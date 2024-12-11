import { useState } from "react";
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

export default function NewTextModal(props) {
  const params = useParams();

  const [textElementText, setTextElementText] = useState("");
  const [validElementText, setValidElementText] = useState(true);
  const [fontSize, setFontSize] = useState("");
  const [validFontSize, setValidFontSize] = useState(true);
  const [fontColour, setFontColour] = useState("");
  const [validFontColour, setValidFontColour] = useState(true);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const validateElementText = (text) => {
    if (text === "") {
      setValidElementText(false);
    } else {
      setValidElementText(true);
    }
    setTextElementText(text);
  };

  const validateFontSize = (fontSize) => {
    if (fontSize <= 0 || fontSize === "") {
      setValidFontSize(false);
    } else {
      setValidFontSize(true);
    }
    setFontSize(fontSize);
  };

  const validateFontColour = (fontColour) => {
    const hex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    if (!hex.test(fontColour)) {
      setValidFontColour(false);
    } else {
      setValidFontColour(true);
    }
    setFontColour(fontColour);
  };

  const handleCreateText = () => {
    let isValid = true;
    if (textElementText === "") {
      setValidElementText(false);
      isValid = false;
    }
    if (fontSize <= 0 || fontSize === "") {
      setValidFontSize(false);
      isValid = false;
    }
    const hex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    if (!hex.test(fontColour)) {
      setValidFontColour(false);
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    const newStore = { ...props.store };
    const newElement = {
      elementId: generateRandomId(),
      type: "text",
      content: textElementText,
      fontSize: fontSize,
      fontColour: fontColour,
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
    setTextElementText("");
    setFontSize("");
    setFontColour("");
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
            Create Text Element
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-text-element"
            id="new-text-element-text"
            label="Text"
            type="text"
            fullWidth
            variant="standard"
            value={textElementText}
            onChange={(e) => {
              validateElementText(e.target.value);
            }}
            helperText={validElementText ? "" : "This field can't be empty"}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-text-element-font"
            id="new-text-element-font"
            label="Font size (em)"
            type="number"
            fullWidth
            variant="standard"
            value={fontSize}
            onChange={(e) => {
              validateFontSize(e.target.value);
            }}
            helperText={validFontSize ? "" : "Must be positive number"}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-text-element-colour"
            id="new-text-element-colour"
            label="Font Colour"
            type="text"
            fullWidth
            variant="standard"
            value={fontColour}
            onChange={(e) => {
              validateFontColour(e.target.value);
            }}
            helperText={
              validFontColour ? "" : "Must be in the form #XXXXXX or #XXX"
            }
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
            name="create-new-text-element-submit"
            variant="contained"
            onClick={handleCreateText}
            disabled={!validElementText || !validFontSize || !validFontColour}
          >
            Create
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}
