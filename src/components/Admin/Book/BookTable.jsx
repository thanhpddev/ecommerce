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

import InputSearch from "./InputSearch";
import { callFetchListBook } from "../../../services/api";
import ViewBookDetail from "./ViewBookDetail";
import BookModalCreate from "./BookModalCreate";

const BookTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const [filter, setFilter] = useState("");

  //show detail user | Drawer
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

    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const closeViewDetail = () => {
    setOpenViewDetail(false);
  };

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
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render: (text, record, index) => {
        return <>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="left"
              title={"Xác nhận xóa người dùng"}
              description={"Bạn có chắc chắn xóa người dùng này?"}
              //   onConfirm={() => handleDelete(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <AiOutlineDelete style={{ color: "red", cursor: "pointer" }} />
            </Popconfirm>

            <AiOutlineEdit
              style={{ marginLeft: 10, cursor: "pointer" }}
              onClick={() => {
                // setDataUpdate(record);
                // showModalUpdate();
              }}
            />
          </>
        );
      },
    },
  ];

  const renderHeader = () => {
    //add user
    const [openModalCreate, setOpenModalCreate] = useState(false);

    return (
      <div
        className="table-button"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Danh sách sách</h3>
        <div style={{ display: "flex", gap: 15 }}>
          <Button
            type="primary"
            icon={<AiOutlineExport />}
            // onClick={handleExportData}
          >
            Export
          </Button>

          <Button
            type="primary"
            icon={<AiOutlineFileAdd />}
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
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

        {/* modal add user */}
        <BookModalCreate
          openModalCreate={openModalCreate}
          setOpenModalCreate={setOpenModalCreate}
          fetchBook={fetchBook}
          // handleOk={handleOk}
          // handleCancel={handleCancel}
          // fetchBook={fetchBook}
        />
        {/* modal import file user */}
        {/* <UserImport
          showModalImport={isModalOpenImport}
          handleCancelImport={handleCancelImport}
        /> */}
      </div>
    );
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("pagination ", pagination, filters, sorter, extra);

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
  const handleSearch = (query) => {
    setFilter(query);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            className="def"
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              pageSizeOptions: ["2", "5", "10", "20", "50"],
            }}
          />
        </Col>
      </Row>

      <ViewBookDetail
        openViewDetail={openViewDetail}
        dataViewDetail={dataViewDetail}
        closeViewDetail={closeViewDetail}
      />
    </>
  );
};

export default BookTable;
