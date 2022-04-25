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
function setCookie(cname, cvalue, exdays, domain) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    let _domain = "domain=" + domain
    document.cookie = cname + "=" + cvalue + ";" + expires + ";" + _domain + ";" + ";path=/";
}

export { postLogin, postSignUp, setCookie }