import HeroCarousel from "@/components/HeroCarousel";
import styles from './page.module.css';
import { BsGeoAltFill } from "react-icons/bs";

export default function Home() {
  return (
    <div>
      {/* Carrusel fijo en el fondo */}
      <div className={styles.carruselContainer}>
        <HeroCarousel />
        <div className={styles.title}>
          <h1>Hola Iván y Flor</h1>
        </div>
      </div>

      {/* Contenido que sube por encima del carrusel */}
      <div className={styles.mainContent}>
        <div className={styles.infoContainer}>
          <div className={styles.location}>
            <BsGeoAltFill className={styles.icon} />
            <span>Barcelona, España</span>
          </div>
          <div className={styles.date}>jueves 29 de mayo de 2025</div>
        </div>

        {/* Agregamos contenido extra para permitir scroll */}
        <div style={{ height: '200vh' }}></div>
      </div>
    </div>
  );
}
