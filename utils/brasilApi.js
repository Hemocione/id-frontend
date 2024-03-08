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

const getEstadosListWithLabel = () => {
  return [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" }
  ]
}

const getCidadesFromEstado = async (estado) => {
  try {
    const { data } = await apiClient.get(`/ibge/municipios/v1/${estado}?providers=dados-abertos-br,gov,wikipedia`);
    return data.map(c => c.nome)
  } catch (error) {
    return []
  }
}

export { getCepData, getCidadesFromEstado, getEstadosListWithLabel };