import React, { useCallback, useState } from "react";
import { dbService, storageService } from "../../src/reactfbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import styled from "styled-components";
import Map from "../../public/components/Map";
import { useNavigate } from "react-router-dom";
// 식별자를 랜덤으로 생성해줌
const PostMakeBack = styled.div`
  font-family: "Nanum Myeongjo", serif;
  width: 100%;
  height: 95vh;
  background: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
const PostFormStyle = styled.form`
  overflow-y: auto;
  margin-top: 0.5rem;
  padding: 1rem;
  width: 70%;
  height: 90%;
  min-height: 90%;
  border-radius: 10px;
  border: 3px solid mediumorchid;
  @media screen and (min-width: 820px) {
    width: 60%;
  }
  @media screen and (min-width: 1400px) {
    width: 50%;
  }
`;

const InputPostStyle = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  background: white;
  border-style: none;
`;
const InputCategory = styled.input`
  margin-right: 1rem;
`;
const FileSelectButton = styled.input`
  display: none;
`;
const FileSelectLabelLayout = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: mediumorchid;
  }
`;
const SubmitButtonStyle = styled.input`
  width: 50%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 3px solid mediumorchid;
  background: white;
`;
const MapButton = styled.button`
  width: 50%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 3px solid mediumorchid;
  background: white;
`;
const UploadImageLayout = styled.div`
  margin-left: 1rem;
  width: 5rem;
  height: 5rem;
  justify-content: center;
  position: relative;
`;
const UploadImageStyle = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 5px;
  background: white;
`;
const UploadImageDeleteButton = styled.button`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 3px solid mediumorchid;
  background: white;
`;
const TopLayout = styled.div`
  margin-top: 0.5rem;
  border: 3px solid mediumorchid;
  border-radius: 5px;
  width: 100%;
  height: 10%;
  display: flex;
`;
const MiddleOneLayout = styled.div`
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 3px solid mediumorchid;
  border-radius: 5px;
  width: 100%;
  height: 5%;
`;

const MiddleTwoLayout = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  height: 8%;
  border-radius: 5px;
  border: 3px solid mediumorchid;
`;

const MiddleThreeLayout = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  text-align: center;
`;

