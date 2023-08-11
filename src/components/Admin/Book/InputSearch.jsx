import React, { useState } from "react";
import { Button, Col, Form, Input, Row, theme } from "antd";

const InputSearch = ({ handleSearch }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    let query = "";
    if (values) {
      Object.keys(values).forEach(function (key, index) {
        if (values[key]) {
          query += `&${key}=/${values[key]}/i`;
        }
      });
      if (query) {
        handleSearch(query);
      }
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`mainText`}
            label={`Tên sách`}
          >
            <Input placeholder="Tên sách" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`author`} label={`Tác giả`}>
            <Input placeholder="Tác giả" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`category`}
            label={`Thể loại`}
          >
            <Input placeholder="Thể loại" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearch;
