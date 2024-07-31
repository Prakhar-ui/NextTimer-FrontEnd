import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";
import NavBar from "./NavBar";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import axios from "axios";

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
  background-color: #3ecf67;
`;

const TimerContainer = styled.div`
  text-align: center;
`;

const Timer = styled.div`
  margin-top: 320px;
  max-width: 90%;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Description = styled.div`
  margin-top: 15vw;
  max-width: 90%;
  width: 2000px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Options = styled.div`
  max-width: 90%;
  margin: auto;
`;

const BlackSquareDesc = styled.div`
  max-width: 90%;
  background-color: #000;
  margin: 10px;
  display: inline-block;
  border-radius: 1vw;
  font-size: 3vw;
`;

const StyledColDesc = styled.div`
  max-width: 90%;
  font-weight: bold;
  color: #fff;
  display: inline-block;
`;

const BlackSquare = styled.div`
  max-width: 90%;
  background-color: #000;
  margin: 1vw;
  display: inline-block;
  border-radius: 1vw;
  font-size: 18vw;
`;

const StyledCol = styled.div`
  max-width: 90%;
  font-size: 20vw;
  font-weight: bold;
  color: #fff;
  display: inline-block;
`;

const MyTaskTimer = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [name, setName] = useState("");
  const [timerType, setTimerType] = useState("");
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [currentSeconds, setCurrentSeconds] = useState();
  const [isRunning, setIsRunning] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const handleBeforeUnload = (event) => {
      postTimer();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    if (task == null) {
      const apiUrl = `http://localhost:8080/api/getTask/${id}`;

      axios
        .get(apiUrl, getConfig())
        .then((response) => {
          const task = response.data;
          setTask(task);
          setName(task.name);
          setTimerType(task.timerType);
          setHours(Math.floor(task.seconds / 3600));
          setMinutes(Math.floor((task.seconds % 3600) / 60));
          setCurrentSeconds(task.seconds % 60);
        })
        .catch((error) => console.error(error));
    }

    if (isRunning) {
      timer = setInterval(() => {
        if (hours === 0 && minutes === 0 && currentSeconds === 0) {
          postTimer();
          alert("Timer Finished");
          navigate(`/my-tasks`, { replace: true });
          clearInterval(timer);
          setIsRunning(false);
        } else {
          if (minutes === 0 && currentSeconds === 0) {
            setHours((prevHours) => prevHours - 1);
            setMinutes(59);
            setCurrentSeconds(59);
          } else if (currentSeconds === 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setCurrentSeconds(59);
          } else {
            setCurrentSeconds((prevSeconds) => prevSeconds - 1);
          }
        }
      }, 1000);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(timer);
    };
  }, );

  const formatTime = (value) => String(value).padStart(2, "0");

  const handleStopTimer = async () => {
    try {
      await postTimer();
      navigate(`/my-tasks`, { replace: true });
    } catch (error) {
      console.error("Error Navigating to My Tasks", error);
    }
  };

  const handlePauseTimer = () => {
    if (isRunning) {
      postTimer();
      setIsRunning(false);
    }
  };

  const handlePlayTimer = () => {
    if (!isRunning) {
      postTimer();
      setIsRunning(true);
    }
  };

  const postTimer = async () => {
    const timerData = {
      taskId: id,
      seconds: hours * 3600 + minutes * 60 + currentSeconds,
    };

    try {
      await axios.post(
        "http://localhost:8080/api/postSeconds",
        timerData,
        getConfig()
      );
    } catch (error) {
      console.error("Error posting timer data:", error);
      throw error;
    }
  };

  const getConfig = () => {
    const storedToken = sessionStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    };
    return config;
  };

  return (
    <Wrapper>
      <NavBar />
      <TimerContainer>
        <Description>
          <StyledColDesc>
            <BlackSquareDesc>
              <p>Name: {name}</p>
            </BlackSquareDesc>
          </StyledColDesc>
          <StyledColDesc>
            <BlackSquareDesc>
              <p>Timer-Type: {timerType}</p>
            </BlackSquareDesc>
          </StyledColDesc>
        </Description>

        <Timer>
          <Row className="text-center mx-0 d-flex align-items-stretch">
            <div className="text-nowrap">
              <StyledCol>
                <BlackSquare>{formatTime(hours)[0]}</BlackSquare>
              </StyledCol>
              <StyledCol>
                <BlackSquare>{formatTime(hours)[1]}</BlackSquare>
              </StyledCol>
              <StyledCol>:</StyledCol>
              <StyledCol>
                <BlackSquare>{formatTime(minutes)[0]}</BlackSquare>
              </StyledCol>
              <StyledCol>
                <BlackSquare>{formatTime(minutes)[1]}</BlackSquare>
              </StyledCol>
              <StyledCol>:</StyledCol>
              <StyledCol>
                <BlackSquare>{formatTime(currentSeconds)[0]}</BlackSquare>
              </StyledCol>
              <StyledCol>
                <BlackSquare>{formatTime(currentSeconds)[1]}</BlackSquare>
              </StyledCol>
            </div>
          </Row>
        </Timer>

        <Options>
          <Row className="text-center mx-0 mt-3">
            <Col>
              <Button variant="success" onClick={handlePlayTimer}>
                <FaPlay />
              </Button>
            </Col>
            <Col>
              <Button variant="warning" onClick={handlePauseTimer}>
                <FaPause />
              </Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={handleStopTimer}>
                Take a Break!
                <FaStop />
              </Button>
            </Col>
          </Row>
        </Options>
      </TimerContainer>
    </Wrapper>
  );
};

export default MyTaskTimer;
