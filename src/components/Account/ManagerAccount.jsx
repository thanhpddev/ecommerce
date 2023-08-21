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
import { Tabs } from "antd";

import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";

const ManagerAccount = ({ showModalAccount, setShowModalAccount }) => {
  const [form] = Form.useForm();
  const [clearModal, setClearModal] = useState(false);
  const [clearChangePass, setClearChangePass] = useState(false);

  const items = [
    {
      key: "info",
      label: `Cập nhật thông tin`,
      children: (
        <UserInfo
          showModalAccount={showModalAccount}
          setShowModalAccount={setShowModalAccount}
          clearModal={clearModal}
          setClearModal={setClearModal}
        />
      ),
    },
    {
      key: "password",
      label: `Đổi mật khẩu`,
      children: (
        <ChangePassword
          showModalAccount={showModalAccount}
          setShowModalAccount={setShowModalAccount}
          clearChangePass={clearChangePass}
          setClearChangePass={setClearChangePass}
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={showModalAccount}
        width={"50vw"}
        footer={(null, null)}
        onCancel={() => {
          setShowModalAccount(false);
          setClearModal(true);
          setClearChangePass(true);
        }}
        maskClosable={false}
      >
        <Tabs defaultActiveKey="info" items={items} />
      </Modal>
    </>
  );
};

export default ManagerAccount;
