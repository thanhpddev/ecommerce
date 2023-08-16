import React, { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { SmileOutlined } from "@ant-design/icons";
import { Divider, Badge, Drawer, message, Avatar, Popover, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";

import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";

import "./header.scss";

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const carts = useSelector((state) => state.order.carts);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const items = [
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

  //handle admin link page
  if (user.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  // url-backend/images/avatar/image-id-here
  const avatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user.avatar
  }`;

  console.log(carts);
  const content = carts.length ? (
    <div className="group">
      {carts.map((item, index) => {
        return (
          <div className="card" key={`book-${index}`}>
            <p className="thumbnail">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                  item.detail.thumbnail
                }`}
                alt={item.detail.mainText}
              />
            </p>
            <div className="card-body">
              <p className="title">{item.detail.mainText}</p>
              <p className="price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.detail.price)}
              </p>
            </div>
          </div>
        );
      })}

      <button
        onClick={() => {
          navigate("/order");
        }}
      >
        Xem giỏ hàng
      </button>
    </div>
  ) : (
    <></>
  );

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo">
                <Link to="/">
                  <FaReact className="rotate icon-react" /> Ecommerce
                </Link>
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  rootClassName="popover-carts"
                  placement="bottom"
                  title={
                    carts.length ? (
                      <span>Sản phẩm mới thêm</span>
                    ) : (
                      <Result
                        icon={
                          <SmileOutlined
                            style={{ fontSize: "3rem", color: "#9d9999" }}
                          />
                        }
                        title="Chưa có sản phẩm nào trong giỏ hàng"
                      />
                    )
                  }
                  content={content}
                  arrow={true}
                >
                  <Badge count={carts?.length ?? 0} size={"small"} showZero>
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space style={{ lineHeight: 1 }}>
                        <Avatar size="small" src={`${avatar}`} alt="avatar" />
                        {user?.fullName}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p>Đăng xuất</p>
        <Divider />
      </Drawer>
    </>
  );
};

export default Header;
