import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { faEdit, faTrash, faPlay } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  padding-left: 0;
  z-index: -1;
  background: linear-gradient(to bottom right, #ffd9fb, white);
`;

const TableCell = styled.td`
  max-width: 200px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  text-align: justify;
`;

const StyledContainer = styled(Container)`
  border: 1px solid black;
  max-width: 90%;
  width: 2000px;
  padding: 20px;
  margin: auto;
`;

const StyledTable = styled(Table)`
  background: white;
`;

const MyTasks = () => {
  const [task, setTask] = useState(null);
  const [serialNumber, setSerialNumber] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = "http://localhost:8080/api/myTasks";
    axios
      .get(apiUrl, getConfig())
      .then((response) => {
        const task = response.data;
        setTask(task);
        setSerialNumber(1);
      })
      .catch((error) => console.error(error));
  }, []);

  const getConfig = () => {
    const storedToken = sessionStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    };
    return config;
  };

  const handleDeleteClick = (id) => {
    const deleteTaskapiUrl = `http://localhost:8080/api/deleteTask/${id}`;

    axios
      .delete(deleteTaskapiUrl, getConfig())
      .then(() => {
        alert("Task deleted successfully");
        window.location.reload();
      })
      .catch((error) => {
        // Log the detailed error information
        console.error("Error:", error.response);
      });
  };

  const handleEditTask = (id) => {
    navigate(`/edit-task/${id}`, { replace: true });
  };

  const handlePlayTimer = (id) => {
    navigate(`/task-timer/${id}`, { replace: true });
  };

  const formatDuration = ({ seconds }) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
      if (minutes > 0) {
        if (remainingSeconds > 0) {
          return `${hours} hours ${minutes} minutes ${remainingSeconds} seconds`;
        }
        return `${hours} hours ${minutes} minutes`;
      }
      if (remainingSeconds > 0) {
        return `${hours} hours ${remainingSeconds} seconds`;
      }
      return `${hours} hours`;
    }

    if (minutes > 0) {
      if (remainingSeconds > 0) {
        return `${minutes} minutes ${remainingSeconds} seconds`;
      }
      return `${minutes} minutes`;
    }

    if (remainingSeconds > 0) {
      return `${remainingSeconds} seconds`;
    }

    return "0 seconds";
  };

  return (
    <Wrapper>
      <NavBar />
      <StyledContainer className="my-5 col-md-8">
        <StyledTable striped bordered hover responsive className="text-nowrap">
          <thead className="text-center">
            <tr>
              <th>No. </th>
              <th style={{ width: "40px" }}>Timer</th>
              <th>Name</th>
              <th>Description</th>
              <th>Timer-Type</th>
              <th>Duration</th>
              <th>Edit Task</th>
              <th>Delete Task</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {task &&
              task.map((t, index) => (
                <tr key={t.id}>
                  <td>{serialNumber + index}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handlePlayTimer(t.id)}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  </td>
                  <td>{t.name}</td>
                  <TableCell>{t.description}</TableCell>
                  <td>{t.timerType}</td>

                  <td>{formatDuration({ seconds: t.seconds })}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditTask(t.id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(t.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </StyledTable>
      </StyledContainer>
    </Wrapper>
  );
};

export default MyTasks;
