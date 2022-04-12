import { TextField } from '@mui/material'
import { useState } from 'react'
import { SimpleButton } from '..'
import { validateEmail, postLogin, setCookie } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import styles from './SignupSection.module.css'

const SignupSection = () => {
    const [errorText, setErrorText] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginData, setloginData] = useState({
        email: '',
        password: '',
    })

    const handleClick = (e) => {
        e.preventDefault();
        setLoading(true);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(process.env.NEXT_PUBLIC_SITE_KEY, { action: 'submit' }).then(captchaToken => {
                login(captchaToken)
            });
        });
    }
    const login = (captchaToken) => {
        postLogin({ ...loginData, captchaToken: captchaToken }).then((response) => {
            setLoading(false)
            if (response.status === 200) {
                setCookie('hemocioneIdToken', response.data.token, 30, 'hemocione.com.br')
                var url_string = window.location.href
                var url = new URL(url_string);
                var redirect = url.searchParams.get("redirect");
                window.location.href = redirect
                    ? redirect
                    : process.env.NEXT_PUBLIC_MAIN_FRONTEND_URL
                return
            }
            setErrorText(response.data.message);
        }).catch((error) => {
            setLoading(false)
            setErrorText("Ocorreu um erro inesperado. Por favor, tente novamente.")
        })
    }
    const handleEmailChange = (e) => {
        setloginData({ ...loginData, email: e.target.value })
    }
    const handlePassChange = (e) => {
        setloginData({ ...loginData, password: e.target.value })
    }
    const emailError = loginData.email != '' && !validateEmail(loginData.email)
    return (
        <div className={styles.loginSection}>
            <div className={styles.loginContent}>
                <h1 className={styles.title}>
                    Faça Cadastro!
                    <br></br>
                    Ou sofra as consequências!
                </h1>
                <p className={styles.errorText}>{errorText}</p>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'Email inválido'}
                        id="email"
                        label="Email"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'CPF inválido'}
                        id="CPF"
                        label="CPF"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'Primeiro nome inválido'}
                        id="Primeiro nome"
                        label="Primeiro nome"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'Sobrenome inválido'}
                        id="Sobrenome"
                        label="Sobrenome"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'Tipo sanguineo inválido'}
                        id="Tipo sanguineo"
                        label="Tipo sanguineo"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'Genero inválido'}
                        id="Genero"
                        label="Genero"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={loginData.email}
                        error={emailError}
                        helperText={emailError && 'Telefone inválido'}
                        id="Telefone"
                        label="Telefone"
                        variant="outlined" />
                </div>
                <div className={styles.field}>
                    <TextField
                        fullWidth
                        onChange={handlePassChange}
                        value={loginData.password}
                        id="password"
                        label="Senha"
                        type="password"
                        variant="outlined" />
                </div>
                <p>Esqueceu a senha?</p>
                {loading
                    ? <div style={{ 'textAlign': 'center', width: '100%' }}>
                        <CircularProgress style={{ 'display': 'inline-block', 'color': 'rgb(224, 14, 22)' }} />
                    </div>
                    : <SimpleButton onClick={handleClick} passStyle={{ width: '100%' }}>
                        Entrar
                    </SimpleButton>}
            </div>
        </div >
    )
}

export default SignupSection