const BottomLayout = styled.div`
  margin-top: 0.5rem;
  text-align: center;
`;
const PostMake = ({ user }) => {
  const navigate = useNavigate(); // useNavigate 훅스를 사용해서 게시글을 올리면 "/" 주소로 강제 이동
  const [inputText, setInputText] = useState(""); // input 태그에 입력하는 value 의 state
  const [uploadImageFileURL, setUploadImageFileURL] = useState(""); // 업로드 하려는 이미지의 주소를 저장
  const [mapStatus, setMapStatus] = useState(false); // 게시글을 작성할 때 매장의 주소를 기록할지 여부
  const [userSelectCategory, setUserSelectCategory] = useState("cafe"); // 사용자가 글을 게시할때 사용자의 주소
  const [userMarkerLocation, setUserMarkerLocation] = useState([]); // 사용자가 맵에 마커한 매장의 주소
  const [mapMarkerChange, setMapMarkerChange] = useState(false); // 맵의 마커가 바뀌었는지 여부를 저장하는 state

  // 트윗 작성 input 태그의 onchange 이벤트 콜백 함수
  const onchangeInputText = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setInputText(value);
  }, []);

  // 게시글에 올리는 가게의 종류를 고르면 호출되는(라디오) onchange 콜백 함수
  const onchangeUserSelectCategory = useCallback((event) => {
    const {
      target: { id },
    } = event;
    setUserSelectCategory(id);
  }, []);
  // 작성한 글을 등록하기 위해 버튼을 클릭했을때 호출되는 콜백함수
  const onsubmitButtonClick = async (e) => {
    e.preventDefault();
    console.log("hello");
    if (mapMarkerChange === true) {
      alert("지도의 마커를 변경하였다면 완료 버튼을 클릭 해주세요.");
      return;
    }
    try {
      let getUploadFileURL = "";
      let uploadSnapshot = "";
      if (uploadImageFileURL !== "") {
        // 이미지 url 이 있다면 이미지가 있다는 뜻이니까
        const storageRef = ref(storageService, `${user.uid}/${uuidv4()}`); // 이미지 storage 에 저장
        uploadSnapshot = await uploadString(
          storageRef,
          uploadImageFileURL,
          "data_url"
        );

        getUploadFileURL = await getDownloadURL(uploadSnapshot.ref); // 이미지 url 불러오기
      }

      await addDoc(collection(dbService, "test"), {
        // 데이터베이스에 저장
        inputText, // 게시글
        createTime: Date.now(), // 생성 날짜
        writer: user.uid, // 작성한 작성자의 uid
        getUploadFileURL, // 업로드한 이미지의 url
        nickname: user.displayName, // 작성자의 닉네임
        userMarkerLocation, // 작성자가 맵에 마커한 위치 정보
        userSelectCategory, // 작성자가 선택한 카테고리 종류
        likeNumber: 0, // 게시물의 좋아요 개수
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setInputText("");
    setUploadImageFileURL("");
    navigate("/");
  };

  const onchangeImageUpload = useCallback((event) => {
    // 사진 파일을 선택했을때 선택한 사진을 화면에 보여주는 코드
    const {
      target: { files },
    } = event;
    const uploadFile = files[0];
    // 파일을 읽어오기 위해서 fileReader API 를 사용하기
    const reader = new FileReader(); // 파일리더 생성
    reader.readAsDataURL(uploadFile); // 파일리더로 파일 읽기
    reader.onloadend = (fileLoadEndEvent) => {
      // 파일리더에 파일 업로드가 끝나는지 리스너를 달아서 업로드가 끝나면 콜백함수에 업로드 된 객체가 전달되어 콜백함수가 호출

      setUploadImageFileURL(fileLoadEndEvent.target.result);
    };
  }, []);
  // 선택한 이미지를 삭제 버튼을 클릭하면 호출
  const onclickUploadFileDelete = useCallback(() => {
    setUploadImageFileURL("");
  }, []);
  // 맵을 화면에 보여주기 위한 버튼을 클릭하였을 때 호출
  const onclickMapButton = useCallback(() => {
    setMapStatus((prev) => !prev);
  }, []);
  return (
    <PostMakeBack>
      <PostFormStyle onSubmit={onsubmitButtonClick}>
        <TopLayout>
          <FileSelectLabelLayout>
            <label htmlFor="fileSelect">FileUpload</label>
          </FileSelectLabelLayout>
          <FileSelectButton
            id="fileSelect"
            type="file"
            accept="image/*"
            onChange={onchangeImageUpload}
          />
          {uploadImageFileURL && (
            <UploadImageLayout>
              <UploadImageStyle src={uploadImageFileURL} alt="올리는 파일" />
              <UploadImageDeleteButton
                type="button"
                onClick={onclickUploadFileDelete}
              >
                X
              </UploadImageDeleteButton>
            </UploadImageLayout>
          )}
        </TopLayout>
        <MiddleOneLayout>
          카테고리 선택 : <label htmlFor="cafe">카페</label>
          <InputCategory
            id="cafe"
            type="radio"
            name="cafe"
            onChange={onchangeUserSelectCategory}
          />
          <label htmlFor="food">음식</label>
          <InputCategory
            id="food"
            type="radio"
            name="cafe"
            onChange={onchangeUserSelectCategory}
          />
          <label htmlFor="mart">마트</label>
          <InputCategory
            id="mart"
            type="radio"
            name="cafe"
            onChange={onchangeUserSelectCategory}
          />
        </MiddleOneLayout>
        <MiddleTwoLayout>
          <InputPostStyle
            type="text"
            value={inputText}
            onChange={onchangeInputText}
            placeholder="올리고 싶은 글을 작성해주세요."
          />
        </MiddleTwoLayout>
        <MiddleThreeLayout>
          <MapButton type="button" onClick={onclickMapButton}>
            위치 지정하기
          </MapButton>
          {mapStatus && (
            <Map
              setUserMarkerLocation={setUserMarkerLocation}
              setMapMarkerChange={setMapMarkerChange}
            />
          )}
        </MiddleThreeLayout>

        <BottomLayout>
          <SubmitButtonStyle type="submit" value="등록" />
        </BottomLayout>
      </PostFormStyle>
    </PostMakeBack>
  );
};

export default PostMake;
