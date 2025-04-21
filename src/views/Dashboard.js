import React from "react";
import {
  Card,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../assets/css/Dashboard.css";

function Dashboard() {
  const dailyShiftData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Bangalore",
        data: [12, 19, 14, 10, 15],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Hyderabad",
        data: [8, 11, 9, 7, 13],
        backgroundColor: "#FF6384",
      },
    ],
  };

  const attendanceData = {
    labels: ["Present", "Absent", "On Leave"],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };

  const earlyOutData = {
    labels: ["Early Out", "On Time"],
    datasets: [
      {
        data: [30, 70],
        backgroundColor: ["#ffc107", "#2196f3"],
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // This is key for custom height
  };
  

  return (
    <div className="dashboard-container bg-blue-50 min-h-screen p-4">
      <Container fluid>
      <Row>
  <Col md={12}>
    <Card className="mb-4 shadow-sm bg-white">
      <Card.Body style={{ height: "350px" }}>
        <Card.Title className="fw-bold text-primary mb-3">Daily Shifts</Card.Title>
        <div style={{ height: "250px", width: "100%" }}>
          <Bar data={dailyShiftData} options={barOptions} />
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>


        <Row>
          <Col md={6}>
            <Card className="mb-4 shadow-sm bg-white">
              <Card.Body>
                <Card.Title className="fw-bold text-success mb-3">Employee Attendance</Card.Title>
                <Pie data={attendanceData} />
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4 shadow-sm bg-white">
              <Card.Body>
                <Card.Title className="fw-bold text-warning mb-3">Early Out Employees</Card.Title>
                <Pie data={earlyOutData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
