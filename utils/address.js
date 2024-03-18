import * as BrasilApi from './brasilApi'
import * as ViaCep from './viaCep'

const getCepData = async (cep) => {
  const brasilApiRes = BrasilApi.getCepData(cep)
  const viaCepRes = ViaCep.getCepData(cep)
  const res = await Promise.any([brasilApiRes, viaCepRes])
  return res
}

export { getCepData }