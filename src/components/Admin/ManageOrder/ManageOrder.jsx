import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Popconfirm,
  message,
  notification,
} from "antd";
import {
  AiOutlineExport,
  AiOutlineFileAdd,
  AiOutlineCloudUpload,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { GrRefresh } from "react-icons/gr";
import moment from "moment";
import * as XLSX from "xlsx";
import { callFetchManageOrder } from "../../../services/api";
import ViewOrderDetail from "./ViewOrderDetail";

// import InputSearch from "./InputSearch";
// import { callDeleteBook, callFetchListBook } from "../../../services/api";
// import ViewBookDetail from "./ViewBookDetail";
// import BookModalCreate from "./BookModalCreate";
// import BookModalUpdate from "./BookModalUpdate";

const ManageOrder = () => {
  const [listOrder, setlistOrder] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const [filter, setFilter] = useState("");

  //show detail book | Drawer
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, sortQuery, filter]);

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}&${sortQuery}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&sort=${sortQuery}`;
    }

    // const res = await callFetchListBook(query);
    // if (res && res.data) {
    //   setlistOrder(res.data.result);
    //   setTotal(res.data.meta.total);
    // }
    const res = await callFetchManageOrder(query);
    if (res && res.data) {
      res.data.result.map((item) => {
        item.totalPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.totalPrice ?? 0);
      });

      setlistOrder(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const closeViewDetail = () => {
    setOpenViewDetail(false);
  };

  const [dataUpdate, setDataUpdate] = useState([]);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },

    {
      title: "Tên người dùng",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "updatedAt",
      sorter: true,
      render: (text, record, index) => {
        return <>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
  ];

  //export button
  const handleExportData = () => {
    if (listOrder.length > 0) {
      listOrder.map((item, index) => {
        delete item.thumbnail;
        delete item.slider;
        if (item.detail) {
          let book = item.detail
            .map((item) => {
              return `${item.bookName} (x${item.quantity})`;
            })
            .join(", ");
          item.detail = book;
        }
      });
      const worksheet = XLSX.utils.json_to_sheet(listOrder);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportOrder.csv");
    }
  };

  const renderHeader = () => {
    return (
      <div
        className="table-button"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Danh sách đặt hàng</h3>
        <div style={{ display: "flex", gap: 15 }}>
          <Button
            type="primary"
            icon={<AiOutlineExport />}
            onClick={handleExportData}
          >
            Export
          </Button>

          <Button
            type="ghost"
            icon={<GrRefresh />}
            onClick={() => {
              setSortQuery("sort=-updatedAt");
              setFilter("");
            }}
          />
        </div>
      </div>
    );
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      //   setCurrent(1);
    }
    //handlesort
    if (sorter && sorter.field) {
      setSortQuery(
        sorter.order === "ascend" ? sorter.field : `-${sorter.field}`
      );
    } else {
      setSortQuery("sort=-updatedAt");
    }
  };

  //handle
  // const handleSearch = (query) => {
  //   setFilter(query);
  // };

  return (
    <>
      <Row gutter={[20, 20]}>
        {/* <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
        </Col> */}
        <Col span={24}>
          <Table
            title={renderHeader}
            className="def"
            columns={columns}
            dataSource={listOrder}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
          />
        </Col>
      </Row>

      <ViewOrderDetail
        openViewDetail={openViewDetail}
        dataViewDetail={dataViewDetail}
        closeViewDetail={closeViewDetail}
      />
    </>
  );
};
export default ManageOrder;
