import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import HomeTimer from "./HomeTimer";
import ZenQuotes from "./ZenQuotes";
import axios from "axios";

// Styled components
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

const WelcomeHeading = styled.h1`
  position: absolute;
  margin-top: 10px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
  background: linear-gradient(to right, #fd18fe, purple);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ContainerStyle = styled(Container)`
  position: absolute;
  margin-top: 650px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
`;

const RowStyle = styled(Row)`
  background: linear-gradient(to right, #fd18fe, purple);
  -webkit-background-clip: text;
  background-clip: text;
  color: #fd18fe;
`;

const TimerWrapper = styled(Row)`
  text-align: center;
  margin: 0;
  align-items: stretch;
`;

const TimerText = styled(Col)`
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  white-space: nowrap;
`;

const Home = () => {
  const [authToken, setauthToken] = useState(null);
  const [age, setAge] = useState(null);
  const [RemainingSecondsforRetirement, setRemainingSecondsforRetirement] =
    useState(null);
  const [globalId, setglobalId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (!authToken) {
      const storedToken = sessionStorage.getItem("authToken");
      const storedglobalId = sessionStorage.getItem("globalId");
      if (storedToken) {
        setauthToken(storedToken);
      }

      if (storedglobalId) {
        setglobalId(storedglobalId);
      }
    }
  }, [authToken]);

  

  useEffect(() => {

    const setRetirement = async (age) => {
      setRemainingSecondsforRetirement(
        calculateRemainingSecondsforRetirement(age)
      );
    };

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the authToken in the Authorization header
      },
    };

    // Check if globalId is non-null and non-empty
    if (authToken && globalId) {
      const apiUrl = `http://localhost:8080/getUserById?id=${globalId}`;

      axios
        .get(apiUrl, config)
        .then((response) => {
          const user = response.data;
          setName(user.name);
          setAge(user.age);
          setRetirement(user.age);
        })
        .catch((error) => console.error(error));
    }
  }, [ authToken, globalId]);

  const calculateRemainingSecondsforRetirement = (myAge) => {
    const retirementAge = 60;
    const yearsRemaining = retirementAge - myAge;
    const remainingSeconds = yearsRemaining * 365 * 24 * 60 * 60;
    return remainingSeconds > 0 ? remainingSeconds : 0;
  };

  const calculateRemainingSecondsforHour = () => {
    const now = new Date();
    const endOfHour = new Date(now);
    endOfHour.setMinutes(59, 59, 999);
    return Math.floor((endOfHour - now) / 1000);
  };

  const calculateRemainingSecondsforDay = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return Math.floor((endOfDay - now) / 1000);
  };

  const calculateRemainingSecondsforMonth = () => {
    const now = new Date();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    return Math.floor((endOfMonth - now) / 1000);
  };

  const calculateRemainingSecondsforYear = () => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
    return Math.floor((endOfYear - now) / 1000);
  };

  return (
    <Wrapper>
      <NavBar />
      <WelcomeHeading className="welcome-heading">
        Hi {name ? name : "Guest"}! Welcome to NextTimer
      </WelcomeHeading>
      <ZenQuotes />
      <ContainerStyle className="container-style">
        <RowStyle className="row-style">
          {RemainingSecondsforRetirement !== null ? (
            <>
              {age !== null ? (
                <Col className="text-nowrap">
                  <div>
                    <HomeTimer seconds={RemainingSecondsforRetirement} />
                    Remaining Till Retirement
                  </div>
                </Col>
              ) : (
                <Col className="text-nowrap">
                  <div>
                    <TimerWrapper className="mx-0">
                      <TimerText>
                        <span>42 years</span>
                      </TimerText>
                    </TimerWrapper>
                    Remaining Till Retirement (With Default age 18)
                  </div>
                </Col>
              )}
            </>
          ) : (
            <Col className="text-nowrap">
              <div>
                <TimerWrapper className="mx-0">
                  <TimerText>
                    <span>42 years</span>
                  </TimerText>
                </TimerWrapper>
                Remaining Till Retirement (With Default age 18)
              </div>
            </Col>
          )}
          <Col className="text-nowrap">
            <div>
              <HomeTimer seconds={calculateRemainingSecondsforYear()} />
              Remaining Till Next Year
            </div>
          </Col>
          <Col className="text-nowrap">
            <div>
              <HomeTimer seconds={calculateRemainingSecondsforMonth()} />
              Remaining Till Next Month
            </div>
          </Col>
          <Col className="text-nowrap">
            <div>
              <HomeTimer seconds={calculateRemainingSecondsforDay()} />
              Remaining Till Next Day
            </div>
          </Col>
          <Col className="text-nowrap">
            <div>
              <HomeTimer seconds={calculateRemainingSecondsforHour()} />
              Remaining Till Next Hour
            </div>
          </Col>
        </RowStyle>
      </ContainerStyle>
    </Wrapper>
  );
};

export default Home;
