import { signOut } from "firebase/auth";
import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService } from "../reactfbase";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoils/UserAtom";

// 네이게이선 배경 스타일 태그
const NavigationBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  height: 5vh;
  width: 100%;
  border-bottom: 1px solid mediumorchid;
  display: flex;
  justify-content: center;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 5vh;
  }
`;

// 애플리케이션의 이름 스타일 태그
const Name = styled.div`
  cursor: pointer;
  font-size: 1.3rem;
  position: absolute;
  color: mediumorchid;
  left: 1rem;
  top: 0.5rem;
  width: 15%;
  display: flex;
  align-items: center;
  @media screen and (width: 1024px) and (height: 600px) {
    top: 0.3rem;
  }
  @media screen and (max-width: 930px) {
    display: none;
  }
`;
// 네이게이션 요소들의 레이아웃 스타일 태그
const NavigationLayout = styled.ul`
  min-width: 370px;
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  @media screen and (min-width: 390px) {
    font-size: 0.8rem;
  }
  @media screen and (min-width: 521px) {
    font-size: 1rem;
  }
  @media screen and (min-width: 700px) {
    font-size: 1.3rem;
  }
  @media screen and (min-width: 900px) {
    font-size: 1.6rem;
  }
`;
// 네비게이션 요소들의 스타일 태그
const NavigationItem = styled.a`
  color: black;
  margin: 0 1rem;
  @media screen and (min-width: 390px) {
    margin: 0 0.4rem;
  }
  @media screen and (min-width: 521px) {
    margin: 0 0.5rem;
  }
  @media screen and (min-width: 700px) {
    margin: 0 1rem;
  }
  @media screen and (min-width: 900px) {
    margin: 0 1.3rem;
  }
  &:hover {
    color: mediumorchid;
  }
`;
// 로그아웃 버튼 스타일 태그
const LogOutButton = styled.button`
  cursor: pointer;
  font-family: "Nanum Myeongjo", serif;
  font-size: 0.5rem;
  border-style: none;
  background: transparent;
  color: black;
  &:hover {
    color: mediumorchid;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.5rem;
  }
  @media screen and (min-width: 390px) {
    font-size: 0.8rem;
  }
  @media screen and (min-width: 521px) {
    font-size: 1rem;
  }
  @media screen and (min-width: 700px) {
    font-size: 1.3rem;
  }
  @media screen and (min-width: 900px) {
    font-size: 1.6rem;
  }
`;

const Navigation = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate(); // useNavigate 훅스를 사용해서 로그 아웃시 "/" 주소로 강제 이동

  // 로그아웃 버튼을 클릭하면 호출되는 콜백 함수
  const onclickLogoutButton = async () => {
    // 로그아웃하기
    try {
      await signOut(authService);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  const iconStyle = useCallback(() => {
    return { color: "mediumorchid", marginRight: "0.5rem" };
  }, []);
  return (
    <NavigationBack>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Name>우리동네핫플</Name>
      </Link>

      <NavigationLayout>
        <li>
          <Link to="/" style={{ textDecoration: "none" }}>
            <NavigationItem>
              {" "}
              <i class="fa-solid fa-house" style={iconStyle()}></i>홈
            </NavigationItem>
          </Link>
        </li>
        <li>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            {user.displayName === null ? (
              <NavigationItem>
                {" "}
                <i class="fa-regular fa-user"></i>닉네임을 만들어주세요.
              </NavigationItem>
            ) : (
              <>
                <NavigationItem>
                  {" "}
                  <i class="fa-regular fa-user" style={iconStyle()}></i>
                  {user.displayName} 님 프로필
                </NavigationItem>
              </>
            )}
          </Link>
        </li>
        <li>
          <Link to="/postmake" style={{ textDecoration: "none" }}>
            <NavigationItem>
              <i class="fa-solid fa-square-plus" style={iconStyle()}></i>게시글
              올리기
            </NavigationItem>
          </Link>
        </li>
        <li>
          <LogOutButton onClick={onclickLogoutButton}>
            {" "}
            <i
              class="fa-solid fa-arrow-right-from-bracket"
              style={iconStyle()}
            ></i>
            로그아웃{" "}
          </LogOutButton>
        </li>
      </NavigationLayout>
    </NavigationBack>
  );
};

export default Navigation;
