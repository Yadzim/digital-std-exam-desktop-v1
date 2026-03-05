import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Modal, message } from 'antd';
import { Html5Qrcode } from 'html5-qrcode';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import './styles.scss';

interface QRCodeScannerProps {
    open: boolean;
    onClose: () => void;
    onScanSuccess: (username: string, password: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ open, onClose, onScanSuccess }) => {
    const { t } = useTranslation();
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrDetectedRef = useRef<boolean>(false);
    const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const stopScanning = useCallback(async () => {
        try {
            // Clear timeout if exists
            if (loginTimeoutRef.current) {
                clearTimeout(loginTimeoutRef.current);
                loginTimeoutRef.current = null;
            }

            if (scannerRef.current) {
                try {
                    // Avval scanner'ni to'xtatish
                    await scannerRef.current.stop().catch(() => {
                        // Ignore errors when stopping - scanner might already be stopped
                    });

                    // Keyin clear() ni chaqirish, lekin xatolarni e'tiborsiz qoldirish
                    // chunki elementlar allaqachon o'chirilgan bo'lishi mumkin
                    try {
                        scannerRef.current.clear();
                    } catch (clearError) {
                        // clear() xatolik bersa, e'tiborsiz qoldirish
                        // Bu normal, chunki elementlar allaqachon o'chirilgan bo'lishi mumkin
                    }
                } catch (err) {
                    // Umumiy xatoliklar
                }
                scannerRef.current = null;
            }
            setIsScanning(false);
            qrDetectedRef.current = false;
            setIsQRCodeDetected(false);
            setIsCameraReady(false);
        } catch (err) {
            // Silently handle stop errors
            setIsScanning(false);
            qrDetectedRef.current = false;
            setIsQRCodeDetected(false);
            setIsCameraReady(false);
        }
    }, []);

    useEffect(() => {
        if (!open) {
            stopScanning();
            return;
        }

        let isMounted = true;

        const initScanner = async () => {
            if (!isMounted) return;

            try {
                // Stop any existing scanner first
                if (scannerRef.current) {
                    try {
                        await scannerRef.current.stop();
                        // clear() ni try-catch ichida chaqirish
                        try {
                            scannerRef.current.clear();
                        } catch (clearError) {
                            // clear() xatolik bersa, e'tiborsiz qoldirish
                            // Bu normal, chunki elementlar allaqachon o'chirilgan bo'lishi mumkin
                        }
                    } catch (e) {
                        // Ignore stop errors
                    }
                    scannerRef.current = null;
                }

                // Check if camera is available
                const devices = await Html5Qrcode.getCameras();
                if (!isMounted) return;

                if (devices && devices.length === 0) {
                    message.error(t('login.qr.error.start'));
                    return;
                }

                const html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                const handleQRCodeScanned = (qrData: string) => {
                    if (!isMounted) return;

                    // Agar QR kod allaqachon o'qilgan bo'lsa, qayta ishlamaslik
                    if (qrDetectedRef.current) {
                        return;
                    }

                    // QR kod topilganda animatsiyani ko'rsatish
                    // Scanner'ni to'xtatmaymiz - kamera ochiq qoladi
                    qrDetectedRef.current = true;
                    setIsQRCodeDetected(true);

                    try {
                        // Decode base64
                        let decodedData: string;
                        try {
                            decodedData = atob(qrData);
                        } catch (e) {
                            // If decoding fails, try using the data directly
                            decodedData = qrData;
                        }

                        // Parse the decoded string
                        // Format: u: tsul-std-10019\np: xE9vXgSK
                        const lines = decodedData.split('\n');
                        let username = '';
                        let password = '';

                        lines.forEach(line => {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('u:')) {
                                username = trimmed.substring(2).trim();
                            } else if (trimmed.startsWith('p:')) {
                                password = trimmed.substring(2).trim();
                            }
                        });

                        if (username && password) {
                            // Animatsiyani 3 soniya ko'rsatish uchun kechikish
                            // Faqat bir marta ishlatish uchun timeout'ni ref'da saqlash
                            if (!loginTimeoutRef.current) {
                                loginTimeoutRef.current = setTimeout(() => {
                                    if (isMounted) {
                                        stopScanning();
                                        onScanSuccess(username, password);
                                        onClose();
                                    }
                                    loginTimeoutRef.current = null;
                                }, 1500);
                            }
                        } else {
                            qrDetectedRef.current = false;
                            setIsQRCodeDetected(false);
                            message.error(t('login.qr.error.invalid'));
                        }
                    } catch (error) {
                        // Only show error message, don't log to console for invalid QR codes
                        qrDetectedRef.current = false;
                        setIsQRCodeDetected(false);
                        message.error(t('login.qr.error.decode'));
                    }
                };

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 450, height: 450 }
                    },
                    (decodedText) => {
                        if (isMounted) {
                            handleQRCodeScanned(decodedText);
                        }
                    },
                    (errorMessage) => {
                        // QR kod topilmayotganda animatsiyani o'chirish
                        // Lekin agar allaqachon o'qilgan bo'lsa, hech narsa qilmaslik
                        if (isMounted && qrDetectedRef.current) {
                            // QR kod allaqachon o'qilgan, hech narsa qilmaslik
                            return;
                        }
                    }
                );

                if (isMounted) {
                    setIsScanning(true);
                    setIsCameraReady(true);
                }
            } catch (err: any) {
                if (!isMounted) return;

                // Only log non-permission errors
                if (!err?.message?.includes('Permission denied') && !err?.message?.includes('NotAllowedError')) {
                    console.error('Error starting QR scanner:', err);
                }
                let errorMsg = t('login.qr.error.start');
                if (err?.message?.includes('Permission denied') || err?.message?.includes('NotAllowedError')) {
                    errorMsg = t('login.qr.error.permission');
                }
                message.error(errorMsg);
                setIsScanning(false);
            }
        };

        initScanner();

        return () => {
            isMounted = false;
            stopScanning();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleClose = () => {
        stopScanning();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            centered
            footer={null}
            width={600}
            closeIcon={<FaTimes />}
            title={t('login.qr.title')}
        >
            <div style={{ textAlign: 'center', padding: '20px 0', position: 'relative' }}>
                <div id="qr-reader" style={{ width: '100%', minHeight: '300px', position: 'relative' }}>
                    {/* QR kod topilguncha ko'rsatiladigan yozuv */}
                    {isCameraReady && !isQRCodeDetected && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '15px 30px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 500,
                            pointerEvents: 'none'
                        }}>
                            {t('login.qr.instruction')}
                        </div>
                    )}

                    {/* QR kod topilganda ko'rsatiladigan animatsiya - yozuv o'rnida */}
                    {isQRCodeDetected && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            pointerEvents: 'none'
                        }}>
                            <div className="qr-scanning-animation">
                                <div className="qr-scan-line"></div>
                                <div className="qr-scan-corners">
                                    <div className="qr-corner qr-corner-top-left"></div>
                                    <div className="qr-corner qr-corner-top-right"></div>
                                    <div className="qr-corner qr-corner-bottom-left"></div>
                                    <div className="qr-corner qr-corner-bottom-right"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default QRCodeScanner;

