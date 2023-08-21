import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import { callDashboard } from "../../services/api";

const AdminPage = () => {
  const [databoard, setDataboard] = useState();
  useEffect(() => {
    const initDataboard = async () => {
      const res = await callDashboard();
      if (res && res.data) {
        countOrder: 49;
        countUser: 12;

        setDataboard(res.data);
      }
    };
    initDataboard();
  }, []);

  const formatter = (value) => <CountUp end={value} separator="," />;

  return (
    <>
      <Row style={{ gap: 15 }}>
        <Col span={10}>
          <Card>
            <h4 style={{ color: "#818181", fontWeight: "normal" }}>
              Tổng users
            </h4>
            <Statistic
              valueStyle={{ fontSize: "2rem" }}
              value={databoard?.countUser ?? 0}
              formatter={formatter}
            />
          </Card>
        </Col>

        <Col span={10}>
          <Card>
            <h4 style={{ color: "#818181", fontWeight: "normal" }}>
              Tổng đơn hàng
            </h4>
            <Statistic
              valueStyle={{ fontSize: "2rem" }}
              value={databoard?.countOrder ?? 0}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default AdminPage;
