import {
  Button,
  Checkbox,
  Empty,
  Form,
  Input,
  InputNumber,
  Result,
  Steps,
} from "antd";
import { BsArrowLeft, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

import {
  doDeleteCartAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";

import "./order.scss";
import { doGetAccountAction } from "../../redux/account/accountSlice";

const Order = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const carts = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);
  console.log(user);

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

  const onFinish = (values) => {
    setIsLoading(true);

    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }, 2000);
    console.log("values", currentStep);
  };

  return (
    <>
      <div className="order-container">
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
                          onChange={(value) => handleOnchangeInput(value, item)}
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
                      checked={true}
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
      </div>
    </>
  );
};

export default Order;
