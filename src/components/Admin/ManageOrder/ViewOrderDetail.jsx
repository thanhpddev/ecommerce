import { Drawer, Descriptions } from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ViewOrderDetail = ({
  openViewDetail,
  closeViewDetail,
  dataViewDetail,
}) => {
  const location = useLocation();
  let detailBook = "";

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
  if (dataViewDetail.detail) {
    detailBook = dataViewDetail.detail.map((item, index) => {
      const slug = convertSlug(item.bookName);
      return (
        <span key={`book-${index}`}>
          <Link
            to={`/book/${slug}?id=${item._id}`}
            target="_blank"
          >{`${item.bookName} (x${item.quantity})`}</Link>
          <br />
        </span>
      );
    });
  }
  const data = [
    { title: "Id", value: dataViewDetail._id },
    { title: "Tên người dùng", value: dataViewDetail.name },
    { title: "Địa chỉ", value: dataViewDetail.address },

    { title: "Giá tiền", value: dataViewDetail.totalPrice },
    { title: "Số điện thoại", value: dataViewDetail.phone },
    {
      title: "Ngày đặt hàng",
      value: moment(dataViewDetail.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    },

    {
      title: "Tên sách",
      value: detailBook,
    },

    { title: "Thể loại sách", value: dataViewDetail.type },
  ];

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (dataViewDetail) {
      let img = [];

      if (dataViewDetail.thumbnail) {
        img.push({
          uid: uuidv4(),
          name: dataViewDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`,
        });
      }

      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        dataViewDetail.slider.map((items) => {
          img.push({
            uid: uuidv4(),
            name: items,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${items}`,
          });
        });
      }

      setFileList(img);
    }
  }, [dataViewDetail]);

  return (
    <>
      <Drawer
        width="50vw"
        title="Thông tin chi tiết"
        placement="right"
        open={openViewDetail}
        onClose={closeViewDetail}
      >
        <Descriptions column={1} bordered>
          {data.map((description, index) =>
            description.title ? (
              <Descriptions.Item key={index} label={description.title}>
                {description.value}
              </Descriptions.Item>
            ) : (
              <div key={index}>{description.value}</div>
            )
          )}
        </Descriptions>
      </Drawer>
    </>
  );
};

export default ViewOrderDetail;
