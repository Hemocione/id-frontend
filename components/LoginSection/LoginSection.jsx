import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import Image from "next/image";
import { SimpleButton } from "..";
import { validateEmail } from "../../utils/validators";
import { login, acceptTerms } from "../../utils/api";
import { setCookie } from "../../utils/cookie";
import { CircularProgress } from "@mui/material";
import styles from "./LoginSection.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import environment from "../../environment";
import Drawer from '@mui/material/Drawer';

const LoginSection = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const encodedRedirect = redirect ? encodeURIComponent(redirect) : "";
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [loading, setLoading] = useState(false);
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const [termsAcceptanceDrawer, setTermsAcceptanceDrawer] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    apiLogin("");
    // window.grecaptcha.ready(() => {
    //   window.grecaptcha
    //     .execute(environment.publicSiteKey, { action: "submit" })
    //     .then((captchaToken) => {
    //     })
    //     .catch((_) => {
    //       setLoading(false);
    //       setErrorText("Captcha Inválido! Você é um robô?");
    //     });
    // });
  };
  const [loggedInToken, setLoggedInToken] = useState(null); 

  const finishLogin = (token) => {
    if (!loggedInToken && !token) {
      return;
    }
    const userToken = token || loggedInToken;
    setCookie(
      environment.tokenCookieKey,
      userToken,
      15,
      "hemocione.com.br"
    );
    const locationRedirect =
      redirect ||
      process.env.NEXT_PUBLIC_MAIN_SITE ||
      "https://www.hemocione.com.br/";

    const url = new URL(locationRedirect);
    // always allow token to be passed to hemocione.com.br in production. in dev mode, allow it to be passed to localhost as well
    if (url.hostname.endsWith("hemocione.com.br") || window.location.hostname.endsWith("id.d.hemocione.com.br")) {
      url.searchParams.append("token", userToken);
    }
    const newLocationRedirect = url.toString();

    window.open(newLocationRedirect, "_self");
  }

  const apiLogin = (captchaToken) => {
    login({ ...loginData, captchaToken: captchaToken })
      .then((response) => {
        setLoading(false);
        if (response.status !== 200) {
          setErrorText(response.data.message);
          return
        }

        setLoggedInToken(response.data.token);

        if (response.data.requestNewTermsAcceptance) {
          setTermsAcceptanceDrawer(true);
          return;
        }

        finishLogin(response.data.token);
      })
      .catch((error) => {
        setLoading(false);
        setErrorText(
          error.response?.data?.message ||
            "Ocorreu um erro inesperado. Por favor, tente novamente."
        );
      });
  };

  const handleEmailChange = (e) => {
    setloginData({ ...loginData, email: e.target.value });
  };

  const handlePassChange = (e) => {
    setloginData({ ...loginData, password: e.target.value });
  };

  const emailError = loginData.email != "" && !validateEmail(loginData.email);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const handleAcceptTerms = () => {
    setAcceptingTerms(true);
    if (!loggedInToken) {
      return;
    }

    acceptTerms({ token: loggedInToken })
      .then((response) => {
        if (response.status !== 200) {
          setErrorText(response.data?.message || "Erro ao aceitar os termos.");
          return;
        }

        finishLogin();
      })
      .catch((error) => {
        console.error(error);
        setErrorText(
          error.response?.data?.message ||
            "Ocorreu um erro inesperado. Por favor, tente novamente."
        );
      }).finally(() => {
        setAcceptingTerms(false);
        setTermsAcceptanceDrawer(false);
      });
  };

  return (
    <div className={styles.loginSection}>
      <form onSubmit={handleSubmit}>
        <div className={styles.loginContent}>
          <div className={styles.title}>
            <Image
              src="/logo.svg"
              width={150}
              height={150}
              alt="Hemocione Logo"
            />
          </div>
          <p className={styles.errorText}>{errorText}</p>
          <div className={`${styles.field} ${styles.emailField}`}>
            <TextField
              fullWidth
              onChange={handleEmailChange}
              value={loginData.email}
              error={emailError}
              helperText={emailError && "Email inválido"}
              id="email"
              label="Email"
              variant="outlined"
            />
          </div>
          <div className={styles.field}>
            <TextField
              fullWidth
              onChange={handlePassChange}
              value={loginData.password}
              id="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            Ainda não possui conta?
            <b
              style={{
                color: "rgb(200, 4, 10)",
              }}
            >
              <Link
                href={
                  encodedRedirect
                    ? `signup/?redirect=${encodedRedirect}`
                    : "signup"
                }
                passHref
              >
                {" Cadastre-se agora!"}
              </Link>
            </b>
          </p>
          <p style={{ textAlign: "center" }}>
            <b
              style={{
                color: "rgb(200, 4, 10)",
              }}
            >
              <Link
                href={
                  encodedRedirect
                    ? `recover/?redirect=${encodedRedirect}`
                    : "recover"
                }
                passHref
              >
                {" Esqueci minha senha"}
              </Link>
            </b>
          </p>
          {loading ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <CircularProgress
                style={{ display: "inline-block", color: "rgb(224, 14, 22)" }}
              />
            </div>
          ) : (
            <SimpleButton
              disabled={!(loginData.email.length && loginData.password.length)}
              onClick={handleSubmit}
              passStyle={{ width: "100%" }}
            >
              Entrar
            </SimpleButton>
          )}
        </div>
      </form>
      <Drawer
        anchor="bottom"
        open={termsAcceptanceDrawer}
      >
        <div className={styles.termsDrawer}>
          <h2>Atualização nos Termos e Políticas</h2>
          <p>
            Para continuar usando o Hemocione, você precisa revisar e aceitar os novos <a
              href={environment.legal.termsOfUse}
              rel="noreferrer"
              target="_blank"
              className={styles.legalDocumentLink}
            >
              Termos de Uso
            </a> e <a
              href={environment.legal.privacyPolicyUrl}
              rel="noreferrer"
              target="_blank"
              className={styles.legalDocumentLink}
            >
              Política de Privacidade
            </a>
          </p>
          <p>Leia atentamente antes de prosseguir.</p>
          <SimpleButton loading={acceptingTerms} onClick={handleAcceptTerms} passStyle={{ width: '100%' }}>
            Aceitar ambos e continuar
          </SimpleButton>
        </div>
      </Drawer>
    </div>
  );
};

export default LoginSection;
