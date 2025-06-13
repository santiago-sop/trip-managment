"use client";

import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
// react icons
import { HiBars3BottomLeft } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./NavbarMenu.module.css";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import TripSelectModal from "@/components/TripSelectModal";

const NavbarMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("inicio");
    const [showTripModal, setShowTripModal] = useState(false);
    const [trips, setTrips] = useState<{ _id: string; name: string }[]>([]);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [user, setUser] = useState<{ email?: string }>({});
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

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        const storedTripId = localStorage.getItem('selectedTripId');
        if (storedTripId) setSelectedTripId(storedTripId);
    }, []);

    useEffect(() => {
        if (!user.email) return;
        fetch(`https://trip-managment.onrender.com/api/users/email/${user.email}`)
            .then(res => res.json())
            .then(data => {
                setTrips(data.payload?.trips || []);
            });
    }, [user.email]);

    const handleChangeTrip = () => {
        setShowTripModal(true);
    };

    const handleSelectTrip = (tripId: string) => {
        setSelectedTripId(tripId);
        localStorage.setItem('selectedTripId', tripId);
        setShowTripModal(false);
        window.location.reload(); // Para que la página principal se actualice con el nuevo viaje
    };

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
                                href="/user"
                                className={`${styles.linkMenu} ${activeLink === "user" ? styles.activeLink : ""}`}
                                onClick={() => handleLinkClick("user")}
                            >
                                Usuario
                            </Link>
                            <Link
                                href="/addTrip"
                                className={`${styles.linkMenu} ${activeLink === "addTrip" ? styles.activeLink : ""}`}
                                onClick={() => handleLinkClick("addTrip")}
                            >
                                Agregar viaje
                            </Link>
                            {/* Cambiar de viaje: muestra el modal en vez de navegar */}
                            <span
                                className={`${styles.linkMenu} ${activeLink === "changeTrip" ? styles.activeLink : ""}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    handleLinkClick("changeTrip");
                                    handleChangeTrip();
                                }}
                            >
                                Cambiar de viaje
                            </span>
                            <Link
                                href="/login"
                                className={`${styles.linkMenu} ${styles.logoutLink}`}
                                onClick={() => {
                                    localStorage.removeItem('loggedIn');
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('selectedTripId');
                                    document.cookie = "loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                                    closeMenu();
                                    window.location.href = "/login";
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
                {/* Modal de selección de viaje */}
                {showTripModal && trips.length > 1 && (
                    <TripSelectModal
                        trips={trips}
                        selectedTripId={selectedTripId}
                        onSelect={handleSelectTrip}
                        onClose={() => setShowTripModal(false)}
                    />
                )}
            </Container>
        </nav>
    );
};

export default NavbarMenu;