import { TextField } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { SimpleButton } from "..";
import { validateEmail } from "../../utils/validators";
import { CircularProgress } from "@mui/material";
import { recoverPassword } from "../../utils/api";
import styles from "./RecoverSection.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

const LoginSection = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleReturn = (e) => {
    let href = redirect ? `/?redirect=${redirect}` : "/";
    router.push(href);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(process.env.NEXT_PUBLIC_SITE_KEY, { action: "submit" })
        .then(async (captchaToken) => {
          await apiRecover(captchaToken);
        })
        .catch((_) => {
          setLoading(false);
          setErrorText("Captcha Inválido! Você é um robô?");
        });
    });
  };

  const apiRecover = async (captchaToken) => {
    try {
      const response = await recoverPassword(email, captchaToken);
      setLoading(false);
      if (response.status === 200) {
        setSent(true);
        return;
      }
      setErrorText(response.data.message);
    } catch (error) {
      setLoading(false);
      setErrorText(
        (error.response && error.response.data.message) ||
          "Ocorreu um erro inesperado. Por favor, tente novamente."
      );
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const emailError = email != "" && !validateEmail(email);

  return (
    <div className={styles.recoverSection}>
      <form onSubmit={handleSubmit}>
        <div className={styles.recoverContent}>
          <div className={styles.title}>
            <Image
              src="/vertical-cor-fb.svg"
              width={150}
              height={150}
              alt="Hemocione Logo"
            />
          </div>
          <p className={styles.errorText}>{errorText}</p>
          {sent ? (
            <div>
              <h2 className={styles.finalMessage}>
                Verifique sua caixa de entrada e spam, enviamos um email de
                recuperação de conta
              </h2>
              <SimpleButton
                onClick={handleReturn}
                passStyle={{ width: "100%" }}
              >
                Voltar à tela de login
              </SimpleButton>
            </div>
          ) : (
            <div>
              <h2 className={styles.title}>Recupere sua conta</h2>
              <div className={`${styles.field} ${styles.emailField}`}>
                <TextField
                  fullWidth
                  onChange={handleEmailChange}
                  value={email}
                  error={emailError}
                  helperText={emailError && "Email inválido"}
                  id="email"
                  label="Digite seu email"
                  variant="outlined"
                />
              </div>
              {loading ? (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <CircularProgress
                    style={{
                      display: "inline-block",
                      color: "rgb(224, 14, 22)",
                    }}
                  />
                </div>
              ) : (
                <SimpleButton
                  onClick={handleSubmit}
                  passStyle={{ width: "100%" }}
                >
                  Enviar
                </SimpleButton>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginSection;
