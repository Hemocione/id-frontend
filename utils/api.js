import axios from "axios";
const { NEXT_PUBLIC_BACKEND_URL } = process.env;

const apiClient = axios.create(
    {
        baseURL: NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    }
)

const login = ({ email, password, captchaToken }) => {
    return (apiClient.post(`/users/login`, {
        'email': email,
        'password': password,
        'g-recaptcha-response': captchaToken,
    }))
}
const signUp = (signUpData) => {
    return (apiClient.post(`/users/register`, signUpData))
}
const validateUserToken = ({ token }) => {
    return (apiClient.get(`/users/validate-token`, { headers: {
        'Authorization': 'Bearer ' + token,
    }}))
}

export { login, signUp, validateUserToken }