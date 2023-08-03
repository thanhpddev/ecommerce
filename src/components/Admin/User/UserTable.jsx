import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "antd";
import InputSearch from "./InputSearch";
import { callFetchListUser } from "../../../services/api";

// https://stackblitz.com/run?file=demo.tsx

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(
    +localStorage.getItem("pagination_current") ?? 1
  );
  const [pageSize, setPageSize] = useState(
    +localStorage.getItem("pagination_pageSize") ?? 2
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  const fetchUser = async (searchFilter) => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (searchFilter) {
      query += `&${searchFilter}`;
    }
    const res = await callFetchListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      sorter: true,
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
      localStorage.setItem("pagination_current", pagination.current);
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      localStorage.setItem("pagination_pageSize", pagination.pageSize);
      setPageSize(pagination.pageSize);
      //   setCurrent(1);
    }
  };

  const handleSearch = (query) => {
    console.log("query ", query);
    fetchUser(query);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
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
    </>
  );
};

export default UserTable;
