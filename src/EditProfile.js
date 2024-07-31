import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Form, Button } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
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
  width: 600px;
  margin: auto;
`;

const StyledForm = styled(Container)`
  max-width: 90%;
  width: 400px;
  margin: auto;
`;

const EditProfile = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function getId() {
    return sessionStorage.getItem("globalId");
  }

  function getConfig() {
    const storedToken = sessionStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    };
    return config;
  }

  useEffect(() => {
    const apiUrl = `http://localhost:8080/getUserById?id=${getId()}`;

    axios
      .get(apiUrl, getConfig())
      .then((response) => {
        const user = response.data;
        setName(user.name);
        setAge(user.age);
        setEmail(user.email);
        setOldEmail(user.email);
      })
      .catch((error) => console.error(error));
  }, []);

  const userValidation = async () => {
    try {
      // Age validation
      if (parseInt(age) > 100 || parseInt(age) <= 0 || parseInt(age) === "") {
        alert("Please enter a valid age.");
        return false;
      }

      // Name length validation
      if (name.length > 50) {
        alert("Name must be less than 50 characters.");
        return false;
      }

      // Email format validation
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
      }

      // Password validation if a new password is provided
      if (password !== "") {
        const passwordCheckResult = await checkOldPassword();

        if (!passwordCheckResult) {
          alert("Incorrect Old Password");
          return false;
        }

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        if (password !== confirmPassword) {
          alert("New password and confirm password do not match.");
          return false;
        }

        if (!passwordRegex.test(password)) {
          alert(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
          );
          return false;
        }

        if (oldPassword === password) {
          alert("Old Password and New Password Cannot be the same.");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("User Validation Failed", error);
      throw error; // Propagate the error to the caller
    }
  };

  async function save(event) {
    event.preventDefault();

    const isValid = await userValidation();
    if (!isValid) {
      return;
    }

    try {
      const userData = {
        id: getId(),
        name: name,
        age: age,
        email: email,
        password: password,
      };

      await axios.post("/editUser", userData, getConfig());

      navigate("/");

      alert("User Edited successfully");
    } catch (error) {
      console.error("Error while editing User:", error);
    }
  }

  async function checkOldPassword() {
    try {
      const userData = {
        username: oldEmail,
        password: oldPassword,
      };

      const response = await axios.post("/login", userData);

      return response.status === 200;
    } catch (error) {
      console.error("Error during Old Password Validation", error);
      // Password check failed
    }
  }

  return (
    <Wrapper>
      <NavBar />
      <StyledContainer className="my-5 p-5">
        <h4 className="text-center">Edit Profile</h4>
        <StyledForm className="col-md-6 offset-md-3">
          <Form onSubmit={save}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Age</Form.Label>
              <Form.Control
                type="text"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Old Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </StyledForm>
      </StyledContainer>
    </Wrapper>
  );
};

export default EditProfile;
