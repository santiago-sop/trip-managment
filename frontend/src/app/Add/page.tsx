'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';

type EndpointType = 'activity' | 'stays' | 'transfers' | 'blog' | 'expense' | 'budget';

const Page = () => {
  // Obtener el trip seleccionado de localStorage
  const selectedTripId = typeof window !== 'undefined' ? localStorage.getItem('selectedTripId') : '';
  const [selectedType, setSelectedType] = useState<EndpointType | ''>('');
  const [formData, setFormData] = useState<{
    name: string;
    date: string;
    cost: string;
    paid: boolean;
    city: string;
    checkin: string;
    checkout: string;
    location: string;
    reservationPDF: File | null;
    description: string;
    content: string;
    startDate: string;
    endDate: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    transferPDF: File | null;
    amount: string;
    paidBy: string;
    title: string;
  }>({
    name: '',
    date: '',
    cost: '',
    paid: false,
    city: '',
    checkin: '',
    checkout: '',
    location: '',
    reservationPDF: null,
    description: '',
    content: '',
    startDate: '',
    endDate: '',
    startLocation: '',
    endLocation: '',
    startTime: '',
    endTime: '',
    transferPDF: null,
    amount: '',
    paidBy: '',
    title: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  // Definir los endpoints fuera de cualquier función
  const endpoints: Record<EndpointType, string> = {
    activity: `https://trip-managment.onrender.com/api/trips/activity/${selectedTripId}`,
    stays: `https://trip-managment.onrender.com/api/trips/stay/${selectedTripId}`,
    transfers: `https://trip-managment.onrender.com/api/trips/transfer/${selectedTripId}`,
    blog: `https://trip-managment.onrender.com/api/trips/blog/${selectedTripId}`,
    expense: `https://trip-managment.onrender.com/api/trips/expense/${selectedTripId}`,
    budget: `https://trip-managment.onrender.com/api/trips/budget/${selectedTripId}`,
    // Puedes agregar más si lo necesitas
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value as EndpointType);
    setFormData({
      name: '',
      date: '',
      cost: '',
      paid: false,
      city: '',
      checkin: '',
      checkout: '',
      location: '',
      reservationPDF: null,
      description: '',
      content: '',
      startDate: '',
      endDate: '',
      startLocation: '',
      endLocation: '',
      startTime: '',
      endTime: '',
      transferPDF: null,
      amount: '',
      paidBy: '',
      title: '',
    }); // Reset form
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'reservationPDF' | 'transferPDF') => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.files?.[0] || null,
    }));
  };

  // Obtener la fecha de hoy en ambos formatos
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const ddMMyy = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}-${today.getFullYear().toString().slice(-2)}`;

  // Inicializar fechas por defecto al montar el componente
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: ddMMyy,
      startDate: ddMMyy,
      endDate: ddMMyy,
      checkInDate: ddMMyy,
      checkOutDate: ddMMyy,
    }));
  }, []);

  // Función para convertir dd-MM-yy a yyyy-MM-dd
  const toApiDate = (dateStr: string) => {
    // Si ya viene en yyyy-MM-dd, no convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr; // o ''
    const [dd, mm, yy] = parts;
    const yyyy = yy && yy.length === 2 ? '20' + yy : yy;
    return `${yyyy}-${mm}-${dd}`;
  };

  // Al enviar el formulario, convertir fechas a formato API
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedType) return;
    const endpoint = endpoints[selectedType];
    // Copia y transforma las fechas
    const dataToSend = { ...formData };
    if (dataToSend.date) dataToSend.date = toApiDate(dataToSend.date);
    if (dataToSend.startDate) dataToSend.startDate = toApiDate(dataToSend.startDate);
    if (dataToSend.endDate) dataToSend.endDate = toApiDate(dataToSend.endDate);
    if (dataToSend.checkin) dataToSend.checkin = toApiDate(dataToSend.checkin);
    if (dataToSend.checkout) dataToSend.checkout = toApiDate(dataToSend.checkout);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    if (res.ok) {
      setSuccessMsg('¡Datos cargados con éxito!');
      setTimeout(() => router.push('/'), 1200);
    }
    // Aquí puedes limpiar el formulario o mostrar feedback
  };

  // Mostrar fechas en inputs como dd-MM-yy
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // value es yyyy-MM-dd, lo convertimos a dd-MM-yy para mostrar
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [yyyy, mm, dd] = value.split('-');
      setFormData((prev) => ({ ...prev, [name]: `${dd}-${mm}-${yyyy.slice(-2)}` }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className={styles.addContainer}>
      <h1>Agregar Nuevo Elemento</h1>
      {successMsg && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: 16 }}>{successMsg}</div>}
      <div className='position-relative'>
        <label className={styles.label}>¿Qué deseas agregar?</label>
        <select className={styles.select} value={selectedType} onChange={handleTypeChange}>
          <option value="">Selecciona una opción</option>
          <option value="activity">Actividad</option>
          <option value="stays">Estadía</option>
          <option value="transfers">Traslado</option>
          <option value="blog">Blog</option>
          <option value="expense">Gasto</option>
          <option value="budget">Plata al presupuesto</option>
        </select>

        <div className={styles.selectorRow}>
          <button type="button" className={styles.closeButton} onClick={() => setSelectedType('')}>
            ✖
          </button>
        </div>
      </div>
      {selectedType && (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* <label className={styles.label}>Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label className={styles.label}>Fecha</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required /> */}

          {/* Activity */}
          {selectedType === 'activity' && (
            <>
              <label className={styles.label}>Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label className={styles.label}>Fecha</label>
              <input type="date" name="date" value={toApiDate(formData.date)} onChange={handleDateInput} required />

              <label className={styles.label}>Ciudad</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />
            </>
          )}

          {/* Estadia */}
          {selectedType === 'stays' && (
            <>
              <label className={styles.label}>Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label className={styles.label}>Fecha de Entrada</label>
              <input type="date" name="startDate" value={toApiDate(formData.startDate)} onChange={handleDateInput} required />

              <label className={styles.label}>Fecha de Salida</label>
              <input type="date" name="endDate" value={toApiDate(formData.endDate)} onChange={handleDateInput} required />

              <label className={styles.label}>Hora de Check-in</label>
              <input type="time" name="checkin" value={formData.checkin} onChange={handleChange} required />

              <label className={styles.label}>Hora de Check-out</label>
              <input type="time" name="checkout" value={formData.checkout} onChange={handleChange} required />

              <label className={styles.label}>Ubicación</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />

              <label className={styles.label}>Subir PDF de Reserva</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'reservationPDF')} />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />
            </>
          )}

          {/* Traslado */}
          {selectedType === 'transfers' && (
            <>
              <label className={styles.label}>Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label className={styles.label}>Día de Inicio</label>
              <input type="date" name="startDate" value={toApiDate(formData.startDate)} onChange={handleDateInput} required />

              <label className={styles.label}>Día Final</label>
              <input type="date" name="endDate" value={toApiDate(formData.endDate)} onChange={handleDateInput} required />

              <label className={styles.label}>Lugar de Inicio</label>
              <input type="text" name="startLocation" value={formData.startLocation} onChange={handleChange} required />

              <label className={styles.label}>Lugar Final</label>
              <input type="text" name="endLocation" value={formData.endLocation} onChange={handleChange} required />

              <label className={styles.label}>Hora de Inicio</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />

              <label className={styles.label}>Hora Final</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />

              <label className={styles.label}>Subir PDF del Ticket</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'transferPDF')} />
            </>
          )}

          {/* Blog */}
          {selectedType === 'blog' && (
            <>
              <label className={styles.label}>Titulo</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />

              <label className={styles.label}>Descripción</label>
              <textarea name="content" value={formData.content} onChange={handleChange} />
            </>
          )}

          {/* Gasto */}
          {selectedType === 'expense' && (
            <>
              <label className={styles.label}>Nombre</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

              <label className={styles.label}>Pagado por</label>
              <input type="text" name="paidBy" value={formData.paidBy} onChange={handleChange} placeholder="Ej: Yo, Pareja" />
            </>
          )}

          {/* Presupuesto */}
          {selectedType === 'budget' && (
            <>
              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </>
          )}

          <button type="submit" className={styles.submitButton}>
            Agregar {selectedType}
          </button>
        </form>
      )}
    </div>
  );
};

export default Page;
