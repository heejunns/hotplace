import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { onAuthStateChanged } from "firebase/auth";
import { authService } from "../reactfbase";
import styled from "styled-components";

const Loading = styled.div`
  width: 100%;
  color: mediumorchid;
  height: 100vh;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 어플리케이션이 로드 될때 너무 빨라서 파이어 베이스는 사용자가 로그인 되었는지 확인할 시간이 없음.
// 그럼 항상 애플리케이션은 항상 로그아웃 되어 있어서 로그인 폼이 브라우저 화면에 보일 것이다.
// 파이어 베이스가 초기화되고 모든 걸 로드할때까지 기다려 줘야 한다.

const App = () => {
  const [firebaseInitialize, setFirebaseInitialize] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        // setCurrentUser({
        //   uid: user.uid,
        //   displayName: user.displayName,
        // });
        setCurrentUser(user);
        setIsLogin(true);
      } else {
        setCurrentUser(null);
        setIsLogin(false);
      }
      setFirebaseInitialize(true);
    });
  }, []);

  const userGetLocation = async (position) => {
    const lat = await position.coords.latitude;
    const lng = await position.coords.longitude;
    // 현재 애플리케이션을 사용하는 사용자의 위치의 좌표를 가져오기

    getAddr(lat, lng);
    function getAddr(lat, lng) {
      let geocoder = new window.kakao.maps.services.Geocoder();

      let coord = new window.kakao.maps.LatLng(lat, lng);
      let callback = function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log(result);
          setUserLocation(result[0].address.region_1depth_name);
        }
      };
      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(userGetLocation);
    }
  }, []);

  return (
    <>
      {firebaseInitialize ? (
        <AppRouter
          isLogin={isLogin}
          user={currentUser}
          setCurrentUser={setCurrentUser}
          userLocation={userLocation}
        />
      ) : (
        <Loading>불러오는 중...</Loading>
      )}
    </>
  );
};

export default App;
