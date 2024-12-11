import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { StoreContext } from "./StoreContext";
import ConfirmationModal from "./ConfirmationModal";
import DashboardEditPresentationModal from "./DashboardEditPresentationModal";

export default function DashboardCard(props) {
  const { store } = React.useContext(StoreContext);
  const navigate = useNavigate();
  const [anchorPosition, setAnchorPosition] = React.useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState(false)
  const [editDeck, setEditDeck] = React.useState(false)
  const [currentDeck, setCurrentDeck] = React.useState(null)

  React.useEffect (() => {
    if (store && store.decks) {
      const deck = store.decks.find((deck => deck.id == props.id))
      if (deck) {
        setCurrentDeck(deck) // all our deck information
      }
    }
  }, [store])

  const handleContextMenu = (event) => {
    event.preventDefault();
    setAnchorPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleClose = () => {
    setAnchorPosition(null);
  };

  const handleEditDetails = () => {
    handleClose();
    setEditDeck(true)
  };

  const handleDeletePresentation = () => {
    handleClose();
    const newStore = { decks: [] };
    //Filter the stores to remove deck id

    const updatedStore = store.decks.filter((deck) => {
      return deck.id != props.id;
    });

    newStore["decks"].push(...updatedStore);

    //Update the backend store
    props.updateStore(newStore);

    // Close modal
    setDeleteConfirmModal(false);
  };

  return (
    <>
      <Card
        className="presentation-card"
        sx={{
          minWidth: 100,
          maxWidth: 345,
          width: "100%",
          aspectRatio: "2/1",
          marginBottom: "10px",
        }}
        onContextMenu={handleContextMenu}
      >
        <CardActionArea
          sx={{ height: "100%", width: "100%" }}
          onClick={() => {
            navigate(`/deck/${props.id}`);
          }}
        >
          <CardMedia
            height="50%"
            component="img"
            image={props.thumbnail}
            alt="slide thumbnail"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Description:{props.description}, Length: {props.length}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Menu
        open={Boolean(anchorPosition)}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          anchorPosition !== null
            ? { top: anchorPosition.mouseY, left: anchorPosition.mouseX }
            : undefined
        }
      >
        <MenuItem 
          sx={{
            color: "black",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
            margin: "5px",
          }}
          onClick={handleEditDetails}>Edit Details</MenuItem>
        <MenuItem 
          sx={{
            color: "red",
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            },
            margin: "5px",
          }}
          onClick={()=>{setDeleteConfirmModal(true)}}>Delete Presentation</MenuItem>
      </Menu>
      <ConfirmationModal
        open={deleteConfirmModal}
        onClick={() => {
          handleDeletePresentation();
        }}
        onClose={() => {
          setDeleteConfirmModal(false);
          handleClose();
        }}
        title={"Delete Presentation"}
        description={"Are you sure you want to delete this presentation?"}
      ></ConfirmationModal>
      <DashboardEditPresentationModal
        open={editDeck}
        onClose={()=>{setEditDeck(false)}}
        currentDeck={currentDeck}
        updateStore={props.updateStore}
      ></DashboardEditPresentationModal>
    </>
  );
}
