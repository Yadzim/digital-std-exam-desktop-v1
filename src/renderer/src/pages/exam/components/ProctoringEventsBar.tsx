import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';

type EventCounts = {
    multi_face_detected: number;
    no_face_detected: number;
    forbidden_process: number;
    tab_switch: number;
    vm_detected: number;
    devtools_detected: number;
    debugger_attached: number;
    multi_display: number;
    proxy_detected: number;
    tunnel_detected: number;
    head_movement: number;
};

const INITIAL_COUNTS: EventCounts = {
    multi_face_detected: 0,
    no_face_detected: 0,
    forbidden_process: 0,
    tab_switch: 0,
    vm_detected: 0,
    devtools_detected: 0,
    debugger_attached: 0,
    multi_display: 0,
    proxy_detected: 0,
    tunnel_detected: 0,
    head_movement: 0,
};

const EVENT_LABELS: Record<keyof EventCounts, string> = {
    multi_face_detected: "Ko'p yuz",
    no_face_detected: "Yuz yo'q",
    forbidden_process: "Taqiqlangan dastur",
    tab_switch: "Oyna almashtirish",
    vm_detected: "VM aniqlandi",
    devtools_detected: "DevTools",
    debugger_attached: "Debugger",
    multi_display: "Ko'p monitor",
    proxy_detected: "Proxy",
    tunnel_detected: "Tunnel",
    head_movement: "Bosh harakati",
};

const ProctoringEventsBar: React.FC = () => {
    const { t } = useTranslation();
    const [counts, setCounts] = useState<EventCounts>({ ...INITIAL_COUNTS });
    const [isElectron, setIsElectron] = useState(false);

    const handleSecurityEvent = useCallback((payload: { type?: string }) => {
        const type = payload?.type;
        if (!type) return;
        setCounts((prev) => {
            if (type in prev) {
                return { ...prev, [type as keyof EventCounts]: prev[type as keyof EventCounts] + 1 };
            }
            return prev;
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

    const hasEvents = Object.values(counts).some((c) => c > 0);

    if (!isElectron) return null;

    return (
        <div className="proctoring-events-bar mt-3">
            <p style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#666' }} className="text-uppercase">
                {t("Proctoring")} / {t("Kuzatuv")}
            </p>
            {hasEvents ? (
                <div className="d-flex flex-wrap gap-2">
                    {(Object.keys(EVENT_LABELS) as Array<keyof EventCounts>).map((key) => {
                        const count = counts[key];
                        if (count === 0) return null;
                        return (
                            <Tooltip key={key} title={EVENT_LABELS[key]}>
                                <span
                                    className="proctoring-badge"
                                    style={{
                                        display: 'inline-block',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        background: '#fff2e8',
                                        border: '1px solid #ffbb96',
                                        color: '#d4380d',
                                    }}
                                >
                                    {EVENT_LABELS[key]}: <strong>{count}</strong>
                                </span>
                            </Tooltip>
                        );
                    })}
                </div>
            ) : (
                <span style={{ fontSize: '11px', color: '#8c8c8c' }}>— {t("Hozircha buzilishlar yo‘q")}</span>
            )}
        </div>
    );
};

export default ProctoringEventsBar;
