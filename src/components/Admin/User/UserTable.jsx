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

import { callDeleteUser, callFetchListUser } from "../../../services/api";
import InputSearch from "./InputSearch";
import ViewUserDetail from "./ViewUserDetail";
import UserModalCreate from "./UserModalCreate";

import "./userTable.scss";
import UserImport from "./data/UserImport";
import UserModalUpdate from "./UserModalUpdate";

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

  //show data update
  const [dataUpdate, setDataUpdate] = useState([]);
  const [isModalUpdate, setIsModalUpdate] = useState(false);

  const showModalUpdate = () => {
    setIsModalUpdate(true);
  };

  const handleCancel = () => {
    setIsModalUpdate(false);
  };

  //handle delete user
  const handleDelete = async (userId) => {
    const res = await callDeleteUser(userId);
    console.log(res);
    if (res && res.data) {
      message.success("Xóa người dùng thành công!");
      await fetchUser();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
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
              onConfirm={() => handleDelete(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <AiOutlineDelete style={{ color: "red", cursor: "pointer" }} />
            </Popconfirm>

            <AiOutlineEdit
              style={{ marginLeft: 10, cursor: "pointer" }}
              onClick={() => {
                setDataUpdate(record);
                showModalUpdate();
              }}
            />
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

  //export button
  const handleExportData = () => {
    if (listUser.length > 0) {
      console.log("listUser", listUser);
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.csv");
    }
  };

  const renderHeader = () => {
    //add user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenImport, setIsModalOpenImport] = useState(false);

    const showModalAdd = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    //Import user
    const showModalImport = () => {
      setIsModalOpenImport(true);
    };
    const handleCancelImport = () => {
      setIsModalOpenImport(false);
    };

    return (
      <div
        className="table-button"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Danh sách người dùng</h3>
        <div style={{ display: "flex", gap: 15 }}>
          <Button
            type="primary"
            icon={<AiOutlineExport />}
            onClick={handleExportData}
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<AiOutlineCloudUpload />}
            onClick={showModalImport}
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
          showModalImport={isModalOpenImport}
          handleCancelImport={handleCancelImport}
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

      {/* update modal user */}
      <UserModalUpdate
        showModalUpdate={isModalUpdate}
        handleCancel={handleCancel}
        dataUpdate={dataUpdate}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default UserTable;
