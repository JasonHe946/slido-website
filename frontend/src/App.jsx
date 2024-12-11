import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { Button } from "@mui/material";
import { styled } from "@mui/material";

import { StoreProvider, StoreContext } from "./components/StoreContext";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Logout from "./components/Logout";
import DashboardPage from "./components/DashboardPage";
import DeckPage from "./components/DeckPage";
import PreviewSlidePage from "./components/PreviewSlidePage";
import SlideRearrangePage from "./components/SlideRearrangePage";

const DashboardBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "light blue",
  width: "100px",
  marginLeft: "10px",
  marginBottom: "10px",
  fontSize: "0.8em",
});

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return (
    <StoreProvider>
      <BrowserRouter>
        <MainApp token={token} setToken={setToken} />
      </BrowserRouter>
    </StoreProvider>
  );
}

function MainApp({ token, setToken }) {
  const { setStore } = useContext(StoreContext);

  const updateStore = (newStore) => {
    axios
      .put(
        "http://localhost:5005/store",
        {
          store: newStore,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setStore(newStore);
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  // Fetch the token from localStorage when the app loads
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Fetch the store when the token changes
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5005/store", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setStore(response.data.store);
        })
        .catch((error) => {
          console.error("Error fetching store:", error.response?.data?.error);
        });
    }
  }, [token, setStore]);

  const isPreviewPage = location.pathname === "/preview";

  return (
    <div id="app-div" style={{height:"100vh", display: "flex", flexDirection: "column"}}>
      {!isPreviewPage && token && (
        <div id="app-header" style={{display: "flex", width: "100%", height: "7%" ,justifyContent: "space-between", alignContent: "center", backgroundColor: "#233743"}}>
          <DashboardBtn name="dashboard-btn" component={Link} to="/dashboard" variant="contained" color="primary">
            Dashboard
          </DashboardBtn>
          <Logout token={token} setToken={setToken} />
        </div>
      )}
      <div style={{height:"100%"}}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/register"
            element={<RegisterPage setTokenFn={setToken} />}
          />
          <Route path="/login" element={<LoginPage setTokenFn={setToken} />} />
          <Route path="/dashboard" element={<DashboardPage updateStore={updateStore} token={token} />} />
          <Route path="/deck/:deckid" element={<DeckPage updateStore={updateStore} token={token} />} />
          <Route
            path="/preview"
            element={<PreviewSlidePage updateStore={updateStore} token={token} />}
          />
          <Route
            path="/rearrange/:deckid"
            element={
              <SlideRearrangePage updateStore={updateStore} token={token} />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
