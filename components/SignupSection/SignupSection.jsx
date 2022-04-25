import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useState } from 'react'
import { SimpleButton } from '..'
import Link from 'next/link'
import { validateEmail, validateCPF, validatePhone } from '../../utils/validators'
import { postSignUp, } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import styles from './SignupSection.module.css'
import { useRouter } from 'next/router';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const SignupSection = () => {
    const router = useRouter()
    const { redirect } = router.query
    const [errorText, setErrorText] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupData, setSignupData] = useState({
        givenName: '',
        surName: '',
        bloodType: '',
        document: '',
        phone: '',
        birthDate: '',
        email: '',
        gender: '',
        password: '',
        passConfirmation: '',
    })

    const handleClick = (e) => {
        e.preventDefault();
        setLoading(true);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(process.env.NEXT_PUBLIC_SITE_KEY, { action: 'submit' }).then(captchaToken => {
                signUp(captchaToken)
            });
        });
    }
    const signUp = (captchaToken) => {
        postSignUp({ ...signupData, 'g-recaptcha-response': captchaToken }).then((response) => {
            setLoading(false)
            if (response.status === 200) {
                window.location.href = redirect || 'https://www.hemocione.com.br/'
                return
            }
            setErrorText(response.data.message);
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            setErrorText("Ocorreu um erro inesperado. Por favor, tente novamente.")
        })
    }
    const handleChange = (key) => (
        (e) => {
            const copyDict = { ...signupData }
            copyDict[key] = e.target.value
            setSignupData(copyDict)
        }
    )
    const emailError = signupData.email != '' && !validateEmail(signupData.email)
    const cpfError = signupData.document != '' && !validateCPF(signupData.document)
    const passConfError = signupData.passConfirmation != signupData.password
    const phoneError = signupData.phone != '' && !validatePhone(signupData.phone)
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
                        onChange={handleChange('givenName')}
                        value={signupData.givenName}
                        id="Primeiro nome"
                        label="Primeiro nome"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleChange('surName')}
                        value={signupData.surName}
                        id="Sobrenome"
                        label="Sobrenome"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleChange('email')}
                        value={signupData.email}
                        error={emailError}
                        helperText={emailError && 'Email inválido'}
                        id="email"
                        label="Email"
                        variant="outlined" />
                </div>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleChange('document')}
                        value={signupData.document}
                        error={cpfError}
                        helperText={cpfError && 'CPF inválido'}
                        id="CPF"
                        label="CPF"
                        variant="outlined" />
                </div>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tipo sanguíneo</InputLabel>
                    <Select
                        id="bloodType"
                        placeholder='Tipo sanguíneo'
                        label="Tipo sanguíneo"
                        onChange={handleChange('bloodType')}
                        fullWidth
                    >
                        {bloodTypes.map((bp) => <MenuItem key={bp} value={bp}>{bp}</MenuItem>)}
                    </Select>
                </FormControl>
                <div className={`${styles.field} ${styles.emailField}`}>
                    <TextField
                        fullWidth
                        onChange={handleChange('phone')}
                        value={signupData.phone}
                        error={phoneError}
                        helperText={phoneError && 'Telefone inválido (Inserir DDD)'}
                        id="Telefone"
                        label="Telefone"
                        variant="outlined" />
                </div>
                <div className={styles.field}>
                    <TextField
                        fullWidth
                        onChange={handleChange('password')}
                        value={signupData.password}
                        id="password"
                        label="Senha"
                        type="password"
                        variant="outlined" />
                </div>
                <div className={styles.field}>
                    <TextField
                        fullWidth
                        onChange={handleChange('passConfirmation')}
                        error={passConfError}
                        helperText={passConfError && 'As senhas devem ser idênticas'}
                        value={signupData.passConfirmation}
                        id="password"
                        label="Confirmar senha"
                        type="password"
                        variant="outlined" />
                </div>
                <Link href={redirect ? `/?redirect=${redirect}` : 'login'}>
                    Já possui conta? Faça login agora
                </Link>
                <p> </p>
                {loading
                    ? <div style={{ 'textAlign': 'center', width: '100%' }}>
                        <CircularProgress style={{ 'display': 'inline-block', 'color': 'rgb(224, 14, 22)' }} />
                    </div>
                    : <SimpleButton onClick={handleClick} passStyle={{ width: '100%' }}>
                        Criar conta
                    </SimpleButton>}
            </div>
        </div >
    )
}

export default SignupSection