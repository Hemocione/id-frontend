import styles from './SimpleButton.module.css'

const SimpleButton = ({ onClick, children, passStyle }) => (
  <button onClick={onClick} style={passStyle} className={styles.button} type='button'>
    {children}
  </button>
)

export default SimpleButton
