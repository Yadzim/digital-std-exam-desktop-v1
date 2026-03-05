import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, Progress } from 'antd';
import { LuUsersRound, LuUserX, LuCrosshair, LuArrowLeftRight, LuCode } from 'react-icons/lu';

type EventCounts = {
    multi_face_detected: number;
    no_face_detected: number;
    tab_switch: number;
    head_movement: number;
    devtools_detected: number;
};

const INITIAL_COUNTS: EventCounts = {
    multi_face_detected: 0,
    no_face_detected: 0,
    tab_switch: 0,
    head_movement: 0,
    devtools_detected: 0,
};

const EVENT_LABELS: Record<keyof EventCounts, string> = {
    multi_face_detected: "Bir necha yuz",
    no_face_detected: "Yuz aniqlanmadi",
    tab_switch: "Boshqa oynaga o'tish",
    devtools_detected: "Buzishga urinish",
    head_movement: "Bosh harakati",
};

const EVENT_WEIGHTS: Record<keyof EventCounts, { maxCount: number; weight: number }> = {
    // 10 marta -> 20%
    multi_face_detected: { maxCount: 10, weight: 20 },
    // 10 marta -> 20%
    no_face_detected: { maxCount: 10, weight: 20 },
    // 10 marta -> 20%
    tab_switch: { maxCount: 10, weight: 20 },
    // 10 marta -> 20%
    head_movement: { maxCount: 10, weight: 20 },
    // 2 marta -> 20%
    devtools_detected: { maxCount: 2, weight: 20 },
};

const ProctoringEventsBar: React.FC = () => {
    const { t } = useTranslation();
    const [counts, setCounts] = useState<EventCounts>({ ...INITIAL_COUNTS });

    const { integrityPercent, gradeLabel, gradeColor } = useMemo(() => {
        let penalty = 0;
        (Object.keys(EVENT_WEIGHTS) as (keyof EventCounts)[]).forEach((key) => {
            const { maxCount, weight } = EVENT_WEIGHTS[key];
            const count = counts[key];
            if (!maxCount || !weight || !count) return;
            const ratio = Math.min(count / maxCount, 1);
            penalty += ratio * weight;
        });
        const rawPercent = 100 - Math.min(penalty, 100);
        const integrity = Math.max(0, Math.round(rawPercent));

        let label = "2 qoniqarsiz";
        let color = "#cf1322";
        if (integrity >= 86) {
            label = "5 a'lo";
            color = "#389e0d";
        } else if (integrity >= 71) {
            label = "4 yaxshi";
            color = "#52c41a";
        } else if (integrity >= 56) {
            label = "3 qoniqarli";
            color = "#faad14";
        }

        return { integrityPercent: integrity, gradeLabel: label, gradeColor: color };
    }, [counts]);

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
        const onEvent = (a: unknown, b?: unknown) => {
            const payload = (b !== undefined ? b : a) as { type?: string };
            handleSecurityEvent(payload);
        };
        let unsubscribe: (() => void) | undefined;
        try {
            const w = window as unknown as {
                electron?: { onSecurityEvent?: (cb: (p: { type?: string }) => void) => () => void };
                require?: (id: string) => { ipcRenderer: { on: (ch: string, fn: (e: unknown, p?: { type?: string }) => void) => void; removeListener: (ch: string, fn: (e: unknown, p?: { type?: string }) => void) => void } };
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

    return (
        <div className="d-flex flex-column align-items-center">
            <div
                className="d-flex align-items-center"
                style={{ gap: 12, marginBottom: 8 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Progress
                    className='p-0 m-0'
                        type="circle"
                        percent={integrityPercent}
                        width={46}
                        strokeColor={gradeColor}
                        status={integrityPercent < 56 ? 'exception' : integrityPercent < 86 ? 'active' : 'normal'}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 14, color: '#000', fontWeight: 600, }}>{t("Yahlitlik indikatori")}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: gradeColor }}>
                            · {gradeLabel}
                        </span>
                    </div>
                </div>
            </div>

            <div
                className="d-flex align-items-center"
                style={{ gap: 8, flexWrap: 'wrap', paddingLeft: 10, paddingRight: 10 }}
            >

                <Tooltip title={EVENT_LABELS.multi_face_detected}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: '#1C4C73',
                            fontWeight: 500,
                        }}
                    >
                        <LuUsersRound size={14} />
                        <span>{EVENT_LABELS.multi_face_detected}</span>
                        <strong>{counts.multi_face_detected}</strong>
                    </span>
                </Tooltip>


                <Tooltip title={EVENT_LABELS.no_face_detected}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: '#1C4C73',
                            fontWeight: 500,
                        }}
                    >
                        <LuUserX size={14} />
                        <span>{EVENT_LABELS.no_face_detected}</span>
                        <strong>{counts.no_face_detected}</strong>
                    </span>
                </Tooltip>


                <Tooltip title={EVENT_LABELS.head_movement}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: '#1C4C73',
                            fontWeight: 500,
                        }}
                    >
                        <LuCrosshair size={14} />
                        <span>{EVENT_LABELS.head_movement}</span>
                        <strong>{counts.head_movement}</strong>
                    </span>
                </Tooltip>


                <Tooltip title={EVENT_LABELS.tab_switch}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: '#1C4C73',
                            fontWeight: 500,
                        }}
                    >
                        <LuArrowLeftRight size={14} />
                        <span>{EVENT_LABELS.tab_switch}</span>
                        <strong>{counts.tab_switch}</strong>
                    </span>
                </Tooltip>

                <Tooltip title={EVENT_LABELS.devtools_detected}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: '#1C4C73',
                            fontWeight: 500,
                        }}
                    >
                        <LuCode size={14} />
                        <span>{EVENT_LABELS.devtools_detected}</span>
                        <strong>{counts.devtools_detected}</strong>
                    </span>
                </Tooltip>
            </div>
        </div>
    );
};

export default ProctoringEventsBar;
