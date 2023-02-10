import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://brasilapi.com.br/api",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCepData = (cep) => {
  return apiClient.get(`/cep/v2/${cep}`);
};

export { getCepData };
