import { signOut } from "firebase/auth";
import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService, dbService } from "../reactfbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
const NavigationBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  height: 5vh;
  width: 100%;
  background: mediumorchid;
  display: flex;
  justify-content: center;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 5vh;
  }
`;
const Name = styled.div`
  font-size: 1.5rem;
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  width: 15%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 930px) {
    display: none;
  }
`;

const NavigationLayout = styled.ul`
  min-width: 370px;
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.5rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 0.8rem;
  }
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
const NavigationItem = styled.a`
  color: black;
  margin: 0 1rem;
  &:hover {
    color: white;
  }
`;
const LogOutButton = styled.button`
  font-family: "Nanum Myeongjo", serif;
  font-size: 0.7rem;
  border-style: none;
  background: transparent;
  &:hover {
    color: white;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.5rem;
  }
  @media screen and (min-width: 400px) {
    font-size: 0.8rem;
  }
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Navigation = ({ user }) => {
  // 로그아웃 버튼을 클릭하면 호출되는 콜백함수

  const navigate = useNavigate(); // useNavigate 훅스를 사용해서 로그 아웃시 "/" 주소로 강제 이동
  const onclickLogoutButton = async () => {
    // 로그아웃하기
    try {
      await signOut(authService);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <NavigationBack>
      <Name>우리동네핫플</Name>

      <NavigationLayout>
        <li>
          <Link to="/" style={{ textDecoration: "none" }}>
            <NavigationItem>홈</NavigationItem>
          </Link>
        </li>
        <li>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            {user.displayName === null ? (
              <NavigationItem>닉네임을 만들어주세요.</NavigationItem>
            ) : (
              <NavigationItem>{user.displayName} 님 프로필</NavigationItem>
            )}
          </Link>
        </li>
        <li>
          <Link to="/postmake" style={{ textDecoration: "none" }}>
            <NavigationItem>게시글 올리기</NavigationItem>
          </Link>
        </li>
        <li>
          <LogOutButton onClick={onclickLogoutButton}>로그아웃</LogOutButton>
        </li>
      </NavigationLayout>
    </NavigationBack>
  );
};

export default Navigation;
