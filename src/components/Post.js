import React, { useCallback, useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../reactfbase";
import { deleteObject, ref } from "firebase/storage";
import styled from "styled-components";
import PostMap from "./PostMap";
import Comments from "./Comments";

const PostStyle = styled.div`
  width: 90%;
  border: 3px solid mediumorchid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin: 1rem 0;
  font-size: 1rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.3rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 1.2rem;
  }
  @media screen and (min-width: 768px) {
    font-size: 1.3rem;
  }
`;
const PostLayout = styled.div`
  width: 100%;
  height: auto;
`;

const ButtonLayout = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const ButtonStyle = styled.button`
  margin: 0 0.3rem;
  border-radius: 10px;
  border: 3px solid mediumorchid;
  padding: 0.3rem;
  background: white;
  font-size: 0.5rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 0.7rem;
  }
  @media screen and (min-width: 970px) {
    font-size: 1.2rem;
  }
`;
const PostImage = styled.img`
  width: 100%;
  height: 15rem;
  border-radius: 10px;
  @media screen and (min-width: 820px) {
    width: 100%;
    height: 20rem;
  }
  @media screen and (min-width: 1400px) {
    width: 100%;
    height: 25rem;
  }
`;
const PostEditForm = styled.form`
  margin-top: 1rem;
  width: 95%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
`;
const PostEditInput = styled.input`
  border-radius: 5px;
  border: 3px solid mediumorchid;
  width: 70%;
  height: 1.5rem;
  padding: 0.5rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 2.5rem;
    font-size: 1.3rem;
  }
  @media screen and (min-width: 400px) {
    height: 2rem;
    font-size: 1rem;
  }
  @media screen and (min-width: 768px) {
    height: 2.5rem;
    font-size: 1.3rem;
  }
`;
const PostEditSubmit = styled.input`
  width: 25%;
  height: 1.5rem;
  border-radius: 5px;
  border: 3px solid mediumorchid;
  background: white;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 2.5rem;
    font-size: 1.3rem;
  }
  @media screen and (min-width: 400px) {
    height: 2rem;
    font-size: 1rem;
  }
  @media screen and (min-width: 768px) {
    height: 2.5rem;
    font-size: 1.3rem;
  }
`;
const PostTime = styled.div`
  float: right;
`;

const PostCategory = styled.div`
  float: right;
  @media screen and (max-width: 1100px) {
    display: none;
  }
`;

const PostNickname = styled.h3`
  float: left;
`;

const PostText = styled.h3`
  clear: both;
  width: 100%;
  height: auto;
  word-break: break-all;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
`;

const PostLike = styled.div`
  width: 2.3rem;
  color: mediumorchid;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1.2rem;
  &:hover {
    color: red;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.5rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 1.2rem;
  }
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
// word-break: break-all;
const Post = ({ data, user }) => {
  const [inputNewText, setInputNewText] = useState(data.inputText); // 닉네임을 변경하는 값의 state
  const [editingMode, setEditngMode] = useState(false); // 게시글 수정 모드를 사용하고 있는지 여부 state
  const [mapMode, setMapMode] = useState(false); // 맵을 보는지 여부 state
  const [commentMode, setCommentMode] = useState(false);
  // 수정 게시글을 작성할때 input 태그에서 발생하는 onchange 이벤트에 호출되는 콜백함수
  const onchangeAditText = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setInputNewText(value);
  }, []);

  // 게시글 삭제 버튼을 클릭하면 호출되는 콜백함수
  const onclickDeleteButton = useCallback(async () => {
    try {
      console.log("클릭중");
      await deleteDoc(doc(dbService, "test", data.id));
      if (data.getUploadFileURL !== "") {
        await deleteObject(ref(storageService, data.getUploadFileURL));
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [data.id, data.getUploadFileURL]);

  // 게시글 수정 폼을 화면에 보여주고 안보여주고 해주는 함수, 게시글 수정 버튼을 클릭하면 호출하는 콜백함수
  const onclickToggleAditButton = useCallback(() => {
    setEditngMode((prev) => !prev);
    setCommentMode(false);
    setMapMode(false);
  }, []);

  // 게시물을 수정하고 버튼을 클릭하였을때 호출
  const onsubmitAdit = async (e) => {
    e.preventDefault();

    await updateDoc(doc(dbService, "test", data.id), {
      inputText: inputNewText,
    }); // 데이터 베이스 업데이트

    setEditngMode((prev) => !prev);
    setInputNewText("");
  };

  // 지도보기 버튼을 클릭하면 호출
  const onclickMapButton = useCallback(() => {
    setMapMode((prev) => !prev);
    setCommentMode(false);
    setEditngMode(false);
  }, []);
  // 하트를 클릭하면 호출
  const onclickLike = async () => {
    if (data.likeMember.length === 0) {
      await updateDoc(doc(dbService, "test", data.id), {
        likeMember: [user.uid],
        likeNumber: 1,
      });
    } else if (data.likeMember.some((element) => element === user.uid)) {
      const newLikeMember = data.likeMember.filter(
        (element) => element !== user.uid
      );
      await updateDoc(doc(dbService, "test", data.id), {
        likeMember: newLikeMember,
        likeNumber: newLikeMember.length,
      });
    } else if (!data.likeMember.some((element) => element === user.uid)) {
      await updateDoc(doc(dbService, "test", data.id), {
        likeMember: [...data.likeMember, user.uid],
        likeNumber: [...data.likeMember, user.uid].length,
      });
    }
  };
  const onclickComments = useCallback(() => {
    setCommentMode((prev) => !prev);
    setEditngMode(false);
    setMapMode(false);
  }, []);
  return (
    <PostStyle image={data.getUploadFileURL}>
      <PostLayout>
        <PostNickname>{data.nickname} 님의 게시글</PostNickname>

        <PostTime>
          {" "}
          {Math.round((Date.now() - data.createTime) / 1000 / 60) < 60
            ? `약 ${Math.round(
                (Date.now() - data.createTime) / 1000 / 60
              )} 분 전`
            : Math.round((Date.now() - data.createTime) / 1000 / 60) > 59 &&
              Math.round((Date.now() - data.createTime) / 1000 / 60 / 60) < 24
            ? `약 ${Math.round(
                (Date.now() - data.createTime) / 1000 / 60 / 60
              )} 시간 전`
            : Math.round((Date.now() - data.createTime) / 1000 / 60 / 60) >
                23 &&
              Math.round((Date.now() - data.createTime) / 1000 / 60 / 60 / 24) <
                30
            ? `약 ${Math.round(
                (Date.now() - data.createTime) / 1000 / 60 / 60 / 24
              )} 일 전`
            : "한달이 넘음"}
        </PostTime>
        <PostCategory>
          {" "}
          {data.userSelectCategory === "food"
            ? "음식"
            : data.userSelectCategory === "cafe"
            ? "카페"
            : data.userSelectCategory === "mart"
            ? "마트"
            : null}
          /
        </PostCategory>
        <PostText>{data.inputText}</PostText>
        {data.getUploadFileURL && (
          <PostImage src={data.getUploadFileURL} alt="사진 업로드" />
        )}
      </PostLayout>
      <ButtonLayout>
        {data.writer === user.uid ? (
          <>
            <ButtonStyle onClick={onclickDeleteButton}>게시글 삭제</ButtonStyle>
            <ButtonStyle onClick={onclickToggleAditButton}>
              게시글 수정
            </ButtonStyle>
            {data.userMarkerLocation.length !== 0 && (
              <ButtonStyle onClick={onclickMapButton}>지도 보기</ButtonStyle>
            )}
            <ButtonStyle onClick={onclickComments}>댓글달기</ButtonStyle>
          </>
        ) : (
          <>
            {data.userMarkerLocation.length !== 0 && (
              <ButtonStyle onClick={onclickMapButton}>지도 보기</ButtonStyle>
            )}
            <ButtonStyle onClick={onclickComments}>댓글달기</ButtonStyle>
          </>
        )}
      </ButtonLayout>

      {editingMode ? (
        <>
          <PostEditForm onSubmit={onsubmitAdit}>
            <PostEditInput
              type="text"
              value={inputNewText}
              onChange={onchangeAditText}
              placeholder="게시물의 수정 사항을 작성해주세요."
            />
            <PostEditSubmit type="submit" value="수정 완료" />
          </PostEditForm>
        </>
      ) : null}
      {mapMode && <PostMap data={data} />}
      {commentMode && (
        <Comments setCommentMode={setCommentMode} data={data} user={user} />
      )}
      <PostLike onClick={onclickLike}>
        &#9829;<span>{data.likeMember.length}</span>
      </PostLike>
    </PostStyle>
  );
};

export default Post;
