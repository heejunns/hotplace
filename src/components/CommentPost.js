import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import styled from "styled-components";
import { dbService } from "../reactfbase";
import { userAtom } from "../recoils/UserAtom";
import { useRecoilValue } from "recoil";

// 댓글 레이아웃 스타일 태그
const CommentLayout = styled.div`
  width: 100%;
  padding: 0.5rem;
  @media screen and (min-width: 820px) and (min-height: 1180px) {
    font-size: 2rem;
  }
`;
// 댓글 지우기 스타일 태그
const CommentDelete = styled.span`
  float: right;
  cursot: pointer;
  &:hover {
    color: red;
  }
`;
// 댓글 작성자를 보여주는 스타일 태그
const CommentWriter = styled.div`
  clear: left;
`;
// 댓글을 보여주는 스타일 태그
const CommentValue = styled.div`
  margin-top: 0.5rem;
`;
// 댓글에서 좋아요 스타일 태그
const CommentLike = styled.div`
  margin-top: 0.5rem;
  color: mediumorchid;
  &:hover {
    color: red;
  }
`;

const CommentPost = ({ commentInfo, data }) => {
  const user = useRecoilValue(userAtom);
  // 댓글에서 좋아요 버튼을 클릭하면 호출
  const onclickLikeButton = async () => {
    const newComments = data.comments.map((comment) => {
      if (comment.comment_id === commentInfo.comment_id) {
        // 기존의 comments 데이터 중에 comment_id 와 CommentPost 를 구성하는 commentInfo 의 comment_id 가 같으면
        if (comment.commentLikeMember.length === 0) {
          // comment 객체 안의 commentLikeMember 의 길이가 0 이라면 아직 좋아요를 누른 사람이 아무도 없다는 뜻 이니까
          return {
            ...comment, // 기존의 comment 객체의 값들은 그대로 다시 저장
            commentLikeMember: [user.uid], // commentLikeMember 의 값에서는 현재 사용자의 uid 를 저장
          };
        } else if (
          comment.commentLikeMember.some((element) => element === user.uid) // commentLikeMember 중에서 현재 사용중인 uid 와 같은 요소가 있다면 true 이니까
        ) {
          // 현재 좋아요를 클릭한 사용자의 정보는 commentLikeMember 에서 삭제하고 새로운 commentLikeMember 을 만들어서
          const newCommentLikeMember = comment.commentLikeMember.filter(
            (element) => element !== user.uid
          );

          return {
            ...comment,
            commentLikeMember: newCommentLikeMember, // 새로운 commentLikeMember 저장
          };
        } else if (
          !comment.commentLikeMember.some((element) => element === user.uid) // false 가 나온다면 기존의 commentLikeMember 에 현재 사용자의 uid 가 없다는 뜻이니까
        ) {
          return {
            ...comment,
            commentLikeMember: [...comment.commentLikeMember, user.uid], // 기존의 commentLikeMember 의 정보애 현재 좋아요를 클릭한 uid 추가
          };
        }
      } else {
        return comment;
      }
    });
    await updateDoc(doc(dbService, "test", data.id), {
      // comment 에 새로운 comment 정보 업데이트
      comments: newComments,
    });
  };

  const onclickDeleteCommentButton = async () => {
    // 댓글 삭제 버튼을 클릭하면 호출
    const newComments = data.comments.filter((comment) => {
      // 클릭한 댓글을 필터로 가려내기 클릭하지 않은 댓글만 리턴
      return comment.comment_id !== commentInfo.comment_id;
    });

    await updateDoc(doc(dbService, "test", data.id), {
      // 새로운 comment 정보 업데이트
      comments: newComments,
    });
  };
  return (
    <div>
      <CommentLayout>
        <CommentDelete onClick={onclickDeleteCommentButton}>삭제</CommentDelete>
        <CommentWriter>
          {commentInfo.commentWriter} /{" "}
          {Math.round(
            (Date.now() - commentInfo.commentCreateTime) / 1000 / 60
          ) < 60
            ? `약 ${Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60
              )} 분 전`
            : Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60
              ) > 59 &&
              Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60 / 60
              ) < 24
            ? `약 ${Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60 / 60
              )} 시간 전`
            : Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60 / 60
              ) > 23 &&
              Math.round(
                (Date.now() - commentInfo.commentCreateTime) /
                  1000 /
                  60 /
                  60 /
                  24
              ) < 30
            ? `약 ${Math.round(
                (Date.now() - commentInfo.commentCreateTime) /
                  1000 /
                  60 /
                  60 /
                  24
              )} 일 전`
            : "한달이 넘음"}
        </CommentWriter>
        <CommentValue>{commentInfo.commentValue} </CommentValue>
        <CommentLike onClick={onclickLikeButton}>
          {" "}
          &#9829; {commentInfo.commentLikeMember.length}
        </CommentLike>
      </CommentLayout>
    </div>
  );
};

export default CommentPost;
