import { Button, Col, Row, Form, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { callChangePassword } from "../../services/api";

const ChangePassword = ({
  showModalAccount,
  setShowModalAccount,
  clearChangePass,
  setClearChangePass,
}) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    if (clearChangePass) {
      form.resetFields();
      setClearChangePass(false);
    }
  }, [clearChangePass]);

  const onFinish = async (values) => {
    setIsLoadingSubmit(true);
    const { email, oldpass, newpass } = values;
    const res = await callChangePassword(email, oldpass, newpass);

    if (res && res.data) {
      setTimeout(() => {
        message.success("Thay đổi mật khẩu thành công!");
        setIsLoadingSubmit(false);
        setShowModalAccount(false);
        form.resetFields();
      }, 1000);
    } else {
      setTimeout(() => {
        message.error("Thay đổi mật khẩu không thành công!");
        setIsLoadingSubmit(false);
      }, 1000);
    }
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 24 }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              initialValue={user.email}
              rules={[
                {
                  required: true,
                  message: "Email không được để trống!",
                },
              ]}
            >
              <Input disabled={true} />
            </Form.Item>

            <Form.Item
              label="Mật khẩu cũ"
              name="oldpass"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu cũ không được để trống!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newpass"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu mới không được để trống!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingSubmit}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ChangePassword;
