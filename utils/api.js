import axios from "axios";
const { NEXT_PUBLIC_BACKEND_URL } = process.env;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const login = ({ email, password, captchaToken }) => {
  return apiClient.post(`/users/login`, {
    email: email,
    password: password,
    "g-recaptcha-response": captchaToken,
  });
};
const signUp = (signUpData, captchaToken) => {
  return apiClient.post(`/users/register`, {
    ...signUpData,
    "g-recaptcha-response": captchaToken,
  });
};
const validateUserToken = ({ token }) => {
  return apiClient.get(`/users/validate-token`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

const recoverPassword = (email, captchaToken) => {
  let response = apiClient.post(`/users/recover-password`, {
    email: email,
    "g-recaptcha-response": captchaToken,
  });
  return response;
};

const resetPassword = ({ newPassword, captchaToken, recoverToken }) => {
  return apiClient.post(
    `/users/reset-password`,
    {
      newPassword: newPassword,
      "g-recaptcha-response": captchaToken,
    },
    {
      headers: {
        Authorization: "Bearer " + recoverToken,
      },
    }
  );
};
export { login, signUp, validateUserToken, recoverPassword, resetPassword };
