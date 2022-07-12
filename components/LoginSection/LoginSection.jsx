import { TextField } from '@mui/material'
import { useState } from 'react'
import Image from 'next/image'
import { SimpleButton } from '..'
import { validateEmail } from '../../utils/validators'
import { login } from '../../utils/api';
import { setCookie } from '../../utils/cookie'
import { CircularProgress } from '@mui/material';
import styles from './LoginSection.module.css'
import { useRouter } from 'next/router';
import Link from 'next/link'

const LoginSection = () => {
    const router = useRouter()
    const { redirect } = router.query
    const [errorText, setErrorText] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginData, setloginData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(process.env.NEXT_PUBLIC_SITE_KEY, { action: 'submit' }).then(captchaToken => {
                login(captchaToken)
            }).catch((_) => {
                setLoading(false)
                setErrorText('Captcha Inválido! Você é um robô?')
            })
        });
    }
    const login = (captchaToken) => {
        login({ ...loginData, captchaToken: captchaToken }).then((response) => {
            setLoading(false)
            if (response.status === 200) {
                setCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY, response.data.token, 30, 'hemocione.com.br')
                window.location.href = redirect || 'https://www.hemocione.com.br/'
                return
            }
            setErrorText(response.data.message);
        }).catch((error) => {
            setLoading(false)
            setErrorText(error.response.data.message || "Ocorreu um erro inesperado. Por favor, tente novamente.")
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
            <form onSubmit={handleSubmit}>
                <div className={styles.loginContent}>
                    <div className={styles.title}>
                        <Image
                            src='/vertical-cor-fb.svg' width={150} height={150} alt="Hemocione Logo" />
                    </div>
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
                    <p style={{ textAlign: 'center' }}>
                        Ainda não possui conta?
                        <b style={{
                            color: 'rgb(200, 4, 10)'
                        }}>
                            <Link href={redirect ? `signup/?redirect=${redirect}` : 'signup'} passHref>
                                {" Cadastre-se agora!"}
                            </Link>
                        </b>
                    </p>
                    {loading
                        ? <div style={{ 'textAlign': 'center', width: '100%' }}>
                            <CircularProgress style={{ 'display': 'inline-block', 'color': 'rgb(224, 14, 22)' }} />
                        </div>
                        : <SimpleButton onClick={handleSubmit} passStyle={{ width: '100%' }}>
                            Entrar
                        </SimpleButton>}
                </div>
            </form>
        </div >
    )
}

export default LoginSection