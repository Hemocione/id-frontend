import { useRouter } from "next/router";
import { useEffect } from "react";
import { deleteCookie } from '../utils/cookie'
import { CircularProgress } from "@mui/material";

export default function Signup() {
    const router = useRouter()
    const { redirect } = router.query
    useEffect(() => {
        deleteCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY)
        window.location.href = redirect || process.env.NEXT_PUBLIC_MAIN_FRONTEND_URL || 'https://www.hemocione.com.br/'
    })

    return (
        <CircularProgress style={{ 'display': 'inline-block', 'color': 'rgb(224, 14, 22)' }} />
    )
}
