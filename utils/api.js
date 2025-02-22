import axios from "axios";
import environment from "../environment";

const apiClient = axios.create({
  baseURL: environment.backendUrl || "http://localhost:8080",
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
const signUp = (signUpData, queryParams, captchaToken = "") => {
  return apiClient.post(
    `/users/register`,
    {
      ...signUpData,
      "g-recaptcha-response": captchaToken,
    },
    {
      params: queryParams,
    }
  );
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

const acceptTerms = ({ token }) => {
  return apiClient.post(`/users//accept-latest-legal-terms`, {}, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

export { login, signUp, validateUserToken, recoverPassword, resetPassword, acceptTerms };
