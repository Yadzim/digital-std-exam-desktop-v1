import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { TbAlertCircle } from 'react-icons/tb';
import QRCode from 'react-qr-code';

type Props = {
  id: number | undefined;
}

const QRCodeModal: React.FC<Props> = ({ id }): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: any) => {
    if (event.ctrlKey && event.key === 'q') {
      event.preventDefault();
      setOpen(prevState => !prevState);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Modal
      open={open && !!id}
      onCancel={() => { setOpen(false) }}
      centered
      footer={null}
      title={null}
    >
      <div className="flex-center flex-column gap-4 survey_box">
        <div className="warning d-flex gap-2">
          <TbAlertCircle className="mt-1" size={17} />Talaba rasmini o'zgartirish uchun QRcode. <br />TSUL Teacher mobil ilovasi orqali scaner qiling!!!
        </div>
        <QRCode value={window.btoa(JSON.stringify({ id, url: 'https://exam.tsul.uz' }))} size={240} />
      </div>
    </Modal>
  );
};

export default QRCodeModal;