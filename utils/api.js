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

const postLogin = ({ email, password, captchaToken }) => {
    return (apiClient.post(`/users/login`, {
        'email': email,
        'password': password,
        'g-recaptcha-response': captchaToken,
    }))
}
const postSignUp = (signUpData) => {
    return (apiClient.post(`/users/register`, signUpData))
}
const postValidate = ({ token }) => {
    return (apiClient.post(`/users/validate-token`, {
        'authUser': token,
    }))
}

export { postLogin, postSignUp, postValidate }