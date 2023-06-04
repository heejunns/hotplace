import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import styled from "styled-components";
import { authService } from "../reactfbase";

const ErrorMessage = styled.div`
  margin-top: 2rem;
  color: red;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
`;
const ErrorMessagePassword = styled(ErrorMessage)`
  margin: 0.5rem 0 0 50%;
  @media screen and (min-width: 600px) {
    margin: 0.5rem 0 0 50%;
    font-size: 1.5rem;
  }
  @media screen and (min-width: 1024px) {
    margin: 0.5rem 0 0 50%;
    font-size: 2rem;
  }
`;
const SuccessMessage = styled.div`
  margin-top: 0.5rem;
  color: green;
  font-size: 0.8rem;
  margin: 0.5rem 0 0 50%;
  @media screen and (min-width: 600px) {
    margin: 0.5rem 0 0 50%;
    font-size: 1.5rem;
  }
  @media screen and (min-width: 1024px) {
    margin: 0.5rem 0 0 50%;
    font-size: 2rem;
  }
`;
const SignUpBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  background: white;
  width: 100vh%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 370px;
`;
const SignUpForm = styled.form`
  margin-top: 5rem;
  width: 80%;
  height: 70%;
  border: 3px solid mediumorchid;
  border-radius: 5px;
  padding: 1rem;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 60%;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 50%;
    width: 65%;
  }

  @media screen and (min-width: 700px) {
    height: 50%;
    width: 70%;
  }
  @media screen and (min-width: 800px) {
    height: 50%;
    width: 60%;
  }
  @media screen and (min-width: 1024px) {
    height: 60%;
    width: 50%;
  }
  @media screen and (min-width: 1300px) {
    height: 60%;
    width: 40%;
  }
`;

const InputEmailLayout = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    margin-bottom: 1.5rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    margin-bottom: 3rem;
  }
`;
const InputPasswordLayout = styled.div`
  width: 100%;
  margin: 1rem 0;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    margin-bottom: 1.5rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    margin-bottom: 3rem;
  }
`;
const InputPasswordCheckLayout = styled.div`
  width: 100%;
  margin: 1rem 0;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    margin-bottom: 1.5rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    margin-bottom: 3rem;
  }
`;
const InputEmailText = styled.label`
  font-size: 1rem;
  display: inline-block;
  width: 38%;
  color: mediumorchid;
  vertical-align: -0.1rem;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    width: 48%;
    font-size: 1.5rem;
    vertical-align: -0.2rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 2.5rem;
    width: 50%;
    vertical-align: -0.6rem;
  }
  @media screen and (min-width: 600px) {
    font-size: 2rem;
    width: 50%;
    vertical-align: -0.4rem;
  }
  @media screen and (min-width: 1024px) {
    font-size: 2.5rem;
    width: 50%;
    vertical-align: -0.6rem;
  }
`;
const InputEmail = styled.input`
  width: 62%;
  height: 2rem;
  border-radius: 5px;
  border: 2px solid mediumorchid;
  padding: 0.5rem;
  background: white;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 2.2rem;
    width: 52%;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 3rem;
    width: 50%;
  }
  @media screen and (min-width: 600px) {
    height: 2.2rem;
    width: 50%;
  }
  @media screen and (min-width: 1024px) {
    height: 2.5rem;
    width: 50%;
  }
`;
const InputPasswordText = styled.label`
  font-size: 1rem;
  display: inline-block;
  width: 38%;
  color: mediumorchid;
  vertical-align: -0.1rem;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    width: 48%;
    font-size: 1.5rem;
    vertical-align: -0.2rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 2.5rem;
    width: 50%;
    vertical-align: -0.6rem;
  }
  @media screen and (min-width: 600px) {
    font-size: 2rem;
    width: 50%;
    vertical-align: -0.4rem;
  }

  @media screen and (min-width: 1024px) {
    font-size: 2.5rem;
    width: 50%;
    vertical-align: -0.6rem;
  }
`;
const InputPassword = styled.input`
  width: 62%;
  height: 2rem;
  border-radius: 5px;
  border: 2px solid mediumorchid;
  padding: 0.5rem;
  background: white;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 2.2rem;
    width: 52%;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 3rem;
    width: 50%;
  }
  @media screen and (min-width: 600px) {
    height: 2.2rem;
    width: 50%;
  }
  @media screen and (min-width: 1024px) {
    height: 2.5rem;
    width: 50%;
  }
`;
const InputPasswordCheckText = styled.label`
  display: inline-block;
  width: 38%;
  font-size: 1rem;
  color: mediumorchid;
  vertical-align: -0.1rem;

  @media screen and (min-width: 390px) and (min-height: 844px) {
    width: 48%;
    font-size: 1.5rem;
    vertical-align: -0.2rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 2.5rem;
    width: 50%;
    vertical-align: -0.6rem;
  }
  @media screen and (min-width: 600px) {
    font-size: 2rem;
    width: 50%;
    vertical-align: -0.4rem;
  }
  @media screen and (min-width: 1024px) {
    font-size: 2.5rem;
    width: 50%;
    vertical-align: -0.6rem;
  }
`;
const InputPasswordCheck = styled.input`
  width: 62%;
  height: 2rem;
  border-radius: 5px;
  border: 2px solid mediumorchid;
  padding: 0.5rem;
  background: white;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    width: 52%;
    height: 2.2rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 3rem;
    width: 50%;
  }
  @media screen and (min-width: 600px) {
    height: 2.2rem;
    width: 50%;
  }
  @media screen and (min-width: 1024px) {
    height: 2.5rem;
    width: 50%;
  }
`;

