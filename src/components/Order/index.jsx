import {
  Button,
  Checkbox,
  Empty,
  Form,
  Input,
  InputNumber,
  Result,
  Steps,
  message,
  notification,
} from "antd";
import { BsArrowLeft, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

import {
  doDeleteCartAction,
  doPlaceOrderAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";

import "./order.scss";
import { doGetAccountAction } from "../../redux/account/accountSlice";
import { callPlaceOrder } from "../../services/api";
import { ShoppingOutlined } from "@ant-design/icons";

const Order = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const carts = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    let price = 0;
    carts.map((item) => {
      price += item.detail.price * item.quantity;
    });
    setTotalPrice(price);
  }, [carts]);

  const handleOnchangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: book, _id: book._id })
      );
    }
  };

  const handleDeleteCart = (item) => {
    dispatch(doDeleteCartAction({ _id: item._id }));
  };

  const onFinish = async (values) => {
    const { fullName, phone, address } = values;

    const data = {
      name: fullName,
      address: address,
      phone: phone,
      totalPrice: totalPrice,
      detail: [],
    };

    carts.map((item) => {
      data.detail.push({
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      });
    });

    setIsLoading(true);

    const res = await callPlaceOrder(data);

    setTimeout(() => {
      if (res && res.data) {
        setCurrentStep(currentStep + 1);
        dispatch(doPlaceOrderAction());

        setIsLoading(false);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res.message,
        });
      }
    }, 1500);

    // console.log("values", carts);
  };

  return (
    <>
      <div className="order-container">
        {/* step */}
        {carts.length ? (
          <Steps
            rootClassName="order-step"
            size="small"
            current={currentStep}
            status={"finish"}
            items={[
              {
                title: "Đơn hàng",
              },
              {
                title: "Đặt hàng",
              },
              {
                title: "Thanh toán",
              },
            ]}
          />
        ) : (
          <></>
        )}

        {/* carts */}
        {carts.length || currentStep === 0 ? (
          <div className="row">
            <div className="col col-left">
              {carts.length ? (
                carts.map((item, index) => {
                  return (
                    <div className="card" key={`book-${index}`}>
                      <div className="card-body">
                        <p className="thumbnail">
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/images/book/${item.detail.thumbnail}`}
                            alt={item.detail.mainText}
                          />
                        </p>
                        <div className="card-content">
                          <p className="title">{item.detail.mainText}</p>
                          <p className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.detail.price)}
                          </p>
                          <InputNumber
                            // min={1}
                            // max={item.detail.quantity}
                            // defaultValue={item.quantity}
                            value={item.quantity}
                            onChange={(value) =>
                              handleOnchangeInput(value, item)
                            }
                          />
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="total">
                          Tổng:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.detail.price * item.quantity)}
                        </p>
                        <BsTrash onClick={() => handleDeleteCart(item)} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{
                    height: 110,
                  }}
                  rootClassName="card-empty"
                  description="Giỏ hàng trống"
                  children={
                    <Link
                      to="/"
                      type="primary"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <BsArrowLeft style={{ marginRight: 5 }} />
                      Quay lại mua hàng
                    </Link>
                  }
                />
              )}
            </div>
            <div className="col col-right">
              {currentStep === 1 && carts.length ? (
                <div className="step">
                  <Form name="basic" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                      labelCol={{ span: 24 }}
                      label="Tên người nhận"
                      name="fullName"
                      initialValue={user.fullName}
                      rules={[
                        {
                          required: true,
                          message: "Tên người nhận không được để trống!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      labelCol={{ span: 24 }}
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

                    <Form.Item
                      labelCol={{ span: 24 }}
                      label="Địa chỉ"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Địa chỉ không được để trống!",
                        },
                      ]}
                    >
                      <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                      labelCol={{ span: 24 }}
                      label="Phương thức thanh toán"
                    >
                      <Checkbox
                        valuePropName="checked"
                        checked
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Thanh toán khi nhận hàng
                      </Checkbox>
                    </Form.Item>

                    <div className="card-body">
                      <p>Tổng tiền</p>
                      <p>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(totalPrice)}
                      </p>
                    </div>

                    <Form.Item>
                      <Button
                        className="order-submit"
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                      >
                        Mua hàng ({carts.length})
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <></>
              )}
              {currentStep === 0 || !carts.length ? (
                <div className="card">
                  <div className="card-body">
                    <p>Tạm tính</p>
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </p>
                  </div>
                  <div className="card-body">
                    <p>Tổng tiền</p>
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </p>
                  </div>
                  <button
                    className="order-submit"
                    onClick={() => {
                      setCurrentStep(currentStep + 1);
                    }}
                  >
                    Mua Hàng ({carts.length})
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* cart result  */}
        {currentStep === 2 ? (
          <Result
            status="success"
            title="Bạn đã đặt hàng thành công."
            subTitle="Cảm ơn bạn đã tin tưởng lựa chọn chúng tôi..."
            extra={[
              <Button
                type="primary"
                key="console"
                icon={<ShoppingOutlined />}
                style={{ margin: "0 0 15px" }}
              >
                <Link to="/history" style={{ marginLeft: "5px" }}>
                  Lịch sử đơn hàng
                </Link>
              </Button>,
              <Link
                to="/"
                type="primary"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BsArrowLeft style={{ marginRight: 5 }} />
                Tiếp tục mua hàng
              </Link>,
            ]}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Order;
