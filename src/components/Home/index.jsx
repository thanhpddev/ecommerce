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
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { callFetchCategory, callFetchListBook } from "../../services/api";

import "./home.scss";
import useDeBounce from "../../Hooks/useDeBounce";

const Home = () => {
  const [listCategory, setListCategory] = useState([]);
  const [listBook, setlistBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("sort=-sold");
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm, isLoadingSearch, setIsLoadingSearch] =
    useOutletContext();
  const [form] = Form.useForm();
  const navigate = useNavigate();

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

  //debounced search value
  const debounced = useDeBounce(searchTerm, 700);
  useEffect(() => {
    fetchBook();
  }, [current, pageSize, sortQuery, filter, debounced]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;

    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    if (filter) {
      query += `${filter}`;
    }
    if (debounced) {
      query += `&mainText=/${encodeURIComponent(debounced)}/i`;
      setIsLoadingSearch(false);
    }

    const res = await callFetchListBook(query);

    if (res && res.data) {
      setlistBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleChangeFilter = (changedValues, values) => {
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        setFilter(`&category=${cate.join(",")}`);
      } else {
        setFilter("");
      }
    }
  };

  const onFinish = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `&price>=${values?.range?.from ?? 0}&price<=${
        values?.range?.to ?? Infinity
      }`;
      if (values.category) {
        f += `&category=${values.category.join(",")}`;
      }
      setFilter(f);
    }
  };

  const items = [
    {
      key: "sort=-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "sort=price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "sort=-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  const onChangeTable = (page, _pageSize) => {
    if (page) {
      setCurrent(page);
    }
    if (_pageSize) {
      setPageSize(_pageSize);
    }
  };

  const onChangeTabs = (activeKey) => {
    setSortQuery(activeKey);
  };

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
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
            <ReloadOutlined
              title="Reset"
              onClick={() => {
                form.resetFields();
                setFilter("");
              }}
            />
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
          </Form>
        </Col>
        <Col className="col-right">
          <Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} />
          </Row>

          <Spin tip="Loading..." size="large" spinning={isLoading}>
            <Row className="customize-row">
              {listBook.map((item, index) => {
                return (
                  <div
                    className="column"
                    key={`book-${index}`}
                    onClick={() => handleRedirectBook(item)}
                  >
                    <div className="wrapper">
                      <div className="thumbnail">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.thumbnail}`}
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
          </Spin>

          <Divider />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              defaultCurrent={1}
              responsive
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={onChangeTable}
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
