import { TextField } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { SimpleButton } from "..";
import { validatePassword } from "../../utils/validators";
import { resetPassword } from "../../utils/api";
import { CircularProgress } from "@mui/material";
import styles from "./ResetSection.module.css";
import { useRouter } from "next/router";
import environment from "../../environment";

const ResetSection = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleReturn = (e) => {
    let href = "/";
    router.push(href);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // window.grecaptcha.ready(() => {
    //   window.grecaptcha
    //     .execute(environment.publicSiteKey, { action: "submit" })
    //     .then((captchaToken) => {
    //       apiReset(captchaToken);
    //     })
    //     .catch((_) => {
    //       setLoading(false);
    //       setErrorText("Captcha Inválido! Você é um robô?");
    //     });
    // });
  };

  const apiReset = (captchaToken) => {
    resetPassword({ newPassword: password, captchaToken, recoverToken: token })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setSent(true);
          return;
        }
        setErrorText(response.data.message);
      })
      .catch((error) => {
        setLoading(false);
        setErrorText(
          (error.response && error.response.data.message) ||
            "Ocorreu um erro inesperado. Por favor, tente novamente."
        );
      });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const passwordError = password != "" && !validatePassword(password);
  const passwordConfirmationError = passwordConfirmation != password;

  return (
    <div className={styles.recoverSection}>
      <form onSubmit={handleSubmit}>
        <div className={styles.recoverContent}>
          <div className={styles.title}>
            <Image
              src="/logo.svg"
              width={150}
              height={150}
              alt="Hemocione Logo"
            />
          </div>
          {sent ? (
            <div>
              <h2 className={styles.finalMessage}>
                Senha alterada com sucesso
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
              <h2 className={styles.title}>Altere sua senha</h2>
              <div className={`${styles.field} ${styles.emailField}`}>
                <TextField
                  fullWidth
                  onChange={handlePasswordChange}
                  value={password}
                  error={passwordError}
                  helperText={passwordError && "Senha pequena demais"}
                  id="password"
                  type="password"
                  label="Nova Senha"
                  variant="outlined"
                />
              </div>
              <div className={`${styles.field}`}>
                <TextField
                  fullWidth
                  onChange={handlePasswordConfirmationChange}
                  value={passwordConfirmation}
                  error={passwordConfirmationError}
                  helperText={
                    passwordConfirmationError && "As senhas devem ser idênticas"
                  }
                  id="password"
                  type="password"
                  label="Confirmar nova Senha"
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

export default ResetSection;
