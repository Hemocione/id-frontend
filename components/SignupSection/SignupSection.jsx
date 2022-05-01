import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
        birthDate: undefined,
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
    const handleBday = value => {
        const copyDict = { ...signupData }
        console.log(value)
        copyDict['birthDate'] = value
        setSignupData(copyDict)
    }
    const emailError = signupData.email != '' && !validateEmail(signupData.email)
    const cpfError = signupData.document != '' && !validateCPF(signupData.document)
    const passError = signupData.password != '' && signupData.password.length < 7
    const passConfError = signupData.passConfirmation != ''
        && signupData.passConfirmation != signupData.password
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
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <TextField
                        fullWidth
                        onChange={handleChange('givenName')}
                        value={signupData.givenName}
                        id="Primeiro nome"
                        label="Primeiro nome"
                        variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <TextField
                        fullWidth
                        onChange={handleChange('surName')}
                        value={signupData.surName}
                        id="Sobrenome"
                        label="Sobrenome"
                        variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <TextField
                        fullWidth
                        onChange={handleChange('email')}
                        value={signupData.email}
                        error={emailError}
                        helperText={emailError && 'Email inválido'}
                        id="email"
                        label="Email"
                        variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <TextField
                        fullWidth
                        onChange={handleChange('document')}
                        value={signupData.document}
                        error={cpfError}
                        helperText={cpfError && 'CPF inválido'}
                        id="CPF"
                        label="CPF"
                        variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
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
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <LocalizationProvider
                        fullWidth
                        dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Data de nascimento"
                            value={signupData.birthDate}
                            onChange={handleBday}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <TextField
                        fullWidth
                        onChange={handleChange('phone')}
                        value={signupData.phone}
                        error={phoneError}
                        helperText={phoneError && 'Telefone inválido (Inserir DDD)'}
                        id="Telefone"
                        label="Telefone"
                        variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
                    <TextField
                        fullWidth
                        onChange={handleChange('password')}
                        value={signupData.password}
                        error={passError}
                        helperText={passError && 'A senha deve ter pelo menos 7 caracteres'}
                        id="password"
                        label="Senha"
                        type="password"
                        variant="outlined" />
                </FormControl>
                <FormControl fullWidth sx={{ 'margin-bottom': '15px' }}>
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
                </FormControl>
                <Link href={redirect ? `/?redirect=${redirect}` : '/'}>
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