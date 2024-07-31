import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "./NavBar";
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
  background: linear-gradient(to bottom right, #ffd9fb, white);
`;

const StyledContainer = styled(Container)`
  border: 1px solid black;
  max-width: 90%;
  width: 400px;
  padding: 20px;
  margin: auto;
`;

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSignIn(event) {
    event.preventDefault();

    const userData = {
      username,
      password,
    };

    try {
      const response = await axios.post("/generateToken", userData);

      const token = response.data;

      // Store the token in sessionStorage
      sessionStorage.setItem("authToken", token);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const apiUrl = `http://localhost:8080/getUserByUsername?username=${username}`;

        const response = await axios.get(apiUrl, config);

        const user = response.data;

        // Store the globalId in sessionStorage
        sessionStorage.setItem("globalId", user.id);

        navigate("/");
      } catch (error) {
        console.error("Error while setting id", error);
      }

      setUsername("");
      setPassword("");

      // You may want to redirect the user or perform other actions upon successful authentication
    } catch (error) {
      // Handle authentication failure
      console.error("Authentication failed:", error);
      alert("Authentication failed");
    }
  }

  return (
    <Wrapper>
      <NavBar />
      <StyledContainer className="my-5 p-5">
        <h4 className="text-center">Sign In</h4>
        <Form onSubmit={handleSignIn}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </div>
        </Form>
      </StyledContainer>
    </Wrapper>
  );
};

export default Signin;
