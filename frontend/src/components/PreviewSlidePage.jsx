import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SlidePage from "./SlidePage";
import { StoreContext } from "./StoreContext";

const NavBox = ({ prevSlide, nextSlide, currentSlideIndex, totalSlides }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "10px 20px",
        borderRadius: "10px",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      <button onClick={prevSlide} disabled={currentSlideIndex === 0}>
        ⬅️ Previous
      </button>
      <button onClick={nextSlide} disabled={currentSlideIndex === totalSlides - 1}>
        Next ➡️
      </button>
    </div>
  );
};

const PreviewSlidePage = ({ updateStore }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const { store, enableFade } = useContext(StoreContext);

  const deckId = queryParams.get("deckId");
  const initialSlideIndex = parseInt(queryParams.get("slideIndex")) || 0;

  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);

  const [fade, setFade] = useState(true);

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

  // Update the URL with the current slide index whenever it changes
  useEffect(() => {
    if (currentDeck && currentSlide) {
      navigate(`/preview?deckId=${deckId}&slideIndex=${currentSlideIndex}`, { replace: true });
    }
  }, [currentSlideIndex, currentDeck, currentSlide, navigate, deckId]);

  useEffect(() => {
    if (store) {
      const deck = store.decks.find((d) => d.id == deckId);
      if (deck) {
        setCurrentDeck(deck);
        setCurrentSlide(deck.slides[currentSlideIndex]);
      }
    }
  }, [deckId, store, currentSlideIndex]);

  const nextSlide = () => {
    if (currentSlideIndex < currentDeck.slides.length - 1) {
      if (enableFade) {
        setFade(false);
        setTimeout(() => {
          setCurrentSlideIndex((prev) => Math.min(prev + 1, currentDeck.slides.length - 1));
          setFade(true);
        }, 300);
      } else {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, currentDeck.slides.length - 1));
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
        }, 300);
      } else {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  if (!currentDeck || !currentSlide) return <div>Loading...</div>;

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        margin: "0",
        padding: "0",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: enableFade ? "opacity 0.3s ease-in-out" : "none",
        opacity: fade ? 1 : 0,
      }}
    >
      {/* SlidePage component */}
      <SlidePage
        slide={currentSlide}
        slideIndex={currentSlideIndex}
        totalSlides={currentDeck.slides.length}
        currentDeck={currentDeck}
        store={store}
        updateStore={updateStore}
        preview={true}
      />

      {/* NavBox overlay */}
      <NavBox
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        currentSlideIndex={currentSlideIndex}
        totalSlides={currentDeck.slides.length}
      />
    </div>
  );
};

export default PreviewSlidePage;