import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';
import { Alert } from 'antd';
import { useAppDispatch, useAppSelector } from 'store/services';
import { FILE_URL } from 'config/utils';
import { EXAM_ACTIONS } from 'store/exam';
import { FaCircleCheck } from "react-icons/fa6";
import { isBlinking, isLookingCenter, isLookingLeftOrRight, isMouthOpen, } from '../utils';


function shuffleArray(_array: any[]): any[] {
  const array = [..._array]
  for (let i = _array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  // array.push({ name: "center", title: "Kameraga qarang" })
  return array;
}

const stap = [
  // { name: "mouth", title: "Og'zingizni oching" },
  { name: "left", title: "Chap tomonga qarang" },
  { name: "right", title: "O'ng tomonga qarang" },
  { name: "live", title: "Pastga qarang" },
  // {order: 4, name: "center", title: "Kameraga qarang" },
]

const initialAuth = {
  // "mouth": false,
  "left": false,
  "right": false,
  "live": false,
  "center": false
}

// const authStap = shuffleArray(stap).concat({ name: "center", title: "Kameraga qarang" });
// const authStap = [...shuffleArray(stap), { name: "center", title: "Kameraga qarang" }];

const WebcamAuthStap: React.FC = () => {

  const webcamRef = useRef<Webcam>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [isNotFace, setIsNotFace] = useState(false);
  const [auth, setAuth] = useState<Record<string, boolean>>(initialAuth);

  const dispatch: any = useAppDispatch();
  const user_id = useAppSelector(p => p.auth.user?.user_id) ?? 0;
  const { user } = useAppSelector(p => p.user);

  const [dimensions, setDimensions] = useState({ width: 297, height: 382 });
  const { width, height } = dimensions;

  const [loader, setLoader] = useState(false);

  const [shuffle, setShuffle] = useState(false);

  const authStap = useMemo(() => [...shuffleArray(stap), { name: "center", title: "Kameraga qarang" }], [shuffle]);
  // const authStap = useMemo(() => shuffleArray(stap), []);


  // useEffect(() => {
  //   console.log(auth);
  //   console.log("authStap", authStap);
  // }, [auth]);

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
    // let i: any
    if (auth[authStap[0]?.name]) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
      }, 1500);
    }

    // return () => clearTimeout(i);
  }, [auth]);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const base64Img = webcamRef.current.getScreenshot({ width, height });

      const binaryData = window.atob(base64Img?.replace(/^data:image\/(png|jpeg);base64,/, '')?.trim() ?? "");

      const unit8Array = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        unit8Array[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([unit8Array], { type: 'image/png' });

      setTimeout(() => {

        dispatch(EXAM_ACTIONS.setFaceId({ url: URL.createObjectURL(blob), urlBase64: base64Img, user_id }));
        setAuth(initialAuth);
        setShuffle(p => !p);

      }, 1500);

    }
  }, [webcamRef, width]);

  const checkAuthStap = useCallback((name: string) => {
    if (!auth[name]) {
      const idx = authStap?.findIndex(e => e.name === name);
      const _name = authStap[idx - 1]?.name;
      if (!idx || (idx && auth[_name])) {
        setAuth(p => ({ ...p, [name]: true }));
        if (name === "center" && idx === 3) {
          capture();
        }
      }
    }
  }, [modelsLoaded, loader, authStap]);

  const loadModels = useCallback(async () => {
    try {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const detectFace = useCallback(async () => {
    if (!modelsLoaded || !webcamRef.current?.video) return;
    const video = webcamRef.current.video;
    try {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const validDetections = detections.filter((d: { detection?: { box?: { x: number; y: number; width: number; height: number } } }) => {
        const box = d.detection?.box;
        return box && typeof box.x === 'number' && typeof box.y === 'number' && typeof box.width === 'number' && typeof box.height === 'number';
      });

      if (validDetections.length > 0) {
        const { landmarks } = validDetections[0];
        const isBlinkingDetected = isBlinking(landmarks);
        const isMouthOpenDetected = isMouthOpen(landmarks);
        const lookDirection = isLookingLeftOrRight(landmarks, video.videoWidth);
        const isCentered = isLookingCenter(landmarks, video.videoWidth);

        setIsNotFace(false);

        if (!loader) {
          if (isBlinkingDetected) {
            checkAuthStap("live");
          } else if (lookDirection === 'left') {
            checkAuthStap("left");
          } else if (lookDirection === 'right') {
            checkAuthStap("right");
          } else if (isCentered && !isMouthOpenDetected) {
            checkAuthStap("center");
          }
        }

      } else {
        setIsNotFace(true);
      }
    } catch (_) {
      setIsNotFace(true);
    }
  }, [modelsLoaded, auth, loader, authStap]);

  useEffect(() => {
    let animationFrameId: number;
    const detectFaceLoop = () => {
      detectFace();
      animationFrameId = requestAnimationFrame(detectFaceLoop);
    };

    if (modelsLoaded) {
      detectFaceLoop();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [modelsLoaded, detectFace]);

  const stapMessage = useMemo(() => {
    const arr = loader ? [...authStap]?.reverse()?.find(e => auth[e.name])
      : authStap?.find(e => !auth[e.name]);

    if (arr) {
      return <h3 className={`text-center animate__animated ${!loader ? "animate__headShake" : ""}`} style={{ margin: 0, color: loader ? "#0b9712" : "#DC3545" }} >
        {loader ? <FaCircleCheck className='animate__animated animate__heartBeat' color='#0b9712' size={24} /> : null} {arr?.title}
      </h3>
    }

    return null;

    // [
    //   ((loader ? authStap?.reverse()?.find(e => auth[e.name])
    //     : authStap?.find(e => !auth[e.name])) ?? {}) as any
    // ]?.map(e => <h3 className={`text-center animate__animated ${!loader ? "animate__headShake" : ""}`} style={{ margin: 0, color: loader ? "#0b9712" : "#DC3545" }} >
    //   {loader ? <FaCircleCheck className='animate__animated animate__heartBeat' color='#0b9712' size={24} /> : null } {e.title}
    // </h3>
    // )
  }, [loader, auth, authStap])

  return (
    <div style={{ height: "100%", display: 'flex', flexDirection: "column", alignItems: "center", margin: "0 auto" }}>
      <Alert type="info" banner message={<span>{("Yuzingizni kameraga qarating va ko'rsatilgan amalni bajaring.")}</span>} closable style={{ width: 400, marginBottom: 8, borderRadius: 4 }} />
      <div style={{ position: 'relative', width: 400, borderRadius: "6px" }}>
        <div className='mt-2 my-4' >
          {
            stapMessage
          }
        </div>
        {
          loader && auth?.center ? <div
            className='d-inline-block p-5 rounded-5'
            style={{ position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%, -50%)", margin: "0 auto", zIndex: 50, background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)" }}
          >
            <FaCircleCheck className='animate__animated animate__heartBeat' color='#0b9712' size={180} />
          </div> : null
        }
        {
          !loader && isNotFace ? <div style={{ position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%, -50%)", margin: "0 auto", zIndex: 50, width: 300 }} >
            <h4
              className='text-center p-2 rounded-2 animate__animated animate__shakeX text-danger'
              style={{ background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(5px)" }}
            >
              Iltimos yuzingizni kameraga qarating!!!
            </h4>
          </div> : null
        }
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={400}
          height={520}
          videoConstraints={{
            width: 400,
            height: 520,
            facingMode: "user",
          }}
          style={{
            borderRadius: "10px",
            outline: "4px solid",
            outlineColor: !loader && isNotFace ? "#DC3545" : "#0b9712",
            outlineOffset: 6
          }}
          mirrored
        />
        {/* <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} /> */}
        {!modelsLoaded && <p>Loading models...</p>}
        {/* <Button type="primary" autoFocus onClick={capture} disabled={!visible} style={{ borderRadius: '4px', width: '100%', marginTop: '8px' }}>{("Tasdiqlash")}</Button> */}
      </div>
    </div>
  );
};

export default WebcamAuthStap;
