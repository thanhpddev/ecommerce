import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  message,
  notification,
} from "antd";
import { useState } from "react";

import { callCreateUser } from "../../../services/api";

const UserModalCreate = ({
  showModalAdd,
  handleOk,
  handleCancel,
  fetchUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    setIsLoading(true);
    const { fullName, email, password, phone } = values;
    const res = await callCreateUser(fullName, email, password, phone);
    setIsLoading(false);
    if (res?.data?._id) {
      message.success("Tạo mới thành công!");
      form.resetFields();
      handleCancel();
      await fetchUser();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={showModalAdd}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={isLoading}
        maskClosable={false}
      >
        <Divider />
        <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item
            labelCol={{ span: 24 }}
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Đăng ký
            </Button>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default UserModalCreate;
