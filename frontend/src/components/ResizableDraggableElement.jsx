import { Rnd } from 'react-rnd';

const ResizableDraggableElement = ({
  children,
  isDraggable = true,
  currentPosition,
  size,
  parentRef,
  handleStopDragging,
  handleResizeStart,
  handleStopResize,
}) => {
  const minWidth = (parentRef.current?.offsetWidth || 0) * 0.01;
  const minHeight = (parentRef.current?.offsetHeight || 0) * 0.01;

  const parentWidth = parentRef.current?.offsetWidth || 1;
  const parentHeight = parentRef.current?.offsetHeight || 1;

  return (
    <Rnd
      minWidth={minWidth}
      minHeight={minHeight}
      disableDragging={!isDraggable}
      size={{
        width: `${(size.width / 100) * parentWidth}px`,
        height: `${(size.height / 100) * parentHeight}px`,
      }}
      position={{
        // Has to be in terms of pixels
        // currentPos x and currentPos y are stored as %
        x: (currentPosition.x / 100) * parentWidth,
        y: (currentPosition.y / 100) * parentHeight,
      }}
      bounds={parentRef.current}
      onDragStop={handleStopDragging}
      onResizeStart={handleResizeStart}
      onResizeStop={handleStopResize}
      enableResizing={{
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: isDraggable,
        bottomRight: isDraggable,
        bottomLeft: isDraggable,
        topLeft: isDraggable,
      }}
      resizeHandleStyles={{
        topRight: { cursor: 'ne-resize' },
        topLeft: { cursor: 'nwse-resize' },
        bottomRight: { cursor: 'nwse-resize' },
        bottomLeft: { cursor: 'nesw-resize' },
      }}
    >
      {children}
    </Rnd>
  );
};

export default ResizableDraggableElement;