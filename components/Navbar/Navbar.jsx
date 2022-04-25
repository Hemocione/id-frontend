import React from 'react'
import styles from './Navbar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import SimpleButton from '../SimpleButton/SimpleButton'
import { useRouter } from 'next/router'

const Navbar = ({ signup }) => {
    const router = useRouter()
    const { redirect } = router.query

    return (
        <nav className={styles.header}>
            <Link href={process.env.NEXT_PUBLIC_MAIN_FRONTEND_URL}>
                <Image alt='Hemocione' width={300} height={200} className={styles.headerTitle} src='/title.svg' />
            </Link>
            {signup && <div className={styles.buttonBox}>
                <Link href={redirect ? `signup/?redirect=${redirect}` : 'signup'}>
                    <SimpleButton>Cadastre-se já!</SimpleButton>
                </Link>
            </div>}
        </nav>
    )
}

export default Navbar