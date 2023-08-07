import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button } from "antd";
import {
  AiOutlineExport,
  AiOutlineFileAdd,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { GrRefresh } from "react-icons/gr";

import { callFetchListUser } from "../../../services/api";
import InputSearch from "./InputSearch";
import ViewUserDetail from "./ViewUserDetail";
import UserModalCreate from "./UserModalCreate";

import "./userTable.scss";
import UserImport from "./UserImport";

// https://stackblitz.com/run?file=demo.tsx

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, sortQuery, filter]);

  const fetchUser = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&sort=${sortQuery}`;
    }
    const res = await callFetchListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  //show detail user | Drawer
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});
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
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <>
            <button>Delete</button>
          </>
        );
      },
    },
  ];

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
      setSortQuery("");
    }
  };

  const handleSearch = (query) => {
    setFilter(query);
  };

  const renderHeader = () => {
    //add user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenExport, setIsModalOpenExport] = useState(false);

    const showModalAdd = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    //export user
    const showModalExport = () => {
      setIsModalOpenExport(true);
    };
    const handleCancelExport = () => {
      setIsModalOpenExport(false);
    };

    return (
      <div
        className="table-button"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Danh sách người dùng</h3>
        <div style={{ display: "flex", gap: 15 }}>
          <Button type="primary" icon={<AiOutlineExport />}>
            Export
          </Button>
          <Button
            type="primary"
            icon={<AiOutlineCloudUpload />}
            onClick={showModalExport}
          >
            Import
          </Button>
          <Button
            type="primary"
            icon={<AiOutlineFileAdd />}
            onClick={showModalAdd}
          >
            Thêm mới
          </Button>
          <Button
            type="ghost"
            icon={<GrRefresh />}
            onClick={() => {
              setSortQuery("");
              setFilter("");
            }}
          />
        </div>

        {/* modal add user */}
        <UserModalCreate
          showModalAdd={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          fetchUser={fetchUser}
        />
        {/* modal import file user */}
        <UserImport
          showModalExport={isModalOpenExport}
          handleCancelExport={handleCancelExport}
        />
      </div>
    );
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
          {/* <InputSearch
            handleSearch={(query) => {
              fetchUser(query);
            }}
          /> */}
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

      {/* view user detail */}
      <ViewUserDetail
        openViewDetail={openViewDetail}
        dataViewDetail={dataViewDetail}
        closeViewDetail={closeViewDetail}
      />
    </>
  );
};

export default UserTable;
