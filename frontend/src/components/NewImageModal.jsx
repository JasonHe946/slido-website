import { useState, useRef } from "react";
import { Modal, Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Slider } from "@mui/material";
import { useParams } from "react-router-dom";

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

export default function NewImageModal(props) {
  const params = useParams();

  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [description, setDescription] = useState("");
  const [validDescription, setValidDescription] = useState(true);

  const [imageURL, setImageURL] = useState("");
  const [, setImageFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const fileInputRef = useRef(null);

  const convertFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    reader.onerror = () => {
      console.error("Error reading file");
    };
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL("");
      convertFileToBase64(file);
    }
  };

  const handleURLChange = (e) => {
    const url = e.target.value;
    setImageURL(url);
    setBase64Image(url);
    setImageFile(null); // Clear file state
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the actual file input
    }
  };

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const validateDescription = (description) => {
    if (description === "") {
      setValidDescription(false);
    } else {
      setValidDescription(true);
    }
    setDescription(description);
  };

  const handleCreateImage = () => {
    const newStore = { ...props.store };
    const newElement = {
      elementId: generateRandomId(),
      alt: description,
      type: "image",
      src: base64Image,
      width: width,
      height: height,
      top: 0,
      left: 0,
    };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == params.deckid) {
        // Find the correct slide in the deck
        const updatedSlides = deck.slides.map((slide) => {
          if (slide.slideId === props.slideId) {
            return {
              ...slide,
              elements: [...slide.elements, newElement], // Add the new element
            };
          }
          return slide;
        });

        return {
          ...deck,
          slides: updatedSlides,
        };
      }
      return deck;
    });

    newStore.decks = updatedDecks;
    props.updateStore(newStore);

    // clear all fields
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setDescription("");
    setImageURL("");
    setWidth(50);
    setHeight(50);
    props.onClose();
  };

  return (
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
            Create Image Element
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-image-element-description"
            id="new-image-element-description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => {
              validateDescription(e.target.value);
            }}
            helperText={validDescription ? "" : "This field can't be empty"}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-image-element-imageURL"
            id="new-image-element-imageURL"
            label="Image url"
            type="url"
            fullWidth
            variant="standard"
            value={imageURL}
            onChange={handleURLChange} // file object
            helperText="Enter an image url OR upload a file"
          />

          <input
            type="file"
            accept="image/*"
            id="image-file-input"
            ref={fileInputRef}
            style={{ marginTop: "16px", marginBottom: "8px" }}
            onChange={handleFileChange}
          />
          <br />
          <br />

          <Typography gutterBottom>Width (%): {width}</Typography>
          <Slider
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            aria-labelledby="width-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            min={0}
            max={100}
          />
          <Typography gutterBottom>Height (%): {height}</Typography>
          <Slider
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            aria-labelledby="height-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            min={0}
            max={100}
          />
          <CreateBtn
            name="create-new-image-element-submit"
            variant="contained"
            onClick={handleCreateImage}
            disabled={!description || !base64Image}
          >
            Create
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}
