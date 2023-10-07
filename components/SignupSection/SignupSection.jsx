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
import { SimpleButton } from "..";
import Link from "next/link";
import { validateEmail, validatePhone } from "../../utils/validators";
import { signUp } from "../../utils/api";
import styles from "./SignupSection.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { setCookie } from "../../utils/cookie";
import { getCepData } from "../../utils/brasilApi";
import { BloodType } from "..";
import useDebounce from "../../utils/useDebounce";
import environment from "../../environment";
import { getDigitalStandRedirectUrl } from "../../utils/digitalStand";
import { ptBR as DatePickerLocale } from "@mui/x-date-pickers/locales";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["M", "F", "O"];
const genderMapping = {
  M: "Masculino",
  F: "Feminino",
  O: "Prefiro não informar",
};

const SignupSection = () => {
  const router = useRouter();
  const { redirect, leadId, uuid, eventRef } = router.query;
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    givenName: "",
    surName: "",
    bloodType: "",
    gender: "O",
    phone: "",
    birthDate: undefined,
    email: "",
    gender: "",
    password: "",
    passConfirmation: "",
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
    if (signupData.address.cep) {
      signupData.address.postalCode = signupData.address.cep;
    }

    const options =
      leadId && uuid ? { leadId: String(leadId), uuid: String(uuid) } : {};
    const hydratedSignUpData = {
      ...signupData,
      phone: signupData.phone || eventRef,
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
          router.push(locationRedirect);
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
      if (!data) return setErrorText("CEP inválido");

      const copyDict = { ...signupData };
      copyDict.address = data;
      copyDict.address.cep = cep;
      setSignupData(copyDict);
    } catch (error) {
      console.error(error);
      setErrorText("CEP inválido");
    }
  }, 700);

  const handleCEPChange = async (e) => {
    const cep = e.target.value;
    const copyDict = { ...signupData };
    copyDict.address.cep = cep;
    setSignupData(copyDict);
    if (cep) debouncedSearchAndUpdateAddress();
  };

  const handleNumberChange = (e) => {
    const number = e.target.value;
    const copyDict = { ...signupData };
    copyDict.address.number = number;
    setSignupData(copyDict);
  };

  const handleComplementChange = (e) => {
    const complement = e.target.value;
    const copyDict = { ...signupData };
    copyDict.address.complement = complement;
    setSignupData(copyDict);
  };

  const handleChange = (key) => (e) => {
    console.log(e.target.value);
    const copyDict = { ...signupData };
    copyDict[key] = e.target.value;
    console.log(copyDict);
    setSignupData(copyDict);
    console.log(signupData);
  };

  const handleBday = (value) => {
    const copyDict = { ...signupData };
    copyDict.birthDate = value;
    setSignupData(copyDict);
  };

  function handleTermsCheckBox() {
    setAcceptedTerms(!acceptedTerms);
  }

  function handlePolicyPrivacyCheckbox() {
    setAcceptedPrivacyPolicy(!acceptedPrivacyPolicy);
  }

  const emailError = signupData.email != "" && !validateEmail(signupData.email);
  const passError = signupData.password != "" && signupData.password.length < 7;
  const passConfError =
    signupData.passConfirmation != "" &&
    signupData.passConfirmation != signupData.password;
  const phoneError = signupData.phone != "" && !validatePhone(signupData.phone);
  const cepError =
    signupData.address.cep != "" && signupData.address.cep.length !== 8;

  const disabledButton =
    !signupData.givenName ||
    !signupData.surName ||
    !signupData.bloodType ||
    !signupData.email ||
    !signupData.password ||
    !signupData.passConfirmation ||
    !signupData.gender ||
    !signupData.birthDate ||
    !signupData.address.cep ||
    !signupData.address.state ||
    !signupData.address.city ||
    !signupData.address.neighborhood ||
    !signupData.address.street ||
    !signupData.address.number ||
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
          <span class={styles.subsectionTitleExplanation}>
            Ao se cadastrar no Hemocione, estaremos sempre em sintonia para
            informá-lo sobre eventos próximos a você!
          </span>
        </div>
        <FormGroup onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ margin: "15px 0" }}>
            <TextField
              fullWidth
              onChange={handleChange("givenName")}
              value={signupData.givenName}
              id="Primeiro nome"
              label="Primeiro nome"
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
              helperText={emailError && "Email inválido"}
              id="email"
              label="Email"
              variant="outlined"
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
                  onClick={(_) => {
                    handleChange("bloodType")({ target: { value: bt } });
                  }}
                />
              ))}
            </div>
          </FormControl>
          <hr className={styles.divider} />
          <div className={styles.twoColumns}>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <InputLabel id="demo-simple-select-label">Gênero</InputLabel>
              <Select
                id="gender"
                placeholder="Gênero"
                label="Gênero"
                onChange={handleChange("gender")}
                fullWidth
                required
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
                  label="Data de nascimento"
                  value={signupData.birthDate}
                  onChange={handleBday}
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
              value={signupData.phone || String(eventRef)}
              error={phoneError}
              helperText={
                phoneError &&
                "Telefone inválido - Por favor insira apenas números e o seu DDD."
              }
              id="Telefone"
              label="Telefone"
              variant="outlined"
              disabled={eventRef ? true : false}
              required
            />
          </FormControl>
          <hr className={styles.divider} />
          <h4 className={styles.subsectionTitle}>
            Qual o seu endereço?{" "}
            <span className={styles.subsectionTitleExplanation}>
              Precisamos saber disso para encontrar bancos de sangue e eventos
              próximos a você!
            </span>
          </h4>
          <div className={styles.twoColumns}>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                fullWidth
                onChange={handleCEPChange}
                value={signupData.address.cep}
                error={cepError}
                helperText={
                  cepError &&
                  "Este CEP não é válido. Por favor, insira um CEP válido."
                }
                label="CEP (apenas números)"
                id="cep"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled
                fullWidth
                value={signupData.address.state}
                label="Estado"
                id="state"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled
                fullWidth
                value={signupData.address.city}
                label="Cidade"
                id="city"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled
                fullWidth
                value={signupData.address.neighborhood}
                label="Bairro"
                id="neighborhood"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                disabled
                fullWidth
                value={signupData.address.street}
                label="Rua"
                id="street"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                fullWidth
                onChange={handleNumberChange}
                value={signupData.address.number}
                label="Número"
                id="number"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <TextField
                fullWidth
                onChange={handleComplementChange}
                value={signupData.address.complement}
                label="Complemento"
                id="complement"
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
              label="Senha"
              type="password"
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              onChange={handleChange("passConfirmation")}
              error={passConfError}
              helperText={passConfError && "As senhas devem ser idênticas"}
              value={signupData.passConfirmation}
              id="password"
              label="Confirmar senha"
              type="password"
              variant="outlined"
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
              position: "fixed",
              bottom: 0,
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
            <p style={{ textAlign: "center", margin: 0 }}>
              Já possui conta?
              <b
                style={{
                  color: "rgb(200, 4, 10)",
                }}
              >
                <Link href={redirect ? `/?redirect=${redirect}` : "/"} passHref>
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
