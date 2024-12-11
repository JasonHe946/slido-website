import { useState } from "react";
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
import { Slider } from "@mui/material";
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

function NewCodeModal(props) {
  const params = useParams();

  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [fontSize, setFontSize] = useState("");
  const [validFontSize, setValidFontSize] = useState(false);
  const [language, setLanguage] = useState("unknown");
  const [validLanguage, setValidLanguage] = useState(false);
  const [code, setCode] = useState("");

  const validateFontSize = (fontSize) => {
    if (fontSize <= 0 || fontSize === "") {
      setValidFontSize(false);
    } else {
      setValidFontSize(true);
    }
    setFontSize(fontSize);
  };

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleCreateCode = () => {

    const newStore = { ...props.store };
    const newElement = {
      elementId: generateRandomId(),
      content: code,
      type: "code",
      language: language,
      fontSize: fontSize,
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
    setFontSize("");
    setLanguage("unknown");
    setCode("");
    setWidth(50);
    setHeight(50);
    setValidFontSize(false);
    setValidLanguage(false);
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
          : "unknown"; // Fallback language
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
            Create Code Element
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            multiline
            minRows={4}
            name="new-code-element-text"
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
            name="new-code-element-font"
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
            name="create-new-code-element-submit"
            variant="contained"
            onClick={handleCreateCode}
            disabled={!validFontSize || !validLanguage}
          >
            Create
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}

export default NewCodeModal;
