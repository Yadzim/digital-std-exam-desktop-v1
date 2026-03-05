import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { UsergroupDeleteOutlined, UserDeleteOutlined, AimOutlined, SwapOutlined } from '@ant-design/icons';

type EventCounts = {
    multi_face_detected: number;
    no_face_detected: number;
    tab_switch: number;
    vm_detected: number;
    debugger_attached: number;
    multi_display: number;
    proxy_detected: number;
    tunnel_detected: number;
    head_movement: number;
};

const INITIAL_COUNTS: EventCounts = {
    multi_face_detected: 0,
    no_face_detected: 0,
    tab_switch: 0,
    vm_detected: 0,
    debugger_attached: 0,
    multi_display: 0,
    proxy_detected: 0,
    tunnel_detected: 0,
    head_movement: 0,
};

const EVENT_LABELS: Record<keyof EventCounts, string> = {
    multi_face_detected: "Ko'p yuz",
    no_face_detected: "Yuz yo'q",
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

    const hasEvents = ['multi_face_detected', 'no_face_detected', 'head_movement', 'tab_switch']
        .some((key) => counts[key as keyof EventCounts] > 0);

    if (!isElectron) return null;

    return (
        <div className="proctoring-events-bar mt-3">
            <p style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#666' }} className="text-uppercase">
                {t("Yahlitlik ko'rsatkichi")}
            </p>
            {hasEvents ? (
                <div
                    className="d-flex align-items-center"
                    style={{ gap: 8, flexWrap: 'wrap' }}
                >
                    {counts.multi_face_detected > 0 && (
                        <Tooltip title={EVENT_LABELS.multi_face_detected}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    background: '#fff2e8',
                                    border: '1px solid #ffbb96',
                                    color: '#d4380d',
                                }}
                            >
                                <UsergroupDeleteOutlined />
                                <span>{EVENT_LABELS.multi_face_detected}</span>
                                <strong>{counts.multi_face_detected}</strong>
                            </span>
                        </Tooltip>
                    )}
                    {counts.no_face_detected > 0 && (
                        <Tooltip title={EVENT_LABELS.no_face_detected}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    background: '#fff2e8',
                                    border: '1px solid #ffbb96',
                                    color: '#d4380d',
                                }}
                            >
                                <UserDeleteOutlined />
                                <span>{EVENT_LABELS.no_face_detected}</span>
                                <strong>{counts.no_face_detected}</strong>
                            </span>
                        </Tooltip>
                    )}
                    {counts.head_movement > 0 && (
                        <Tooltip title={EVENT_LABELS.head_movement}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    background: '#fff2e8',
                                    border: '1px solid #ffbb96',
                                    color: '#d4380d',
                                }}
                            >
                                <AimOutlined />
                                <span>{EVENT_LABELS.head_movement}</span>
                                <strong>{counts.head_movement}</strong>
                            </span>
                        </Tooltip>
                    )}
                    {counts.tab_switch > 0 && (
                        <Tooltip title={EVENT_LABELS.tab_switch}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    background: '#fff2e8',
                                    border: '1px solid #ffbb96',
                                    color: '#d4380d',
                                }}
                            >
                                <SwapOutlined />
                                <span>{EVENT_LABELS.tab_switch}</span>
                                <strong>{counts.tab_switch}</strong>
                            </span>
                        </Tooltip>
                    )}
                </div>
            ) : (
                <span style={{ fontSize: '11px', color: '#8c8c8c' }}>— {t("Hozircha buzilishlar yo‘q")}</span>
            )}
        </div>
    );
};

export default ProctoringEventsBar;
