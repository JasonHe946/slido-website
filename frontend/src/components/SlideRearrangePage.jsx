import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "./StoreContext";
import SlidePage from "./SlidePage";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShuffleIcon from '@mui/icons-material/Shuffle';


const SlideRearrangePage = ({updateStore}) => {
  const params = useParams();
  const navigate = useNavigate();
  const { store } = React.useContext(StoreContext);

  const [currentDeck, setCurrentDeck] = React.useState({})

  // Get currentDeck on mount
  React.useEffect(() => {
    if (store && store.decks) {
      const deck = store.decks.find((deck) => deck.id == params.deckid);
      if (deck) {
        setCurrentDeck(deck);
      }
    }
  }, [store, params.deckid]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    
    const updatedSlides = Array.from(currentDeck.slides);
    const [movedSlide] = updatedSlides.splice(result.source.index, 1);
    updatedSlides.splice(result.destination.index, 0, movedSlide);
    
    const updatedDeck = { ...currentDeck, slides: updatedSlides };
    setCurrentDeck(updatedDeck);
    
    const updatedStore = {
      ...store,
      decks: store.decks.map((deck) =>
        deck.id == params.deckid ? updatedDeck : deck
      ),
    };
    updateStore(updatedStore);
  };

  return (
    <div style={{backgroundColor: "#2F2F33", height: "100%"}}>
      <IconButton
        sx={{fontSize: "0.8em", color:"white"}}
        onClick={()=>{navigate(`/deck/${params.deckid}`)}}
      >
        <ArrowBackIcon/>
            Back
      </IconButton>
      <div style={{display: "flex"}}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="slides-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ 
                  ...provided.droppableProps.style,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#EBECF0",
                  width: "32vw",
                  height: "80vh",
                  maxHeight: "85vh",
                  border: "1px solid grey",
                  borderRadius: "5px",
                  alignItems: "center",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  marginLeft: "20px",
                  overflowY: "auto",
                }}
              >
                {currentDeck.slides?.map((slide, index) => (
                  <Draggable
                    key={slide.slideId}
                    draggableId={slide.slideId.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          display: "flex",
                          width: "28vw",
                          height: "15vh",
                          border: "1px solid black",
                          marginTop: "10px",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          flexShrink: 0, // Prevent shrinking
                          overflow: "hidden",
                        }}
                      >
                        <SlidePage
                          slide={slide}
                          slideIndex={index}
                          totalSlides={currentDeck.slides.length}
                          currentDeck={currentDeck}
                          updateStore={updateStore}
                          preview={true}
                        />

                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ color:"white", display: "flex", flexDirection:"column", justifyContent: "center", alignItems:"center", flexGrow: "1"}}>
                Drag to Re-Order your slides! <br/>
          <br/>
          <ShuffleIcon/>
        </div>
      </div>
    </div>
  )
};

export default SlideRearrangePage


