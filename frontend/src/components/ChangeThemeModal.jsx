import { useState } from "react";
import { Modal, Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";

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
  width: "70vw",
  maxWidth: 500,
  maxHeight: "70vh",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

export default function ChangeThemeModal(props) {
  const params = useParams();

  const [backgroundType, setBackgroundType] = useState("");
  const [solidBackgroundColour, setSolidBackgroundColour] = useState("#ffffff");
  const [gradientBackgroundColourOne, setGradientBackgroundColourOne] =
    useState("#ffffff");
  const [gradientBackgroundColourTwo, setGradientBackgroundColourTwo] =
    useState("#ffffff");
  const [imageURL, setImageURL] = useState("");
  const [isDefaultBackground, setIsDefaultBackground] = useState(false);


  const handleChangeTheme = () => {
    const newStore = { ...props.store };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == params.deckid) {
        return {
          ...deck,
          slides: deck.slides.map((slide) => {
            if (slide.slideId == props.slideId) {
              return {
                ...slide,
                backgroundType: backgroundType,
                solidBackgroundColour: solidBackgroundColour,
                gradientStartColour: gradientBackgroundColourOne,
                gradientEndColour: gradientBackgroundColourTwo,
                backgroundImage: imageURL,
              };
            }
            return slide; // Return unchanged slide if it doesn't match the slideId
          }),
          ...(isDefaultBackground && {
            isDefaultBackground: isDefaultBackground,
            deckBackgroundType: backgroundType,
            deckSolidBackgroundColour: solidBackgroundColour,
            deckGradientStartColour: gradientBackgroundColourOne,
            deckGradientEndColour: gradientBackgroundColourTwo,
            deckBackgroundImage: imageURL,
          }),
        };
      }
      return deck; // Return unchanged deck if it doesn't match the deckId
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
            Choose type of slide background
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={backgroundType}
              onChange={(e) => setBackgroundType(e.target.value)}
            >
              <FormControlLabel
                value="solid"
                control={<Radio />}
                label="Solid Colour"
              />
              <FormControlLabel
                value="gradient"
                control={<Radio />}
                label="Gradient"
              />
              <FormControlLabel
                value="image"
                control={<Radio />}
                label="Image"
              />
            </RadioGroup>
          </FormControl>
          {backgroundType === "solid" && (
            <div>
              <Typography variant="body2">Select Background Colour:</Typography>
              <HexColorPicker
                color={solidBackgroundColour}
                onChange={setSolidBackgroundColour}
              />
              <div style={{ marginTop: 10 }}>
                Selected Color: {solidBackgroundColour}
              </div>
            </div>
          )}
          {backgroundType === "gradient" && (
            <div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div>
                  <Typography variant="body2">Select Start Colour:</Typography>
                  <HexColorPicker
                    color={gradientBackgroundColourOne}
                    onChange={setGradientBackgroundColourOne}
                  />
                  <div style={{ marginTop: 10 }}>
                    Start Colour: {gradientBackgroundColourOne}
                  </div>
                </div>
                <div>
                  <Typography variant="body2">Select End Colour:</Typography>
                  <HexColorPicker
                    color={gradientBackgroundColourTwo}
                    onChange={setGradientBackgroundColourTwo}
                  />
                  <div style={{ marginTop: 10 }}>
                    End Colour: {gradientBackgroundColourTwo}
                  </div>
                </div>
              </div>
            </div>
          )}
          {backgroundType === "image" && (
            <TextField
              autoFocus
              required
              margin="dense"
              name="change-theme-imageURL"
              id="new-theme-element-imageURL"
              label="Image url"
              type="url"
              fullWidth
              variant="standard"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)} // file object
              helperText="Enter an image url"
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefaultBackground}
                onChange={(e) => setIsDefaultBackground(e.target.checked)}
                name="default-background"
                color="primary"
              />
            }
            label="Default Deck Background"
          />
          <br />
          <CreateBtn
            name="change-theme-submit"
            variant="contained"
            onClick={handleChangeTheme}
          >
            Set Theme
          </CreateBtn>
        </Box>
      </Modal>
    </div>
  );
}
