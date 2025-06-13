'use client'

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { BsGeoAltFill } from "react-icons/bs";
import { FaBus, FaBed } from "react-icons/fa";
import { Container } from "react-bootstrap";
import ActivityCard from "@/components/ActivityCard";
import HeroCarousel from "@/components/HeroCarousel";
import TripSelectModal from "@/components/TripSelectModal";

export default function Home() {
  const [location, setLocation] = useState("Cargando ubicación...");
  const [dateStr, setDateStr] = useState("");
  type Trip = {
    _id: string;
    name: string;
    // Agrega aquí otras propiedades relevantes del viaje si las conoces
  };
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
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
    city?: string;
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
    setTripData(null);
    setShowTripModal(false);
    // Solo limpiar selectedTripId si el usuario realmente cambió (no en cada recarga)
    // Si quieres limpiar solo cuando cambia el email, puedes comparar con un ref previo
    // localStorage.removeItem('selectedTripId');
  }, [user.email]);

  // 3. Cuando user.email esté disponible, cargar los viajes
  useEffect(() => {
    if (!user.email) return;
    setLoadingTrips(true);
    fetch(`https://trip-managment.onrender.com/api/users/email/${user.email}`)
      .then(res => res.json())
      .then(data => {
        const userData = data.payload;
        setTrips(userData?.trips || []);
        const storedTripId = localStorage.getItem('selectedTripId');
        if (userData?.trips?.length === 1) {
          setSelectedTripId(userData.trips[0]._id);
          setShowTripModal(false);
        } else if (userData?.trips?.length > 1) {
          // Si hay un tripId guardado y es válido, no mostrar el modal
          if (storedTripId && userData.trips.some((t: any) => t._id === storedTripId)) {
            setSelectedTripId(storedTripId);
            setShowTripModal(false);
          } else {
            setSelectedTripId(null);
            setShowTripModal(true);
          }
        } else {
          setSelectedTripId(null);
          setShowTripModal(false);
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
    const fecha = new Date();
    fetch(`https://trip-managment.onrender.com/api/trips/dayData/${selectedTripId}?date=${fecha}`)
      .then(res => res.json())
      .then(data => {
        setTripData(data.payload);
        setLoadingTripData(false);
      })
      .catch(() => setLoadingTripData(false));
  }, [selectedTripId]);

  // Sincronizar selectedTripId con localStorage
  useEffect(() => {
    const storedTripId = localStorage.getItem('selectedTripId');
    if (storedTripId) setSelectedTripId(storedTripId);
  }, []);
  useEffect(() => {
    if (selectedTripId) {
      localStorage.setItem('selectedTripId', selectedTripId);
    }
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
      {/* Modal de selección de viaje */}
      {showTripModal && trips.length > 1 && (
        <TripSelectModal
          trips={trips}
          selectedTripId={selectedTripId}
          onSelect={tripId => {
            setSelectedTripId(tripId);
            setShowTripModal(false);
          }}
          onClose={() => setShowTripModal(false)}
        />
      )}
      <div className={styles.carruselContainer}>
        <HeroCarousel />
        <div className={styles.title}>
          <h1>Hola {user.firstName}!</h1> {/* Nombre dinámico del usuario */}
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.infoContainer}>
          {/* Mostrar el nombre del viaje seleccionado arriba de la localización */}
          {selectedTripId && trips.length > 0 && (
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: 4 }}>
              {trips.find(t => t._id === selectedTripId)?.name}
            </div>
          )}
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
                  <div className={styles.actividadLine}></div>
                  <div className={styles.actividadListContainer}>
                    <ul className={styles.customList}>
                      <li className={styles.actividadList}><span className={styles.actividadNombre}>{tripData.activity}</span></li>
                    </ul>
                  </div>
                </div>
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
