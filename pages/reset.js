import { useEffect } from "react";
import { Navbar, ResetSection } from "../components";
import environment from "../environment";

export default function Recover() {
  // useEffect(() => {
  //   const scriptExist = document.getElementById("recaptcha-key");
  //   if (!scriptExist) {
  //     const script = document.createElement("script");
  //     script.id = "recaptcha-key";
  //     script.src = `https://www.google.com/recaptcha/api.js?render=${environment.publicSiteKey}`;
  //     script.onload = () => console.log("captcha loaded");
  //     document.body.appendChild(script);
  //   }
  // }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <ResetSection />
    </div>
  );
}
