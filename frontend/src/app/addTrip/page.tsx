"use client";
import { useState, useEffect } from "react";

export default function AddTripPage() {
  const [trip, setTrip] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    destination: "",
    budget: 0
  });
  const [msg, setMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || '{}');
    setUserEmail(storedUser.email || "");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: name === "budget" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Agregando viaje...");
    try {
      const res = await fetch(`https://trip-managment.onrender.com/api/trips/${userEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMsg("Viaje agregado correctamente");
        setTrip({ name: "", description: "", startDate: "", endDate: "", destination: "", budget: 0 });
      } else {
        setMsg(data.message || "Error al agregar viaje");
      }
    } catch (err) {
      setMsg("Error de conexión");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Agregar viaje</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input name="name" type="text" value={trip.name} onChange={handleChange} required style={{ width: "100%" }} />
        <label>Descripción:</label>
        <textarea name="description" value={trip.description} onChange={handleChange} style={{ width: "100%" }} />
        <label>Fecha de inicio:</label>
        <input name="startDate" type="date" value={trip.startDate} onChange={handleChange} required style={{ width: "100%" }} />
        <label>Fecha de fin:</label>
        <input name="endDate" type="date" value={trip.endDate} onChange={handleChange} required style={{ width: "100%" }} />
        <label>Destino:</label>
        <input name="destination" type="text" value={trip.destination} onChange={handleChange} style={{ width: "100%" }} />
        <label>Presupuesto:</label>
        <input name="budget" type="number" value={trip.budget} onChange={handleChange} min={0} style={{ width: "100%" }} />
        <button type="submit" style={{ marginTop: 16 }}>Agregar viaje</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
