import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../routes/Home";
import LoginForm from "../routes/LoginForm";
import Profile from "../routes/Profile";
import PropTypes from "prop-types";
import Signup from "../routes/Signup";
import Navigation from "./Navigation";
import PostMake from "../routes/PostMake";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoils/UserAtom";
// displayname 을 업데이트 한다고 해서 새로운 user 객체를 생성해서 displayname 을 변경하는것이 아닌 기존의 user 객체의 값을 변환한다. 그래서 닉네임을 변경해도 바로 네이게이션에 변경한 닉네임이 바로 업데이트 되지 않음.

const AppRouter = ({ userLocation }) => {
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (
    <>
      <Router>
        {user && <Navigation />}
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Home userLocation={userLocation} />} />
              <Route path="/profile" element={<Profile />} />

              <Route
                path="/postmake"
                element={<PostMake userLocation={userLocation} />}
              />
            </>
          ) : (
            <>
              <Route path="/" element={<LoginForm />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
