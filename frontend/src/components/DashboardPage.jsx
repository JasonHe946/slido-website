import React from "react";
import { styled, TextField, IconButton  } from "@mui/material";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import NewPresentationModal from "./NewPresentationModal";
import DashboardCard from "./DashboardCard";
import { StoreContext } from "./StoreContext";
import boxImg from '../assets/box.png';

const CardContainer = styled('div') ({
  height: "78vh",
  minWidth: "345px",
  overflowY: "auto",
  marginTop: "20px",
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#F0F4F8",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
})

const NewDeckBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "green",
  width: "200px",
  fontSize: "0.8em",
});

const DashboardPage = ({updateStore}) => {

  const [createPresentation, setCreatePresentation] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { store } = React.useContext(StoreContext);

  // Filter presentations by title based on the search query and return all decks if no search query
  const filteredDecks = store.decks
    ? store.decks.filter((deck) =>
      searchQuery.trim() === "" || deck.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#B3CAD8", height: "100%"}}>
      <NewDeckBtn name="new-presentation-btn"variant="contained" onClick={() => setCreatePresentation(true)}>New Deck</NewDeckBtn>{" "}
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", width:"300px"}}>
        <TextField
          variant="standard"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginTop: "20px", width: "300px" }}
        />
        {searchQuery && (
          <IconButton onClick={handleClearSearch}>
            <ClearIcon />
          </IconButton>
        )}

      </div>
      <CardContainer>
        {(filteredDecks.length> 0) ? (
          filteredDecks.map((deck) => {
            return (
              <DashboardCard
                key={deck.id}
                id={deck.id}
                title={deck.title}
                description={deck.description}
                thumbnail={deck.thumbnail}
                length={deck.slides.length}
                updateStore={updateStore}
              />
            );
          })
        ) : (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <p style={{fontSize: "1.3em"}}>It looks empty in here!</p>
            <img style={{height: "200px"}} alt="empty box" src={boxImg}/>
          </div>
        )}
      </CardContainer>
      <NewPresentationModal
        open={createPresentation}
        onClose={() => setCreatePresentation(false)}
        store={store}
        updateStore={updateStore}
      ></NewPresentationModal>
    </div>
  );
};

export default DashboardPage;
