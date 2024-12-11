import React, { useState } from "react";
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

function EditVideoModal(props) {
  const params = useParams();

  const [autoplay, setAutoplay] = useState(props.element.autoPlay);
  const [videoUrl, setVideoUrl] = useState(props.element.src);
  const [validVideo, setValidVideo] = useState(true);
  const [positionX, setPositionX] = useState(props.element.left);
  const [positionY, setPositionY] = useState(props.element.top);

  React.useEffect(() => {
    // Update the local position state whenever the store updates
    setPositionX(props.element.left);
    setPositionY(props.element.top);
  }, [props.element.left, props.element.top]);

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


  const handleCreateVideo = () => {

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
                  left: positionX,
                  top: positionY,
                  src: videoUrl,
                  autoPlay: autoplay,
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
            Update Video Element
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            name="edit-video-element-url"
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
          <CreateBtn
            name="edit-video-element-submit"
            variant="contained"
            onClick={handleCreateVideo}
            disabled={!validVideo}
          >
            Update
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}

export default EditVideoModal;