const InputPasswordCheckMessage = styled.div`
  font-size: 0.8rem;
  margin: 0.5rem 0 0 50%;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    margin: 0.5rem 0 0 50%;
    font-size: 1rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    margin: 0.5rem 0 0 50%;
    font-size: 1.5rem;
  }
  @media screen and (min-width: 600px) {
    margin: 0.5rem 0 0 50%;
    font-size: 1.5rem;
  }
  @media screen and (min-width: 1024px) {
    margin: 0.5rem 0 0 50%;
    font-size: 2rem;
  }
`;
const SignUpButton = styled.button`
  width: 50%;
  height: 2rem;
  border-radius: 5px;
  border: 3px solid mediumorchid;
  background: white;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    width: 60%;
    height: 3rem;
  }
  @media screen and (min-width: 600px) {
    width: 60%;
    height: 2.5rem;
  }
  @media screen and (min-width: 1024px) {
    width: 60%;
    height: 3rem;
  }
`;
const SignButtonLayout = styled.div`
  width: 100%;
  text-align: center;
`;

const LogoName = styled.div`
  min-width: 245px;
  color: mediumorchid;
  font-size: 2.5rem;
  @media screen and (min-width: 820px) and (min-height: 1180px) {
    font-size: 4rem;
  }
  @media screen and (min-width: 600px) {
    font-size: 3rem;
  }
  @media screen and (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

// 회원가입을 하면 바로 자동으로 로그인이 되고 페이지가 회원가입 페이지에 머물어 있는 문제가 있다.
// 회원가입 하면 자동으로 홈 페이지로 이동하고 로그아웃되며 회원가입 때 입력한 이메일과 비밀번호로 로그인 하도록 만들기.

const Signup = () => {
  const navigate = useNavigate(); // useNavigate 훅스를 사용해서 로그 아웃시 "/" 주소로 강제 이동
  // 중복확인 버튼을 클릭하면 서브밋 이벤트가 발생함, 당연히 버튼에 달아둔 클릭 이벤트도 발생

  const [inputNewEmail, setInputNewEmail] = useState(""); // 입력하는 이메일 state
  const [inputNewPassword, setInputNewPassword] = useState(""); // 입력하는 비밀번호 state
  const [inputNewPasswordCheck, setInputNewPasswordCheck] = useState(""); // 입력하는 비밀번호확인 state
  const [checkPasswordApproval, setCheckPasswordApproval] = useState(null); // 입력하는 비밀번호와 비밀번호확인에 입력한 비밀번호가 같은 여부를 확인하는 state
  const [error, setError] = useState("");
  // 입력하는 이메일과 비밀번호의 input 태그에서 onchange 이벤트가 발생하면 호출
  const onchangeInput = useCallback((event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "newEmail") {
      setInputNewEmail(value);
    } else if (name === "newPassword") {
      setInputNewPassword(value);
    }
  }, []);
  // 이메일과 비밀번호, 비밀번호확인을 입력하고 회원가입 버튼을 클릭하면 호출
  const onsubmitSignUpButton = async (e) => {
    e.preventDefault();
    console.log("hello world!");
    if (checkPasswordApproval !== true) {
      setError("비밀번호 확인을 해주세요.");
      return;
    }

    try {
      const createData = await createUserWithEmailAndPassword(
        authService,
        inputNewEmail,
        inputNewPassword
      );

      await signOut(authService);
      navigate("/");
      alert("회원가입 성공! 생성한 계정으로 로그인 해주세요!");
      console.log(createData);
    } catch (e) {
      console.log(e.message);
      switch (e.code) {
        case "auth/invalid-email":
          setError("잘못된 형식의 이메일 입니다.");
          break;
        case "auth/email-already-in-use":
          setError("이미 등록되어 있는 이메일 입니다.");
          break;
        case "auth/weak-password":
          setError("비밀번호가 6자리 미만 입니다.");
          break;
        default:
          console.log("에러");
      }
      setInputNewEmail("");
      setInputNewPassword("");
      setInputNewPasswordCheck("");
    }
  };
  // 비밀번호 확인 input 에서 onchange 이벤트가 발생하면 호출, 입력한 비밀번호와 같은 판단
  const onchangePasswordCheck = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      if (value === "") {
        setCheckPasswordApproval(null);
      } else {
        setCheckPasswordApproval(value === inputNewPassword);
      }
      setInputNewPasswordCheck(value);
    },
    [inputNewPassword]
  );
  return (
    <SignUpBack>
      <LogoName>우리동네 핫플</LogoName>
      <SignUpForm onSubmit={onsubmitSignUpButton}>
        <InputEmailLayout>
          <InputEmailText htmlFor="newEmail">이메일</InputEmailText>
          <InputEmail
            name="newEmail"
            type="email"
            value={inputNewEmail}
            onChange={onchangeInput}
            placeholder="이메일을 입력해주세요."
          />
        </InputEmailLayout>

        <InputPasswordLayout>
          <InputPasswordText htmlFor="newPassword">비밀번호</InputPasswordText>
          <InputPassword
            name="newPassword"
            type="password"
            value={inputNewPassword}
            onChange={onchangeInput}
            placeholder="비밀번호를 입력 해주세요."
          />
        </InputPasswordLayout>
        <InputPasswordCheckLayout>
          <div>
            <InputPasswordCheckText htmlFor="namePasswordCheck">
              비밀번호확인
            </InputPasswordCheckText>
            <InputPasswordCheck
              name="newPasswordCheck"
              type="password"
              value={inputNewPasswordCheck}
              onChange={onchangePasswordCheck}
              placeholder="비밀번호 확인을 위해 다시 입력 해주세요."
            />
          </div>
          {checkPasswordApproval === null ? (
            <InputPasswordCheckMessage>
              비밀번호 중복을 확인 해주세요.
            </InputPasswordCheckMessage>
          ) : checkPasswordApproval === false ? (
            <ErrorMessagePassword>
              비밀번호가 일치하지 않습니다.
            </ErrorMessagePassword>
          ) : (
            <SuccessMessage>비밀번호가 일치합니다.</SuccessMessage>
          )}
        </InputPasswordCheckLayout>
        <SignButtonLayout>
          <SignUpButton type="submit">회원가입</SignUpButton>
        </SignButtonLayout>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </SignUpForm>
    </SignUpBack>
  );
};

export default Signup;
