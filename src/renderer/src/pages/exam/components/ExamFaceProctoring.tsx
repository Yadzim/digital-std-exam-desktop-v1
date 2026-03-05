import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';

function sendProctoringEvent(type: string, data?: unknown) {
  try {
    const w = window as unknown as {
      electron?: { sendProctoringEvent?: (t: string, d?: unknown) => void };
      require?: (id: string) => { ipcRenderer: { send: (ch: string, p: unknown) => void } };
    };
    if (w.electron?.sendProctoringEvent) {
      w.electron.sendProctoringEvent(type, data);
    } else if (typeof w.require === 'function') {
      w.require('electron').ipcRenderer.send('proctoring-event', { type, data });
    }
  } catch (_) {}
}

const DETECTION_INTERVAL_MS = 1000;

const ExamFaceProctoring: React.FC = () => {
  const webcamRef = useRef<{ video: HTMLVideoElement; getScreenshot: (o?: { width?: number; height?: number }) => string | null } | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    try {
      const w = window as unknown as { electron?: { isElectron?: boolean }; require?: (id: string) => unknown };
      if (w.electron?.isElectron) {
        setIsElectron(true);
        return;
      }
      if (typeof w.require === 'function') {
        w.require('electron');
        setIsElectron(true);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!isElectron) return;
    let cancelled = false;
    (async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        if (cancelled) return;
        setModelsLoaded(true);
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, [isElectron]);

  useEffect(() => {
    if (!modelsLoaded || !isElectron) return;

    const runDetection = async () => {
      if (!webcamRef.current?.video) return;
      const v = webcamRef.current.video;
      if (!v.srcObject || v.paused || v.ended || v.readyState < 2 || v.videoWidth < 100) return;
      try {
        // digital-std-exam-desktop kabi: default TinyFaceDetectorOptions, faqat yuz soni
        const detections = await faceapi.detectAllFaces(v, new faceapi.TinyFaceDetectorOptions());
        if (detections.length === 0) {
          sendProctoringEvent('no_face_detected', { count: 0 });
        } else if (detections.length > 1) {
          sendProctoringEvent('multi_face_detected', { count: detections.length });
        } else {
          sendProctoringEvent('face_ok');
        }
      } catch (_) {
        // Xatolarda hech narsa yubormaymiz (digital-std-exam-desktop kabi)
      }
    };

    const intervalId = setInterval(runDetection, DETECTION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [modelsLoaded, isElectron]);

  if (!isElectron || !modelsLoaded) return null;

  return (
    <div style={{ display: 'none' }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }}
      />
    </div>
  );
};

export default ExamFaceProctoring;
