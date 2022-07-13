import { useEffect } from 'react';
import { Navbar, LoginSection } from '../components'
import { validateUserToken } from '../utils/api'
import { deleteCookie, getCookie } from '../utils/cookie'
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter()
  const { redirect } = router.query

  useEffect(() => {
    let userToken = getCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY)
    if (userToken) {
      validateUserToken(userToken).then((res) => {
        if (res.status === 200) {
          const redirectLocation = redirect || 'https://www.hemocione.com.br/'
          router.push(redirectLocation)
          return
        }
        deleteCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY)
      }).catch((_) => {
        deleteCookie(process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY)
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
      <Navbar />
      <LoginSection />
    </div>
  )
}
