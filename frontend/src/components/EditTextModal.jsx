import React, { useState } from "react";
import { Modal, Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
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

function EditTextModal(props) {
  const params = useParams();

  const [textElementText, setTextElementText] = useState(props.element.content);
  const [validElementText, setValidElementText] = useState(true);
  const [fontSize, setFontSize] = useState(props.element.fontSize);
  const [validFontSize, setValidFontSize] = useState(true);
  const [fontColour, setFontColour] = useState(props.element.fontColour);
  const [validFontColour, setValidFontColour] = useState(true);
  const [positionX, setPositionX] = useState(props.element.left);
  const [positionY, setPositionY] = useState(props.element.top);

  React.useEffect(() => {
    // Update the local position state whenever the store updates
    setPositionX(props.element.left);
    setPositionY(props.element.top);
  }, [props.element.left, props.element.top]);

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

  const handleEditText = () => {
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

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == params.deckid) {
        const updatedSlides = deck.slides.map((slide) => {
          if (slide.slideId == props.slide.slideId) {
            const updatedElements = slide.elements.map((element) => {
              if (element.elementId == props.element.elementId) {
                // Update the existing element properties
                return {
                  ...element,
                  content: textElementText,
                  fontSize: fontSize,
                  fontColour: fontColour,
                  left: positionX,
                  top: positionY,
                };
              }
              return element;
            });

            return {
              ...slide,
              elements: updatedElements,
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
            Edit Text Element
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            name="edit-text-element"
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
            name="edit-text-element-font"
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
            name="edit-text-element-colour"
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
          <CreateBtn
            name="edit-text-element-submit"
            variant="contained"
            onClick={handleEditText}
            disabled={!validElementText || !validFontSize || !validFontColour}
          >
            Update
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}

export default EditTextModal;
