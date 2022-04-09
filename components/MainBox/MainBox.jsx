import { style } from '@mui/system'
import { LoginSection } from '..'
import styles from './MainBox.module.css'
const MainBox = () => (
    <div className={styles.mainBox}>
        <div className={styles.logoStrip}>
        </div>
        <LoginSection />
    </div>
)

export default MainBox