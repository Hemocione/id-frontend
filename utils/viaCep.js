import axios from "axios";

const viaCepApiClient = axios.create({
  baseURL: "https://viacep.com.br/ws",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCepData = async (cep) => {
  const res = await viaCepApiClient.get(`/${cep}/json`);
  res.data = {
    cep: cep,
    neighborhood: res.data.bairro,
    street: res.data.logradouro,
    city: res.data.localidade,
    state: res.data.uf,
  };
  return res;
};

export { getCepData };
