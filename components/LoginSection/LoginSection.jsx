import { TextField } from '@mui/material'
import styles from './LoginSection.module.css'

const LoginSection = () => {
    return (
        <div>
            <h1 className={styles.title}>
                Faça login!
                <br></br>
                Ou sofra as consequências!
            </h1>
            <div>
                <TextField id="email" label="Email" variant="outlined" />
            </div>
            <div>
                <TextField id="password" label="Senha" variant="outlined" />
            </div>
        </div>
    )
}

export default LoginSection