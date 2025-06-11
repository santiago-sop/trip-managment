"use client";

import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
// react icons
import { HiBars3BottomLeft } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./NavbarMenu.module.css";

import Link from "next/link";
import { usePathname } from 'next/navigation';

const NavbarMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("inicio");
    const pathname = usePathname();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLinkClick = (linkId: string) => {
        setActiveLink(linkId);
        closeMenu();
    };

    useEffect(() => {
        // Sincronizar activeLink con la ruta actual
        const currentRoute = pathname === '/' ? 'inicio' : pathname.slice(1);
        setActiveLink(currentRoute);

        if (menuOpen) {
            document.body.classList.add(styles.noScroll);
        } else {
            document.body.classList.remove(styles.noScroll);
        }
    }, [pathname, menuOpen]);

    return (
        <nav className={`${styles.navbar} fixed-top`}>
            <Container>
                <div className={styles.navbarContenedor}>


                    <div className={`${styles.menu} ${menuOpen ? styles.active : ""}`}>
                        <div className={styles.menuBox}>
                            <Link
                                href="/"
                                className={`${styles.firstLink} ${activeLink === "inicio" ? styles.activeLink : ""}`}
                                onClick={() => handleLinkClick("inicio")}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/personas"
                                className={`${styles.linkMenu} ${activeLink === "personas" ? styles.activeLink : ""}`}
                                onClick={() => handleLinkClick("personas")}
                            >
                                Personas
                            </Link>
                            <Link
                                href="/nosotros"
                                className={`${styles.linkMenu} ${activeLink === "nosotros" ? styles.activeLink : ""}`}
                                onClick={() => handleLinkClick("nosotros")}
                            >
                                Nosotros
                            </Link>
                            <Link
                                href="/contacto"
                                className={`${styles.linkMenu} ${activeLink === "contacto" ? styles.activeLink : ""}`}
                                onClick={() => handleLinkClick("contacto")}
                            >
                                Contacto
                            </Link>
                            <Link
                                href="/login"
                                className={`${styles.linkMenu} ${styles.logoutLink}`}
                                onClick={() => {
                                    // Elimina autenticación
                                    localStorage.removeItem('loggedIn');
                                    localStorage.removeItem('user');
                                    document.cookie = "loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                                    closeMenu();
                                    window.location.href = "/login"; // Fuerza recarga total
                                }}
                            >
                                Cerrar sesión
                            </Link>
                        </div>
                    </div>
                    {menuOpen ? (
                        <AiOutlineClose className={styles.iconBars} onClick={toggleMenu} />
                    ) : (
                        <HiBars3BottomLeft className={styles.iconBars} onClick={toggleMenu} />
                    )}

                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.brandText}>
                            eurotrip
                        </Link>
                    </div>
                </div>
            </Container>
        </nav>
    );
};

export default NavbarMenu;