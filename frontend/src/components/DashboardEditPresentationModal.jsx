import React, { useState } from "react";
import { Modal, Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Form from "react-bootstrap/Form";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorModal from "./ErrorModal";

import { StoreContext } from "./StoreContext";

const CreateBtn = styled(Button)({
  marginTop: "20px",
  fontSize: "0.85em",
  width: "25%",
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const StyledFormControl = styled(Form.Control)({
  width: "100%",
  marginTop: "5px",
});

export default function DashboardEditPresentationModal(props) {
  const [presentationName, setPresentationName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [finalImageUrl, setFinalImageUrl] = React.useState("");
  const fileInputRef = React.useRef(null);
  const { store } = React.useContext(StoreContext);

  React.useEffect(() => {
    if (props.currentDeck) {
      setPresentationName(props.currentDeck.title)
      setDescription(props.currentDeck.description)
      setFinalImageUrl(props.currentDeck.thumbnail)
      setImageUrl(""); // Clear the image URL field
      setFile(null); // Clear any uploaded file
    }
  }, [store, props.currentDeck])

  const convertImgToBase64 = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        setErrorMessage("Failed to read image file")
        setErrorModal(true);
        reject();
      };
    });
  };


  const handleDeleteFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input value
    }
  };

  const editPresentation = (url) => {

    const newStore = { decks: [] };
    const updatedDecks = store.decks.map((deck) => {
      if (deck.id == props.currentDeck.id) {
        return { ...deck,
          title: presentationName,
          description: description,
          thumbnail: url,
        };
      }
      return deck; // Keep other decks unchanged
    });
    newStore["decks"].push(...updatedDecks);

    //Update the backend store
    props.updateStore(newStore);
  }

  const handleEditPresentation = async () => {
  // Check if the presentation name is empty
    if (!presentationName) {
      setError(true);
      return;
    }

    let newImageUrl = "";

    // Case 1: If no new image URL or file is provided, keep the existing thumbnail
    if (!imageUrl && !file) {
      newImageUrl = finalImageUrl; // Keep the current thumbnail
    } else if (imageUrl && file) {
      setErrorMessage("Only one field can be filled");
      setErrorModal(true);
      return;
    } else {
    // Case 2: Use the new image URL if provided
      if (imageUrl) {
        newImageUrl = imageUrl;
      }

      // Case 3: Convert the uploaded file to a base64 string
      if (file) {
        if (!file.type.startsWith("image/")) {
          setErrorMessage("Please upload a valid image file.");
          setErrorModal(true);
          setFile(null); // Clear the invalid file
          handleDeleteFile();
          return;
        }
        newImageUrl = await convertImgToBase64();
      }
    }

    // Set the final image URL and update the store
    setFinalImageUrl(newImageUrl);
    setError(false);

    // Update the store with the new presentation details
    editPresentation(newImageUrl);

    // Close the modal and clear fields
    setImageUrl("");
    setFile(null);
    props.onClose();
  };

  return (
    <>
      <div>
        <Modal
          open={props.open}
          onClose={props.onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <IconButton
              onClick={props.onClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Presentation Details
            </Typography>
            <TextField
              autoFocus
              required
              name="edit-presentation-name"
              margin="dense"
              id="edit-presentation-name"
              label="Presentation Name"
              type="text"
              fullWidth
              variant="standard"
              value={presentationName}
              onChange={(e) => {
                setPresentationName(e.target.value);
                setError(false);
              }}
              error={error}
              helperText={error ? "This field can't be empty" : ""}
            />

            <TextField
              autoFocus
              name="edit-presentation-description"
              margin="dense"
              id="edit-presentation-description"
              label="Presentation Description"
              type="text"
              fullWidth
              variant="standard"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(false);
              }}
            /> <br/>
            <br/>
            <Form
              sx={{ display: "flex", flexDirection: "column" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <Form.Group>
                <Form.Label>Image URL</Form.Label>
                <StyledFormControl
                  name="edit-presentation-image-url"
                  type="text"
                  placeholder="https://www.example.com/image.jpg?v=123456789"
                  onChange={(e) => setImageUrl(e.target.value)} // file object
                />
              </Form.Group>
              <br />
              OR <br />
              <br />
              <Form.Group>
                <Form.Label>Upload File</Form.Label>
                <StyledFormControl
                  style={{ border: "1px solid grey", borderRadius: "4px" }}
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && (
                  <IconButton onClick={handleDeleteFile}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Form.Group>
            </Form>


            <CreateBtn name="edit-presentation-submit" variant="contained" onClick={handleEditPresentation}>
              Confirm
            </CreateBtn>
          </Box>
        </Modal>
      </div>
      <ErrorModal
        open={errorModal}
        handleClose={()=>{setErrorModal(false)}}
        title={"Error"}
        description={errorMessage}
      >
      </ErrorModal>
    </>
  );
}
