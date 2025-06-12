'use client';

import React, { useState } from 'react';
import styles from './add.module.css';

const Page = () => {
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    cost: '',
    paid: false,
    description: '',
  });

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setFormData({ name: '', date: '', cost: '', paid: false, description: '' }); // Reset form
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : value,
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

      {/* Selección de tipo */}
      <label className={styles.label}>¿Qué deseas agregar?</label>
      <select className={styles.select} value={selectedType} onChange={handleTypeChange}>
        <option value="">Selecciona una opción</option>
        <option value="activity">Actividad</option>
        <option value="stay">Estadía</option>
        <option value="transfer">Traslado</option>
        <option value="blog">Blog</option>
        <option value="expense">Gasto</option>
      </select>

      {/* Formulario dinámico */}
      {selectedType && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label className={styles.label}>Fecha</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />

          {/* Campos específicos */}
          {(selectedType === 'expense' || selectedType === 'stay') && (
            <>
              <label className={styles.label}>Costo</label>
              <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />

              <label className={styles.label}>¿Pagado?</label>
              <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />
            </>
          )}

          {(selectedType === 'activity' || selectedType === 'blog') && (
            <>
              <label className={styles.label}>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </>
          )}

          <button type="submit" className={styles.submitButton}>Agregar {selectedType}</button>
        </form>
      )}
    </div>
  );
};

export default Page;
