import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";

const Wrapper = styled(Row)`
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

const HomeTimer = ({ seconds }) => {
  const calculatedYears = Math.floor(seconds / (365 * 24 * 3600));
  const calculatedMonths = Math.floor(seconds / (30 * 24 * 3600));
  const calculatedDays = Math.floor(
    (seconds % (365 * 24 * 3600)) / (24 * 3600)
  );
  const calculatedHours = Math.floor((seconds % (24 * 3600)) / 3600);
  const calculatedMinutes = Math.floor((seconds % 3600) / 60);
  const calculatedSeconds = seconds % 60;

  // Set initial state using the calculated values
  const [years, setYears] = useState(calculatedYears);
  const [months, setMonths] = useState(calculatedMonths);
  const [days, setDays] = useState(calculatedDays);
  const [hours, setHours] = useState(calculatedHours);
  const [minutes, setMinutes] = useState(calculatedMinutes);
  const [currentSeconds, setSeconds] = useState(calculatedSeconds);
  const isRunning = true;

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        if (
          years === 0 &&
          months === 0 &&
          days === 0 &&
          hours === 0 &&
          minutes === 0 &&
          currentSeconds === 0
        ) {
          clearInterval(timer);
          window.location.reload();
        } else {
          if (
            months === 0 &&
            days === 0 &&
            hours === 0 &&
            minutes === 0 &&
            currentSeconds === 0
          ) {
            setYears((prevYears) => prevYears - 1);
            setMonths(11);
            setDays(isLeapYear(years) ? 29 : 28); // Update days based on leap year
            setHours(23);
            setMinutes(59);
            setSeconds(59);
          } else if (
            days === 0 &&
            hours === 0 &&
            minutes === 0 &&
            currentSeconds === 0 &&
            months > 0
          ) {
            setMonths((prevMonths) => prevMonths - 1);
            const daysInMonth = new Date(years, months, 0).getDate();
            setDays(daysInMonth);
            setHours(23);
            setMinutes(59);
            setSeconds(59);
          } else if (
            hours === 0 &&
            minutes === 0 &&
            currentSeconds === 0 &&
            days > 0
          ) {
            setDays((prevDays) => prevDays - 1);
            setHours(23);
            setMinutes(59);
            setSeconds(59);
          } else if (minutes === 0 && currentSeconds === 0 && hours > 0) {
            setHours((prevHours) => prevHours - 1);
            setMinutes(59);
            setSeconds(59);
          } else if (currentSeconds === 0 && minutes > 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          } else {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds, currentSeconds, minutes, hours, days, months, years]);

  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return (
    <Wrapper className="mx-0">
      <TimerText>
        {hours === 0 && years === 0 && days === 0 && (
          <span>
            {minutes} {minutes === 1 ? " minute" : " minutes"} and{" "}
            {currentSeconds} {currentSeconds === 1 ? " second" : " seconds"}
          </span>
        )}
        {hours > 0 && years === 0 && days === 0 && (
          <span>
            {hours} {hours === 1 ? "hour" : "hours"}
          </span>
        )}
        {years === 0 && months === 0 && days > 0 && (
          <span>
            {days} {days === 1 ? "day" : "days"}
          </span>
        )}
        {years === 0 && months > 0 && (
          <span>
            {months} {months === 1 ? "month" : "months"}
          </span>
        )}
        {years > 0 && (
          <span>
            {years} {years === 1 ? "year" : "years"}
          </span>
        )}
      </TimerText>
    </Wrapper>
  );
};

export default HomeTimer;
