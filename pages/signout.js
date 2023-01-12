import { useRouter } from "next/router";
import { useEffect } from "react";
import { deleteCookie } from "../utils/cookie";
import { CircularProgress } from "@mui/material";

export default function SignOut() {
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    deleteCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY);
    const redirectLocation =
      redirect ||
      process.env.NEXT_PUBLIC_MAIN_SITE ||
      process.env.NEXT_PUBLIC_MAIN_FRONTEND_URL ||
      "https://www.hemocione.com.br/";
    router.push(redirectLocation);
  });

  return (
    <CircularProgress
      style={{ display: "inline-block", color: "rgb(224, 14, 22)" }}
    />
  );
}
