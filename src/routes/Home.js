import React, { useCallback, useEffect, useState } from "react";
import { dbService } from "../reactfbase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import Post from "../components/Post";
import styled from "styled-components";
const HomeBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  width: 100%;
  height: 90vh;
  background: white;
  display: flex;
  justify-content: center;
  min-width: 370px;
`;
const PostLayout = styled.div`
  margin-top: 1rem;
  // border: 3px solid mediumorchid;
  border-radius: 10px;
  height: 100%;
  width: 90%;

  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    width: 85%;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    width: 70%;
  }
  @media screen and (min-width: 400px) {
    width: 80%;
  }
  @media screen and (min-width: 820px) {
    width: 60%;
  }
`;
const HamburgerSideBar = styled.div`
  width: 10rem;
  background: mediumorchid;
  opacity: 0.8;
  height: 145vh;
  z-index: 3;
  top: 2.1rem;
  position: fixed;
  right: 0px;
  transition: all ease 1s;
`;

const HamburgerLabel = styled.label`
  position: absolute;
  top: 0.3rem;
  right: 0;
  width: 2rem;
  height: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    top: 0.5rem;
    right: 0.3rem;
    height: 1.8rem;
    width: 2.3rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    top: 0.3rem;
    right: 0.3rem;
    height: 2.8rem;
    width: 3.3rem;
  }
  @media screen and (max-width: 359px) {
    display: none;
  }
`;

const HamburgerOne = styled.div`
  width: 1.5rem;
  height: 0.2rem;
  border: 1px solid black;
  background: black;
  border-radius: 10px;
  position: relative;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 0.3rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 0.4rem;
    width: 3rem;
  }
`;
const HamburgerInputCheckbox = styled.input`
  display: none;
  &:checked ~ ${HamburgerSideBar} {
    right: -200px;
  }
`;

const HamburgerTwo = styled.div`
  width: 1.5rem;
  height: 0.2rem;
  border: 1px solid black;
  background: black;
  border-radius: 10px;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 0.3rem;
  }

  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 0.4rem;
    width: 3rem;
  }
`;

const HamburgerThree = styled.div`
  width: 1.5rem;
  height: 0.2rem;
  border: 1px solid black;
  background: black;
  border-radius: 10px;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 0.3rem;
  }

  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 0.4rem;
    width: 3rem;
  }
`;
const HamburgerSideBarLayout = styled.ul`
  width: 100%;
  padding: 0.5rem;
`;

const HamburgerSideBarList = styled.li`
  margin-top: 1rem;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;
const Home = ({ user, userLocation }) => {
  const [currentData, setCurrentData] = useState([]);

  // 실시간으로 데이터 베이스에 저장되어 있는 데이터를 가져온다.
  const getRealTimePostData = useCallback(() => {
    const q = query(
      collection(dbService, "test"),
      orderBy("createTime", "desc") // createTime 기준으로 내림차순으로 정렬
    );
    onSnapshot(q, (snapshot) => {
      setCurrentData([]); // 새롭게 불러온 데이터를 저장하기 위해 현재 데이터를 초기화
      snapshot.forEach((doc) =>
        setCurrentData((prevDocData) => [
          ...prevDocData,
          { ...doc.data(), id: doc.id },
        ])
      );
    });
  }, []);

  useEffect(() => {
    getRealTimePostData();
  }, [getRealTimePostData]);
  // 전체 게시물 보기를 클릭 하였을때 호출
  const onclickPostWhole = useCallback(() => {
    const q = query(
      collection(dbService, "test"),
      orderBy("createTime", "desc")
    );
    onSnapshot(q, (snapshot) => {
      setCurrentData([]);
      snapshot.forEach((doc) =>
        setCurrentData((prevDocData) => [
          ...prevDocData,
          { ...doc.data(), id: doc.id },
        ])
      );
    });
  }, []);
  const onclickPost = useCallback((category) => {
    const q = query(
      collection(dbService, "test"),
      where("userSelectCategory", "==", category),
      orderBy("createTime", "desc")
    );
    onSnapshot(q, (snapshot) => {
      setCurrentData([]);
      snapshot.forEach((doc) =>
        setCurrentData((prevDocData) => [
          ...prevDocData,
          { ...doc.data(), id: doc.id },
        ])
      );
    });
  }, []);
  const onclickPostLike = useCallback(() => {
    const q = query(
      collection(dbService, "test"),
      orderBy("likeNumber", "desc")
    );
    console.log(q);
    onSnapshot(q, (snapshot) => {
      setCurrentData([]);
      snapshot.forEach((doc) =>
        setCurrentData((prevDocData) => [
          ...prevDocData,
          { ...doc.data(), id: doc.id },
        ])
      );
    });
  }, []);

  const onclickPostAddress = useCallback(() => {
    const q = query(
      collection(dbService, "test"),
      where("userLocation", "==", userLocation),
      orderBy("createTime", "desc")
    );
    onSnapshot(q, (snapshot) => {
      setCurrentData([]);
      snapshot.forEach((doc) =>
        setCurrentData((prevDocData) => [
          ...prevDocData,
          { ...doc.data(), id: doc.id },
        ])
      );
    });
  }, []);

  return (
    <HomeBack>
      <HamburgerInputCheckbox
        id="hamburger"
        type="checkbox"
        checked="false"
      ></HamburgerInputCheckbox>
      <HamburgerLabel htmlFor="hamburger">
        <HamburgerOne></HamburgerOne>
        <HamburgerTwo></HamburgerTwo>
        <HamburgerThree></HamburgerThree>
      </HamburgerLabel>
      <HamburgerSideBar>
        <HamburgerSideBarLayout>
          <HamburgerSideBarList onClick={onclickPostWhole}>
            전체 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={() => onclickPost("cafe")}>
            카페 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={() => onclickPost("food")}>
            음식 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={() => onclickPost("mart")}>
            마트 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={onclickPostLike}>
            좋아요 순서
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={onclickPostAddress}>
            나의 지역 게시물
          </HamburgerSideBarList>
        </HamburgerSideBarLayout>
      </HamburgerSideBar>
      <PostLayout>
        {currentData.length === 0 ? (
          <div>현재 게시물이 없습니다.</div>
        ) : (
          currentData.map((data, index) => {
            return <Post key={index} data={data} user={user} />;
          })
        )}
      </PostLayout>
    </HomeBack>
  );
};

export default Home;
