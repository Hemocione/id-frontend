import styles from './SimpleButton.module.css'

const SimpleButton = ({ handleClick, children, passStyle }) => (
  <button onClick={handleClick} style={passStyle} className={styles.button} type='button'>
    {children}
  </button>
)

export default SimpleButton
