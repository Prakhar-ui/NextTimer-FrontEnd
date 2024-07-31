import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import navLogo from './Assets/logo.png';

const StyledNavbar = styled(Navbar)`
  padding-top: 0;
  padding-bottom: 0;
`;

const StyledContainer = styled(Container)`
  &&& {
    padding-left: 0;
  }
`;

const NavBarBrand = styled(Link)`
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
`;

const NavBarImg = styled.img`
  margin-right: 10px;

  @media (max-width: 767px) {
    margin: 0 auto;
    display: block;
  }
`;

const NavLinkStyle = {
  color: "#fd18fe",
  fontSize: "1.25rem",
  margin: 0,
  padding: 0,
  flexGrow: 1,
  textAlign: "center",
};

const EqualSpaceNav = styled(Nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const NavBar = () => {
  const navigate = useNavigate();

  const [globalId, setglobalId] = useState("");
  const [authToken, setauthToken] = useState("");

  const handleSignout = () => {
    // Perform signout logic here
    setauthToken(false);
    setglobalId("");

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("globalId");

    // You may want to redirect the user or perform other actions upon successful authentication
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = sessionStorage.getItem("authToken");
      const storedglobalId = sessionStorage.getItem("globalId");

      if (storedToken && storedglobalId) {
        setauthToken(storedToken);
        setglobalId(storedglobalId);
      }
    };

    fetchData();
  }, []);

  return (
    <StyledNavbar bg="dark" expand="lg" variant="dark">
      <StyledContainer fluid>
        <NavBarBrand as={Link} to="/" className="navbar-brand">
          <NavBarImg src={navLogo} width="100px" alt="Background" />
        </NavBarBrand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <EqualSpaceNav className="ms-auto">
            {authToken && globalId && globalId.trim() !== "" ? (
              <>
                <Nav.Link as={Link} to="/my-tasks" style={NavLinkStyle}>
                  My Tasks
                </Nav.Link>
                <Nav.Link as={Link} to="/create-task" style={NavLinkStyle}>
                  Create New Task
                </Nav.Link>
                <Nav.Link as={Link} to="/edit-profile" style={NavLinkStyle}>
                  Edit Profile
                </Nav.Link>
                <Nav.Link onClick={handleSignout} style={NavLinkStyle}>
                  Signout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" style={NavLinkStyle}>
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" style={NavLinkStyle}>
                  Login
                </Nav.Link>
              </>
            )}
          </EqualSpaceNav>
        </Navbar.Collapse>
      </StyledContainer>
    </StyledNavbar>
  );
};

export default NavBar;
