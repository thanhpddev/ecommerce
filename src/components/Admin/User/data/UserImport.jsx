import { InboxOutlined } from "@ant-design/icons";
import { Divider, message, Modal, notification, Table, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";

import { callBulkCreateUser } from "../../../../services/api";
import templateFile from "./template.xlsx?url";

const { Dragger } = Upload;

const UserImport = ({ showModalImport, handleCancelImport }) => {
  const [dataExcel, setDataExcel] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowUploadList, setIsShowUploadList] = useState(true);

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
        // console.log(info.file, info.fileList);
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

  //   console.log("dataExcel ", dataExcel);
  const handleSubmitImport = async () => {
    setIsLoading(true);
    const data = dataExcel.map((item, index) => {
      item.password = "123456";
      //   delete item.key;
      return item;
    });

    let res = await callBulkCreateUser(data);
    setIsLoading(false);

    if (res.data) {
      notification.success({
        description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
        message: "Import thành công",
      });
      handleCancelImport();
      setDataExcel([]);
      setIsShowUploadList(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
  };

  return (
    <>
      <Modal
        title="Import dữ liệu người dùng"
        open={showModalImport}
        okText="Import"
        cancelText="Hủy"
        onOk={handleSubmitImport}
        onCancel={() => {
          handleCancelImport();
          setDataExcel([]);
          setIsShowUploadList(false);
        }}
        confirmLoading={isLoading}
        maskClosable={false}
        okButtonProps={{ disabled: dataExcel.length < 1 }}
      >
        <Dragger {...propsUpload} showUploadList={isShowUploadList}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo tệp vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Chỉ hỗ trợ dạng file xlsx, xls, .csv hoặc{" "}
            <a
              href={templateFile}
              download
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Tải xuống tệp mẫu
            </a>
          </p>
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
