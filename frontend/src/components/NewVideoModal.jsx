import { useState} from "react";
import {
  Modal,
  Button,
  styled,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Slider } from "@mui/material";
import { useParams} from "react-router-dom";

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

function NewVideoModal(props) {
  const params = useParams();

  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [autoplay, setAutoplay] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [validVideo, setValidVideo] = useState(false);

  const validateVideo = (video) => {
    const regex =
      /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(\?.*)?$/;
    if (regex.test(video)) {
      setValidVideo(true);
    } else {
      setValidVideo(false);
    }
    setVideoUrl(video);
  };

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleCreateVideo = () => {

    const newStore = { ...props.store };
    const newElement = {
      elementId: generateRandomId(),
      type: "video",
      src: videoUrl,
      autoPlay: autoplay,
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
    setVideoUrl("");
    setAutoplay(false);
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
            Create Video Element
          </Typography>
          <TextField
            autoFocus
            required
            name="new-video-element-url"
            margin="dense"
            id="new-video-element-url"
            label="Video url"
            type="text"
            fullWidth
            variant="standard"
            value={videoUrl}
            onChange={(e) => {
              validateVideo(e.target.value);
            }}
            helperText={
              validVideo ? "" : "Please input a valid embedded youtube url"
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                name="autoplay"
                color="primary"
              />
            }
            label="Autoplay"
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
            name="create-new-video-element-submit"
            variant="contained"
            onClick={handleCreateVideo}
            disabled={!validVideo}
          >
            Create
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}

export default NewVideoModal;
