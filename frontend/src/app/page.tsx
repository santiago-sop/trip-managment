'use client'

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { BsGeoAltFill } from "react-icons/bs";
import { FaBus, FaBed } from "react-icons/fa";
import { Container } from "react-bootstrap";
import ActivityCard from "@/components/ActivityCard";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  const [location, setLocation] = useState("Cargando ubicación...");
  const [dateStr, setDateStr] = useState("");
  //const [userName, setUserName] = useState("Usuario");// Estado para el nombre del usuario
  type Trip = {
    _id: string;
    name: string;
    // Agrega aquí otras propiedades relevantes del viaje si las conoces
  };
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  interface TripData {
    budget: {
      dailyBudget: number;
    };
    activity: string;
    activities?: { _id: string; name: string }[];
    transfer?: {
      name?: string;
      startTime?: string;
    };
    stay?: {
      name?: string;
      checkin?: string;
    };
    // Agrega aquí otras propiedades relevantes si las hay
  }

  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingTripData, setLoadingTripData] = useState(false);
  const [user, setUser] = useState<{ _id?: string; firstName?: string; lastName?: string; email?: string }>({});

  // 1. Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  // 2. Limpiar estados cuando cambia el usuario
  useEffect(() => {
    setTrips([]);
    setSelectedTripId(null);
    setTripData(null);
  }, [user.email]);

  // 3. Cuando user.email esté disponible, cargar los viajes
  useEffect(() => {
    if (!user.email) return; // Espera a que user.email esté definido
    setLoadingTrips(true);
    fetch(`https://trip-managment.onrender.com/api/users/email/${user.email}`)
      .then(res => res.json())
      .then(data => {
        const userData = data.payload;
        setTrips(userData?.trips || []);
        if (userData?.trips?.length === 1) {
          setSelectedTripId(userData.trips[0]._id);
        }
        setLoadingTrips(false);
      })
      .catch(() => setLoadingTrips(false));
  }, [user.email]);

  // Cuando cambia el viaje seleccionado, obtener sus datos
  useEffect(() => {
    if (!selectedTripId) {
      setTripData(null);
      return;
    }
    setLoadingTripData(true);
    const fecha = "2025-06-08"; // O la fecha que quieras consultar
    fetch(`https://trip-managment.onrender.com/api/trips/dayData/${selectedTripId}?date=${fecha}`)
      .then(res => res.json())
      .then(data => {
        setTripData(data.payload);
        setLoadingTripData(false);
      })
      .catch(() => setLoadingTripData(false));
  }, [selectedTripId]);

  // Geolocalización y fecha (igual que antes)
  useEffect(() => {
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
    /*
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            // Llamar a API de geocoding inverso para obtener ciudad
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
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
    */
    // Ubicación fija para pruebas
    setLocation("Barcelona, España");
  }, []);

  // Render
  return (
    <div>
      <div className={styles.carruselContainer}>
        <HeroCarousel />
        <div className={styles.title}>
          <h1>Hola {user.firstName}!</h1> {/* Nombre dinámico del usuario */}
        </div>
      </div>
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
            {/* Estado de carga de viajes */}
            {loadingTrips && <p>Cargando viajes...</p>}
            {/* Sin viajes */}
            {!loadingTrips && trips.length === 0 && <p>No hay viajes para este usuario.</p>}
            {/* Selector de viajes si hay más de uno */}
            {!loadingTrips && trips.length > 1 && (
              <div>
                <label>Selecciona un viaje: </label>
                <select
                  value={selectedTripId || ""}
                  onChange={e => setSelectedTripId(e.target.value)}
                >
                  <option value="" disabled>Elige un viaje</option>
                  {trips.map(trip => (
                    <option key={trip._id} value={trip._id}>{trip.name}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Datos del viaje */}
            {loadingTripData && <p>Cargando datos del viaje...</p>}
            {tripData && (
              <>
                <div className={styles.presupuestoContainer}>
                  <h2 className={styles.titlePresupuesto}>Presupuesto</h2>
                  <div className={styles.presupuestoLine}></div>
                  <p className={styles.descriptionPresupuesto}>€ {tripData.budget.dailyBudget}</p>
                </div>
                <div className={styles.actividadContainer}>
                  <h2 className={styles.titleActividad}>Actividad del día</h2>
                  <div className={styles.actividadLine}>{tripData.activity}</div>
                  <div className={styles.actividadListContainer}>
                  <ul className={styles.customList}>
                    {tripData.activities?.map((act: { _id: string; name: string }) => (
                      <li className={styles.actividadList} key={act._id}><span className={styles.actividadNombre}>{act.name}</span></li>
                    ))}
                  </ul>
                  </div>
                </div>
                {/* Puedes adaptar los siguientes ActivityCard según los datos de tu viaje */}
                <ActivityCard
                  title="Próximo traslado"
                  icon={<FaBus className="customIcon" />}
                  location={tripData.transfer?.name || "No definido"}
                  description={tripData.transfer?.startTime || ""}
                />
                <ActivityCard
                  title="Próxima estadía"
                  icon={<FaBed className="customIcon" />}
                  location={tripData.stay?.name || "No definido"}
                  description={tripData.stay?.checkin || ""}
                />
              </>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}
