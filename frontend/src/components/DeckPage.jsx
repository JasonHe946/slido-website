import axios from "axios";
import React from "react";
import {
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from '@mui/material/useMediaQuery';

import { useParams, useNavigate } from "react-router-dom";

import ConfirmationModal from "./ConfirmationModal";
import EditThumbnailModal from "./EditThumbnailModal";
import SlidePage from "./SlidePage";
import NewTextModal from "./NewTextModal";
import NewImageModal from "./NewImageModal";
import NewVideoModal from "./NewVideoModal";
import NewCodeModal from "./NewCodeModal";
import ChangeThemeModal from "./ChangeThemeModal";
import { StoreContext } from "./StoreContext";
import ErrorModal from "./ErrorModal";

const Deck = styled("div")(({isportrait})=> ({
  display: "flex",
  flexDirection: isportrait ? "column" : "row",
  height: "100%",
  width: "100%",
  overflow: "hidden"
}));

const BtnContainer = styled("div")(({isportrait})=> ({
  display: "flex",
  flexDirection: isportrait ? "row" : "column",
  backgroundColor: "#121b21",
  height: isportrait ? "11%" : "100%",
  width: isportrait ? "100%" : "11%",
  padingTop: isportrait ? "30px" : "0px",
  alignItems: "center",
  overflowX:"auto",
  overflowY: isportrait ? "hidden" : "auto",
  gap: isportrait ? "5px" : "0px",
}));

const ThumbnailContainer = styled("div")({
  position: "relative",
  display: "flex",
  // flexDirection: "column",
  marginTop: "20px",
  backgroundColor: "white",
  height: "18vh",
  width: "80%",
  alignItems: "center",
  cursor: "pointer",

  "&:hover button": {
    // set opacity of any children buttons within the div.
    opacity: 1,
  },
});

const ThumbnailContainerPortrait = styled("div")({
  position: "relative",
  display: "flex",
  // flexDirection: "column",
  padding: "10px",
  height: "90%",
  minWidth: "15%",
  alignItems: "center",
  cursor: "pointer",
  "&:hover button": {
    opacity: 1,
  },
});

const EditThumbnailBtnPortrait = styled(IconButton)({
  position: "absolute",
  backgroundColor: "rgba(255,255,255, 0.6)",
  opacity: "0",
  maxHeight: "100%",
  maxWidth: "100%",
  top: "15%",
  left: "9%",
  right: "9%",
  bottom: "15%",
  borderRadius: "0",
  transition: "opacity 0.1s", // Smooth fade-in effect
});

const Thumbnail = styled("img")({
  // flexDirection: "column",
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
});

const EditThumbnailBtn = styled(IconButton)({
  position: "absolute",
  backgroundColor: "rgba(255,255,255, 0.6)",
  opacity: "0",
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
  borderRadius: "0",
  transition: "opacity 0.1s", // Smooth fade-in effect
});

const SlideContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#1a2932",
  height: "100%",
  flexGrow: "1",
  alignItems: "center",
});

const NavBox = styled("div")({
  display: "flex",
  flexDirection: "row",
  backgroundColor: "white",
  marginTop: "5px",
});

const SlideBox = styled("div")(({ fade }) => ({
  display: "flex",
  backgroundColor: "white",
  marginTop: "10px",
  // height: "85%",
  width: "80%",
  aspectRatio: "2/1",
  position: "relative",
  overflow: "hidden",
  transition: "opacity 0.3s ease-in-out", // Fade transition
  opacity: fade ? 1 : 0, // Control visibility based on `fade` state
}));

const SlideHeader = styled("div")(({isportrait})=>({
  paddingTop: isportrait ? "10px" : "0px",
  paddingBottom: isportrait ? "5px" : "0px",
  display: "flex",
  backgroundColor: "#17232b",
  height: "8%",
  width: "100%",
  alignItems: "center",
  fontFamily: "Arial, sans-serif",
  fontSize: "1.5em",
}));

