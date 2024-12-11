import React, { useState, useRef } from "react";
import { Modal, Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Form from "react-bootstrap/Form";
import ErrorModal from "./ErrorModal";

const StyledFormControl = styled(Form.Control)({
  width: "100%",
  marginTop: "5px",
});

const YesBtn = styled(Button)({
  variant: "contained",
  marginTop: "20px",
  fontSize: "0.80em",
  width: "25%",
});

const NoBtn = styled(YesBtn)({
  backgroundColor: "red",
  marginLeft: "10px",
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

export default function EditThumbnailModal(props) {
  const [imageUrl, setImageUrl] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const convertImgToBase64 = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Async - when reader success, set image url.
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        setErrorMessage("Failed to read file")
        setErrorModal(true)
        reject();
      };
    });
  };

  const handleConfirm = async () => {
    if (!imageUrl && !file) {
      setErrorMessage("At least one field must be filled.");
      setErrorModal(true)
    } else if (imageUrl && file) {

      setErrorMessage("Only one field can be filled")
      setErrorModal(true)
    } else {
      let finalImageUrl = imageUrl;
      if (file) {
        if (!file.type.startsWith("image/")) {
          setErrorMessage("Please upload a valid image file.")
          setErrorModal(true)
          setFile(null); // Clear the file if it’s not an image
          handleDeleteFile();
          return; // exit out of function
        }

        finalImageUrl = await convertImgToBase64(); // sets imageurl, wait for function to finish
      }

      props.onClick(finalImageUrl);
      setImageUrl("");
      setFile(null);
      props.onClose();
    }
  };

  const handleCancel = () => {
    // Clear states and close modal
    setImageUrl("");
    setFile(null);
    props.onClose();
  };

  const handleDeleteFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input value
    }
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
            {props.title}
          </Typography>{" "}
          <br />
          <Form
            sx={{ display: "flex", flexDirection: "column" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <StyledFormControl
                name="edit-thumbnail-image-url"
                type="text"
                placeholder="https://www.example.com/image.jpg?v=123456789"
                onChange={(e) => setImageUrl(e.target.value)} // file object
              />
            </Form.Group>
            <br />
            OR <br />
            <br />
            <Form.Group>
              <Form.Label>Upload File</Form.Label>
              <StyledFormControl
                style={{ border: "1px solid grey", borderRadius: "4px" }}
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <IconButton onClick={handleDeleteFile}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Form.Group>
          </Form>
          <YesBtn
            variant="contained"
            onClick={handleConfirm} // use whatever function is passed onto onClick
            name="edit-thumbnail-confirm"
          >
            Confirm
          </YesBtn>
          <NoBtn
            variant="contained"
            onClick={handleCancel} // close the modal.
          >
            Cancel
          </NoBtn>
        </Box>
      </Modal>
      <ErrorModal
        open={errorModal}
        handleClose={()=>{setErrorModal(false)}}
        title={"Error"}
        description={errorMessage}
      >
      </ErrorModal>
    </div>
  );
}
