import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from 'antd';

const VIOLATION_LABELS: Record<string, string> = {
  no_face_detected: "Yuz aniqlanmadi",
  head_movement: "Bosh harakati",
  multi_face_detected: "Ko'p yuz aniqlandi",
  forbidden_process: "Taqiqlangan dastur ishlatilmoqda",
  tab_switch: "Oyna almashtirildi",
  vm_detected: "Virtual mashina aniqlandi",
  devtools_detected: "Developer vositalar ochiq",
  multi_display: "Ko'p monitor aniqlandi",
  proxy_detected: "Proxy aniqlandi",
  tunnel_detected: "Tunnel aniqlandi",
};

const MESSAGE_INTRO = "Hurmatli talaba, siz quyidagi qoida buzilishlarni qilmoqdasiz:";

type AlertItem = { type: string; label: string; key: number };

const ProctoringAlertBanner: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isElectron, setIsElectron] = useState(false);
  const keyRef = React.useRef(0);

  const handleSecurityEvent = useCallback((payload: { type?: string }) => {
    const type = payload?.type;
    if (!type) return;
    if (type === "security_cleared" || type === "face_ok") {
      setAlerts([]);
      return;
    }
    const label = VIOLATION_LABELS[type] || type;
    setAlerts((prev) => {
      const next = [...prev, { type, label, key: keyRef.current++ }];
      if (next.length > 3) return next.slice(-3);
      return next;
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
    } catch (_) {}
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
    } catch (_) {}
    return () => unsubscribe?.();
  }, [handleSecurityEvent]);

  if (!isElectron || alerts.length === 0) return null;

  return (
    <div
      className="proctoring-alert-banner"
      style={{
        marginBottom: 16,
        padding: '12px 16px',
        background: '#fff2e8',
        borderBottom: '2px solid #ff7875',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Alert
        message={
          <span style={{ fontWeight: 600, fontSize: '14px' }}>
            {MESSAGE_INTRO}
          </span>
        }
        description={
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            {alerts.map((a) => (
              <li key={a.key} style={{ marginBottom: '4px' }}>
                {a.label}
              </li>
            ))}
          </ul>
        }
        type="warning"
        showIcon
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      />
    </div>
  );
};

export default ProctoringAlertBanner;
