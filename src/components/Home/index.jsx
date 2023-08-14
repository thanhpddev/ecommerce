import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
} from "antd";

import "./home.scss";
import { callFetchCategory, callFetchListBook } from "../../services/api";
import { useEffect, useState } from "react";

const Home = () => {
  const [listCategory, setListCategory] = useState([]);
  const [listBook, setlistBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("sort=-sold");
  const [filter, setFilter] = useState("");

  const [form] = Form.useForm();

  //fetchCategory
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchCategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);

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
      setlistBook(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const handleChangeFilter = (changedValues, values) => {
    // console.log(">>> check handleChangeFilter", changedValues, values);
  };

  const onFinish = (values) => {};

  const items = [
    {
      key: "1",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "2",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "3",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "4",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  const onChange = (page, _pageSize) => {
    if (pagee) {
      setCurrent(page);
    }
    if (_pageSize) {
      setPageSize(_pageSize);
    }
  };

  return (
    <div className="homepage-container">
      <Row gutter={[20, 20]}>
        <Col className="col-left">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              {" "}
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
          </div>
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item
              name="category"
              label="Danh mục sản phẩm"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row className="checkbox-category">
                  {listCategory.map((item, index) => {
                    return (
                      <Col span={24} key={index}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider />
            <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
              <div>
                <Rate
                  value={5}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"></span>
              </div>
              <div>
                <Rate
                  value={4}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={3}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={2}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={1}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
            </Form.Item>
          </Form>
        </Col>
        <Col className="col-right">
          <Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Row>
          <Row className="customize-row">
            {listBook.map((item, index) => {
              return (
                <div className="column" key={index}>
                  <div className="wrapper">
                    <div className="thumbnail">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item.thumbnail
                        }`}
                        alt={item.mainText}
                      />
                    </div>
                    <div className="text">{item.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </div>
                    <div className="rating">
                      <Rate
                        value={5}
                        disabled
                        style={{ color: "#ffce3d", fontSize: 10 }}
                      />
                      <span>Đã bán {item.sold}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Row>
          <Divider />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              defaultCurrent={1}
              responsive
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={onChange}
              // showSizeChanger={true}
              // pageSizeOptions={["5", "10", "20", "50"]}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
