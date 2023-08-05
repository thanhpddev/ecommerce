import { Drawer, Badge, Descriptions } from "antd";
import moment from "moment/moment";

const ViewUserDetail = ({
  openViewDetail,
  closeViewDetail,
  dataViewDetail,
}) => {
  // console.log(dataViewDetail);
  const data = [
    { title: "Id", value: dataViewDetail._id },
    { title: "Tên hiển thị", value: dataViewDetail.fullName },
    { title: "Email", value: dataViewDetail.email },
    { title: "Số điện thoại", value: dataViewDetail.phone },
    {
      title: "Role",
      value: <Badge status="processing" text={dataViewDetail.role} />,
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
  return (
    <>
      <Drawer
        width="50vw"
        title="Chi tiết người dùng"
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

export default ViewUserDetail;
