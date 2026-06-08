import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function AllResults() {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/my-results`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch results:", err);
      });
  }, []);

  if (results.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h4>No test results found.</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 text-primary">📊 Your Test Performance</h2>
      <Row className="g-4">
        {results.map((result) => {
          const {
            _id,
            score,
            totalMarks,
            correctAnswers,
            wrongAnswers,
            testPaperId,
          } = result;

          const percentage = Math.round((score / totalMarks) * 100);
          const testTitle = testPaperId?.title || "Untitled Test";
         

          let rankColor = "secondary";
          let progressColor = "#6c757d";
          if (percentage >= 90) {
            rankColor = "success";
            progressColor = "#198754";
          } else if (percentage >= 70) {
            rankColor = "primary";
            progressColor = "#0d6efd";
          } else if (percentage >= 50) {
            rankColor = "warning";
            progressColor = "#ffc107";
          } else {
            rankColor = "danger";
            progressColor = "#dc3545";
          }

          return (
            <Col key={_id} md={6} lg={4}>
              <Card className="shadow h-100 border-0">
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <div style={{ width: 100, height: 100, marginBottom: "1rem" }}>
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                      styles={buildStyles({
                        textSize: "16px",
                        pathColor: progressColor,
                        textColor: progressColor,
                        trailColor: "#eee",
                      })}
                    />
                  </div>
                  <Card.Title className="text-dark fs-5">{testTitle}</Card.Title>
                  
                  <p>
                    <strong>Score:</strong> {score} / {totalMarks}
                  </p>
                  <p className="mb-1">
                    <strong>✅ Correct:</strong> {correctAnswers}
                  </p>
                  <p>
                    <strong>❌ Wrong:</strong> {wrongAnswers}
                  </p>
                  <Badge bg={rankColor} className="px-3 py-2 mt-2">
                    {percentage >= 90
                      ? "🎓 Expert"
                      : percentage >= 70
                      ? "🔥 Advanced"
                      : percentage >= 50
                      ? "👍 Intermediate"
                      : "📘 Beginner"}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
