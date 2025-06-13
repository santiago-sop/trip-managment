'use client'

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { BsGeoAltFill } from "react-icons/bs";
import { FaBus, FaBed, FaArrowRight } from "react-icons/fa";
import { Container } from "react-bootstrap";
import ActivityCard from "@/components/ActivityCard";
import HeroCarousel from "@/components/HeroCarousel";
import TripSelectModal from "@/components/TripSelectModal";
import Link from "next/link";

export default function Home() {
  const [location, setLocation] = useState("Cargando ubicación...");
  // Inicializar dateStr con la fecha de hoy en formato yyyy-MM-dd
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const [dateStr, setDateStr] = useState(todayStr);
  type Trip = {
    _id: string;
    name: string;
    // Agrega aquí otras propiedades relevantes del viaje si las conoces
  };
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState(dateStr);
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

  // Cuando cambia el viaje seleccionado o la fecha, obtener sus datos
  useEffect(() => {
    if (!selectedTripId) {
      setTripData(null);
      return;
    }
    setLoadingTripData(true);
    fetch(`https://trip-managment.onrender.com/api/trips/dayData/${selectedTripId}?date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        setTripData(data.payload);
        setLoadingTripData(false);
      })
      .catch(() => setLoadingTripData(false));
  }, [selectedTripId, dateStr]);

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
    // Obtener ubicación con geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            // Llamar a API de geocoding inverso para obtener ciudad y país
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const ciudad = data.address.city || data.address.town || data.address.village || "Ubicación desconocida";
            const pais = data.address.country || "";
            setLocation(`${ciudad}, ${pais}`);
          } catch {
            setLocation("No se pudo obtener la ubicación");
          }
        },
        () => setLocation(tripData?.city ? tripData.city : "Permiso de ubicación denegado")
      );
    } else {
      setLocation(tripData?.city ? tripData.city : "Geolocalización no soportada");
    }
  }, [tripData?.city]);
  // Función para mostrar la fecha en formato dd/MM/yyyy
  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return '';
    const [yyyy, mm, dd] = isoDate.split('-');
    return `${dd}/${mm}/${yyyy}`;
  };

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
          {/* Mostrar la fecha como botón y popup para seleccionar */}
          <div className={styles.date}>
            <button
              style={{ fontSize: '1em', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setTempDate(dateStr); setShowDateModal(true); }}
            >
              {formatDisplayDate(dateStr)}
            </button>
            {showDateModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 260, boxShadow: '0 2px 16px #0003', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="date"
                    value={tempDate}
                    onChange={e => setTempDate(e.target.value)}
                    style={{ fontSize: '1em', padding: 4 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={() => setShowDateModal(false)} style={{ padding: '6px 16px' }}>Cancelar</button>
                    <button
                      onClick={() => { setDateStr(tempDate); setShowDateModal(false); }}
                      style={{ padding: '6px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}
                    >Aceptar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                <div className={styles.actividadContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 className={styles.titleActividad}>Actividad del día</h2>
                    <div className={styles.actividadLine}></div>
                    <div className={styles.actividadListContainer}>
                      <ul className={styles.customList}>
                        <li className={styles.actividadList}><span className={styles.actividadNombre}>{tripData.activity}</span></li>
                      </ul>
                    </div>
                  </div>
                  <Link href="/activity" style={{ marginLeft: 12, color: '#007bff', fontSize: 22, display: 'flex', alignItems: 'center' }}>
                    <FaArrowRight />
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <ActivityCard
                    title="Próximo traslado"
                    icon={<FaBus className="customIcon" />}
                    location={tripData.transfer?.name || "No definido"}
                    description={tripData.transfer?.startTime || ""}
                  />
                  <Link href="/transfer" style={{ marginLeft: 12, color: '#007bff', fontSize: 22, display: 'flex', alignItems: 'center', alignSelf: 'flex-start' }}>
                    <FaArrowRight />
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <ActivityCard
                    title="Próxima estadía"
                    icon={<FaBed className="customIcon" />}
                    location={tripData.stay?.name || "No definido"}
                    description={tripData.stay?.checkin || ""}
                  />
                  <Link href="/stay" style={{ marginLeft: 12, color: '#007bff', fontSize: 22, display: 'flex', alignItems: 'center', alignSelf: 'flex-start' }}>
                    <FaArrowRight />
                  </Link>
                </div>
              </>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}
