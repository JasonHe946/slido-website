import axios from "axios";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";

const LogoutBtn = styled(Button)({
  marginTop: "10px",
  marginRight: "10px",
  marginBottom: "10px",
  backgroundColor: "grey",
  width: "100px",
  fontSize: "0.8em",
});


const Logout = ({ token, setToken }) => {
  const navigate = useNavigate();
  const logoutFn = () => {
    axios
      .post(
        "http://localhost:5005/admin/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };
  return <LogoutBtn name="logout-btn" variant="contained" onClick={logoutFn}>Logout</LogoutBtn>;
};

export default Logout;
