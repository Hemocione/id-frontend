import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react'
import { SimpleButton } from '..'
import Link from 'next/link'
import { validateEmail, validateCPF, validatePhone } from '../../utils/validators'
import { signUp, } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import styles from './SignupSection.module.css'
import { useRouter } from 'next/router';
import Image from 'next/image'
import { setCookie } from '../../utils/cookie'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const genders = ['M', 'F', 'O']
const genderMapping = { 'M': 'Masculino', 'F': 'Feminino', 'O': 'Prefiro não informar' }

const SignupSection = () => {
    const router = useRouter()
    const { redirect } = router.query
    const [errorText, setErrorText] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupData, setSignupData] = useState({
        givenName: '',
        surName: '',
        bloodType: '',
        gender: '',
        document: '',
        phone: '',
        birthDate: undefined,
        email: '',
        gender: '',
        password: '',
        passConfirmation: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(process.env.NEXT_PUBLIC_SITE_KEY, { action: 'submit' }).then(captchaToken => {
                apiSignUp(captchaToken)
            }).catch((_) => {
                setLoading(false)
                setErrorText('Captcha Inválido! Você é um robô?')
            });
        });
    }
    const apiSignUp = (captchaToken) => {
        signUp({ ...signupData, 'g-recaptcha-response': captchaToken }).then((response) => {
            setLoading(false)
            if (response.status === 201) {
                setCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY, response.data.token, 15, 'hemocione.com.br')
                const locationRedirect = redirect || process.env.NEXT_PUBLIC_MAIN_SITE || 'https://www.hemocione.com.br/'
                router.push(locationRedirect)
                return
            }
            setErrorText(response.data.message);
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            setErrorText(error.response.data.message || "Ocorreu um erro inesperado. Por favor, tente novamente.")
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
                <div className={styles.title}>
                    <Image
                        src='/vertical-cor-fb.svg' width={150} height={150} alt="Hemocione Logo" />
                </div>
                <p className={styles.errorText}>{errorText}</p>
                <form onSubmit={handleSubmit}>
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
                        <InputLabel id="demo-simple-select-label">Gênero</InputLabel>
                        <Select
                            id="gender"
                            placeholder='Gênero'
                            label="Gênero"
                            onChange={handleChange('gender')}
                            fullWidth
                        >
                            {genders.map((g) => <MenuItem key={g} value={g}>{genderMapping[g]}</MenuItem>)}
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
                    <p style={{ textAlign: 'center' }}>
                        Já possui conta?
                        <b style={{
                            color: 'rgb(200, 4, 10)'
                        }}>
                            <Link href={redirect ? `/?redirect=${redirect}` : '/'} passHref>
                                {" Faça login agora!"}
                            </Link>
                        </b>
                    </p>
                    {loading
                        ? <div style={{ 'textAlign': 'center', width: '100%' }}>
                            <CircularProgress style={{ 'display': 'inline-block', 'color': 'rgb(224, 14, 22)' }} />
                        </div>
                        : <SimpleButton onClick={handleSubmit} passStyle={{ width: '100%' }}>
                            Criar conta
                        </SimpleButton>}
                </form>
            </div>
        </div >
    )
}

export default SignupSection