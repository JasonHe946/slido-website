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

export default function NewPresentationModal(props) {
  const [presentationName, setPresentationName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [, setFinalImageUrl] = React.useState("");
  const fileInputRef = React.useRef(null);
  const { store } = React.useContext(StoreContext);

  const convertImgToBase64 = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Async - when reader success, set image url.
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

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const createNewPresentation = (store, imgUrl) => {
    const newStore = { ...store };

    if (!("decks" in newStore)) {
      newStore["decks"] = [];
    }

    newStore["decks"].push({
      id: generateRandomId(),
      title: presentationName,
      description: description,
      thumbnail: imgUrl,
      length: 1,
      isDefaultBackground: false,
      deckBackgroundType: "",
      deckSolidBackgroundColour: "#ffffff",
      deckGradientStartColour: "#ffffff",
      deckGradientEndColour: "#ffffff",
      deckBackgroundImage: "",
      slides: [
        {
          slideId: generateRandomId(),
          slideTitle: "first slide title",
          elements: [],
          fontFamily: "Arial",
          backgroundType: "",
          solidBackgroundColour: "#ffffff",
          gradientStartColour: "#ffffff",
          gradientEndColour: "#ffffff",
          backgroundImage: "",
        },
      ],
    });

    props.updateStore(newStore);
  };

  const handleDeleteFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input value
    }
  };

  const handleCreatePresentation = async () => {
    if (!presentationName) {
      setError(true);
    } else {
      let newImageUrl = "";
      if (!imageUrl && !file) {
        newImageUrl =
          "https://media.tarkett-image.com/large/TH_24567080_24594080_24596080_24601080_24563080_24565080_24588080_001.jpg"; // grey square as default
      } else if (imageUrl && file) {
        setErrorMessage("Only one field can be filled")
        setErrorModal(true)
        return
      } else {
        newImageUrl = imageUrl;
        if (file) {
          if (!file.type.startsWith("image/")) {
            setErrorMessage("Please upload a valid image file.")
            setErrorModal(true)
            setFile(null); // Clear the file if it’s not an image
            handleDeleteFile();
            return; // exit out of function
          }
          newImageUrl = await convertImgToBase64();
        }
      }

      setFinalImageUrl(newImageUrl); // sets imageurl, wait for function to finish
      setError(false);
      createNewPresentation(store, newImageUrl);
      //Clear all fields
      setDescription("");
      setPresentationName("");
      setImageUrl("");
      setFile(null);
      props.onClose();
    }
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
              Create Presentation
            </Typography>
            <TextField
              autoFocus
              required
              name="new-presentation-name"
              margin="dense"
              id="new-presentation-name"
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
              name="new-presentation-description"
              margin="dense"
              id="new-presentation-description"
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
                  name="new-presentation-image-url"
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


            <CreateBtn name="new-presentation-submit" variant="contained" onClick={handleCreatePresentation}>
              Create
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
