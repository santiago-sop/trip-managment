'use client';

import React, { useState } from 'react';
import styles from './add.module.css';

const Page = () => {
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    date: string;
    cost: string;
    paid: boolean;
    city: string;
    checkInDate: string;
    checkOutDate: string;
    checkInTime: string;
    checkOutTime: string;
    location: string;
    reservationPDF: File | null;
    description: string;
    startDay: string;
    endDay: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    transferPDF: File | null;
    amount: string;
    paidBy: string;
  }>({
    name: '',
    date: '',
    cost: '',
    paid: false,
    city: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    location: '',
    reservationPDF: null,
    description: '',
    startDay: '',
    endDay: '',
    startLocation: '',
    endLocation: '',
    startTime: '',
    endTime: '',
    transferPDF: null,
    amount: '',
    paidBy: '',
  });

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setFormData({
      name: '',
      date: '',
      cost: '',
      paid: false,
      city: '',
      checkInDate: '',
      checkOutDate: '',
      checkInTime: '',
      checkOutTime: '',
      location: '',
      reservationPDF: null,
      description: '',
      startDay: '',
      endDay: '',
      startLocation: '',
      endLocation: '',
      startTime: '',
      endTime: '',
      transferPDF: null,
      amount: '',
      paidBy: '',
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Datos enviados:', formData);
    // Aquí puedes agregar la lógica para enviar los datos al backend con fetch()
  };

  return (
    <div className={styles.addContainer}>
      <h1>Agregar Nuevo Elemento</h1>

      <label className={styles.label}>¿Qué deseas agregar?</label>
      <select className={styles.select} value={selectedType} onChange={handleTypeChange}>
        <option value="">Selecciona una opción</option>
        <option value="activity">Actividad</option>
        <option value="stay">Estadía</option>
        <option value="transfer">Traslado</option>
        <option value="blog">Blog</option>
        <option value="expense">Gasto</option>
      </select>

      {selectedType && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label className={styles.label}>Fecha</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />

          {/* Activity */}
          {selectedType === 'activity' && (
            <>
              <label className={styles.label}>Ciudad</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />

              <label className={styles.label}>Pagado por</label>
              <input type="text" name="paidBy" value={formData.paidBy} onChange={handleChange} placeholder="Ej: Yo, Pareja" />

              <label className={styles.label}>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </>
          )}

          {/* Estadia */}
          {selectedType === 'stay' && (
            <>
              <label className={styles.label}>Fecha de Entrada</label>
              <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />

              <label className={styles.label}>Fecha de Salida</label>
              <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />

              <label className={styles.label}>Hora de Check-in</label>
              <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} required />

              <label className={styles.label}>Hora de Check-out</label>
              <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} required />

              <label className={styles.label}>Ubicación</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />

              <label className={styles.label}>Subir PDF de Reserva</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'reservationPDF')} />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />

              <label className={styles.label}>Pagado por</label>
              <input type="text" name="paidBy" value={formData.paidBy} onChange={handleChange} placeholder="Ej: Yo, Pareja" />
            </>
          )}

          {/* Traslado */}
          {selectedType === 'transfer' && (
            <>
              <label className={styles.label}>Día de Inicio</label>
              <input type="date" name="startDay" value={formData.startDay} onChange={handleChange} required />

              <label className={styles.label}>Día Final</label>
              <input type="date" name="endDay" value={formData.endDay} onChange={handleChange} required />

              <label className={styles.label}>Lugar de Inicio</label>
              <input type="text" name="startLocation" value={formData.startLocation} onChange={handleChange} required />

              <label className={styles.label}>Lugar Final</label>
              <input type="text" name="endLocation" value={formData.endLocation} onChange={handleChange} required />

              <label className={styles.label}>Hora de Inicio</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />

              <label className={styles.label}>Hora Final</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />

              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />

              <label className={styles.label}>Pagado por</label>
              <input type="text" name="paidBy" value={formData.paidBy} onChange={handleChange} placeholder="Ej: Yo, Pareja" />

              <label className={styles.label}>Subir PDF del Ticket</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'transferPDF')} />
            </>
          )}

          {/* Blog */}
          {selectedType === 'blog' && (
            <>
              <label className={styles.label}>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </>
          )}

          {/* Gasto */}
          {selectedType === 'expense' && (
            <>
              <label className={styles.label}>Monto (€)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />

              <label className={styles.label}>Pagado por</label>
              <input type="text" name="paidBy" value={formData.paidBy} onChange={handleChange} placeholder="Ej: Yo, Pareja" />
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
