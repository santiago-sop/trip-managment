'use client';

import { MdHome, MdAddCircle, MdCalendarMonth, MdToday } from 'react-icons/md';
import styles from './NavbarFooter.module.css';
import React from 'react'

const NavbarFooter = () => {
  return (
    <nav className={styles.navbar}>
  <a href="#" className={styles.link}><MdHome /></a>
  <a href="#" className={styles.link}><MdAddCircle /></a>
  <a href="#" className={styles.link}><MdCalendarMonth /></a>
  <a href="#" className={styles.link}><MdToday /></a>
</nav>
  )
}

export default NavbarFooter