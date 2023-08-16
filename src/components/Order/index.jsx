import { InputNumber } from "antd";
import { BsTrash } from "react-icons/bs";

import "./order.scss";

const Order = () => {
  const onChange = (value) => {
    console.log("changed", value);
  };

  return (
    <>
      <div className="order-container">
        <div className="row">
          <div className="col col-left">
            <div className="card">
              <div className="card-body">
                <p className="thumbnail">
                  <img
                    src="https://picsum.photos/id/1018/250/150/"
                    alt="thumbnail"
                  />
                </p>
                <div className="card-content">
                  <p className="title">Tên sản phẩm là gì vậy anh em ơi</p>
                  <p className="price">250.000d</p>
                  <InputNumber
                    min={1}
                    // max={10}
                    defaultValue={3}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="card-body">
                <p className="total">Tổng: 250.000d</p>
                <BsTrash />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <p className="thumbnail">
                  <img
                    src="https://picsum.photos/id/1018/250/150/"
                    alt="thumbnail"
                  />
                </p>
                <div className="card-content">
                  <p className="title">Tên sản phẩm là gì vậy anh em ơi</p>
                  <p className="price">250.000d</p>
                  <InputNumber
                    min={1}
                    // max={10}
                    defaultValue={3}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="card-body">
                <p className="total">Tổng: 250.000d</p>
                <BsTrash />
              </div>
            </div>
          </div>
          <div className="col col-right">
            <div className="card">
              <div className="card-body">
                <p>Tạm tính</p>
                <p>100.000.000</p>
              </div>
              <div className="card-body">
                <p>Tổng tiền</p>
                <p>100.000.000</p>
              </div>
              <button>Mua Hàng (2)</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
