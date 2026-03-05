const pastga = 0.24;
const right = 2;
const left = 1.2;

export const distance = (pt1: any, pt2: any) => {
  return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
};

export const eyeAspectRatio = (eye: any[]) => {
  const a = distance(eye[1], eye[5]);
  const b = distance(eye[2], eye[4]);
  const c = distance(eye[0], eye[3]);
  return (a + b) / (2.0 * c);
};

export const isBlinking = (landmarks: any) => {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const leftEAR = eyeAspectRatio(leftEye);
  const rightEAR = eyeAspectRatio(rightEye);
  const EAR_THRESHOLD = pastga;
  return leftEAR < EAR_THRESHOLD || rightEAR < EAR_THRESHOLD;
};

export const isMouthOpen = (landmarks: any) => {
  const upperLip = landmarks.getMouth()[13];
  const lowerLip = landmarks.getMouth()[19];
  const MOUTH_OPEN_THRESHOLD = 15; // Adjust this threshold based on your needs
  const mouthOpenDistance = distance(upperLip, lowerLip);
  return mouthOpenDistance > MOUTH_OPEN_THRESHOLD;
};

export const isLookingLeftOrRight = (landmarks: any, videoWidth: number) => {
  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const noseX = nose[3].x;
  const leftEyeX = leftEye[0].x;
  const rightEyeX = rightEye[3].x;

  // Adjust for the mirrored video
  const adjustedNoseX = videoWidth - noseX;
  const adjustedLeftEyeX = videoWidth - leftEyeX;
  const adjustedRightEyeX = videoWidth - rightEyeX;

  if (adjustedNoseX - adjustedLeftEyeX > right) {
    return "right";
  } else if (adjustedRightEyeX - adjustedNoseX > left) {
    return "left";
  }
  return null;

  // // const LOOK_THRESHOLD = 25; // Adjust this threshold based on your needs
  // if (noseX - leftEyeX < 20) {
  //   return 'left';
  // } else if (rightEyeX - noseX > 20) {
  //   return 'right';
  // }
  // return null;
};

export const isLookingCenter = (landmarks: any, videoWidth: number) => {
  const nose = landmarks.getNose();
  const noseX = nose[3].x;

  // Calculate the center of the camera's field of view
  const centerX = videoWidth / 2;

  // Define a threshold for the centering
  const CENTER_THRESHOLD = 20; // Adjust this threshold as needed

  // Check if the nose position is within the centering threshold
  if (Math.abs(noseX - centerX) < CENTER_THRESHOLD) {
    return true;
  }
  return false;
};
