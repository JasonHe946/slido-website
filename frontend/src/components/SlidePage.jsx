import React from "react";
import { styled } from "@mui/material";
import Element from "./Element";
import { StoreContext } from "./StoreContext";
import useMediaQuery from '@mui/material/useMediaQuery';

const SlideContainer = styled("div")({
  position: "relative", // Ensures the PageNumberBox is positioned relative to this container
  width: "100%",
  height: "100%",
});

const PageNumberBox = styled("div")(({ smallScreen }) => ({
  position: "absolute",
  bottom: "10px",
  left: "10px",
  width: "10%",
  height: "10%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: smallScreen ? "0.5em" : "1em", // Change font size based on smallScreen state
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "white",
}));

// Slide component that renders all elements of the slide
const SlidePage = ({
  slide,
  slideIndex,
  totalSlides,
  currentDeck,
  updateStore,
  preview,
}) => {

  const { store } = React.useContext(StoreContext);
  const [resizeTrigger, setResizeTrigger] = React.useState(0);

  const smallScreen = useMediaQuery('(max-width: 1030px)')

  const getBackgroundStyle = () => {
    // Check if the slide has a backgroundType defined
    if (slide.backgroundType) {
      switch (slide.backgroundType) {
      case "solid":
        return {
          backgroundColor: slide.solidBackgroundColour,
        };
      case "gradient":
        return {
          background: `linear-gradient(${slide.gradientStartColour}, ${slide.gradientEndColour})`,
        };
      case "image":
        return {
          backgroundImage: `url(${slide.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      default:
        return {};
      }
    }

    // If no slide backgroundType, fall back to the deck's default background
    if (currentDeck.isDefaultBackground) {
      switch (currentDeck.deckBackgroundType) {
      case "solid":
        return {
          backgroundColor: currentDeck.deckSolidBackgroundColour,
        };
      case "gradient":
        return {
          background: `linear-gradient(${currentDeck.deckGradientStartColour}, ${currentDeck.deckGradientEndColour})`,
        };
      case "image":
        return {
          backgroundImage: `url(${currentDeck.deckBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      default:
        return {};
      }
    }

    // Return an empty style if neither slide nor deck has a background type
    return {};
  };

  const slideRef = React.useRef(null);

  // Use ResizeObserver to detect size changes and trigger a re-render
  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setResizeTrigger((prev) => prev + 1); // Increment to trigger a re-render
    });

    if (slideRef.current) {
      resizeObserver.observe(slideRef.current);
    }

    return () => {
      if (slideRef.current) {
        resizeObserver.unobserve(slideRef.current);
      }
    };
  }, []);


  return (
    <SlideContainer ref={slideRef} style={getBackgroundStyle()}>
      {slide.elements.map((element, index) => (
        <Element
          key={index}
          element={element}
          slide={slide}
          deck={currentDeck}
          store={store}
          updateStore={updateStore}
          elementNumber={index}
          parentRef={slideRef}
          preview={preview}
          resizeTrigger={resizeTrigger}
        />
      ))}
      <PageNumberBox smallScreen={smallScreen}>
        {totalSlides === 1
          ? `${slideIndex + 1}`
          : `${slideIndex + 1} / ${totalSlides}`}
      </PageNumberBox>
    </SlideContainer>
  );
};

export default SlidePage;
