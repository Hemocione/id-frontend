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

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined
}

export { postLogin, postSignUp, setCookie, getCookie }