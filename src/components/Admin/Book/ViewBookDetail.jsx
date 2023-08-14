import { Drawer, Badge, Descriptions, Divider, Upload, Modal } from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ViewBookDetail = ({
  openViewDetail,
  closeViewDetail,
  dataViewDetail,
}) => {
  console.log(dataViewDetail);

  const data = [
    { title: "Id", value: dataViewDetail._id },
    { title: "Tên sách", value: dataViewDetail.mainText },
    { title: "Tác giả", value: dataViewDetail.author },
    { title: "Giá tiền", value: dataViewDetail.price },
    { title: "Số lượng", value: dataViewDetail.quantity },
    { title: "Đã bán", value: dataViewDetail.sold },
    {
      title: "Thể loại",
      value: <Badge status="processing" text={dataViewDetail.category} />,
    },
    {
      title: "Created At",
      value: moment(dataViewDetail.createdAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Updated At",
      value: moment(dataViewDetail.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

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

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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
        <Divider orientation="center">Ảnh sách</Divider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        />
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </Drawer>
    </>
  );
};

export default ViewBookDetail;
