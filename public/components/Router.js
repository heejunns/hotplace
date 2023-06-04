import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../src/routes/Home";
import LoginForm from "../../src/routes/LoginForm";
import Profile from "../../src/routes/Profile";
import PropTypes from "prop-types";
import Signup from "../../src/routes/Signup";
import Navigation from "./Navigation";
import PostMake from "../../src/routes/PostMake";
// displayname 을 업데이트 한다고 해서 새로운 user 객체를 생성해서 displayname 을 변경하는것이 아닌 기존의 user 객체의 값을 변환한다. 그래서 닉네임을 변경해도 바로 네이게이션에 변경한 닉네임이 바로 업데이트 되지 않음.

const AppRouter = ({ isLogin, user, setCurrentUser }) => {
  return (
    <>
      <Router>
        {isLogin && <Navigation user={user} />}
        <Routes>
          {isLogin ? (
            <>
              <Route path="/" element={<Home user={user} />} />
              <Route
                path="/profile"
                element={
                  <Profile user={user} setCurrentUser={setCurrentUser} />
                }
              />

              <Route path="/postmake" element={<PostMake user={user} />} />
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

AppRouter.propTypes = {
  isLogin: PropTypes.node,
};
export default AppRouter;