const SlideTitle = styled("h1")({
  color: "white",
  marginLeft: "20px",
  fontSize: "inherit", // Inherit font size from SlideTitle’s container
  fontFamily: "inherit", // Inherit font family
});

const DeleteBtn = styled(Button)(({isportrait}) => ({
  marginTop: "10px",
  marginBottom: isportrait ? "0px" : "30px",
  marginRight: isportrait ? "30px" : "0px",
  backgroundColor: "#f44336",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
}));

const AddTextBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "light blue",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
});

const AddImageBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "#f1807e",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
});

const AddVideoBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "#CF9FFF",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
});

const AddCodeBtn = styled(Button)(({isportrait}) => ({
  marginTop: "10px",
  marginBottom: isportrait ? "0px" : "30px",
  marginRight: isportrait ? "30px" : "0px",
  backgroundColor: "#FFA500",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
}));

const ChangeThemeBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "#FF4d6a",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
});

const PreviewDeckBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "#40CB90",
  color: "white",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
});

const RearrangeDeckBtn = styled(Button)({
  marginTop: "10px",
  backgroundColor: "#666666",
  color: "white",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
});

const SlideTransitionBtn = styled(Button)(({isportrait}) => ({
  marginTop: "10px",
  marginBottom: isportrait ? "20px" : "0px",
  color: "white",
  width: "70%",
  fontSize: "clamp(0.5em ,1vw, 0.8em)",
}));

const FontFamilyContainer = styled("div")(({isportrait}) =>({
  marginTop: "15px",
  width: "70%",
  backgroundColor: "white",
  marginBottom: isportrait ? "10px" : "30px",
  borderRadius: "5px",
}));

const SlideButtonContainer = styled("div")(({isportrait})=> ({
  marginTop: "10px",
  display: "flex",
  justifyContent: "center",
  paddingTop: isportrait ? "60px" : "0px",
  width: "100%",
  height: "5vh",
  gap: "20px"
}));

const AddSlideBtn = styled(Button)({
  backgroundColor: "#4CAF50", // Green background for "Add Slide"
  color: "white",
  minWidth: "20%", // Half width of the container (with space in between)
  "&:hover": {
    backgroundColor: "#45a049", // Darker green on hover
  },
  fontSize: "clamp(0.40em ,1vw, 0.8em)",
});

const DeleteSlideBtn = styled(Button)({
  backgroundColor: "#f44336", // Red background for "Delete Slide"
  color: "white",
  minWidth: "20%", // Half width of the container (with space in between)
  "&:hover": {
    backgroundColor: "#e53935", // Darker red on hover
  },
  fontSize: "clamp(0.40em ,1vw, 0.8em)",
});

const TitleInput = styled("input")({
  color: "white",
  fontSize: "inherit", // Inherit font size from SlideTitle’s container
  fontFamily: "inherit", // Inherit font family
  fontWeight: "bold", // Inherit font weight
  backgroundColor: "transparent",
  opacity: "0.70",
  border: "none",
  outline: "none",
  width: "80%",
  height: "50%",
  marginLeft: "18px",
  borderRadius: "5px",
});

