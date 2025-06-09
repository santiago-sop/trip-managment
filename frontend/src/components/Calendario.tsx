'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendario.module.css';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type Evento = {
  title: string;
  start: Date;
  end: Date;
};

const Calendario = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleSelectSlot = ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => {
    setSelectedSlot({ start, end });
    setNewTitle('');
    setModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (selectedSlot && newTitle.trim() !== '') {
      setEventos((prev) => [...prev, { title: newTitle.trim(), start: selectedSlot.start, end: selectedSlot.end }]);
      setModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        selectable
        longPressThreshold={10}
        onSelectSlot={handleSelectSlot}
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        style={{ height: '100%' }}
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          showMore: (total: number) => `+ Ver más (${total})`,
        }}
      />

      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Nuevo evento</h3>
            <input
              type="text"
              placeholder="Título del evento"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEvent}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
