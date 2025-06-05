'use client';

import { MdHome, MdAddCircle, MdCalendarMonth, MdToday } from 'react-icons/md';
import styles from './NavbarFooter.module.css';
import React from 'react'
import Link from 'next/link';

const NavbarFooter = () => {
  return (
    <nav className={styles.navbar}>
  <Link href="/" className={styles.link}><MdHome /></Link>
  <Link href="#" className={styles.link}><MdAddCircle /></Link>
  <Link href="/calendar" className={styles.link}><MdCalendarMonth /></Link>
  <Link href="#" className={styles.link}><MdToday /></Link>
</nav>
  )
}

export default NavbarFooter