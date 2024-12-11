import React from "react";
import EditTextModal from "./EditTextModal";
import EditImageModal from "./EditImageModal";
import EditVideoModal from "./EditVideoModal";
import EditCodeModal from "./EditCodeModal";
import ElementCornerBoxes from "./ElementCornerBoxes";
import ResizableDraggableElement from "./ResizableDraggableElement";
import ConfirmationModal from "./ConfirmationModal";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Element = (props) => {
  const [deleteConfirmation, setDeleteConfirmation] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [editTextModal, setEditTextModal] = React.useState(false);
  const [editImageModal, setEditImageModal] = React.useState(false);
  const [editVideoModal, setEditVideoModal] = React.useState(false);
  const [editCodeModal, setEditCodeModal] = React.useState(false);
  const [showCornerBoxes, setShowCornerBoxes] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState({
    x: props.element.left,
    y: props.element.top,
  });
  const [, setBounds] = React.useState({});
  const [isDraggable, setIsDraggable] = React.useState(false);
  const [, setIsResizing] = React.useState(false);
  const [size, setSize] = React.useState({
    width: props.element.width,
    height: props.element.height,
  });

  const dragRef = React.useRef(null);
  const parentRef = props.parentRef; // used to reference parent container for move calculations

  const updateBounds = () => {
    if (parentRef.current && dragRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const dragRect = dragRef.current.getBoundingClientRect();
      setBounds({
        left: 0,
        top: 0,
        right: parentRect.width - dragRect.width,
        bottom: parentRect.height - dragRect.height,
      });
    }
  };

  React.useEffect(() => {
    // This effect will run whenever the slide size changes to make elements re-render to correct size.
  }, [props.resizeTrigger]);

  React.useEffect(() => {
    // Update the local position state whenever the store updates
    setCurrentPosition({
      x: props.element.left,
      y: props.element.top,
    });
  }, [props.element.left, props.element.top]);

  // Update size whenever change in size occurs
  React.useEffect(() => {
    setSize({
      width: props.element.width,
      height: props.element.height,
    });
  }, [props.element.width, props.element.height]);

  // Calculate bounds relative to the viewport when the component mounts
  React.useEffect(() => {
    updateBounds();

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });

    if (dragRef.current) {
      resizeObserver.observe(dragRef.current);
    }

    // Clean up the observer on component unmount
    return () => {
      if (dragRef.current) {
        resizeObserver.unobserve(dragRef.current);
      }
    };
  }, [parentRef, props.store]);

  const handleDoubleClickText = () => {
    if (props.preview) return;
    setEditTextModal(true);
  };

  const handleDoubleClickImage = () => {
    if (props.preview) return;
    setEditImageModal(true);
  };

  const handleDoubleClickVideo = () => {
    if (props.preview) return;
    setEditVideoModal(true);
  };

  const handleDoubleClickCode = () => {
    if (props.preview) return;
    setEditCodeModal(true);
  };

  const handleClick = (e) => {
    if (props.preview) return;
    e.stopPropagation();
    setShowCornerBoxes(true);
    setIsDraggable(true);
  };

  // Handle blur event to disable dragging when clicking outside
  const handleBlur = () => {
    if (props.preview) return;
    setIsDraggable(false);
    setShowCornerBoxes(false);
  };

  // Function to start resizing
  const handleResizeStart = (e) => {
    if (props.preview) return;
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleStopResize = (e, direction, ref, delta, position) => {
    if (props.preview) return;
    const newWidth =
      (parseFloat(ref.style.width) / parentRef.current.offsetWidth) * 100;
    const newHeight =
      (parseFloat(ref.style.height) / parentRef.current.offsetHeight) * 100;

    // Coordinates of the top left corner. If resizing from top left corner have to update the position.
    const xNew = position.x;
    const yNew = position.y;

    const xNewPercentage = (xNew / parentRef.current.offsetWidth) * 100;
    const yNewPercentage = (yNew / parentRef.current.offsetHeight) * 100;

    //set size as percentage
    setSize({
      width: newWidth,
      height: newHeight,
    });

    setCurrentPosition({ x: xNewPercentage, y: yNewPercentage });

    updateElementSize(
      props.deck.id,
      props.slide.slideId,
      props.element.elementId,
      props.store,
      props.updateStore,
      newWidth,
      newHeight,
      xNewPercentage,
      yNewPercentage
    );
  };

  const handleStopDragging = (e, data) => {
    if (props.preview) return;
    if (parentRef.current) {
      const xNew = data.x;
      const yNew = data.y;

      const xNewPercentage = (xNew / parentRef.current.offsetWidth) * 100;
      const yNewPercentage = (yNew / parentRef.current.offsetHeight) * 100;

      setCurrentPosition({ x: xNewPercentage, y: yNewPercentage });
      handleUpdateElementPosition(
        props.deck.id,
        props.slide.slideId,
        props.element.elementId,
        props.store,
        props.updateStore,
        xNewPercentage,
        yNewPercentage
      );
    }
  };

  // Delete element on right-click
  const handleContextMenu = (e) => {
    if (props.preview) return; // Disable deletion in preview mode
    e.preventDefault();
    setDeleteConfirmation(true);
  };

  // Delete element on right-click
  const handleContextMenuModal = () => {
    deleteElementById(
      props.deck.id,
      props.slide.slideId,
      props.element.elementId,
      props.store,
      props.updateStore
    );
    setDeleteConfirmation(false);
  };

  //Update specific element in the store
  const handleUpdateElementPosition = (
    deckId,
    slideId,
    elementId,
    store,
    updateStore,
    xNew,
    yNew
  ) => {
    const newStore = { ...store };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == deckId) {
        return {
          ...deck,
          slides: deck.slides.map((slide) => {
            if (slide.slideId == slideId) {
              return {
                ...slide,
                elements: slide.elements.map((element) => {
                  if (element.elementId == elementId) {
                    return { ...element, top: yNew, left: xNew };
                  }
                  return element; // Return unchanged element if it doesn't match elementId
                }),
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

  const updateElementSize = (
    deckId,
    slideId,
    elementId,
    store,
    updateStore,
    newWidth,
    newHeight,
    xNew,
    yNew
  ) => {
    const newStore = { ...store };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == deckId) {
        return {
          ...deck,
          slides: deck.slides.map((slide) => {
            if (slide.slideId == slideId) {
              return {
                ...slide,
                elements: slide.elements.map((element) => {
                  if (element.elementId == elementId) {
                    return {
                      ...element,
                      width: newWidth,
                      height: newHeight,
                      left: xNew,
                      top: yNew,
                    };
                  }
                  return element;
                }),
              };
            }
            return slide;
          }),
        };
      }
      return deck;
    });

    newStore.decks = updatedDecks;
    updateStore(newStore);
  };

  const deleteElementById = (
    deckId,
    slideId,
    elementId,
    store,
    updateStore
  ) => {
    const newStore = { ...store };

    const updatedDecks = newStore.decks.map((deck) => {
      if (deck.id == deckId) {
        return {
          ...deck,
          slides: deck.slides.map((slide) => {
            if (slide.slideId == slideId) {
              return {
                ...slide,
                elements: slide.elements.filter(
                  (el) => el.elementId !== elementId
                ),
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
      {props.element.type === "text" && (
        <ResizableDraggableElement
          isDraggable={isDraggable}
          currentPosition={currentPosition}
          size={size}
          parentRef={parentRef}
          handleStopDragging={handleStopDragging}
          handleResizeStart={handleResizeStart}
          handleStopResize={handleStopResize}
        >
          <div
            className="new-text-element-created"
            tabIndex={0}
            onClick={handleClick}
            onBlur={handleBlur}
            ref={dragRef}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClickText}
            style={{
              width: `100%`,
              height: `100%`,
              position: "relative",
              fontSize: `${props.element.fontSize}em`,
              color: props.element.fontColour,
              border: props.preview
                ? "none"
                : isHovered
                  ? "2px solid grey"
                  : "1px solid grey",
              margin: 0,
              padding: 0,
              cursor: props.preview ? "default" : "pointer",
              zIndex: props.elementNumber,
              fontFamily: props.slide.fontFamily,
            }}
            onMouseEnter={() => !props.preview && setIsHovered(true)}
            onMouseLeave={() => !props.preview && setIsHovered(false)}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {props.element.content}
            </div>
            {showCornerBoxes && (
              <ElementCornerBoxes
                parentRef={parentRef}
                elementNumber={props.elementNumber}
              ></ElementCornerBoxes>
            )}
          </div>
        </ResizableDraggableElement>
      )}
      {props.element.type === "image" && (
        <ResizableDraggableElement
          isDraggable={isDraggable}
          currentPosition={currentPosition}
          size={size}
          parentRef={parentRef}
          handleStopDragging={handleStopDragging}
          handleResizeStart={handleResizeStart}
          handleStopResize={handleStopResize}
        >
          <div
            className="new-image-element-created"
            tabIndex={0}
            ref={dragRef}
            style={{
              width: `100%`,
              height: `100%`,
              position: "absolute",
              border: props.preview
                ? "none"
                : isHovered
                  ? "2px solid grey"
                  : "1px solid grey",
              cursor: props.preview ? "default" : "pointer",
              zIndex: props.elementNumber,
              objectFit: "fill",
            }}
            onMouseEnter={() => !props.preview && setIsHovered(true)}
            onMouseLeave={() => !props.preview && setIsHovered(false)}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClickImage}
            onClick={handleClick}
            onBlur={handleBlur}
          >
            <img
              draggable={false}
              src={props.element.src}
              alt={props.element.alt}
              style={{
                height: "100%",
                width: "100%",
                userSelect: "none",
              }}
            />
            {showCornerBoxes && (
              <ElementCornerBoxes
                elementNumber={props.elementNumber}
              ></ElementCornerBoxes>
            )}
          </div>
        </ResizableDraggableElement>
      )}
      {props.element.type === "video" && (
        <ResizableDraggableElement
          isDraggable={isDraggable}
          currentPosition={currentPosition}
          size={size}
          parentRef={parentRef}
          handleStopDragging={handleStopDragging}
          handleResizeStart={handleResizeStart}
          handleStopResize={handleStopResize}
        >
          <div
            className="new-video-element-created"
            tabIndex={0}
            ref={dragRef}
            style={{
              width: `100%`,
              height: `100%`,
              position: "absolute",
              border: props.preview
                ? "none"
                : isHovered
                  ? "2px solid grey"
                  : "1px solid grey",
              cursor: props.preview ? "default" : "pointer",
              zIndex: props.elementNumber,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "grey",
              userSelect: "none",
            }}
            onMouseEnter={() => !props.preview && setIsHovered(true)}
            onMouseLeave={() => !props.preview && setIsHovered(false)}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClickVideo}
            onClick={handleClick}
            onBlur={handleBlur}
          >
            <iframe
              width="95%"
              height="95%"
              src={`${props.element.src}${
                props.element.autoPlay
                  ? (props.element.src.includes("?") ? "&" : "?") + "autoplay=1"
                  : ""
              }`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {showCornerBoxes && (
              <ElementCornerBoxes
                elementNumber={props.elementNumber}
              ></ElementCornerBoxes>
            )}
          </div>
        </ResizableDraggableElement>
      )}
      {props.element.type === "code" && (
        <ResizableDraggableElement
          isDraggable={isDraggable}
          currentPosition={currentPosition}
          size={size}
          parentRef={parentRef}
          handleStopDragging={handleStopDragging}
          handleResizeStart={handleResizeStart}
          handleStopResize={handleStopResize}
        >
          <div
            className="new-code-element-created"
            tabIndex={0}
            ref={dragRef}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClickCode}
            style={{
              width: `100%`,
              height: `100%`,
              position: "absolute",
              fontSize: `${props.element.fontSize}em`,
              border: props.preview
                ? "none"
                : isHovered
                  ? "2px solid grey"
                  : "1px solid grey",
              cursor: props.preview ? "default" : "pointer",
              zIndex: props.elementNumber,
            }}
            onMouseEnter={() => !props.preview && setIsHovered(true)}
            onMouseLeave={() => !props.preview && setIsHovered(false)}
            onClick={handleClick}
            onBlur={handleBlur}
          >
            {showCornerBoxes && (
              <ElementCornerBoxes
                elementNumber={props.elementNumber}
              ></ElementCornerBoxes>
            )}

            <SyntaxHighlighter
              language={props.element.language.toLowerCase()} // Set language dynamically
              style={hybrid}
              customStyle={{
                fontSize: `${props.element.fontSize}em`,
                whiteSpace: "pre", // Preserve whitespace (spaces, newlines, etc.)
                fontFamily: "monospace",
                overflow: "hidden",
              }}
            >
              {props.element.content}
            </SyntaxHighlighter>
          </div>
        </ResizableDraggableElement>
      )}

      <EditTextModal
        open={editTextModal}
        onClose={() => setEditTextModal(false)}
        store={props.store}
        updateStore={props.updateStore}
        slide={props.slide}
        element={props.element}
      />
      <EditImageModal
        open={editImageModal}
        onClose={() => setEditImageModal(false)}
        store={props.store}
        updateStore={props.updateStore}
        slide={props.slide}
        element={props.element}
      />
      <EditVideoModal
        open={editVideoModal}
        onClose={() => setEditVideoModal(false)}
        store={props.store}
        updateStore={props.updateStore}
        slide={props.slide}
        element={props.element}
      />
      <EditCodeModal
        open={editCodeModal}
        onClose={() => setEditCodeModal(false)}
        store={props.store}
        updateStore={props.updateStore}
        slide={props.slide}
        element={props.element}
      />
      <ConfirmationModal
        open={deleteConfirmation}
        onClick={() => {
          handleContextMenuModal();
        }}
        onClose={() => {
          setDeleteConfirmation(false);
        }}
        title={"Delete Element"}
        description={"Are you sure you want to delete this element?"}
      ></ConfirmationModal>
    </>
  );
};

export default Element;
