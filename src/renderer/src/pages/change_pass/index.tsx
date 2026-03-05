import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "store/services";
import { Button, Col, Divider, Form, Input, message, Modal, Row } from "antd";
import instance from "config/_axios";
import { asyncN } from "utils/notifications";
import { SelectStudentTheme } from "config/theme/colors";
import { useHistory } from "react-router-dom";

type ChangePasswordType = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChangePassword: FC<ChangePasswordType> = ({visible, setVisible}): JSX.Element => {

  const [form] = Form.useForm();
  const auth: any = useAppSelector(state => state.auth);
  const _id = auth?.user?.user_id;
  const theme = SelectStudentTheme();
  const history = useHistory();

  const onSubmit = async (values: any) => {
    try {
      const formdata = new FormData();
      Object.entries(values).forEach(([key, value]: any) => {
        formdata.append(key, String(value));
      });

      const response = await instance({ url: `/passwords/${_id}`, method: 'PUT', data: formdata })

      if (response.data.status === 1) {
        form.resetFields();
        setVisible(false);
        message.success("Parol muvaffaqiyatli o'rgartirildi");
      }
    } catch (error: any) {
      asyncN("error", 'update', error?.response.data?.message);
    }
  }

  return (
    <Modal
      title="Parolni o'zgartirish"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Avvalgi parol"
          name='old_password'
          rules={[{ required: true, message: "Maydonni to'ldirish shart!" }]}
        >
          <Input.Password placeholder="Avvalgi parolingizni kiriting ..." />
        </Form.Item>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Yangi parol"
              name='new_password'
              rules={[{ required: true, message: "Maydonni to'ldirish shart!" }]}
            >
              <Input.Password placeholder="Yangi parolni kiriting ..." />
            </Form.Item>

          </Col>
          <Col span={24}>
            <Form.Item
              label="Parolni takrorlang"
              name='re_password'
              rules={[{ required: true, message: "Maydonni to'ldirish shart!" }]}
              className="mb-0"
            >
              <Input.Password placeholder="Parolni qayta kiriting ..." />
            </Form.Item>

          </Col>
        </Row>
        <Divider className="mt-5" />
        <div className="text-end" >
          <Button type="primary" danger onClick={() => { form.resetFields(); setVisible(false) }}>Bekor qilish</Button>
          <Button className="ms-2" htmlType="submit" type="primary">Saqlash</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ChangePassword;