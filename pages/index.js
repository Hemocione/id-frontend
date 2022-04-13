import { useEffect } from 'react';
import { Background, Navbar, LoginSection } from '../components'
import styles from '../styles/Home.module.css'

export default function Home() {
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
