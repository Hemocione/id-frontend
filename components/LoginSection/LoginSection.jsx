import { TextField } from '@mui/material'
import { SimpleButton } from '..'
import styles from './LoginSection.module.css'

const LoginSection = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.loginSection}>
                <h1 className={styles.title}>
                    Faça login!
                    <br></br>
                    Ou sofra as consequências!
                </h1>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        id="email"
                        label="Email"
                        variant="outlined" />
                </div>
                <div className={styles.field}>
                    <TextField
                        fullWidth
                        id="password"
                        label="Senha"
                        variant="outlined" />
                </div>
                <p>Esqueceu a senha?</p>
                <SimpleButton passStyle={{ width: '100%' }}>Entrar</SimpleButton>
            </div>
        </div>
    )
}

export default LoginSection