import HeroCarousel from "@/components/HeroCarousel";
import styles from './page.module.css';
import { BsGeoAltFill } from "react-icons/bs";
import { FaBus } from "react-icons/fa";
import { FaBed } from "react-icons/fa";

import { Container } from "react-bootstrap";
import ActivityCard from "@/components/ActivityCard";

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


        <div>
          <Container>
            <div className={styles.presupuestoContainer}>
              <h2 className={styles.titlePresupuesto}>Presupuesto</h2>
              <div className={styles.presupuestoLine}></div>
              <p className={styles.descriptionPresupuesto}> € 120</p>
            </div>
            <div className={styles.actividadContainer}>
              <h2 className={styles.titleActividad}>Actividad del dia</h2>
              <div className={styles.actividadLine}></div>
              <ul className={styles.customList}>
                <li className={styles.actividadList}>Visita la sagrada familia</li>
                <li className={styles.actividadList}>Visita la sagrada familia</li>
              </ul>
            </div>
            <ActivityCard title="Próximo traslado"
              icon={<FaBus className="customIcon" />}
              location="Barcelona -> Madrid"
              description="Salida: 15:30" />

            <ActivityCard title="Próxima extadía"
              icon={<FaBed className="customIcon" />}
              location="Hostel Central"
              description="Check-in: 15:30" />
          </Container>
        </div>
      </div>
    </div>
  );
}
