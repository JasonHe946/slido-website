import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import { TextField, Button } from "@mui/material";
import { CenteredFormGroup } from "./RegisterPage";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function LoginPage({ setTokenFn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrorModal, setLoginErrorModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5005/admin/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setTokenFn(response.data.token);
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoginErrorModal(true);
        setLoginError(error.response.data.error);
      });
  };

  return (
    <>
      <IconButton
        style={{ fontSize: "0.8em" }}
        onClick={() => {
          navigate("/");
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
          open={loginErrorModal}
          handleClose={() => setLoginErrorModal(false)}
          title={"Login Error"}
          description={loginError}
        />
        <form onSubmit={login}>
          <CenteredFormGroup>
            <h1>Login</h1>
            <TextField
              id="login-email-input"
              label="Email"
              type="email"
              value={email}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              id="login-password-input"
              label="Password"
              type="password"
              value={password}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              name="login-submit"
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </CenteredFormGroup>
        </form>
        <p>
          Do not have an account?{" "}
          <a
            href="#"
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
