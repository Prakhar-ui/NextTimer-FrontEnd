import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReusableForm from "./ReusableForm";
import taskFormFields from "./taskFormFields";

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

const StyledContainer = styled(Container)`
  border: 1px solid black;
  max-width: 90%;
  width: 600px;
  margin: auto;
`;

const StyledForm = styled(Container)`
  max-width: 90%;
  width: 400px;
  margin: auto;
`;

const CreateTask = () => {
  const [authToken, setauthToken] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    if (storedToken) {
      setauthToken(storedToken);
    }
  }, [authToken]);

  const saveTask = async (event) => {
    event.preventDefault();

    const calcSeconds = hours * 3600 + minutes * 60 + seconds;

    const taskData = {
      name: taskName,
      description: taskDescription,
      seconds: calcSeconds,
    };
    console.log("Task Data:", taskData);
    try {
      await axios.post("/api/newTask", taskData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      navigate("/my-tasks");
      alert("Task created successfully");
    } catch (error) {
      console.error("Error while saving task:", error);
      alert("Error while saving task. Please try again.");
    }
  };

  const fields = taskFormFields.map((field) => {
    switch (field.name) {
      case "taskName":
        return { ...field, value: taskName, onChange: setTaskName };
      case "taskDescription":
        return {
          ...field,
          value: taskDescription,
          onChange: setTaskDescription,
        };
      case "hours":
        return { ...field, value: hours, onChange: setHours };
      case "minutes":
        return { ...field, value: minutes, onChange: setMinutes };
      case "seconds":
        return { ...field, value: seconds, onChange: setSeconds };
      default:
        return field;
    }
  });

  return (
    <Wrapper>
      <NavBar />
      <StyledContainer className="my-5 p-5">
        <h4 className="text-center">Create Task</h4>
        <StyledForm className="col-md-6 offset-md-3">
          <ReusableForm fields={fields} onSubmit={saveTask} />
        </StyledForm>
      </StyledContainer>
    </Wrapper>
  );
};

export default CreateTask;
