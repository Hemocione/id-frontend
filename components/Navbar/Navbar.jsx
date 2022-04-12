import React from 'react'
import styles from './Navbar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import SimpleButton from '../SimpleButton/SimpleButton'

const Navbar = ({ signup }) => (
    <nav className={styles.header}>
        <Link href={process.env.NEXT_PUBLIC_MAIN_FRONTEND_URL}>
            <Image alt='Hemocione' width={300} height={200} className={styles.headerTitle} src='/title.svg' />
        </Link>
        {signup && <div className={styles.buttonBox}>
            <Link href='signup'>
                <SimpleButton>Cadastre-se já!</SimpleButton>
            </Link>
        </div>}
    </nav>
)

export default Navbar