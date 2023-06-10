import React, { useCallback, useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { authService, dbService } from "../reactfbase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import styled from "styled-components";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoils/UserAtom";

// 현재 우리가 다양한 컴포넌트에 prop 로 전달해주고 있는 user 객체를 authService.currentUser 로 업데이트 해야한다. 하지만 set 함수로 업데이트 해도 리 랜더링이 되지 않는다. 왜일까?
// react 는 복잡하고 큰 객체를 전에 상태와 바뀌었는지 판단하는것을 어려워한다.
// 그럼 어떻게 리액트가 상태가 바뀐것을 판단하고 리 랜더링 해주게 할까?
// 첫번째 방법은 user 객체에서 필요한 데이터가 따로 가져와 새로운 객체를 생성해 사용하는 것이다. user 객체의 모든 내용을 사용하지 않는데 모든 데이터를 prop 로 전달하면서  사용할 필요가 없다는 뜻이다.
// 또 다른 방법은 user 객체 자체를 복사해서 업데이트 하는 것이다. JSON.parse(JSON.stringify(객체)) , Object.assign({},객체)

// 프로필 페이지 배경 스타일 태그
const ProfileBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  background: white;
  width: 100%;
  height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 370px;
`;
// 프로필 이름을 변경하는 폼 스타일 태그
const ProfileForm = styled.form`
  border: 1px solid mediumorchid;
  border-top: none;
  width: 78%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (min-width: 400px) {
    width: 70%;
  }
  @media screen and (min-width: 820px) {
    width: 53%;
  }
`;
// 현재 사용자가 올린 게시글을 보여줄 게시글 레이아웃 스타일 태그
const PostProfileLayout = styled.div`
  border-radius: 10px;
  height: 90%;
  width: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  @media screen and (min-width: 400px) {
    width: 77.8%;
  }
  @media screen and (min-width: 820px) {
    width: 58.85%;
  }
`;
// 프로필 이름 변경 폼 내부의 input 스타일 태그
const ProfileFormInput = styled.input`
  width: 60%;
  height: 2rem;
  border-radius: 5px;
  border: 2px solid mediumorchid;
  padding: 0.5rem;
  background: white;
  margin-right: 1rem;
`;
// 프로필 이름 변경 후 버튼을 클릭하는데 닉네임 변경 버튼 스타일 태그
const ProfileFormSubmit = styled.input`
  border-radius: 5px;
  border: 2px solid mediumorchid;
  padding: 0.5rem;
  width: 5rem;
  height: 2rem;
  background: white;
`;
const Profile = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [userUploadData, setUserUploadData] = useState([]); // 해당 유저가 작성한 게시글만 가져와서 저장하는 state
  const [newNickname, setNewNickname] = useState(user.displayName); // 해당 유저의 닉네임을 저장하는 state

  // 해당 유저가 작성한 글을 실시간으로 가져오기
  const getRealtimeUserData = useCallback(() => {
    const q = query(
      collection(dbService, "test"),
      where("writer", "==", user.uid),
      orderBy("createTime", "desc")
    );
    onSnapshot(q, (snapshot) => {
      setUserUploadData([]);
      snapshot.forEach((doc) =>
        setUserUploadData((prevDocData) => [
          ...prevDocData,
          { ...doc.data(), id: doc.id },
        ])
      );
    });
  }, [user.uid]);

  useEffect(() => {
    getRealtimeUserData();
  }, [getRealtimeUserData]);

  // 닉네임을 작성하는 Input 태그에서 onchange 이벤트가 발생하면 호출
  const onchangeNewNickname = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setNewNickname(value);
  }, []);

  // 새로운 닉네임을 작성하고 버튼을 클릭하면 호출
  const onsubmitNewNickname = async (e) => {
    e.preventDefault();
    if (user.displayName !== newNickname) {
      await updateProfile(authService.currentUser, {
        displayName: newNickname,
      });
    }
    // 현재 유저의 정보를 필요한것만 업로드 하기
    // setCurrentUser({
    //   uid: authService.currentUser.uid,
    //   displayName: authService.currentUser.displayName,
    // });
    const newUser = JSON.parse(JSON.stringify(authService.currentUser));
    setUser(newUser);

    setNewNickname("");
  };

  return (
    <ProfileBack>
      <ProfileForm onSubmit={onsubmitNewNickname}>
        <ProfileFormInput
          type="text"
          value={newNickname}
          onChange={onchangeNewNickname}
          maxLength="5"
          placeholder="변경할 닉네임을 입력해주세요. 최대 5글자"
        />
        <ProfileFormSubmit type="submit" value="닉네임 변경" />
      </ProfileForm>
      <PostProfileLayout>
        {userUploadData.length === 0 ? (
          <div>현재 게시물이 없습니다.</div>
        ) : (
          userUploadData.map((data, index) => {
            return (
              <Post
                key={index}
                data={data}
                user={user}
                index={index}
                dataLen={userUploadData.length}
              />
            );
          })
        )}
      </PostProfileLayout>
    </ProfileBack>
  );
};

export default Profile;
