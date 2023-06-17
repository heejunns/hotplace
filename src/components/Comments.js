import React, { useCallback, useState } from "react";
import styled from "styled-components";
import CommentPost from "./CommentPost";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "../reactfbase";
import { v4 as uuidv4 } from "uuid";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoils/UserAtom";

// 댓글 기능의 뒷배경 스타일 태그
const CommentBack = styled.div`
  margin: 1rem 0;
  height: 300px;
  width: 100%;
  background-color: white;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.19);
  overflow-y: auto;
`;
// 댓글을 입력하는 form 의 스타일 태그
const CommentForm = styled.form`
  clear: both;
  display: flex;
  justify-content: center;
`;
// 댓글을 입력하는 input 의 스타일 태그
const CommentInput = styled.input`
  border: 3px solid mediumorchid;
  width: 55%;
  height: 2rem;
  border-radius: 5px;
  font-size: 0.8rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.3rem;
    height: 2.5rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 1rem;
    height: 2.3rem;
  }
  @media screen and (min-width: 768px) {
    font-size: 1.3rem;
    height: 2.5rem;
  }
`;
// 댓글을 입력하고 댓글을 게시하는 버튼의 스타일 태그
const CommentSubmitButton = styled.button`
  border: 3px solid mediumorchid;
  margin-left: 1rem;
  border-radius: 5px;
  height: 2rem;
  background: white;
  font-size: 0.8rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.3rem;
    height: 2.5rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 1rem;
    height: 2.3rem;
  }
  @media screen and (min-width: 768px) {
    font-size: 1.3rem;
    height: 2.5rem;
  }
`;
// 댓글을 삭제할 수 있는 버튼의 스타일 태그
const CommentModeDeleteButton = styled.button`
  font-size: 1.5rem;
  float: right;
  background: white;
  border: 3px solid mediumorchid;
  border-radius: 50%;
  cursor: pointer;
  @media screen and (min-width: 820px) and (min-height: 1180px) {
    width: 3rem;
    height: 3rem;
  }
`;
// 아무 댓글이 없다면 보여질 스타일 태그
const NoComment = styled.div`
  margin: 1rem 0 0 1rem;
  font-size: 1rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 2rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 1.5rem;
  }
`;

const Comments = ({ setCommentMode, data }) => {
  const user = useRecoilValue(userAtom);
  const [commentInput, setCommentInput] = useState(""); // 댓글 입력 state

  const onchangeCommentInput = (event) => {
    // input 태그에 댓글을 입력할면 onchange 이벤트 발생
    const {
      target: { value },
    } = event;
    setCommentInput(value);
  };
  // 댓글 모드를 닫아버리는 x 버튼 클릭하면 호출
  const onclickCommentModeDelete = useCallback(() => {
    setCommentMode((prev) => !prev);
  }, [setCommentMode]);

  // 댓글을 입력하고 댓글 게시 버튼을 클릭하면 호출
  const onclickCommentSubmit = async (event) => {
    event.preventDefault();
    console.log(typeof data.id, "뭐요");
    await updateDoc(doc(dbService, "test", data.id), {
      comments: [
        ...data.comments,
        {
          commentWriter: user.displayName, // 댓글 게시자
          commentValue: commentInput, // 댓글 글
          comment_id: uuidv4(), // 댓글 아이디 무작위로 숫자 생성해서 만들기
          commentCreateTime: Date.now(), // 댓글 게시 시간
          commentLikeMember: [], // 댓글 좋아요 누른 사람 명단 관리
        },
      ],
    });
  };

  return (
    <CommentBack>
      <CommentModeDeleteButton onClick={onclickCommentModeDelete}>
        &#215;
      </CommentModeDeleteButton>
      <CommentForm onSubmit={onclickCommentSubmit}>
        <CommentInput
          type="text"
          placeholder="댓글을 입력하세요."
          value={commentInput}
          onChange={onchangeCommentInput}
        />
        <CommentSubmitButton>댓글 게시</CommentSubmitButton>
      </CommentForm>
      {data.comments.length === 0 ? (
        <NoComment>댓글없음...</NoComment>
      ) : (
        data.comments.map((commentInfo) => {
          return (
            <CommentPost commentInfo={commentInfo} data={data} user={user} />
          );
        })
      )}
    </CommentBack>
  );
};

export default Comments;
