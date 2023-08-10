import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";

import { callUpdateUser } from "../../../services/api";

const UserModalUpdate = ({
  showModalUpdate,
  handleCancel,
  dataUpdate,
  fetchUser,
}) => {
  //   const [dataUpdate, setDataUpdate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setIsLoading(true);
    const { _id, fullName, phone } = values;
    const res = await callUpdateUser(_id, fullName, phone);
    setIsLoading(false);
    if (res && res.data) {
      message.success("Cập nhật người dùng thành công!");
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

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  return (
    <>
      <Modal
        forceRender
        title="Update người dùng"
        open={showModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={isLoading}
        maskClosable={false}
      >
        <Divider />
        <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item
            hidden
            labelCol={{ span: 24 }}
            label="Id"
            name="_id"
            rules={[{ required: true, message: "Id không được để trống!" }]}
          >
            <Input />
          </Form.Item>
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
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
          >
            <Input disabled />
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

export default UserModalUpdate;
