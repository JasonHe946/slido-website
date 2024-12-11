import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import { FormGroup, TextField, Button, styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const CenteredFormGroup = styled(FormGroup)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "300px",
  margin: "auto",
  marginTop: "10%",
  gap: "16px",
  padding: "20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
});

function RegisterPage({ setTokenFn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [registerErrorModal, setRegisterErrorModal] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [pwMatchModal, setpwMatchModal] = useState(false);

  const navigate = useNavigate();

  const register = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setpwMatchModal(true);
      return;
    }
    axios
      .post("http://localhost:5005/admin/auth/register", {
        email: email,
        password: password,
        name: name,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setTokenFn(response.data.token);
        navigate("/dashboard");
      })
      .catch((error) => {
        setRegisterErrorModal(true);
        setRegisterError(error.response.data.error);
      });
  };

  return (
    <>
      <IconButton
        style={{ fontSize: "0.8em" }}
        onClick={() => {
          navigate("/login");
        }}
      >
        <ArrowBackIcon />
        Back
      </IconButton>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ErrorModal
          open={registerErrorModal}
          handleClose={() => setRegisterErrorModal(false)}
          title={"Register Error"}
          description={registerError}
        />
        <ErrorModal
          open={pwMatchModal}
          handleClose={() => setpwMatchModal(false)}
          title={"Register Error"}
          description={"Passwords do not match"}
        />
        <form onSubmit={register}>
          <CenteredFormGroup>
            <h1>Register</h1>
            <TextField
              name="register-email"
              id="register-email-input"
              label="Email"
              type="email"
              value={email}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              name="register-password"
              id="register-password-input"
              label="Password"
              type="password"
              value={password}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <TextField
              name="register-confirm-password"
              id="register-confirm-password-input"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              variant="outlined"
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
            <TextField
              name="register-name"
              id="register-name-input"
              label="Name"
              type="text"
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button
              name="register-submit"
              type="submit"
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          </CenteredFormGroup>
        </form>
        <p>
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => {
              navigate("/login");
            }}
          >
            Go back to Login
          </a>
        </p>
      </div>
    </>
  );
}

export default RegisterPage;
