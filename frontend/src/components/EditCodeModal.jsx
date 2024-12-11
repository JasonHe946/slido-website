import React, { useState } from "react";
import {
  Modal,
  Button,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import flourite from "flourite";

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

function EditCodeModal(props) {
  const params = useParams();

  const [fontSize, setFontSize] = useState(props.element.fontSize);
  const [validFontSize, setValidFontSize] = useState(true);
  const [language, setLanguage] = useState(props.element.language);
  const [validLanguage, setValidLanguage] = useState(true);
  const [code, setCode] = useState(props.element.content);
  const [positionX, setPositionX] = useState(props.element.left);
  const [positionY, setPositionY] = useState(props.element.top);

  React.useEffect(() => {
    // Update the local position state whenever the store updates
    setPositionX(props.element.left);
    setPositionY(props.element.top);
  }, [props.element.left, props.element.top]);

  const validateFontSize = (fontSize) => {
    if (fontSize <= 0 || fontSize === "") {
      setValidFontSize(false);
    } else {
      setValidFontSize(true);
    }
    setFontSize(fontSize);
  };


  const handleCreateCode = () => {

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
                  content: code,
                  language: language,
                  fontSize: fontSize,
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

  const detectLanguage = (codeSnippet) => {
    const detectedLanguage = flourite(codeSnippet).language;
    return detectedLanguage === "Javascript"
      ? "javascript"
      : detectedLanguage === "C"
        ? "c"
        : detectedLanguage === "Python"
          ? "python"
          : "unknown";
  };

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode); // Update the code state

    const languageDetected = detectLanguage(newCode); // Get the detected language

    setLanguage(languageDetected); // Set the language state

    // Set validLanguage based on the detected language
    if (languageDetected === "unknown") {
      setValidLanguage(false);
    } else {
      setValidLanguage(true);
    }
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <IconButton
            onClick={props.onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Code Element
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            multiline
            minRows={4}
            name="edit-code-element"
            label="Insert code block"
            value={code}
            onChange={handleCodeChange}
            variant="outlined"
            helperText={
              language !== "unknown"
                ? "Language inputted: " + language
                : "Please enter code in either Python, C, or Javascript"
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
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
          <br />
          <br />
          <CreateBtn
            name="edit-code-element-submit"
            variant="contained"
            onClick={handleCreateCode}
            disabled={!validFontSize || !validLanguage}
          >
            Update
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}

export default EditCodeModal;
