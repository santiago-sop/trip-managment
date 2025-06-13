import React, { useEffect, useState } from "react";

interface Trip {
  _id: string;
  name: string;
}

interface TripSelectModalProps {
  trips: Trip[];
  selectedTripId: string | null;
  onSelect: (tripId: string) => void;
  onClose: () => void;
}

const modalStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const boxStyle: React.CSSProperties = {
  background: '#fff', padding: 32, borderRadius: 12, minWidth: 300, boxShadow: '0 2px 16px #0003'
};

const TripSelectModal: React.FC<TripSelectModalProps> = ({ trips, selectedTripId, onSelect, onClose }) => {
  const [localTripId, setLocalTripId] = useState(selectedTripId || "");

  useEffect(() => {
    setLocalTripId(selectedTripId || "");
  }, [selectedTripId]);

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2>Selecciona un viaje</h2>
        <select
          style={{ width: '100%', padding: 8, margin: '16px 0' }}
          value={localTripId}
          onChange={e => setLocalTripId(e.target.value)}
        >
          <option value="" disabled>Elige un viaje</option>
          {trips.map(trip => (
            <option key={trip._id} value={trip._id}>{trip.name}</option>
          ))}
        </select>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '6px 16px' }}>Cancelar</button>
          <button
            onClick={() => {
              if (localTripId) onSelect(localTripId);
            }}
            style={{ padding: '6px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}
            disabled={!localTripId}
          >Aceptar</button>
        </div>
      </div>
    </div>
  );
};

export default TripSelectModal;
