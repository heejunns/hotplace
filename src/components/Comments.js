import React, { useCallback, useState } from "react";
import styled from "styled-components";
import CommentPost from "./CommentPost";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "../reactfbase";
import { v4 as uuidv4 } from "uuid";

const CommentBack = styled.div`
  margin: 1rem 0;
  height: 300px;
  width: 100%;
  background-color: white;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.19);
  overflow-y: auto;
`;
const CommentForm = styled.form`
  clear: both;
  display: flex;
  justify-content: center;
`;
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
const CommentModeDeleteButton = styled.button`
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
const Comments = ({ setCommentMode, data, user }) => {
  console.log(data);
  const [commentInput, setCommentInput] = useState("");
  const onchangeCommentInput = (event) => {
    const {
      target: { value },
    } = event;
    setCommentInput(value);
  };
  const onclickCommentModeDelete = useCallback(() => {
    setCommentMode((prev) => !prev);
  }, [setCommentMode]);
  const onclickCommentSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "test", data.id), {
      comments: [
        ...data.comments,
        {
          commentWriter: user.displayName,
          commentValue: commentInput,
          comment_id: uuidv4(),
          commentCreateTime: Date.now(),
          commentLikeMember: [],
        },
      ],
    });
  };

  return (
    <CommentBack>
      <CommentModeDeleteButton onClick={onclickCommentModeDelete}>
        X
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
