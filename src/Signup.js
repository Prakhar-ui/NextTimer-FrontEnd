import React, {  useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { Container as BootstrapContainer, Form, Button } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "./NavBar";
import axios from "axios";
import styled from "styled-components";

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

const StyledContainer = styled(BootstrapContainer)`
  border: 1px solid black;
  max-width: 90%;
  width: 400px;
  padding: 20px;
  margin: auto;
`;

const Signup = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function save(user) {
    user.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (parseInt(age) > 100 || parseInt(age) <= 0 || parseInt(age) === "") {
      alert("Please enter a valid age.");
      return;
    }

    // Name length validation
    if (name.length > 50) {
      alert("Name must be less than 50 characters.");
      return;
    }

    // Email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Password complexity validation
    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    const userData = {
      name: name,
      age: age,
      email: email,
      password: password,
    };

    try {
      // Make a request to your authentication endpoint
      const response = await axios.post("/registeruser", userData);
      console.log(userData);
      if (response.data === "Username already present") {
        throw new Error(
          "User already registered! Please login or forget password"
        );
      } else {
        alert("User registered successfully");
        navigate("/login");

        setName("");
        setAge("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      alert("Error registering User" + userData);
    }
  }

  return (
    <Wrapper>
      <NavBar />
      <StyledContainer className="my-5 p-5">
        <h4 className="text-center">Register</h4>
        <Form onSubmit={save}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
              style={{ width: "100%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </StyledContainer>
    </Wrapper>
  );
};

export default Signup;
