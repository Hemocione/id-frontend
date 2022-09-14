import { TextField } from '@mui/material'
import { useState } from 'react'
import Image from 'next/image'
import { SimpleButton } from '..'
import { validateEmail } from '../../utils/validators'
import { CircularProgress } from '@mui/material';
import styles from './RecoverSection.module.css'
import { useRouter } from 'next/router';

const LoginSection = () => {
    const router = useRouter()
    const { redirect } = router.query
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        // e.preventDefault();
        // setLoading(true);
        // window.grecaptcha.ready(() => {
        //     window.grecaptcha.execute(process.env.NEXT_PUBLIC_SITE_KEY, { action: 'submit' }).then(captchaToken => {
        //         console.log(captchaToken)
        //         apiLogin(captchaToken)
        //     }).catch((_) => {
        //         setLoading(false)
        //         setErrorText('Captcha Inválido! Você é um robô?')
        //     })
        // });
    }

    const apiLogin = (captchaToken) => {
        // login({ ...loginData, captchaToken: captchaToken }).then((response) => {
        //     setLoading(false)
        //     if (response.status === 200) {
        //         setCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY, response.data.token, 15, 'hemocione.com.br')
        //         const locationRedirect = redirect || process.env.NEXT_PUBLIC_MAIN_SITE || 'https://www.hemocione.com.br/'
        //         router.push(locationRedirect)
        //         return
        //     }
        //     setErrorText(response.data.message);
        // }).catch((error) => {
        //     setLoading(false)
        //     setErrorText(error.response.data.message || "Ocorreu um erro inesperado. Por favor, tente novamente.")
        // })
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const emailError = email != '' && !validateEmail(email)

    return (
        <div className={styles.recoverSection}>
            <form onSubmit={handleSubmit}>
                <div className={styles.recoverContent}>
                    <div className={styles.title}>
                        <Image
                            src='/vertical-cor-fb.svg' width={150} height={150} alt="Hemocione Logo" />
                    </div>
                    <div className={`${styles.field} ${styles.emailField}`}>
                        <TextField
                            fullWidth
                            onChange={handleEmailChange}
                            value={email}
                            error={emailError}
                            helperText={emailError && 'Email inválido'}
                            id="email"
                            label="Email"
                            variant="outlined" />
                    </div>
                    {loading
                        ? <div style={{ 'textAlign': 'center', width: '100%' }}>
                            <CircularProgress style={{ 'display': 'inline-block', 'color': 'rgb(224, 14, 22)' }} />
                        </div>
                        : <SimpleButton onClick={handleSubmit} passStyle={{ width: '100%' }}>
                            Entrar
                        </SimpleButton>}
                </div>
            </form>
        </div>
    )
}

export default LoginSection