const DeckPage = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const isPortrait = useMediaQuery('(orientation: portrait)');

  const { store, setStore, enableFade, toggleFade } =
    React.useContext(StoreContext);

  const [currentDeck, setCurrentDeck] = React.useState({});
  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState(false);
  const [deleteSlideConfirmModal, setDeleteSlideConfirmModal] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(false);
  const [previousTitle, setPreviousTitle] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [editThumbnailModal, setEditThumbnailModal] = React.useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [currentSlide, setCurrentSlide] = React.useState(null);
  const [preview] = React.useState(false);

  // slide elements
  const [createTextModal, setCreateTextModal] = React.useState(false);
  const [createImageModal, setCreateImageModal] = React.useState(false);
  const [createVideoModal, setCreateVideoModal] = React.useState(false);
  const [createCodeModal, setCreateCodeModal] = React.useState(false);

  // font family
  const [fontFamily, setFontFamily] = React.useState("Arial");
  // change theme
  const [themeModal, setThemeModal] = React.useState(false);

  // For URL updating
  const queryParams = new URLSearchParams(location.search);
  const initialSlideIndex = parseInt(queryParams.get("slideIndex")) || 0; // Slide index upon refresh / mount from the URL

  // Slide Transitions
  const [fade, setFade] = React.useState(true);

  // Error Modal
  const [errorModal, setErrorModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Load deck and slide data when the component mounts or store updates
  React.useEffect(() => {
    if (store && store.decks) {
      const deck = store.decks.find((deck) => deck.id == params.deckid);
      if (deck) {
        setCurrentDeck(deck);
        setCurrentSlide(deck.slides[initialSlideIndex]);
        setCurrentSlideIndex(initialSlideIndex);
      }
    }
  }, [store, params.deckid, initialSlideIndex]);

  // Function to update the slide index in the URL
  const updateUrlWithSlideIndex = (index) => {
    navigate(`/deck/${params.deckid}?slideIndex=${index}`, { replace: true });
  };

  // Load deck title on mount and store current deck in variable for later use.
  React.useEffect(() => {
    if (store && store.decks) {
      const deck = store.decks.find((deck) => deck.id == params.deckid);

      setCurrentDeck(deck); // Load current deck and store all info upon render.
      if (deck) {
        setTitle(deck.title);
        setPreviousTitle(deck.title);
        setCurrentSlide(deck.slides[currentSlideIndex]);
      }
    }
  }, [store, params.deckid]);

  React.useEffect(() => {
    if (currentDeck && currentDeck.slides && currentDeck.slides.length > 0) {
      setCurrentSlide(currentDeck.slides[currentSlideIndex]); // Set the current slide based on index
      setFontFamily(currentDeck.slides[currentSlideIndex].fontFamily);
    }
  }, [currentDeck, currentSlideIndex]);

  const handlePreviewDeck = () => {
    // Open a new tab with the SlidePage route and pass necessary data via URL parameters
    const url = `/preview?deckId=${currentDeck.id}&slideIndex=0`; // start previewing from first slide
    window.open(url, "_blank");
  };

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const updateStore = (newStore) => {
    // setStore(newStore);
    axios
      .put(
        "http://localhost:5005/store",
        {
          store: newStore,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then(() => {
        setStore(newStore);
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  const handleDeletePresentation = async () => {
    const newStore = { decks: [] };
    //Filter the stores to remove deck id
    const updatedStore = store.decks.filter((deck) => {
      return deck.id != params.deckid;
    });

    newStore["decks"].push(...updatedStore);

    //Update the backend store
    updateStore(newStore);

    // Close modal
    setDeleteConfirmModal(false);

    navigate("/dashboard");
  };

  const handleEditTitle = () => {
    if (title.trim() === "") {
      setErrorMessage("Title cannot be empty.");
      setErrorModal(true)
      setTitle(previousTitle);
      return;
    }

    const newStore = { decks: [] };
    const updatedDecks = store.decks.map((deck) => {
      if (deck.id == params.deckid) {
        return { ...deck, title: title }; // Replace with updated title
      }
      return deck; // Keep other decks unchanged
    });
    newStore["decks"].push(...updatedDecks);

    //Update the backend store
    updateStore(newStore);

    setPreviousTitle(title);
  };
  const handleTitleBlur = () => {
    setEditTitle(false);
    // Update the store
    handleEditTitle();
  };

  const addNewSlide = () => {
    const newStore = { ...store };
    const newSlide = {
      slideId: generateRandomId(),
      slideTitle: "New Slide",
      elements: [],
      fontFamily: "Arial",
      backgroundType: "",
      solidBackgroundColour: "#ffffff",
      gradientStartColour: "#ffffff",
      gradientEndColour: "#ffffff",
      backgroundImage: "",
    };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == params.deckid) {
        return {
          ...deck,
          slides: [...deck.slides, newSlide],
        };
      }
      return deck;
    });
    newStore.decks = updatedDecks;
    updateStore(newStore);
  };

  //Gets data from EditThumbnailModal.
  const handleEditThumbnail = (url) => {
    const newStore = { decks: [] };
    const updatedDecks = store.decks.map((deck) => {
      if (deck.id == params.deckid) {
        return { ...deck, thumbnail: url };
      }
      return deck; // Keep other decks unchanged
    });

    newStore["decks"].push(...updatedDecks);
    updateStore(newStore);
    currentDeck.thumbnail = url;
  };

  const nextSlide = () => {
    if (currentSlideIndex < currentDeck.slides.length - 1) {
      if (enableFade) {
        setFade(false); // Trigger fade-out
        setTimeout(() => {
          const newIndex = currentSlideIndex + 1;
          setCurrentSlideIndex(newIndex);
          setCurrentSlide(currentDeck.slides[newIndex]);
          setFade(true); // Trigger fade-in after slide change
          updateUrlWithSlideIndex(newIndex);
        }, 300); // Adjust the timeout to match the transition duration
      } else {
        setCurrentSlideIndex((prev) =>
          Math.min(prev + 1, currentDeck.slides.length - 1)
        );
      }
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      if (enableFade) {
        setFade(false);
        setTimeout(() => {
          setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
          setFade(true);
        }, 300); // Adjust the timeout to match the transition duration
      } else {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  // Update URL whenever the slide index changes
  React.useEffect(() => {
    if (
      currentDeck &&
      Array.isArray(currentDeck.slides) &&
      currentSlideIndex < currentDeck.slides.length
    ) {
      updateUrlWithSlideIndex(currentSlideIndex);
      setCurrentSlide(currentDeck.slides[currentSlideIndex]);
    }
  }, [currentSlideIndex, currentDeck]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlideIndex, currentDeck]);

  // Function to delete the current slide
  const handleDeleteSlide = () => {
    if (currentDeck.slides.length == 1) {
      setDeleteSlideConfirmModal(false);
      setDeleteConfirmModal(true);
      return;
    }
    const updatedDeck = { ...currentDeck };
    updatedDeck.slides.splice(currentSlideIndex, 1);
    setCurrentDeck(updatedDeck);

    // If the last slide is deleted, move to the previous slide or first one
    if (currentSlideIndex >= updatedDeck.slides.length) {
      setCurrentSlideIndex(updatedDeck.slides.length - 1);
    }

    setDeleteSlideConfirmModal(false);
  }

  const handleFontFamily = (e) => {
    setFontFamily(e.target.value);
    const newStore = { ...store };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == params.deckid) {
        return {
          ...deck,
          slides: deck.slides.map((slide) => {
            if (slide.slideId == currentSlide.slideId) {
              return {
                ...slide,
                fontFamily: e.target.value,
              };
            }
            return slide; // Return unchanged slide if it doesn't match the slideId
          }),
        };
      }
      return deck; // Return unchanged deck if it doesn't match the deckId
    });

    newStore.decks = updatedDecks;
    updateStore(newStore);
  };

  return (
    <>
      <Deck isportrait={isPortrait}>
        {isPortrait && (
          <SlideHeader isportrait={isPortrait}>
            <ThumbnailContainerPortrait>
              <Thumbnail alt="deck thumbnail" src={currentDeck.thumbnail} />
              <EditThumbnailBtnPortrait
                name="edit-thumbnail-btn"
                disableRipple
                onClick={() => {
                  setEditThumbnailModal(true);
                }}
              >
                <EditIcon sx={{ height: "25px" }} />
              </EditThumbnailBtnPortrait>
            </ThumbnailContainerPortrait>
            {editTitle ? (
              <TitleInput
                name="edit-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur} // Make the edit
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleBlur();
                  }
                }}
                autoFocus
              />
            ) : (
              <SlideTitle>{title}</SlideTitle>
            )}

            {!editTitle && ( // Render edit button if edit is not already clicked.
              <IconButton
                onClick={() => {
                  setEditTitle(true);
                }}
                sx={{ color: "white", marginLeft: "10px" }}
                aria-label="edit-title"
              >
                <EditIcon sx={{ height: "20px", paddingTop: "10px" }} />
              </IconButton>
            )}
          </SlideHeader>
        )}
        <BtnContainer isportrait={isPortrait}>
          {!isPortrait && (
            <ThumbnailContainer>
              <Thumbnail alt="deck thumbnail" src={currentDeck.thumbnail} />
              <EditThumbnailBtn
                name="edit-thumbnail-btn"
                disableRipple
                onClick={() => {
                  setEditThumbnailModal(true);
                }}
              >
                <EditIcon sx={{ height: "50px" }} />
              </EditThumbnailBtn>
            </ThumbnailContainer>
          )}
          <PreviewDeckBtn onClick={handlePreviewDeck}>
            Preview Deck
          </PreviewDeckBtn>
          <RearrangeDeckBtn
            onClick={() => {
              navigate(`/rearrange/${params.deckid}`);
            }}
          >
            Re-order Deck
          </RearrangeDeckBtn>
          <DeleteBtn
            isportrait={isPortrait}
            name="delete-deck-btn"
            onClick={() => {
              setDeleteConfirmModal(true);
            }}
            variant="contained"
          >
            Delete Deck
          </DeleteBtn>
          <AddTextBtn
            name="add-text-btn"
            onClick={() => {
              setCreateTextModal(true);
            }}
            variant="contained"
          >
            Add Text
          </AddTextBtn>
          <AddImageBtn
            name="add-image-btn"
            onClick={() => {
              setCreateImageModal(true);
            }}
            variant="contained"
          >
            Add Image
          </AddImageBtn>
          <AddVideoBtn
            name="add-video-btn"
            onClick={() => {
              setCreateVideoModal(true);
            }}
            variant="contained"
          >
            Add Video
          </AddVideoBtn>
          <AddCodeBtn
            isportrait={isPortrait}
            name="add-code-btn"
            onClick={() => {
              setCreateCodeModal(true);
            }}
            variant="contained"
          >
            Add Code
          </AddCodeBtn>
          <ChangeThemeBtn
            name="change-theme-btn"
            onClick={() => {
              setThemeModal(true);
            }}
            variant="contained"
          >
            Change Theme
          </ChangeThemeBtn>
          <SlideTransitionBtn
            style={{
              backgroundColor: enableFade ? "#f44336" : "#4CAF50",
            }}
            onClick={() => toggleFade(!enableFade)}
          >
            {enableFade ? "Disable Fade" : "Enable Fade"}
          </SlideTransitionBtn>
          <FontFamilyContainer isportrait={isPortrait}>
            <FormControl fullWidth>
              <InputLabel
                id="font-family-select-label"
                sx={{
                  marginTop: "11px",
                  color: "#000",
                }}
              >
                Font Family:
              </InputLabel>
              <Select
                labelId="font-family-select-label"
                id="font-family-select"
                value={fontFamily}
                label="Font Family"
                onChange={handleFontFamily}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#000",
                }}
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Courier New">Courier New</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              </Select>
            </FormControl>
          </FontFamilyContainer>
        </BtnContainer>
        <SlideContainer>
          {!isPortrait && (

            <SlideHeader isportrait={isPortrait}>
              {isPortrait && (
                <ThumbnailContainerPortrait>
                  <Thumbnail alt="deck thumbnail" src={currentDeck.thumbnail} />
                  <EditThumbnailBtnPortrait
                    name="edit-thumbnail-btn"
                    disableRipple
                    onClick={() => {
                      setEditThumbnailModal(true);
                    }}
                  >
                    <EditIcon sx={{ height: "25px" }} />
                  </EditThumbnailBtnPortrait>
                </ThumbnailContainerPortrait>
              )}
              {editTitle ? (
                <TitleInput
                  name="edit-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur} // Make the edit
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTitleBlur();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <SlideTitle>{title}</SlideTitle>
              )}

              {!editTitle && ( // Render edit button if edit is not already clicked.
                <IconButton
                  onClick={() => {
                    setEditTitle(true);
                  }}
                  sx={{ color: "white", marginLeft: "10px" }}
                  aria-label="edit-title"
                >
                  <EditIcon sx={{ height: "20px", paddingTop: "10px" }} />
                </IconButton>
              )}
            </SlideHeader>
          )}
          <SlideButtonContainer isportrait={isPortrait}>
            <AddSlideBtn
              name="add-slide-btn"
              onClick={() => {
                addNewSlide();
              }}
              variant="contained"
            >
              Add New Slide
            </AddSlideBtn>
            <DeleteSlideBtn
              onClick={() => {
                setDeleteSlideConfirmModal(true)
              }}
              variant="contained"
            >
              Delete Slide
            </DeleteSlideBtn>
          </SlideButtonContainer>
          <SlideBox fade={fade}>
            {currentSlide && (
              <SlidePage
                slide={currentSlide}
                slideIndex={currentSlideIndex}
                totalSlides={currentDeck.slides.length}
                currentDeck={currentDeck}
                store={store}
                updateStore={updateStore}
                preview={preview}
              />
            )}
          </SlideBox>
          <NavBox>
            {currentSlide && (
              <>
                <button
                  name="previous-slide-btn"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                >
                  ⬅️
                </button>
                <button
                  name="next-slide-btn"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === currentDeck.slides.length - 1}
                >
                  ➡️
                </button>
              </>
            )}
          </NavBox>
        </SlideContainer>
      </Deck>
      <ConfirmationModal
        open={deleteConfirmModal}
        onClick={() => {
          handleDeletePresentation();
        }}
        onClose={() => {
          setDeleteConfirmModal(false);
        }}
        title={"Delete Slide Deck"}
        description={"Are you sure you want to delete this slide deck?"}
      ></ConfirmationModal>
      <ConfirmationModal
        open={deleteSlideConfirmModal}
        onClick={() => {
          handleDeleteSlide();
        }}
        onClose={() => {
          setDeleteSlideConfirmModal(false);
        }}
        title={"Delete Slide"}
        description={"Are you sure you want to delete this slide?"}
      ></ConfirmationModal>
      <EditThumbnailModal
        open={editThumbnailModal}
        onClick={handleEditThumbnail}
        onClose={() => {
          setEditThumbnailModal(false);
        }}
        title={"Edit Thumbnail"}
      ></EditThumbnailModal>
      {currentSlide && (
        <NewTextModal
          slideId={currentSlide.slideId}
          open={createTextModal}
          onClose={() => setCreateTextModal(false)}
          store={store}
          updateStore={updateStore}
        />
      )}
      {currentSlide && (
        <NewImageModal
          slideId={currentSlide.slideId}
          open={createImageModal}
          onClose={() => setCreateImageModal(false)}
          store={store}
          updateStore={updateStore}
        />
      )}
      {currentSlide && (
        <NewVideoModal
          slideId={currentSlide.slideId}
          open={createVideoModal}
          onClose={() => setCreateVideoModal(false)}
          store={store}
          updateStore={updateStore}
        />
      )}
      {currentSlide && (
        <NewCodeModal
          slideId={currentSlide.slideId}
          open={createCodeModal}
          onClose={() => setCreateCodeModal(false)}
          store={store}
          updateStore={updateStore}
        />
      )}
      {currentSlide && (
        <ChangeThemeModal
          slideId={currentSlide.slideId}
          open={themeModal}
          onClose={() => setThemeModal(false)}
          store={store}
          updateStore={updateStore}
        />
      )}
      <ErrorModal
        open={errorModal}
        handleClose={()=>{setErrorModal(false)}}
        title={"Error"}
        description={errorMessage}
      >
      </ErrorModal>
    </>
  );
};

export default DeckPage;
