import { InboxOutlined } from "@ant-design/icons";
import { Divider, message, Modal, Table, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Dragger } = Upload;

const UserImport = ({
  showModalExport,
  handleOkExport,
  handleCancelExport,
}) => {
  const [dataExcel, setDataExcel] = useState([]);

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
        //   console.log("info.file", info.fileList[0].originFileObj.name);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            // find the name of your sheet in the workbook first
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // convert to json format
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1,
            });
            if (json && json.length > 0) {
              json.map((item, index) => {
                item.key = index;
              });
              setDataExcel(json);
            }
          };
        }

        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal
        title="Import dữ liệu người dùng"
        open={showModalExport}
        okText="Import"
        cancelText="Hủy"
        onOk={handleOkExport}
        onCancel={handleCancelExport}
        maskClosable={false}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo tệp vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">Nghiêm cấm tải lên dữ liệu bị cấm.</p>
        </Dragger>
        <Divider />
        <Table
          title={() => <p>Dữ liệu upload:</p>}
          dataSource={dataExcel}
          columns={[
            {
              title: "Tên hiển thị",
              dataIndex: "fullName",
              key: "fullName",
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
            },
            {
              title: "Số điện thoại",
              dataIndex: "phone",
              key: "phone",
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default UserImport;
