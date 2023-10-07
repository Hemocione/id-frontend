import { useEffect } from "react";
import { LoginSection } from "../components";
// import { validateUserToken } from "../utils/api";
// import { deleteCookie, getCookie } from "../utils/cookie";
import { useRouter } from "next/router";
import environment from "../environment";

// TODO: come back with cookies stuff (simply remake auth interface my dude...)

export default function Home() {
  const router = useRouter();
  // const { redirect } = router.query;

  useEffect(() => {
    // let userToken = getCookie(environment.tokenCookieKey);
    // if (userToken) {
    //   validateUserToken({ token: userToken })
    //     .then((res) => {
    //       if (res.status === 200) {
    //         const redirectLocation =
    //           redirect ||
    //           process.env.NEXT_PUBLIC_MAIN_SITE ||
    //           "https://www.hemocione.com.br/";
    //         router.push(redirectLocation);
    //         return;
    //       }
    //       deleteCookie(environment.tokenCookieKey);
    //     })
    //     .catch((_) => {
    //       deleteCookie(environment.tokenCookieKey);
    //     });
    // }
  });

  useEffect(() => {
    const scriptExist = document.getElementById("recaptcha-key");
    if (!scriptExist) {
      const script = document.createElement("script");
      script.id = "recaptcha-key";
      script.src = `https://www.google.com/recaptcha/api.js?render=${environment.publicSiteKey}`;
      script.onload = () => console.log("captcha loaded");
      document.body.appendChild(script);
    }
  }, []);
  return <LoginSection />;
}
