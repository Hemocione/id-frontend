import { useEffect } from 'react';
import { Background, Navbar, LoginSection } from '../components'
import { getCookie } from '../utils/api'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const { redirect } = router.query

  useEffect(() => {
    let curId = getCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY)
    if (curId) {
      postValidate(curId).then((res) => {
        if (response.status === 200) {
          window.location.href = redirect || 'https://www.hemocione.com.br/'
        }
      })
    }
  })

  useEffect(() => {
    const scriptExist = document.getElementById("recaptcha-key");
    if (!scriptExist) {
      const script = document.createElement("script")
      script.id = "recaptcha-key"
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_SITE_KEY}`
      script.onload = () => console.log('captcha loaded')
      document.body.appendChild(script)
    }
  }, [])
  return (
    <div>
      <Navbar signup />
      <LoginSection />
    </div>
  )
}
