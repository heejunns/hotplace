import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";

const PostMapStyle = styled.div`
  border-radius: 10px;
  width: 100%;
  height: 20rem;
`;
const PostMap = ({ data }) => {
  const { userMarkerLocation } = data;

  const getMap = useCallback(() => {
    const mapContainer = document.getElementById("postMap"); // 지도를 표시할 div
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        userMarkerLocation[0],
        userMarkerLocation[1]
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 마커가 표시될 위치입니다
    const markerPosition = new window.kakao.maps.LatLng(
      userMarkerLocation[0],
      userMarkerLocation[1]
    );

    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [userMarkerLocation]);
  useEffect(() => {
    getMap();
  }, [getMap]);

  return (
    <div>
      <PostMapStyle id="postMap"></PostMapStyle>
    </div>
  );
};

export default PostMap;
