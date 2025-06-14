"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StayPage() {
  const { tripId, stayId } = useParams();
  const router = useRouter();
  type Stay = {
    name: string;
    startDate: string;
    endDate: string;
    checkin: string;
    checkout: string;
    location: string;
    cost: number;
    paid: boolean;
    // ...otros campos
  };
  const [stay, setStay] = useState<Stay | null>(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log("Fetching stay with ID:", stayId);
    fetch(`https://trip-managment.onrender.com/api/trips/stay/${tripId}/${stayId}`)
      .then(res => res.json())
      .then(data => {
        if (data.payload && Array.isArray(data.payload.stays) && data.payload.stays.length > 0) {
          setStay(data.payload.stays[0]);
        } else {
          setStay(null);
        }
      });
  }, [stayId, tripId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setStay((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/stay/${tripId}/${stayId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stay)
    });
    if (res.ok) setMsg("¡Estadía modificada!");
    else setMsg("Error al modificar");
    setEdit(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/stay/${tripId}/${stayId}`, {
      method: "DELETE"
    });
    if (res.ok) router.push("/");
    else setMsg("Error al eliminar");
  };

  if (!stay) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Estadía</h2>
      <div>
        <div>
          <span>Nombre: </span>
          {edit ? (
            <input name="name" value={stay.name || ""} onChange={handleChange} />
          ) : (
            <span>{stay.name}</span>
          )}
        </div>
        <div>
          <span>Fecha inicio: </span>
          {edit ? (
            <input name="startDate" type="date" value={stay.startDate?.slice(0,10) || ""} onChange={handleChange} />
          ) : (
            <span>{stay.startDate?.slice(0,10)}</span>
          )}
        </div>
        <div>
          <span>Check-in: </span>
          {edit ? (
            <input name="checkin" value={stay.checkin || ""} onChange={handleChange} />
          ) : (
            <span>{stay.checkin}</span>
          )}
        </div>
        <div>
          <span>Fecha fin: </span>
          {edit ? (
            <input name="endDate" type="date" value={stay.endDate?.slice(0,10) || ""} onChange={handleChange} />
          ) : (
            <span>{stay.endDate?.slice(0,10)}</span>
          )}
        </div>
        <div>
          <span>Check-out: </span>
          {edit ? (
            <input name="checkout" value={stay.checkout || ""} onChange={handleChange} />
          ) : (
            <span>{stay.checkout}</span>
          )}
        </div>
        <div>
          <span>Ubicación: </span>
          {edit ? (
            <input name="location" value={stay.location || ""} onChange={handleChange} />
          ) : (
            <span>{stay.location}</span>
          )}
        </div>
        <div>
          <span>Costo: </span>
          {edit ? (
            <input name="cost" type="number" value={stay.cost || ""} onChange={handleChange} />
          ) : (
            <span>{stay.cost}</span>
          )}
        </div>
        <div>
          <span>Pagado: </span>
          {edit ? (
            <input name="paid" type="checkbox" checked={!!stay.paid} onChange={handleChange} />
          ) : (
            <span>{stay.paid ? "Sí" : "No"}</span>
          )}
        </div>
      </div>
      {edit ? (
        <>
          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEdit(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <button onClick={() => setEdit(true)}>Modificar</button>
          <button onClick={handleDelete}>Eliminar</button>
          <div>{msg}</div>
        </>
      )}
    </div>
  );
}