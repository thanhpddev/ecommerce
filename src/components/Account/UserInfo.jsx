import {
  Avatar,
  Button,
  Col,
  Row,
  Upload,
  message,
  Form,
  Input,
  Spin,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { callUpLoadInfo, callUploadAvatar } from "../../services/api";
import {
  doUpLoadAvatarAction,
  doUpdateUserInfoAction,
} from "../../redux/account/accountSlice";

import "./account.scss";

const UserInfo = ({
  showModalAccount,
  setShowModalAccount,
  clearModal,
  setClearModal,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  let tempAvatar = useSelector(
    (state) => state.account.tempAvatar ?? state.account.user.avatar
  );
  const [avatar, setAvatar] = useState(user.avatar);
  const [isLoadingSpin, setIsLoadingSpin] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (clearModal) {
      form.resetFields();
      setAvatar(user.avatar);
      setClearModal(false);
      dispatch(doUpLoadAvatarAction({ avatar: user.avatar }));
    }
  }, [clearModal]);

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    setIsLoadingSpin(true);
    const res = await callUploadAvatar(file);
    if (res && res.data) {
      setTimeout(() => {
        setAvatar(res.data.fileUploaded);
        dispatch(doUpLoadAvatarAction({ avatar: res.data.fileUploaded }));

        setIsLoadingSpin(false);
        message.success("Upload avatar thành công!");
      }, 1000);

      onSuccess("ok");
    } else {
      setTimeout(() => {
        setIsLoadingSpin(false);
        message.error("Upload avatar không thành công!");
      }, 1000);
      onError("Đã có lỗi khi upload file");
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFinish = async (values) => {
    setIsLoadingSubmit(true);
    const { fullName, phone, avatar, id } = values;
    const res = await callUpLoadInfo(fullName, phone, tempAvatar, id);
    if (res && res.data) {
      setTimeout(() => {
        dispatch(
          doUpdateUserInfoAction({ avatar: tempAvatar, phone, fullName })
        );
        localStorage.removeItem("access_token");
        message.success("Cập nhật thông tin thành công!");
        setIsLoadingSubmit(false);
        setShowModalAccount(false);
        setClearModal(false);
      }, 1000);
    } else {
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <>
      <Row className="row-avatar">
        <Col span={10}>
          <Spin tip="Loading..." size="large" spinning={isLoadingSpin}>
            <Avatar
              size={150}
              src={`${
                import.meta.env.VITE_BACKEND_URL
              }/images/avatar/${avatar}`}
              style={{ display: "block", marginBottom: 15 }}
            />
          </Spin>

          <Upload
            maxCount={1}
            showUploadList={false}
            customRequest={handleUploadAvatar}
          >
            <Button icon={<UploadOutlined />}>Upload avatar</Button>
          </Upload>
        </Col>
        <Col span={14}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 24 }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            // onValuesChange={onValuesChange}
            autoComplete="off"
          >
            <Form.Item
              label="Id"
              name="id"
              initialValue={user.id}
              hidden
              rules={[
                {
                  required: true,
                  message: "Id không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

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
              label="Tên hiển thị"
              name="fullName"
              initialValue={user.fullName}
              rules={[
                {
                  required: true,
                  message: "Tên hiển thị không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              initialValue={user.phone}
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
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

export default UserInfo;
