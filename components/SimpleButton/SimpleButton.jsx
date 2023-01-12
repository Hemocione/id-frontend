import { Button } from "@mui/material";
import styles from "./SimpleButton.module.css";

const SimpleButton = ({ disabled, onClick, children, passStyle }) => (
  <Button
    disabled={disabled}
    type="submit"
    onClick={onClick}
    style={passStyle}
    className={styles.button}
  >
    {children}
  </Button>
);

export default SimpleButton;
