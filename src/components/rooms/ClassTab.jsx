import React from "react";
import { Card, Col, Descriptions, Row, Typography, Calendar, Space, List, Tag } from "antd";
import { FolderFilled, FileFilled } from "@ant-design/icons";

const classInfo = {
  code: "CATH-ENG-A2",
  name: "Lớp A2 - Gia đình",
  teacher: "Nguyễn Minh",
  students: 5,
  sessions: 5,
  tuition: "2.000.000 VND",
  startDate: "10/09/2025",
  finishDate: "10/11/2025",
  breakCount: 0,
  link: "https://cathspeak.com/class/a2",
};

const materials = [
  { name: "11/09/2025", size: "26.5MB", type: "folder" },
  { name: "15/09/2025", size: "18.2MB", type: "folder" },
  { name: "Slides_Week1.pdf", size: "4.5MB", type: "file" },
];

const records = [
  { name: "Record_11-09-2025.mp4", size: "26.5MB" },
  { name: "Record_18-09-2025.mp4", size: "28.1MB" },
  { name: "Record_25-09-2025.mp4", size: "27.3MB" },
];

const ClassTab = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Typography.Title level={5}>Thông tin lớp</Typography.Title>
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ width: 140 }}
              contentStyle={{ fontWeight: 500 }}
            >
              <Descriptions.Item label="Mã lớp">{classInfo.code}</Descriptions.Item>
              <Descriptions.Item label="Tên lớp">{classInfo.name}</Descriptions.Item>
              <Descriptions.Item label="Giáo viên">{classInfo.teacher}</Descriptions.Item>
              <Descriptions.Item label="Số lượng học viên">{classInfo.students}</Descriptions.Item>
              <Descriptions.Item label="Tổng buổi học">{classInfo.sessions}</Descriptions.Item>
              <Descriptions.Item label="Nghỉ học">{classInfo.breakCount}</Descriptions.Item>
              <Descriptions.Item label="Học phí">{classInfo.tuition}</Descriptions.Item>
              <Descriptions.Item label="Ngày dự kiến kết thúc">
                {classInfo.finishDate}
              </Descriptions.Item>
              <Descriptions.Item label="Link phòng">
                <a href={classInfo.link} target="_blank" rel="noreferrer">
                  {classInfo.link}
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} lg={12}>
            <Typography.Title level={5}>Thời khóa biểu</Typography.Title>
            <Card size="small" bodyStyle={{ padding: 8 }}>
              <Calendar fullscreen={false} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Tài liệu lớp học" bodyStyle={{ paddingTop: 8 }}>
        <List
          itemLayout="horizontal"
          dataSource={materials}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.type === "folder" ? (
                    <FolderFilled style={{ color: "#a30a1c", fontSize: 20 }} />
                  ) : (
                    <FileFilled style={{ color: "#faad14", fontSize: 20 }} />
                  )
                }
                title={item.name}
                description={<Tag color="default">{item.size}</Tag>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Record" bodyStyle={{ paddingTop: 8 }}>
        <List
          itemLayout="horizontal"
          dataSource={records}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<FileFilled style={{ color: "#1890ff", fontSize: 20 }} />}
                title={item.name}
                description={<Tag color="default">{item.size}</Tag>}
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};

export default ClassTab;

