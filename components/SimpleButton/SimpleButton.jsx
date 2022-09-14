import { Button } from '@mui/material'
import styles from './SimpleButton.module.css'

const SimpleButton = ({ onClick, children, passStyle }) => (
  <Button type="submit" onClick={onClick} style={passStyle} className={styles.button}>
    {children}
  </Button>
)

export default SimpleButton
