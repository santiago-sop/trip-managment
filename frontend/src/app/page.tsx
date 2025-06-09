'use client'

import HeroCarousel from "@/components/HeroCarousel";
import styles from './page.module.css';
import { BsGeoAltFill } from "react-icons/bs";
import { FaBus, FaBed } from "react-icons/fa";

import { Container } from "react-bootstrap";
import ActivityCard from "@/components/ActivityCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<string>("Cargando ubicación...");
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    // Obtener fecha y formatear en español
    const fechaHoy = new Date();
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const fechaFormateada = new Intl.DateTimeFormat("es-ES", opcionesFecha).format(fechaHoy);
    setDateStr(fechaFormateada);

    // Obtener ubicación con geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            // Llamar a API de geocoding inverso para obtener ciudad
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            // data.address puede tener 'city' o 'town' o 'village'
            const ciudad = data.address.city || data.address.town || data.address.village || "Ubicación desconocida";
            const pais = data.address.country || "";
            setLocation(`${ciudad}, ${pais}`);
          } catch {
            setLocation("No se pudo obtener la ubicación");
          }
        },
        () => setLocation("Permiso de ubicación denegado")
      );
    } else {
      setLocation("Geolocalización no soportada");
    }
  }, []);

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
            <span>{location}</span>
          </div>
          <div className={styles.date}>{dateStr}</div>
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
            <ActivityCard
              title="Próximo traslado"
              icon={<FaBus className="customIcon" />}
              location="Barcelona -> Madrid"
              description="Salida: 15:30"
            />

            <ActivityCard
              title="Próxima extadía"
              icon={<FaBed className="customIcon" />}
              location="Hostel Central"
              description="Check-in: 15:30"
            />
          </Container>
        </div>
      </div>
    </div>
  );
}
