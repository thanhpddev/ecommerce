import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "antd";
import InputSearch from "./InputSearch";
import { callFetchListUser } from "../../../services/api";
import ViewUserDetail from "./ViewUserDetail";

// https://stackblitz.com/run?file=demo.tsx

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("");

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, sortQuery]);

  const fetchUser = async (searchFilter) => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (searchFilter) {
      query += `&${searchFilter}`;
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
        // console.log(record);
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
    // console.log("query ", query);
    fetchUser(query);
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
              pageSizeOptions: ["2", "5", "10", "20"],
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
