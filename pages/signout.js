import { useRouter } from "next/router";
import { useEffect } from "react";
import { deleteCookie } from '../utils/api'
import { Navbar } from "../components";

export default function Signup() {
    const router = useRouter()
    const { redirect } = router.query
    useEffect(() => {
        deleteCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY)
        window.location.href = redirect || 'https://www.hemocione.com.br/'
    })

    return (
        <div>
        </div>
    )
}
