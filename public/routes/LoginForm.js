import React, { useCallback, useMemo } from "react";
import { authService } from "../../src/reactfbase";
import { Link } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Login from "../../public/components/Login";
import styled from "styled-components";

const LoginFormBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  width: 100%;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const LoginFormLayout = styled.div`
  border: 3px solid mediumorchid;
  border-radius: 5px;
  height: 60%;
  width: 80%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 820px) {
    width: 50%;
  }
  @media screen and (min-width: 1500px) {
    width: 30%;
  }
`;

const ButtonLayout = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ButtonStyle = styled.button`
  border: 3px solid mediumorchid;
  background: white;
  height: 2rem;
  width: 40%;
  border-radius: 10px;
`;
const LogoName = styled.div`
  color: mediumorchid;
  font-size: 4rem;
`;
const LoginForm = () => {
  const provider = useMemo(() => new GoogleAuthProvider(), []); // 구글로 로그인하기 위해서 구글 인증 프로바이더 가져오기

  // 구글로 로그인하기 버튼 클릭 하였을 때 호출되는 콜백 함수
  const onclickGoogleLogin = useCallback(() => {
    try {
      const dataGoogle = signInWithPopup(authService, provider);
      GoogleAuthProvider.credentialFromResult(dataGoogle);
    } catch (e) {
      console.log(e);
    }
  }, [provider]);

  return (
    <LoginFormBack>
      <LogoName>우리동네 핫플</LogoName>
      <LoginFormLayout>
        <Login />
        <ButtonLayout>
          <ButtonStyle onClick={onclickGoogleLogin}>
            구글로 로그인하기
          </ButtonStyle>
          <ButtonStyle>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              회원가입하기
            </Link>
          </ButtonStyle>
        </ButtonLayout>
      </LoginFormLayout>
    </LoginFormBack>
  );
};

export default LoginForm;
