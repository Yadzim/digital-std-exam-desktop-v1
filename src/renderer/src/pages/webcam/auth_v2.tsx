import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';
import { Alert } from 'antd';
import { useAppDispatch, useAppSelector } from 'store/services';
import { FILE_URL } from 'config/utils';
import { FaCircleCheck } from "react-icons/fa6";
import { isBlinking, isLookingCenter, isLookingLeftOrRight, isMouthOpen, } from './utils';
import useDebounce from 'hooks/useDebounce';
import CheckFaceID from './service';
import { setFile } from 'store/faceID';
import { useTranslation } from 'react-i18next';

function shuffleArray(array: any[]): any {
  // for (let i = array.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [array[i], array[j]] = [array[j], array[i]];
  // }

  // return array;

  return array[Math.floor(Math.random() * array.length)];
}

const stap = [
  // { name: "mouth", title: "Og'zingizni oching" },
  { name: "left", title: "Yuzingizni chapga buring" }, // Chap tomonga qarang
  { name: "live", title: "Yuzingizni pastga qarating" }, // Pastga qarang
  { name: "right", title: "Yuzingizni o'ngga buring" }, // O'ng tomonga qarang
  // {order: 4, name: "center", title: "Kameraga qarang" },
]

const initialAuth = {
  // "mouth": false,
  "left": false,
  "right": false,
  "live": false,
  "center": false
}

const WebcamAuthStap: React.FC<{ examId?: number }> = ({ examId }) => {

  const { t } = useTranslation();
  const { isLoading } = useAppSelector(p => p.faceID)

  const webcamRef = useRef<Webcam>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [_isNotFace, setIsNotFace] = useState(false);
  const [auth, setAuth] = useState<Record<string, boolean>>(initialAuth);

  const isNotFace = useDebounce(_isNotFace, 500);

  const dispatch: any = useAppDispatch();
  const { user } = useAppSelector(p => p.user);

  const width = 297;
  const height = 382;

  const [loader, setLoader] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const authStap = useMemo(() => [shuffleArray(stap), { name: "center", title: "Kameraga qarang" }], [shuffle]);

  const [hasCamera, setHasCamera] = useState<number>();

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(1);
        stream.getTracks().forEach(track => track.stop()); // Stop the tracks after checking
      } catch (error) {
        setHasCamera(0);
      }
    };

    checkCamera();
  }, []);

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

      // const blob = new Blob([unit8Array], { type: 'image/png' });

      setTimeout(() => {

        dispatch(setFile(base64Img ?? ""));
        // dispatch(CheckFaceID({ id: examId, file: base64Img ?? "" }))
        // dispatch(EXAM_ACTIONS.setFaceId({ url: URL.createObjectURL(blob), urlBase64: base64Img, user_id }));
        setAuth(initialAuth);
        setShuffle(p => !p);

      }, 1500);

    }
  }, [webcamRef]);

  const checkAuthStap = useCallback((name: string) => {
    if (!auth[name]) {
      const idx = authStap?.findIndex(e => e.name === name);
      const _name = authStap[idx - 1]?.name;
      if (!idx || (idx && auth[_name])) {
        setAuth(p => ({ ...p, [name]: true }));
        if (name === "center" && idx === 1) {
          capture();
        }
      }
    }
  }, [modelsLoaded, loader, authStap]);

  // console.log("authStap", authStap);


  const loadModels = useCallback(async () => {
    try {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
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

  const sendProctoringEvent = useCallback((type: string, data?: unknown) => {
    try {
      const w = window as unknown as { electron?: { sendProctoringEvent?: (t: string, d?: unknown) => void }; require?: (id: string) => { ipcRenderer: { send: (ch: string, p: unknown) => void } } };
      if (w.electron?.sendProctoringEvent) {
        w.electron.sendProctoringEvent(type, data);
      } else if (typeof w.require === 'function') {
        w.require('electron').ipcRenderer.send('proctoring-event', { type, data });
      }
    } catch (_) {}
  }, []);

  const detectFace = useCallback(async () => {
    if (!modelsLoaded || !webcamRef.current?.video) return;
    const video = webcamRef.current.video;
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    try {
      const detections = await faceapi.detectAllFaces(video, options)
        .withFaceLandmarks(true)
        .withFaceExpressions();

      if (detections.length > 1) {
        sendProctoringEvent('multi_face_detected', { count: detections.length });
      }
      if (detections.length === 0) {
        setIsNotFace(true);
        sendProctoringEvent('no_face_detected');
        return;
      }

      const first = detections[0];
      if (!first.landmarks) {
        setIsNotFace(true);
        return;
      }
      setIsNotFace(false);
      const { landmarks } = first;
      const isBlinkingDetected = isBlinking(landmarks);
      const isMouthOpenDetected = isMouthOpen(landmarks);
      const lookDirection = isLookingLeftOrRight(landmarks, video.videoWidth);
      const isCentered = isLookingCenter(landmarks, video.videoWidth);

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
    } catch (_) {
      sendProctoringEvent('no_face_detected');
    }
  }, [modelsLoaded, auth, loader, authStap, sendProctoringEvent]);

  useEffect(() => {
    if (!isLoading) {
      let animationFrameId: number;
      const detectFaceLoop = () => {
        detectFace().catch(() => {});
        animationFrameId = requestAnimationFrame(detectFaceLoop);
      };

      if (modelsLoaded) {
        detectFaceLoop();
      }

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [modelsLoaded, detectFace, isLoading]);

  const stapMessage = useMemo(() => {
    const arr = loader ? [...authStap]?.reverse()?.find(e => auth[e.name])
      : authStap?.find(e => !auth[e.name]);

    if (arr) {
      return <h3 className={`text-center animate__animated ${!loader ? "animate__headShake" : ""}`} style={{ margin: 0, color: loader ? "#0b9712" : "#DC3545" }} >
        {loader ? <FaCircleCheck className='animate__animated animate__heartBeat' color='#0b9712' size={24} /> : null} {t(arr?.title)}
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

  if (hasCamera === 0) {
    return (
      <div className='text-center my-5'>
        <img src="https://cdn.dribbble.com/users/1356973/screenshots/4989211/media/8efffd1963c042ffd1ca5ce43ee436d4.png" alt="" style={{ maxWidth: 400, margin: "0 auto" }} />
        <h4 className='mt-4'>{("Iltimos kameraga ulanishni tekshiring!!!")}</h4>
        <p>Qurilmaga kamera ulanmagan yoki kameradan foydalanish uchun ruxsat berilmagan.</p>
        <div className='text-bg-warning d-inline-block px-2 rounded' >Xatolik bartaraf etilgandan so'ng sahifani qayta yangilang!</div>
      </div>
    )
  }

  return (
    <div style={{ height: "100%", display: 'flex', flexDirection: "column", alignItems: "center", margin: "0 auto" }}>
      <Alert type="info" banner message={<span>{t("Yuzingizni quyidagi ramka ichida saqlang va ko'rsatilgan amalni bajaring.")}</span>} closable style={{ width: 400, marginBottom: 8, borderRadius: 4 }} />
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
              {t("Iltimos yuzingizni kameraga qarating!!!")}
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
        {!modelsLoaded && <p>Loading models...</p>}
      </div>
    </div>
  );
};

export default WebcamAuthStap;
