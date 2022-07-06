import styles from './SimpleButton.module.css'
import { Button } from '@mui/material';

const SimpleButton = ({ onClick, children, passStyle }) => (
  <Button type="submit" onClick={onClick} style={passStyle} className={styles.button}>
    {children}
  </Button>
)

export default SimpleButton
