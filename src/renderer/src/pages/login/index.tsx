import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Divider, Form } from "antd";
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SignIn from './signIn';
import './login.scss'
import { HiAcademicCap } from 'react-icons/hi';
import { FaUniversity, FaUnlockAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaClipboardQuestion, FaComputer, FaUserGraduate } from 'react-icons/fa6';
import LanguageV2 from '../../components/structure/components/LanguageV2';
import WinterDecorations from './components/WinterDecorations';
import Logo from 'assets/images/TDYU_en_white.png';
import Hat from 'assets/images/christmas-hat.png';
import RefreshPage from 'components/RefreshPage';
import QRCodeScanner from '../../components/QRCodeScanner';
import { FaQrcode } from 'react-icons/fa';

const Login: any = () => {

    const dispatch: any = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [qrScannerOpen, setQrScannerOpen] = useState(false);

    const performLogin = async (username: string, password: string) => {
        try {
            setLoading(true);
            const formdata = new FormData();
            formdata.append('username', username);
            formdata.append('password', password);
            formdata.append("is_main", '2');
            const arg = {
                type: 'login',
                data: formdata
            }
            await dispatch(SignIn(arg));
        } catch (error) {
            // Login errors are handled by SignIn action
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        await performLogin(values.username, passwordValue);
    };

    const handleQRScanSuccess = async (username: string, password: string) => {
        await performLogin(username, password);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        history.listen((location) => {
            if (location.pathname === localStorage.getItem("_url")) {
                localStorage.removeItem("_url");
            }
        })
    }, [])

    return (
        <div className="login-page">
            <RefreshPage />
            <WinterDecorations />
            <div className="login-container">
                <div className="login-form-panel">
                    <div className="language-switcher">
                        <LanguageV2 />
                    </div>
                    <div>
                        <div className="logo-section">
                            <div className="logo-icon">
                                <HiAcademicCap />
                            </div>
                            <div className="logo-text">
                                <span className="logo-title">TDYU</span>
                                <span className="logo-subtitle">{t('login.logo.subtitle')}</span>
                            </div>
                        </div>

                        <Form
                            name="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            className="login-form"
                        >
                            <h1 className="welcome-title">{t('login.welcome')}</h1>
                            <p className="welcome-subtitle">
                                {t('login.subtitle')}
                            </p>

                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: t('login.username.error') }]}
                            >
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <FaUserGraduate className="input-icon" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }} />
                                    <input
                                        type="text"
                                        placeholder={t('login.username.placeholder')}
                                        className="custom-input"
                                        style={{ paddingLeft: '45px' }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: t('login.password.error') }]}
                            >
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <FaUnlockAlt className="input-icon" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }} />
                                    <input
                                        type="text"
                                        value={showPassword ? passwordValue : '*'.repeat(passwordValue.length)}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (showPassword) {
                                                setPasswordValue(newValue);
                                            } else {
                                                const currentMasked = '*'.repeat(passwordValue.length);

                                                if (newValue === currentMasked) {
                                                    return;
                                                }

                                                if (newValue.length > currentMasked.length) {
                                                    const addedText = newValue.slice(currentMasked.length);
                                                    const newChars = addedText.replace(/\*/g, '');
                                                    if (newChars) {
                                                        setPasswordValue(passwordValue + newChars);
                                                    }
                                                }
                                                else if (newValue.length < currentMasked.length) {
                                                    setPasswordValue(passwordValue.slice(0, newValue.length));
                                                }
                                            }
                                        }}
                                        placeholder={t('login.password.placeholder')}
                                        className="custom-input"
                                        style={{ paddingLeft: '45px', paddingRight: '45px' }}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: 'rgba(0, 0, 0, 0.45)',
                                            zIndex: 1,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {showPassword ? <FaEye className='input-icon' /> : <FaEyeSlash className='input-icon' />}
                                    </span>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    loading={loading}
                                    className="login-button"
                                >
                                    {t('login.button')}
                                    {new Date().getMonth() === 11 && (
                                        <img src={Hat} alt="Santa Hat" className="santa-hat" />
                                    )}
                                </Button>
                            </Form.Item>
                            <Divider className='mt-0 px-5'>
                                {t('login.qr.divider')}
                            </Divider>
                            <Form.Item>
                                <Button
                                    type="default"
                                    block
                                    onClick={() => setQrScannerOpen(true)}
                                    className="d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                        height: '50px',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px',
                                        fontWeight: 600,                                    
                                        background: 'white',
                                        color: '#1a2f53'
                                    }}
                                >
                                    <FaQrcode size={22} />   {t('login.qr.button')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                <div className="info-panel">
                    <div className="info-content">
                        <div className='text-center mb-4'>
                            <img src={Logo} alt="" className="university-logo" />
                        </div>
                        <h2 className="university-title">
                            {t('login.university.title')}
                        </h2>
                        <p className="university-tagline">
                            {t('login.university.tagline')}
                        </p>

                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <FaUnlockAlt />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{t('login.feature.login.title')}</h3>
                                    <p className="feature-description">
                                        {t('login.feature.login.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <FaUniversity />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{t('login.feature.location.title')}</h3>
                                    <p className="feature-description">
                                        {t('login.feature.location.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <FaComputer />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{t('login.feature.computer.title')}</h3>
                                    <p className="feature-description">
                                        {t('login.feature.computer.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <FaClipboardQuestion />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{t('login.feature.finish.title')}</h3>
                                    <p className="feature-description">
                                        {t('login.feature.finish.description')}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <p className="copyright">
                        © 2022-{new Date().getFullYear()} {t('login.copyright')}
                    </p>
                </div>
            </div>

            <QRCodeScanner
                open={qrScannerOpen}
                onClose={() => setQrScannerOpen(false)}
                onScanSuccess={handleQRScanSuccess}
            />
        </div>
    )
}
export default Login;