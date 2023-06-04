import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import styled from "styled-components";
import { dbService } from "../reactfbase";

const CommentLayout = styled.div`
  width: 100%;
  padding: 0.5rem;
  @media screen and (min-width: 820px) and (min-height: 1180px) {
    font-size: 2rem;
  }
`;
const CommentAdit = styled.span`
  float: right;
`;
const CommentDelete = styled.span`
  float: right;
  cursot: pointer;
  &:hover {
    color: red;
  }
`;
const CommentWriter = styled.div`
  clear: left;
`;
const CommentValue = styled.div`
  margin-top: 0.5rem;
`;
const CommentLike = styled.div`
  margin-top: 0.5rem;
  color: mediumorchid;
  &:hover {
    color: red;
  }
`;

const CommentPost = ({ commentInfo, data, user }) => {
  const onclickLikeButton = async () => {
    const newComments = data.comments.map((comment) => {
      if (comment.comment_id === commentInfo.comment_id) {
        if (comment.commentLikeMember.length === 0) {
          return {
            ...comment,
            commentLikeMember: [user.uid],
          };
        } else if (
          comment.commentLikeMember.some((element) => element === user.uid)
        ) {
          const newCommentLikeMember = comment.commentLikeMember.filter(
            (element) => element !== user.uid
          );

          return {
            ...comment,
            commentLikeMember: newCommentLikeMember,
          };
        } else if (
          !comment.commentLikeMember.some((element) => element === user.uid)
        ) {
          return {
            ...comment,
            commentLikeMember: [...comment.commentLikeMember, user.uid],
          };
        }
      } else {
        return comment;
      }
    });
    await updateDoc(doc(dbService, "test", data.id), {
      comments: newComments,
    });
  };
  const onclickDeleteCommentButton = async () => {
    const newComments = data.comments.filter((comment) => {
      return comment.comment_id !== commentInfo.comment_id;
    });
    await updateDoc(doc(dbService, "test", data.id), {
      comments: newComments,
    });
  };

  return (
    <div>
      <CommentLayout>
        <CommentAdit>수정</CommentAdit>
        <CommentDelete onClick={onclickDeleteCommentButton}>
          삭제 /{" "}
        </CommentDelete>
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
              ) > 59
            ? `약 ${Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60 / 60
              )} 시간 전`
            : Math.round(
                (Date.now() - commentInfo.commentCreateTime) / 1000 / 60 / 60
              ) > 23
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
