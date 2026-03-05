import { Modal } from 'antd';
import { CButton } from 'components/Buttons';
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ActInfoModal: React.FC<Props> = ({ open, setOpen }): JSX.Element => {

  return (
    <Modal
      open={open}
      onCancel={() => {}}
      title={null}
      width={500}
      footer={null}
      closeIcon={<></>}
    >
      <div className="warning_exam_pass- text-danger">
        <h6><FaExclamationTriangle size={17} className="mb-1" />&nbsp;&nbsp;{("Siz bu imtihondan ACT qilingansiz")}!</h6>
        <br />
        <span>
          ACT qilingandan so'ng yozgan ishingiz qabul qilinmaydi. Iltimos imtihonni yakunlab xonani tark eting!
        </span>
      </div>
      <br />
      <div className="d-flex justify-content-end">
        <CButton onClick={() => setOpen(false)}>Tushunarli</CButton>
      </div>
    </Modal>
  );
};

export default ActInfoModal;