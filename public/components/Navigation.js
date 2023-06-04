import { signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService } from "../../src/reactfbase";
const NavigationBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  height: 5vh;
  width: 100%;
  background: mediumorchid;
  display: flex;
  min-width: 500px;
  justify-content: center;
  position: relative;
`;
const Name = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 0.5rem;
  width: 11%;
  height: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 903px) {
    display: none;
  }
`;

const NavigationLayout = styled.ul`
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 16px;
  border-style: none;
  background: transparent;
  &:hover {
    color: white;
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
