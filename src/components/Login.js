import React, { useCallback, useState } from "react";
import { authService } from "../reactfbase";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";

// 로그인 폼 스타일 태그
const FormStyle = styled.form`
  text-align: center;
  height: 40%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
// 로그인 폼 내에 input 스타일 태그
const InputStyle = styled.input`
  display: block;
  width: 90%;
  height: 2rem;
  border-radius: 5px;
  border: 3px solid mediumorchid;
  padding: 1rem;
  @media screen and (min-width: 768px) {
    height: 3rem;
  }
`;
// 이메일, 비밀번호 입력 후 클릭하는 버튼 스타일 태그
const ButtonStyle = styled.button`
  width: 50%;
  height: 2rem;
  border-radius: 10px;
  border: 3px solid mediumorchid;
  background: white;
  @media screen and (min-width: 768px) {
    height: 3rem;
  }
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState(""); // 입력하는 이메일을 저장하는 state
  const [inputPassword, setInputPassword] = useState(""); // 입력하는 비밀번호를 저장하는 state

  // 이메일과 비밀번호를 입력하면 input 태그에서 onchange 이벤트가 발생하면 호출
  const onchangeInput = useCallback((e) => {
    e.target.name === "email"
      ? setInputEmail(e.target.value)
      : setInputPassword(e.target.value);
  }, []);

  // 로그인 버튼 클릭 했을 때 호출
  const onsubmitLoginButton = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        // 로그인
        await signInWithEmailAndPassword(
          authService,
          inputEmail,
          inputPassword
        );
      } catch (error) {
        console.log(error.message);
        alert("이메일 또는 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");
      }
    },
    [inputEmail, inputPassword]
  );
  return (
    <>
      <FormStyle onSubmit={onsubmitLoginButton}>
        <InputStyle
          name="email"
          type="email"
          placeholder="이메일을 입력하세요."
          value={inputEmail}
          required
          onChange={onchangeInput}
        />
        <InputStyle
          name="password"
          type="password"
          placeholder="비밀번호를 입력 하세요."
          value={inputPassword}
          required
          onChange={onchangeInput}
        />
        <ButtonStyle type="submit">로그인</ButtonStyle>
      </FormStyle>
    </>
  );
};

export default Login;
