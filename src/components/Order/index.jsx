import { Button, InputNumber, Result } from "antd";
import { BsArrowLeft, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import {
  doDeleteCartAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";

import "./order.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Order = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

  const carts = useSelector((state) => state.order.carts);

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

  return (
    <>
      <div className="order-container">
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
              <Result
                status="403"
                title="Giỏ hàng trống"
                rootClassName="card-result"
                extra={
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
              <button disabled={true}>Mua Hàng ({carts.length})</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
