import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://brasilapi.com.br/api",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCepData = async (cep) => {
  try {
    const res = await apiClient.get(`/cep/v2/${cep}`);
    return res;
  } catch (error) {
    const res = await apiClient.get(`/cep/v1/${cep}`);
    return res;
  }
};

export { getCepData };
