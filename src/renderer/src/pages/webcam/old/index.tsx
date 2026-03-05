import { Alert, Button } from "antd";
import React, { useEffect, useState } from "react";
import faceId from 'assets/images/faceId3.png'
import Webcam from "react-webcam";
import { useAppDispatch, useAppSelector } from "store/services";
import { EXAM_ACTIONS } from "store/exam";
import { useTranslation } from "react-i18next";
import { FILE_URL } from "config/utils";

function WebcamAuth() {
  const { t } = useTranslation();
  // const [url, setUrl] = React.useState<any>("");
  const dispatch: any = useAppDispatch();
  const user_id = useAppSelector(p => p.auth.user?.user_id) ?? 0;
  // const face = useAppSelector(p => p.exam.faceId.urlBase64);
  const { user } = useAppSelector(p => p.user);
  const webcamRef = React.useRef<any>(null);
  const btnRef = React.useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 297, height: 382 });
  const { width, height } = dimensions;

  useEffect(() => {
    if (user) {
      const img = new Image();
      img.src = FILE_URL + (user?.profile?.image ?? "");
      img.onload = () => {
        setDimensions({ width: img.width ?? 297, height: img.height ?? 382 });
      };
    }
  }, [user]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "NumpadEnter" || e.code === "Enter") {
        capture();

      }
      // console.log("clicked");
    })
  }, []);

  const capture = React.useCallback(() => {
    const base64Img = webcamRef.current.getScreenshot({ width, height });
    // console.log(width, height);


    // console.log("base 64 image ->", base64Img)

    const binaryData = window.atob(base64Img?.replace(/^data:image\/(png|jpeg);base64,/, '')?.trim());

    const unit8Array = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      unit8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([unit8Array], { type: 'image/png' });

    // setUrl(URL.createObjectURL(blob));
    dispatch(EXAM_ACTIONS.setFaceId({ url: URL.createObjectURL(blob), urlBase64: base64Img, user_id }));
  }, [webcamRef]);

  // console.log(url);

  return (
    // <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center"}} >
    <div style={{ display: "flex", justifyContent: "center" }} >
      <div style={{ marginTop: "3rem", marginBottom: "3rem" }} >
        <Alert type="info" banner message={<span>{t("Yuzingizni kameraga qarating va belgilangan chegaraga to'g'irlang.")}</span>} closable style={{ width: '297px', marginBottom: 8, borderRadius: 4 }} />
        {/* <div style={{ position: 'relative', width: '297px', height: '382px', borderRadius: "6px", marginTop:"7rem" }}> */}
        <div style={{ position: 'relative', width: 297, height: 382, borderRadius: "6px" }}>
          <Webcam
            // width={"100%"}
            // height={"100%"}
            width={297}
            height={382}
            videoConstraints={{
              width: 297,
              height: 382,
              facingMode: "user",
            }}
            screenshotQuality={0.92}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            audio={false}
            mirrored={true}
            style={{
              borderRadius: "10px",
              // transform: `scale(${297/width})`
            }}
          />
          <div style={{ position: 'absolute', width: "80%", height: "70%", top: '15%', left: '10%', right: '10%', bottom: 10 }}>
            <img src={faceId} width={"100%"} height={"100%"} alt="" />
          </div>
        </div>
        <Button ref={btnRef} type="primary" autoFocus onKeyDown={(e) => {
          if (e.code === "NumpadEnter" || e.code === "Enter") {
            capture();
          }
        }} onClick={capture} style={{ borderRadius: '4px', width: '100%', marginTop: '8px' }}>{t("Tasdiqlash")}</Button>
      </div>
      {/* <div style={{ width: "200px", height: "400px" }}>
        <img src={url} width={"100%"} height={"100%"} alt="" />
      </div> */}
    </div>
  );
}

export default WebcamAuth;
