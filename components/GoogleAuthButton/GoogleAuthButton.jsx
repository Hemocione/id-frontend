import { useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../utils/api";
import environment from "../../environment";

const GoogleAuthButton = ({ onLogin, onSignupRequired, onError }) => {
  const pendingRef = useRef(false);

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
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() =>
        onError("Não foi possível entrar com o Google. Tente novamente.")
      }
      text="continue_with"
      locale="pt_BR"
    />
  );
};

export default GoogleAuthButton;
