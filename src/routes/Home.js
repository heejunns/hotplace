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
  height: 95vh;
  background: white;
  display: flex;
  justify-content: center;
  min-width: 370px;
`;
const PostLayout = styled.div`
  height: 100%;
  width: 80%;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    width: 85%;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    width: 70%;
  }
  @media screen and (min-width: 400px) {
    width: 70%;
  }
  @media screen and (min-width: 820px) {
    width: 60%;
  }
  @media screen and (min-width: 1000px) {
    width: 50%;
  }
`;
const HamburgerSideBar = styled.div`
  width: 13rem;
  opacity: 0.8;
  background: mediumorchid;
  height: 145vh;
  z-index: 3;
  top: 3.4rem;
  position: fixed;
  right: 0;
  transition: all ease 1s;
  @media screen and (width: 540px) and (height: 720px) {
    top: 2.2rem;
  }
  @media screen and (min-width: 900px) {
    top: 2rem;
    background: transparent;
  }
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
  font-size: 2rem;
  @media screen and (min-width: 390px) {
    top: 0.5rem;
    right: 0.3rem;
    height: 1.8rem;
    width: 2.3rem;
  }
  @media screen and (min-width: 768px) {
    top: 0rem;
    right: 0.3rem;
    height: 2.8rem;
    width: 3.3rem;
    font-size: 1.5rem;
  }
  @media screen and (max-width: 530px) {
    display: none;
  }

  @media screen and (min-width: 900px) {
    top: 0.2rem;
    right: 0.3rem;
    height: 2.3rem;
    font-size: 1.8rem;
  }
  @media screen and (width: 540px) and (height: 720px) {
    top: -0.3rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 1.5rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    top: 0.2rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 2rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    top: 0.2rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 2rem;
  }
  @media screen and (min-width: 820px) and (min-height: 1024px) {
    top: 0.4rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 2.3rem;
  }
  @media screen and (min-width: 912px) and (min-height: 1024px) {
    top: 0.8rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 2.5rem;
  }
  @media screen and (min-width: 1024px) and (height: 600px) {
    top: -0.4rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 1.7rem;
  }
  @media screen and (min-width: 1280px) and (min-height: 800px) {
    top: -0.1rem;
    right: 0.3rem;
    height: 2.8rem;
    font-size: 2rem;
  }
`;
const HamburgerInputCheckbox = styled.input`
  display: none;
  &:checked ~ ${HamburgerSideBar} {
    right: -210px;
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
    color: mediumorchid;
  }
`;
const NoPost = styled.div`
  font-size: 3rem;
  margin-top: 2rem;
  color: mediumorchid;
`;
const Home = ({ userLocation }) => {
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
  // 카페, 음식, 마트 게시물 보기 클릭하였을 때
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
  // 좋아요 순 게시글 보기 클릭하였을 때
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
  // 사용자의 사는 지역 게시글만 보기 클릭하였을 때
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
  }, [userLocation]);

  const iconStyle = useCallback(() => {
    return {
      marginRight: "0.5rem",
    };
  }, []);

  return (
    <HomeBack>
      <HamburgerInputCheckbox
        id="hamburger"
        type="checkbox"
        checked="false"
      ></HamburgerInputCheckbox>
      <HamburgerLabel htmlFor="hamburger">
        <i class="fa-solid fa-bars"></i>
      </HamburgerLabel>
      <HamburgerSideBar>
        <HamburgerSideBarLayout>
          <HamburgerSideBarList onClick={() => onclickPost("cafe")}>
            <i class="fa-solid fa-mug-hot" style={iconStyle()}></i>
            카페 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={() => onclickPost("food")}>
            <i class="fa-solid fa-bowl-food" style={iconStyle()}></i>
            food 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={() => onclickPost("mart")}>
            <i class="fa-solid fa-store" style={iconStyle()}></i>
            마트 게시글
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={onclickPostLike}>
            <i class="fa-regular fa-heart" style={iconStyle()}></i>
            좋아요 순으로 보기
          </HamburgerSideBarList>
          <HamburgerSideBarList onClick={onclickPostAddress}>
            <i class="fa-solid fa-location-dot" style={iconStyle()}></i>
            나의 지역 게시글만 보기
          </HamburgerSideBarList>
        </HamburgerSideBarLayout>
      </HamburgerSideBar>
      <PostLayout>
        {currentData.length === 0 ? (
          <NoPost>현재 게시물이 없습니다.</NoPost>
        ) : (
          currentData.map((data, index) => {
            return (
              <Post
                key={index}
                data={data}
                index={index}
                dataLen={currentData.length}
              />
            );
          })
        )}
      </PostLayout>
    </HomeBack>
  );
};

export default Home;
