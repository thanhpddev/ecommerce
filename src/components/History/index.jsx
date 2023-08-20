import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import ReactJson from "react-json-view";
import { useDispatch, useSelector } from "react-redux";

import { callFetchBookById, callHistoryOrder } from "../../services/api";

import "./history.scss";

const History = () => {
  let [dataTable, setDataTable] = useState([]);
  let [thumbnail, setThumbnail] = useState([]);
  let [reload, setReload] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);

  // const fetchBookById = async (id) => {
  //   const res = await callFetchBookById(id);
  //   setThumbnail((prev) => [...prev, res.data.thumbnail]);
  // };

  const fetchData = async () => {
    let res = await callHistoryOrder();

    if (res && res.data) {
      if (user.id !== res.data[0].userId) {
        location.reload();
      } else {
        let data = [];
        res.data.map((item, index) => {
          if (user.role === "ADMIN") {
            data.push({
              key: ++index,
              _id: index,
              updatedAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
              totalPrice: `${item.totalPrice} ₫`,
              status: <Tag color="green">Thành công</Tag>,
              detail: (
                <ReactJson
                  src={item.detail}
                  name="Chi tiết đơn mua"
                  collapsed={true}
                />
              ),
            });
          } else {
            if (item.detail.length) {
              const detailBook = item.detail.map((item, index) => {
                return (
                  <span
                    key={`item-${index}`}
                    style={{ display: "flex", marginBottom: 10 }}
                  >
                    {/* <img
                      style={{ width: 50, marginRight: 5 }}
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        thumbnail[index]
                      }`}
                    /> */}
                    {`${item.bookName} (x${item.quantity})`}
                    <br />
                  </span>
                );
              });
              data.push({
                key: ++index,
                _id: index,
                bookName: detailBook,
                updatedAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
                totalPrice: `${item.totalPrice} ₫`,
                status: <Tag color="green">Thành công</Tag>,
              });
            }
          }
        });
        setDataTable(data);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //

  const columns_admin = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
    },
  ];

  const columns_user = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
    },

    {
      title: "Ngày đặt",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },

    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];

  return (
    <>
      <div className="history-page">
        <Table
          columns={user.role === "Admin" ? columns_admin : columns_user}
          dataSource={dataTable}
          pagination={false}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

export default History;
