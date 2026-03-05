declare module '*.pdf'

declare module 'react-webcam' {
  const Webcam: React.ComponentType<{
    ref?: React.RefObject<{ getScreenshot: (opts?: { width?: number; height?: number }) => string | null; video: HTMLVideoElement | null }>;
    audio?: boolean;
    width?: number;
    height?: number;
    screenshotFormat?: string;
    videoConstraints?: MediaTrackConstraints;
    style?: React.CSSProperties;
  }>;
  export default Webcam;
}

interface ElectronAPI {
  startProctoring?: (launchToken?: string) => void;
  stopProctoring?: () => void;
  startTestMode?: () => void;
  stopTestMode?: () => void;
  sendProctoringEvent?: (type: string, data?: unknown) => void;
  onSecurityEvent?: (callback: (payload: unknown) => void) => () => void;
  onHandshakeSuccess?: (callback: (payload: unknown) => void) => () => void;
  onHandshakeError?: (callback: (error: unknown) => void) => () => void;
  onSessionTerminated?: (callback: () => void) => () => void;
  onLockdownActive?: (callback: () => void) => () => void;
  onLockdownDisabled?: (callback: () => void) => () => void;
  rendererReady?: () => void;
  isElectron?: boolean;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

// Fix for react-icons TypeScript errors with React 17
// Extended SVGProps to include size prop for react-icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
}

// Override react-icons module declarations to fix JSX component type errors
declare module 'react-icons/fa' {
    import { FC } from 'react';
    export const FaRegSnowflake: FC<IconProps>;
    export const FaSnowman: FC<IconProps>;
    export const FaEye: FC<IconProps>;
    export const FaEyeSlash: FC<IconProps>;
    export const FaUniversity: FC<IconProps>;
    export const FaUnlockAlt: FC<IconProps>;
    export const FaBars: FC<IconProps>;
    export const FaDownload: FC<IconProps>;
    export const FaExclamationTriangle: FC<IconProps>;
    export const FaExclamationCircle: FC<IconProps>;
    export const FaCircleCheck: FC<IconProps>;
    export const FaArrowLeft: FC<IconProps>;
    export const FaArrowRight: FC<IconProps>;
    export const FaGift: FC<IconProps>;
    export const FaCakeCandles: FC<IconProps>;
    export const FaRegStar: FC<IconProps>;
    export const FaFire: FC<IconProps>;
    export const FaSync: FC<IconProps>;
    export const FaBriefcase: FC<IconProps>;
    export const FaTimes: FC<IconProps>;
    export const FaQrcode: FC<IconProps>;
}

declare module 'react-icons/fa6' {
    import { FC } from 'react';
    export const FaClipboardQuestion: FC<IconProps>;
    export const FaComputer: FC<IconProps>;
    export const FaUserGraduate: FC<IconProps>;
    export const FaCakeCandles: FC<IconProps>;
    export const FaCircleCheck: FC<IconProps>;
}

declare module 'react-icons/gi' {
    import { FC } from 'react';
    export const GiSnowBottle: FC<IconProps>;
    export const GiSnowflake2: FC<IconProps>;
    export const GiSnowman: FC<IconProps>;
    export const GiTensionSnowflake: FC<IconProps>;
}

declare module 'react-icons/hi' {
    import { FC } from 'react';
    export const HiAcademicCap: FC<IconProps>;
}

declare module 'react-icons/bi' {
    import { FC } from 'react';
    export const BiLoaderAlt: FC<IconProps>;
    export const BiWifi: FC<IconProps>;
    export const BiWifiOff: FC<IconProps>;
    export const BiLogOut: FC<IconProps>;
    export const BiArrowBack: FC<IconProps>;
    export const BiX: FC<IconProps>;
    export const BiCalendarCheck: FC<IconProps>;
    export const BiHomeAlt: FC<IconProps>;
}

declare module 'react-icons/fi' {
    import { FC } from 'react';
    export const FiExternalLink: FC<IconProps>;
}

declare module 'react-icons/tb' {
    import { FC } from 'react';
    export const TbAlertCircle: FC<IconProps>;
    export const TbRefresh: FC<IconProps>;
    export const TbClock: FC<IconProps>;
    export const TbAlertTriangle: FC<IconProps>;
    export const TbBuildingCommunity: FC<IconProps>;
    export const TbDeviceDesktopPin: FC<IconProps>;
    export const TbArrowRight: FC<IconProps>;
    export const TbDeviceDesktopOff: FC<IconProps>;
    export const TbBook2: FC<IconProps>;
    export const TbLicense: FC<IconProps>;
    export const TbListDetails: FC<IconProps>;
    export const TbFaceId: FC<IconProps>;
    export const TbArrowLeft: FC<IconProps>;
    export const TbBabyBottle: FC<IconProps>;
}

declare module 'react-icons/wi' {
    import { FC } from 'react';
    export const WiStars: FC<IconProps>;
}

declare module 'react-icons/bs' {
    import { FC } from 'react';
    export const BsStars: FC<IconProps>;
}
