import { Modal, Spin } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { TbArrowLeft } from 'react-icons/tb';
import { useAppSelector } from 'store/services';
import WebcamAuthStap from './auth_v2';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CheckFaceID from './service';
import { setFile, setIsOpen } from 'store/faceID';

const AuthFaceID: React.FC<{ examId: number; isProtected: boolean }> = ({ examId, isProtected }): JSX.Element => {
  const dispatch = useDispatch();
  const { isAuth, isOpen, file, isLoading } = useAppSelector(p => p.faceID);
  const faceError = useAppSelector(p => p.exam.faceError)
  const history = useHistory();
  const hasDispatched = useRef(false); // flag

  useEffect(() => {
    if (!isAuth || faceError) {
      dispatch(setIsOpen(true));
    }

    return () => {
      dispatch(setFile(""));
    }
  }, [faceError]);

  useEffect(() => {
    if (file) {
      if (!hasDispatched.current) {
        dispatch(CheckFaceID({ id: examId, file }));
        hasDispatched.current = true; // set flag so it doesn't dispatch again
      }
    } else {
      hasDispatched.current = false;
    }
  }, [file]);

  return (
    <div className="">
      <Modal
        open={isOpen && !!isProtected}
        width={800}
        centered
        footer={null}
        title={null}
      >
        <TbArrowLeft size={20} color="#464646" className="cursor-pointer " onClick={() => { history.goBack() }} />
        <Spin spinning={isLoading} tip="Tekshirilmoqda...">
          <WebcamAuthStap />
        </Spin>
      </Modal>
    </div>
  );
};

export default AuthFaceID;