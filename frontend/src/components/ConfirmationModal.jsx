import { Modal, Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

const YesBtn = styled(Button)({
  variant: "contained",
  marginTop: "20px",
  fontSize: "0.85em",
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

export default function ConfirmationModal(props) {

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
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {props.description}
          </Typography>

          <YesBtn
            name="yes-confirm-btn"
            variant="contained"
            onClick={props.onClick} // use whatever function is passed onto onClick
          >
            Yes
          </YesBtn>
          <NoBtn
            variant="contained"
            onClick={props.onClose} // close the modal.
          >
            No
          </NoBtn>
        </Box>
      </Modal>
    </div>
  );
}
