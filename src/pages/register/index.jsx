import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

import { callRegister } from "../../services/api";

import "./register.scss";

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsSubmit(true);
    // console.log("Success:", values);
    const { fullName, email, password, phone } = values;
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    console.log("res", res);
  };

  // const onFinishFailed = (errorInfo) => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
              <Divider />
            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Họ tên"
                name="fullName"
                rules={[
                  { required: true, message: "Họ tên không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!",
                    // pattern: new RegExp(/^[0-9]+$/),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng ký
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal">
                Đã có tài khoản ?
                <span>
                  <Link to="/login"> Đăng Nhập </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
