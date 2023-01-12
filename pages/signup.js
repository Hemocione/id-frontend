import { useEffect } from "react";
import { SignupSection } from "../components";

export default function Signup() {
  useEffect(() => {
    const scriptExist = document.getElementById("recaptcha-key");
    if (!scriptExist) {
      const script = document.createElement("script");
      script.id = "recaptcha-key";
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_SITE_KEY}`;
      script.onload = () => console.log("captcha loaded");
      document.body.appendChild(script);
    }
  }, []);
  return <SignupSection />;
}
