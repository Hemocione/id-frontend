import Drawer from "@mui/material/Drawer";
import { SimpleButton } from "..";
import environment from "../../environment";
import styles from "./TermsAcceptanceDrawer.module.css";

/**
 * Shown when the backend answers a login with `requestNewTermsAcceptance`.
 * Shared by the login and signup pages: both can complete a login (signup also
 * signs in accounts that already exist), so both have to gate on the new terms.
 */
const TermsAcceptanceDrawer = ({ open, loading, onAccept }) => (
  <Drawer anchor="bottom" open={open}>
    <div className={styles.termsDrawer}>
      <h2>Atualização nos Termos e Políticas</h2>
      <p>
        Para continuar usando o Hemocione, você precisa revisar e aceitar os
        novos{" "}
        <a
          href={environment.legal.termsOfUse}
          rel="noreferrer"
          target="_blank"
          className={styles.legalDocumentLink}
        >
          Termos de Uso
        </a>{" "}
        e{" "}
        <a
          href={environment.legal.privacyPolicyUrl}
          rel="noreferrer"
          target="_blank"
          className={styles.legalDocumentLink}
        >
          Política de Privacidade
        </a>
      </p>
      <p>Leia atentamente antes de prosseguir.</p>
      <SimpleButton
        loading={loading}
        onClick={onAccept}
        passStyle={{ width: "100%" }}
      >
        Aceitar ambos e continuar
      </SimpleButton>
    </div>
  </Drawer>
);

export default TermsAcceptanceDrawer;
