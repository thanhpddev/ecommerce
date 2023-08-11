import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Avatar } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";

import "./layout.scss";

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const user = useSelector((state) => state.account.user);
  //active link
  const location = useLocation();
  // const [selectedKey, setSelectedKey] = useState(
  //   items.find((_item) => location.pathname.startsWith(_item.path)).key
  // );

  useEffect(() => {
    items.find((current) => {
      if (location.pathname === current.label.props.to) {
        setActiveMenu(current.key);
      }

      if (current.children) {
        current.children.find((subCurrent, index) => {
          if (location.pathname === subCurrent.label.props.to) {
            setActiveMenu(subCurrent.key);
          }
        });
      }
    });
  }, [location]);

  const items = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreOutlined />,
    },
    {
      label: <span>Manage Users</span>,
      // key: 'user',
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user">CRUD</Link>,
          key: "crud",
          icon: <TeamOutlined />,
        },
        {
          label: <Link to="/admin/file1">test</Link>,
          key: "file1",
          icon: <TeamOutlined />,
        },
      ],
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "book",
      icon: <ExceptionOutlined />,
    },
    {
      label: <Link to="/admin/order">Manage Orders</Link>,
      key: "order",
      icon: <DollarCircleOutlined />,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const itemsDropdown = [
    {
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
      key: "account",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  // url-backend/images/avatar/image-id-here
  const avatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user.avatar
  }`;

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>Admin</div>
        <Menu
          defaultSelectedKeys={[activeMenu]}
          selectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout style={{ padding: "0 15px", boxSizing: "border-box" }}>
        <div className="admin-header" style={{ marginBottom: "15px" }}>
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ lineHeight: 1 }}>
                <Avatar size="small" src={`${avatar}`} alt="avatar" />
                {user?.fullName}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content>
          <Outlet />
        </Content>
        <Footer style={{ padding: 0 }}>
          React Test Fresher &copy; Hỏi Dân IT - Made with <HeartTwoTone />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
