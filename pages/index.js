import Head from 'next/head'
import Image from 'next/image'
import { LoginSection, Navbar } from '../components'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <LoginSection></LoginSection>
    </div>
  )
}
