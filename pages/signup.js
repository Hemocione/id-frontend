// import { useEffect } from "react";
import { SignupSection } from "../components";
// import environment from "../environment";

// TODO: come back with captcha
export default function Signup() {
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
  return <SignupSection />;
}
