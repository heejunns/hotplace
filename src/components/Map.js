import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
const MapLayout = styled.div`
  width: 100%;
  border: 3px solid mediumorchid;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.5rem;
  height: 85%;
`;
const MapImage = styled.div`
  color: mediumorchid;
  width: 100%;
  height: 10rem;
  border-radius: 5px;
  @media screen and (min-width: 390px) and (min-height: 844px) {
    height: 15rem;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    height: 18rem;
  }
`;
const ButtonLayout = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
`;

const ButtonMarker = styled.button`
  border-radius: 10px;
  border: 3px solid mediumorchid;
  background: white;
  padding: 0.3rem;
  font-size: 1rem;
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    font-size: 1.3rem;
  }
  @media screen and (min-width: 800px) {
    font-size: 1.5rem;
  }
`;

const Map = ({ setUserMarkerLocation }) => {
  const [marker, setMarker] = useState("");
  const getLocation = useCallback(
    async (position) => {
      const lat = await position.coords.latitude;
      const lng = await position.coords.longitude;
      // 현재 애플리케이션을 사용하는 사용자의 위치의 좌표를 가져오기

      const mapContainer = document.getElementById("map"); // 지도를 표시할 div
      const mapOption = {
        center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

      // 지도를 생성합니다
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      console.log("지도 만듬!");
      const options = {
        // Drawing Manager를 생성할 때 사용할 옵션입니다
        map: map, // Drawing Manager로 그리기 요소를 그릴 map 객체입니다
        drawingMode: [
          // drawing manager로 제공할 그리기 요소 모드입니다
          window.kakao.maps.drawing.OverlayType.MARKER,
          window.kakao.maps.drawing.OverlayType.POLYLINE,
          window.kakao.maps.drawing.OverlayType.RECTANGLE,
          window.kakao.maps.drawing.OverlayType.CIRCLE,
          window.kakao.maps.drawing.OverlayType.POLYGON,
        ],
        // 사용자에게 제공할 그리기 가이드 툴팁입니다
        // 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
        guideTooltip: ["draw", "drag", "edit"],
        markerOptions: {
          // 마커 옵션입니다
          draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다
          removable: true, // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다
        },
      };

      // 위에 작성한 옵션으로 Drawing Manager를 생성합니다
      var manager = new window.kakao.maps.drawing.DrawingManager(options);

      // 버튼 클릭 시 호출되는 핸들러 입니다
      setMarker(() => {
        return (type) => {
          // 그리기 중이면 그리기를 취소합니다
          manager.cancel();

          // 클릭한 그리기 요소 타입을 선택합니다
          manager.select(window.kakao.maps.drawing.OverlayType[type]);
        };
      });
      manager.addListener("remove", function (e) {
        // 마커를 삭제하면 이벤트 발생
        const data = manager.getData();
        console.log("삭제", data);
        if (data.marker.length !== 0) {
          //불러온 데이터의 marker 에 데이터가 있다면
          setUserMarkerLocation([data.marker[0].y, data.marker[0].x]); // 마커를 지정한 좌표를 state 로 업데이트
          return;
        } else if (data.marker.length === 0) {
          // 마커를 삭제하고 완료 버튼을 클릭하면 마커의 좌표를 저장하는 state 초기화
          setUserMarkerLocation([]);
          return;
        }
      });

      manager.addListener("drawend", function (d) {
        // 마커를 생성하면 이벤트 발생
        const data = manager.getData();
        if (data.marker.length !== 0) {
          //불러온 데이터의 marker 에 데이터가 있다면
          setUserMarkerLocation([data.marker[0].y, data.marker[0].x]); // 마커를 지정한 좌표를 state 로 업데이트
          return;
        } else if (data.marker.length === 0) {
          // 마커를 삭제하고 완료 버튼을 클릭하면 마커의 좌표를 저장하는 state 초기화
          setUserMarkerLocation([]);
          return;
        }
      });
    },
    [setUserMarkerLocation]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLocation);
    }
    // 주소-좌표 변환 객체를 생성합니다
    //   var geocoder = new window.kakao.maps.services.Geocoder();
    //   // 주소로 좌표를 검색합니다
    //   geocoder.addressSearch(
    //     "제주특별자치도 제주시 첨단로 242",
    //     function (result, status) {
    //       // 정상적으로 검색이 완료됐으면
    //       if (status === window.kakao.maps.services.Status.OK) {
    //         var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
    //         // 결과값으로 받은 위치를 마커로 표시합니다
    //         var marker = new window.kakao.maps.Marker({
    //           map: map,
    //           position: coords,
    //         });
    //         // 인포윈도우로 장소에 대한 설명을 표시합니다
    //         var infowindow = new window.kakao.maps.InfoWindow({
    //           content:
    //             '<div style="width:150px;text-align:center;padding:6px 0;">여기가 맛집</div>',
    //         });
    //         infowindow.open(map, marker);
    //         // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
    //         map.setCenter(coords);
    //       }
    //     }
    //   );
    // }
  }, [getLocation]);

  console.log(marker);
  return (
    <MapLayout>
      <MapImage id="map">맵 불러오는 중</MapImage>
      <ButtonLayout>
        <ButtonMarker type="button" onClick={() => marker("MARKER")}>
          마커하기
        </ButtonMarker>
      </ButtonLayout>
    </MapLayout>
  );
};

export default memo(Map);
