import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SimpleButton, GoogleAuthButton, TermsAcceptanceDrawer } from "..";
import { validateEmail } from "../../utils/validators";
import { login, acceptTerms } from "../../utils/api";
import { setCookie } from "../../utils/cookie";
import { CircularProgress } from "@mui/material";
import styles from "./LoginSection.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import environment from "../../environment";
import { resolveAuthRedirect } from "../../utils/authRedirect";
import {
  GOOGLE_UNLOCK_STORAGE_KEY,
  isGoogleAuthAvailable,
  registerLogoTap,
} from "../../utils/googleAuthFlag";

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
  const [googleUnlocked, setGoogleUnlocked] = useState(false);
  const logoTaps = useRef({ count: 0, lastTapAt: null });

  useEffect(() => {
    try {
      if (localStorage.getItem(GOOGLE_UNLOCK_STORAGE_KEY) === "true") {
        setGoogleUnlocked(true);
      }
    } catch (error) {
      // private mode can throw on localStorage access; stay locked
    }
  }, []);

  // Reveals Google sign-in inside the native app after ten taps in a row.
  const handleLogoTap = () => {
    if (googleUnlocked) return;

    const next = registerLogoTap({ ...logoTaps.current, now: Date.now() });
    logoTaps.current = { count: next.count, lastTapAt: next.lastTapAt };
    if (!next.unlocked) return;

    setGoogleUnlocked(true);
    try {
      localStorage.setItem(GOOGLE_UNLOCK_STORAGE_KEY, "true");
    } catch (error) {
      // unlocked for this render either way
    }
  };

  const googleAuthAvailable = isGoogleAuthAvailable({
    clientId: environment.googleClientId,
    redirect,
    unlocked: googleUnlocked,
  });

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
    setCookie(environment.tokenCookieKey, userToken, 15, "hemocione.com.br");
    // always allow token to be passed to hemocione.com.br in production. in dev mode, allow it to be passed to localhost as well
    window.open(
      resolveAuthRedirect({
        candidate: redirect,
        fallback: process.env.NEXT_PUBLIC_MAIN_SITE,
        currentHostname: window.location.hostname,
        token: userToken,
      }),
      "_self"
    );
  };

  const apiLogin = (captchaToken) => {
    login({ ...loginData, captchaToken: captchaToken })
      .then((response) => {
        setLoading(false);
        if (response.status !== 200) {
          setErrorText(response.data.message);
          return;
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

  const handleGoogleLogin = (data) => {
    setLoggedInToken(data.token);

    if (data.requestNewTermsAcceptance) {
      setTermsAcceptanceDrawer(true);
      return;
    }

    finishLogin(data.token);
  };

  const handleGoogleSignupRequired = ({ credential, profile }) => {
    sessionStorage.setItem(
      "hemocioneGoogleSignup",
      JSON.stringify({ credential, profile })
    );
    router.push(
      encodedRedirect
        ? `/signup?redirect=${encodedRedirect}&google=1`
        : "/signup?google=1"
    );
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
      setAcceptingTerms(false);
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
      })
      .finally(() => {
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
              onClick={handleLogoTap}
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
          {googleAuthAvailable && (
            <>
              <div className={styles.orDivider}>
                <span>ou</span>
              </div>
              <div className={styles.googleButtonRow}>
                <GoogleAuthButton
                  onLogin={handleGoogleLogin}
                  onSignupRequired={handleGoogleSignupRequired}
                  onError={setErrorText}
                />
              </div>
            </>
          )}
        </div>
      </form>
      <TermsAcceptanceDrawer
        open={termsAcceptanceDrawer}
        loading={acceptingTerms}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};

export default LoginSection;
