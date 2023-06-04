import React, { useCallback, useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { authService, dbService } from "../../src/reactfbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import styled from "styled-components";
import Post from "../../public/components/Post";

//  닉네임을 설정하는 과정에서 user 객체의 displayname 을 사용하려고 할 때 updateProfile 를 이용해 user 객체의 displayname 을 변경하여 닉네임을 변경한다.
// 문제는 이 과정에서 변경하고 싶은 닉네임을 작성 후 submit 하면 네비게이션의 닉네임이 바로 업데이트 되지 않고 새로고침이나 페이지를 이동해야만 변경한 닉네임이 화면에 반영된다.
// 새로운 닉네임을 작성 후 submit 버튼을 클릭하고 user 객체의 displayname 의 변경이 있는지 확인해보면 변경은 되는것을 확인 할 수 있다.
// 내 예상 닉네임 변경전과 변경후의 user 객체가 같은 유저 객체라 리 랜더링이 일어나지 않아서 그런거 같다. 직접 확인 해보면 변경전과 변경후의 유저 객체는 같은 객체이다.

// 현재 우리가 다양한 컴포넌트에 prop 로 전달해주고 있는 user 객체를 authService.currentUser 로 업데이트 해야한다. 하지만 set 함수로 업데이트 해도 리 랜더링이 되지 않는다. 왜일까?
// react 는 복잡하고 큰 객체를 전에 상태와 바뀌었는지 판단하는것을 어려워한다.
// 그럼 어떻게 리액트가 상태가 바뀐것을 판단하고 리 랜더링 해주게 할까?
// 첫번째 방법은 user 객체에서 필요한 데이터가 따로 가져와 새로운 객체를 생성해 사용하는 것이다. user 객체의 모든 내용을 사용하지 않는데 모든 데이터를 prop 로 전달하면서  사용할 필요가 없다는 뜻이다.
// 또 다른 방법은 user 객체 자체를 복사해서 업데이트 하는 것이다. JSON.parse(JSON.stringify(객체)) , Object.assign({},객체)

const ProfileBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  background: white;
  width: 100%;
  height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 500px;
`;

const ProfileForm = styled.form`
  margin-top: 0.5rem;
  border: 3px solid mediumorchid;
  border-radius: 10px;
  width: 80%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (min-width: 820px) {
    width: 60%;
  }
  @media screen and (min-width: 1400px) {
    width: 50%;
  }
`;
const PostProfileLayout = styled.div`
  padding: 0.5rem;
  margin-top: 1rem;
  border-radius: 10px;
  height: 90%;
  width: 87%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  @media screen and (min-width: 820px) {
    width: 67%;
  }
  @media screen and (min-width: 1400px) {
    width: 56%;
  }
`;
const ProfileFormInput = styled.input`
  width: 12rem;
  height: 2rem;
  border-radius: 5px;
  border: 3px solid mediumorchid;
  padding: 0.5rem;
  background: white;
  margin-right: 1rem;
`;
const ProfileFormSubmit = styled.input`
  border-radius: 5px;
  border: 3px solid mediumorchid;
  padding: 0.5rem;
  width: 8rem;
  height: 2rem;
  background: white;
`;
const Profile = ({ user, setCurrentUser }) => {
  const [userUploadData, setUserUploadData] = useState([]); // 해당 유저가 작성한 게시글만 가져와서 저장하는 state
  const [newNickname, setNewNickname] = useState(user.displayName); // 해당 유저의 닉네임을 저장하는 state

  // 해당 유저가 작성한 글을 실시간으로 가져오기
  const getRealtimeUserData = useCallback(() => {
    const q = query(
      collection(dbService, "test"),
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
  }, []);

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
    setCurrentUser(JSON.parse(JSON.stringify(authService.currentUser)));

    setNewNickname("");
  };

  return (
    <>
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
              return <Post key={index} data={data} user={user} />;
            })
          )}
        </PostProfileLayout>
      </ProfileBack>
    </>
  );
};

export default Profile;
