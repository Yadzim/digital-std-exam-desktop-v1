import React, { useEffect, useCallback, useState } from 'react';
import { notification } from 'antd';

const VIOLATION_LABELS: Record<string, string> = {
  no_face_detected: "Yuz aniqlanmadi",
  head_movement: "Bosh harakati",
  multi_face_detected: "Ko'p yuz aniqlandi",
  tab_switch: "Oyna almashtirildi",
};

const MESSAGE_INTRO = "Qoida buzilishi:";

const ProctoringAlertBanner: React.FC = () => {
  const [isElectron, setIsElectron] = useState(false);

  const handleSecurityEvent = useCallback((payload: { type?: string }) => {
    const type = payload?.type;
    if (!type) return;
    if (type === 'devtools_detected' || type === 'screenshot') return;
    if (type === "security_cleared" || type === "face_ok") {
      notification.destroy();
      return;
    }
    const label = VIOLATION_LABELS[type] || type;
    const key = `proctoring-${Date.now()}`;
    notification.open({
      key,
      message: 'Proctoring ogohlantirish',
      description: (
        <div className="text-secondary">
          {MESSAGE_INTRO} <strong>{label}</strong>.
          <br />
          <div className="notification-progres" />
        </div>
      ),
      type: 'warning',
      style: {
        backgroundColor: '#fffbeb',
        position: 'relative',
        borderRadius: '10px',
      },
      // Kamida 2 sekund, odatda ~4 sekund ko'rinib turadi
      duration: 4,
    });
  }, []);

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
    } catch (_) { }
  }, []);

  useEffect(() => {
    const onEvent = (a: unknown, b?: unknown) => {
      const payload = (b !== undefined ? b : a) as { type?: string };
      handleSecurityEvent(payload);
    };
    let unsubscribe: (() => void) | undefined;
    try {
      const w = window as unknown as {
        electron?: { onSecurityEvent?: (cb: (p: unknown) => void) => () => void };
        require?: (id: string) => { ipcRenderer: { on: (ch: string, fn: (e: unknown, p?: unknown) => void) => void; removeListener: (ch: string, fn: (e: unknown, p?: unknown) => void) => void } };
      };
      if (w.electron?.onSecurityEvent) {
        unsubscribe = w.electron.onSecurityEvent((p) => handleSecurityEvent(p));
      } else if (typeof w.require === 'function') {
        const ipc = w.require('electron').ipcRenderer;
        if (ipc) {
          ipc.on('security-event', onEvent);
          unsubscribe = () => ipc.removeListener('security-event', onEvent);
        }
      }
    } catch (_) { }
    return () => unsubscribe?.();
  }, [handleSecurityEvent]);

  if (!isElectron) return null;
  return null;
};

export default ProctoringAlertBanner;
