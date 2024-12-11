import { styled } from "@mui/material";

const Box = styled('div') ({
  position: "absolute",
  width: "5px",
  height: "5px",
  backgroundColor: "black",
})

//Render all 4 corners
const ElementCornerBoxes = ({elementNumber}) => {


  return (
    <>
      {/* Top Left corner */}
      <Box
        id="TopLeft"
        style={{
          top: "-5px",
          left: "-5px",
          zIndex: elementNumber + 1
        }}
      />
      {/* Top Right corner */}
      <Box
        id="TopRight"
        style={{
          top: "-5px",
          right: "-5px",
          zIndex: elementNumber + 1
        }}
      />
      {/* Bottom Left corner */}
      <Box
        id="BottomLeft"
        style={{
          bottom: "-5px",
          left: "-5px",
          zIndex: elementNumber + 1
        }}
      />
      {/* Bottom Right corner */}
      <Box
        id="BottomRight"
        style={{
          bottom: "-5px",
          right: "-5px",
          zIndex: elementNumber + 1
        }}
      />
    </>
        
  );
}

export default ElementCornerBoxes