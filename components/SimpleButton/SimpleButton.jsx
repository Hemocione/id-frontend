import { LoadingButton } from "@mui/lab";
import styles from "./SimpleButton.module.css";

const SimpleButton = ({ disabled, onClick, children, passStyle, loading }) => (
  <LoadingButton
    loading={loading}
    disabled={disabled}
    type="submit"
    onClick={onClick}
    style={passStyle}
    className={styles.button}
    variant="outlined"
  >
    {children}
  </LoadingButton>
);

export default SimpleButton;
