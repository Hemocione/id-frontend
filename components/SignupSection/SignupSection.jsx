import {
  FormGroup,
  FormControl,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import Link from "next/link";
import {
  validateEmail,
  validatePhone,
  validateCEP,
  validateCPF,
} from "../../utils/validators";
import { signUp } from "../../utils/api";
import styles from "./SignupSection.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { setCookie } from "../../utils/cookie";
import {
  getCidadesFromEstado,
  getEstadosListWithLabel,
} from "../../utils/brasilApi";
import { getCepData } from "../../utils/address";
import useDebounce from "../../utils/useDebounce";
import environment from "../../environment";
import { getDigitalStandRedirectUrl } from "../../utils/digitalStand";
import { ptBR as DatePickerLocale } from "@mui/x-date-pickers/locales";
import { SimpleButton, CepMask, PhoneMask, BloodType, CpfMask } from "..";
import _ from "lodash";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["M", "F", "O"];
const genderMapping = {
  M: "Masculino",
  F: "Feminino",
  O: "Prefiro não informar",
};
const estadosWithLabel = getEstadosListWithLabel();
const estados = estadosWithLabel.map((e) => e.value);
const getEstadoLabel = (estado) => {
  const estadoObj = estadosWithLabel.find((e) => e.value === estado);
  return estadoObj?.label || estado;
};

const SignupSection = () => {
  const router = useRouter();
  const { redirect, leadId, uuid, eventRef } = router.query;
  const encodedRedirect = redirect ? encodeURIComponent(redirect) : "";
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptToCEPSearch, setAttemptToCEPSearch] = useState(false);
  const [_searchingCities, setSearchingCities] = useState(false);
  const [_cities, setCities] = useState([]);
  const [unknownBloodType, setUnknownBloodType] = useState(false);
  const [computedAddress, setComputedAddress] = useState(false);
  const [signupData, setSignupData] = useState({
    givenName: "",
    surName: "",
    bloodType: "",
    gender: "O",
    phone: "",
    birthDate: "",
    email: "",
    password: "",
    passConfirmation: "",
    document: "",
    address: {
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      coordinates: {
        longitude: "",
        latitude: "",
      },
    },
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    apiSignUp();
    // window.grecaptcha.ready(() => {
    //   window.grecaptcha
    //     .execute(environment.publicSiteKey, { action: "submit" })
    //     .then((captchaToken) => {
    //       apiSignUp(captchaToken);
    //     })
    //     .catch((_) => {
    //       setLoading(false);
    //       setErrorText("Captcha Inválido! Você é um robô?");
    //     });
    // });
  };
  const apiSignUp = () => {
    const data = _.cloneDeep(signupData);
    if (data.address.cep) {
      const hydratedPostalCode = data.address.cep.replace(/\D/g, "");
      data.address.postalCode = hydratedPostalCode;
    }

    if (unknownBloodType) {
      data.bloodType = "-";
    }

    const options =
      leadId && uuid ? { leadId: String(leadId), uuid: String(uuid) } : {};
    const hydratedPhone = (data.phone || eventRef).replace(/\D/g, "").trim();
    const hydratedSignUpData = {
      ...data,
      phone: hydratedPhone,
    };

    signUp(hydratedSignUpData, options)
      .then((response) => {
        setLoading(false);
        if ([200, 201].includes(response.status)) {
          if (response.data["token"]) {
            setCookie(
              environment.tokenCookieKey,
              response.data.token,
              15,
              "hemocione.com.br"
            );
          }

          const digitalStandRedirect =
            leadId && uuid
              ? getDigitalStandRedirectUrl(String(leadId), String(uuid))
              : null;

          const locationRedirect =
            digitalStandRedirect ||
            redirect ||
            environment.mainFrontendUrl ||
            "https://www.hemocione.com.br/";

          const url = new URL(locationRedirect);
          url.searchParams.append("token", response.data.token);
          const newLocationRedirect = url.toString();

          window.open(newLocationRedirect, "_self");
          return;
        }
        setErrorText(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setErrorText(
          error.response?.data?.message ||
            "Ocorreu um erro inesperado. Por favor, tente novamente."
        );
      });
  };

  const debouncedSearchAndUpdateAddress = useDebounce(async () => {
    try {
      if (signupData.address.cep.length < 8) return;

      const cep = signupData.address.cep.replace(/\D/g, "");
      const { data } = await getCepData(cep);
      if (!data) return; // API call worked but no data was returned - invalid CEP

      const copyDict = { ...signupData };
      copyDict.address = data;
      copyDict.address.cep = cep;
      setSignupData(copyDict);
    } catch (error) {
      console.error(error);
      setAttemptToCEPSearch(true);
    } finally {
      setComputedAddress(true);
    }
  }, 700);

  const debouncedSearchCities = useDebounce(async () => {
    setSearchingCities(true);
    try {
      const cities = await getCidadesFromEstado(signupData.address.state);
      setCities(cities);
    } catch (error) {
    } finally {
      setSearchingCities(false);
    }
  }, 700);

  const handleCEPChange = async (e) => {
    const cep = e.target.value;
    const copyDict = { ...signupData };
    copyDict.address.cep = cep;
    setSignupData(copyDict);
    if (cep) debouncedSearchAndUpdateAddress();
  };

  const handleChange = (key) => (e) => {
    const copyDict = { ...signupData };
    _.set(copyDict, key, e.target.value);
    setSignupData(copyDict);
  };

  const handleStateChange = async (e) => {
    const estado = e.target.value;
    const copyDict = { ...signupData };
    copyDict.address.state = estado;
    setSignupData(copyDict);
    if (estado) debouncedSearchCities(estado);
  };

  function handleTermsCheckBox() {
    setAcceptedTerms(!acceptedTerms);
  }

  function handlePolicyPrivacyCheckbox() {
    setAcceptedPrivacyPolicy(!acceptedPrivacyPolicy);
  }

  function handleUnknownBloodTypeCheckbox() {
    if (!unknownBloodType) {
      // Clear blood type if unknown is selected
      handleChange("bloodType")({ target: { value: "" } });
    }
    setUnknownBloodType(!unknownBloodType);
  }

  const emailError = signupData.email != "" && !validateEmail(signupData.email);
  const passError = signupData.password != "" && signupData.password.length < 7;
  const passConfError =
    signupData.passConfirmation != "" &&
    signupData.passConfirmation != signupData.password;
  const phoneError = signupData.phone != "" && !validatePhone(signupData.phone);
  const cpfError =
    signupData.document != "" && !validateCPF(signupData.document);

  const cepError =
    signupData.address.cep != "" && !validateCEP(signupData.address.cep);

  const validBloodSelection = unknownBloodType || signupData.bloodType;

  const disabledButton =
    !signupData.givenName ||
    !signupData.surName ||
    !validBloodSelection ||
    !signupData.email ||
    !signupData.password ||
    !signupData.passConfirmation ||
    !signupData.gender ||
    !signupData.birthDate ||
    !signupData.address.cep ||
    !signupData.document ||
    cpfError ||
    passConfError ||
    passError ||
    emailError ||
    phoneError ||
    !acceptedTerms ||
    !acceptedPrivacyPolicy;

  return (
    <div className={styles.loginSection}>
      <div className={styles.loginContent}>
        <div className={styles.titleHeader}>
          <Image
            src="/logo.svg"
            width={150}
            height={150}
            alt="Hemocione Logo"
          />
          <h2 className={styles.title}>Cadastre-se agora!</h2>
          <span className={styles.subsectionTitleExplanation}>
            Faça parte da Rede Hemocione de doadores e ajude a salvar vidas!
          </span>
        </div>
        <FormGroup onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ margin: "15px 0" }}>
            <TextField
              fullWidth
              onChange={handleChange("givenName")}
              value={signupData.givenName}
              id="Nome"
              label="Nome"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("surName")}
              value={signupData.surName}
              id="Sobrenome"
              label="Sobrenome"
              name="surName"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("email")}
              value={signupData.email}
              error={emailError}
              id="email"
              label="Email"
              name="email"
              variant="outlined"
              autoComplete="username"
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("document")}
              value={eventRef ? String(eventRef) : signupData.document}
              error={cpfError}
              id="cpf"
              label="CPF"
              variant="outlined"
              name="cpf"
              disabled={eventRef ? true : false}
              InputProps={{
                inputComponent: CpfMask,
              }}
              required
            />
          </FormControl>
          <hr className={styles.divider} />
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <h4 className={styles.subsectionTitle}>
              Qual seu tipo sanguíneo?{" "}
            </h4>
            <div className={styles.bloodTypeRow}>
              {bloodTypes.map((bt) => (
                <BloodType
                  key={bt}
                  value={bt}
                  active={signupData.bloodType === bt}
                  disabled={unknownBloodType}
                  clickCall={(_) => {
                    handleChange("bloodType")({ target: { value: bt } });
                  }}
                />
              ))}
            </div>
            <div className={styles.bloodTypeUnknown}>
              <Checkbox
                checked={unknownBloodType}
                onChange={handleUnknownBloodTypeCheckbox}
                sx={{
                  "& .MuiSvgIcon-root": {
                    color: "#D1151A",
                  },
                }}
              />
              <span>Não sei meu tipo sanguíneo ou não quero informá-lo 😔</span>
            </div>
          </FormControl>
          <hr className={styles.divider} />
          <div className={styles.twoColumns}>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <InputLabel id="gender" required>
                Gênero
              </InputLabel>
              <Select
                labelId="gender"
                id="gender"
                placeholder="Gênero"
                label="Gênero"
                onChange={handleChange("gender")}
                name="gender"
                fullWidth
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {genderMapping[g]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <LocalizationProvider
                fullWidth
                dateAdapter={AdapterDateFns}
                localeText={
                  DatePickerLocale.components.MuiLocalizationProvider
                    .defaultProps.localeText
                }
                adapterLocale={ptBR}
              >
                <DatePicker
                  label="Data de nascimento *"
                  value={signupData.birthDate}
                  name="birthDate"
                  onChange={(value) =>
                    handleChange("birthDate")({ target: { value } })
                  }
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("phone")}
              value={eventRef ? String(eventRef) : signupData.phone}
              error={phoneError}
              id="Telefone"
              label="Telefone"
              variant="outlined"
              name="phone"
              disabled={eventRef ? true : false}
              InputProps={{
                inputComponent: PhoneMask,
              }}
              required
            />
          </FormControl>
          <hr className={styles.divider} />
          <h4 className={styles.subsectionTitle}>
            Qual o seu endereço?{" "}
            <span className={styles.subsectionTitleExplanation}>
              Precisamos saber disso para encontrar bancos de sangue e campanhas
              próximas a você!
            </span>
          </h4>
          <div className={styles.twoColumns}>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                fullWidth
                onChange={handleCEPChange}
                value={signupData.address.cep}
                error={cepError}
                label="CEP"
                id="cep"
                name="cep"
                variant="outlined"
                InputProps={{
                  inputComponent: CepMask,
                }}
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <InputLabel id="state" required>
                Estado
              </InputLabel>
              <Select
                labelId="state"
                id="state"
                placeholder="Estado"
                label="Estado"
                value={signupData.address.state}
                onChange={handleChange("address.state")}
                name="state"
                disabled={!attemptToCEPSearch}
                fullWidth
              >
                {estados.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {getEstadoLabel(estado)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled={!attemptToCEPSearch}
                fullWidth
                onChange={handleChange("address.city")}
                value={signupData.address.city}
                required
                label="Cidade"
                placeholder="Cidade"
                id="city"
                name="city"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled={!computedAddress}
                fullWidth
                onChange={handleChange("address.neighborhood")}
                value={signupData.address.neighborhood}
                label="Bairro"
                id="neighborhood"
                name="neighborhood"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled={!computedAddress}
                fullWidth
                onChange={handleChange("address.street")}
                value={signupData.address.street}
                label="Rua"
                id="street"
                name="street"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                fullWidth
                onChange={handleChange("address.number")}
                value={signupData.address.number}
                label="Número"
                id="address-number"
                name="address-number"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                fullWidth
                onChange={handleChange("address.complement")}
                value={signupData.address.complement}
                label="Complemento"
                id="complement"
                name="complement"
                variant="outlined"
              />
            </FormControl>
          </div>
          <hr className={styles.divider} />
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("password")}
              value={signupData.password}
              error={passError}
              helperText={
                passError && "A senha deve ter pelo menos 7 caracteres"
              }
              id="password"
              name="password"
              label="Senha"
              type="password"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("passConfirmation")}
              error={passConfError}
              value={signupData.passConfirmation}
              id="password-confirmation"
              name="password-confirmation"
              label="Confirmar senha"
              type="password"
              variant="outlined"
              required
            />
          </FormControl>
          <div className={styles.checkBoxRow}>
            <Checkbox
              checked={acceptedTerms}
              onChange={handleTermsCheckBox}
              sx={{
                "& .MuiSvgIcon-root": {
                  color: "#D1151A",
                },
              }}
            />
            <span>
              Eu declaro que aceito os{" "}
              <a
                href={environment.legal.termsOfUse}
                rel="noreferrer"
                target="_blank"
                className={styles.legalDocumentLink}
              >
                Termos de Uso
              </a>
            </span>
          </div>
          <div className={styles.checkBoxRow}>
            <Checkbox
              checked={acceptedPrivacyPolicy}
              onChange={handlePolicyPrivacyCheckbox}
              sx={{
                "& .MuiSvgIcon-root": {
                  color: "#D1151A",
                },
              }}
            />
            <span>
              Eu declaro que aceito a{" "}
              <a
                href={environment.legal.privacyPolicyUrl}
                rel="noreferrer"
                target="_blank"
                className={styles.legalDocumentLink}
              >
                Política de Privacidade
              </a>
            </span>
          </div>
          <SimpleButton
            loading={loading}
            disabled={disabledButton}
            onClick={handleSubmit}
            passStyle={{
              width: "100%",
              display: "var(--display-signup-button-bottom)",
              borderRadius: 0,
            }}
          >
            {loading ? "" : "Criar conta"}
          </SimpleButton>
          <SimpleButton
            loading={loading}
            disabled={disabledButton}
            onClick={handleSubmit}
            passStyle={{
              width: "100%",
              margin: "16px auto",
              display: "var(--display-signup-button-normal)",
            }}
          >
            {loading ? "" : "Criar conta"}
          </SimpleButton>
          {leadId && uuid ? null : (
            <p style={{ textAlign: "center", margin: 0, marginTop: "10px" }}>
              Já possui conta?
              <b
                style={{
                  color: "rgb(200, 4, 10)",
                }}
              >
                <Link
                  href={encodedRedirect ? `/?redirect=${encodedRedirect}` : "/"}
                  passHref
                >
                  {" Faça login!"}
                </Link>
              </b>
            </p>
          )}
          <p className={styles.errorText}>{errorText}</p>
        </FormGroup>
      </div>
    </div>
  );
};

export default SignupSection;
