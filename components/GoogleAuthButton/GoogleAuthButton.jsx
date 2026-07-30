import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../utils/api";
import environment from "../../environment";
import styles from "./GoogleAuthButton.module.css";

// Google's button only takes a pixel width, capped at 400, and cannot be told
// to fill its container. Measuring the container and feeding the number back is
// what keeps it the same width as the primary button next to it.
const GSI_MAX_WIDTH = 400;

const GoogleAuthButton = ({ onLogin, onSignupRequired, onError }) => {
  const pendingRef = useRef(false);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const measure = () => {
      const available = Math.floor(node.getBoundingClientRect().width);
      if (available > 0) setWidth(Math.min(available, GSI_MAX_WIDTH));
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!environment.googleClientId) return null;

  const handleSuccess = async (credentialResponse) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      const credential = credentialResponse.credential;
      const response = await googleAuth({ credential });
      if (response.data?.status === "signup_required") {
        onSignupRequired({ credential, profile: response.data.profile });
        return;
      }
      onLogin(response.data);
    } catch (error) {
      console.error(error);
      onError(
        error.response?.data?.message ||
          "Ocorreu um erro inesperado. Por favor, tente novamente."
      );
    } finally {
      pendingRef.current = false;
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Held back until measured, so the button never flashes at its default
          209px before snapping to full width. */}
      {width !== null && (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            onError("Não foi possível entrar com o Google. Tente novamente.")
          }
          text="continue_with"
          // BCP 47, which is what GSI documents; "pt_BR" fell back to English.
          locale="pt-BR"
          size="large"
          shape="rectangular"
          logo_alignment="center"
          width={width}
        />
      )}
    </div>
  );
};

export default GoogleAuthButton;
