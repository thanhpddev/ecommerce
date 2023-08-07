import { InboxOutlined } from "@ant-design/icons";
import { Divider, message, Modal, Table, Upload } from "antd";

const { Dragger } = Upload;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 1000);
};

const propsUpload = {
  name: "file",
  multiple: false,
  maxCount: 1,
  //   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  accept:
    ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  customRequest: dummyRequest,
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const UserImport = ({
  showModalExport,
  handleOkExport,
  handleCancelExport,
}) => {
  return (
    <>
      <Modal
        title="Import dữ liệu người dùng"
        open={showModalExport}
        okText="Import"
        cancelText="Hủy"
        onOk={handleOkExport}
        onCancel={handleCancelExport}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
        <Divider />
        <Table
          title={() => <p>Dữ liệu upload:</p>}
          //   dataSource={dataSource}
          columns={[
            {
              title: "Tên hiển thị",
              dataIndex: "fullName",
            },
            {
              title: "Email",
              dataIndex: "email",
            },
            {
              title: "Số điện thoại",
              dataIndex: "phone",
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default UserImport;
