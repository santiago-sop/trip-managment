"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ActivityPage() {
  const { tripId, activityId } = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log("Fetching activity with ID:", activityId);
    fetch(`https://trip-managment.onrender.com/api/trips/activity/${tripId}/${activityId}`)
      .then(res => res.json())
      .then(data => setActivity(data.payload));
  }, [activityId]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setActivity((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/activity/${tripId}/${activityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity)
    });
    if (res.ok) setMsg("¡Actividad modificada!");
    else setMsg("Error al modificar");
    setEdit(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/activity/${tripId}/${activityId}`, {
      method: "DELETE"
    });
    if (res.ok) router.push("/");
    else setMsg("Error al eliminar");
  };

  if (!activity) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Actividad</h2>
      {edit ? (
        <>
          <input name="name" value={activity.name} onChange={handleChange} />
          <input name="description" value={activity.description} onChange={handleChange} />
          <input name="date" type="date" value={activity.date?.slice(0,10)} onChange={handleChange} />
          <input name="city" value={activity.city} onChange={handleChange} />
          <input name="cost" type="number" value={activity.cost} onChange={handleChange} />
          <label>
            Pagado <input name="paid" type="checkbox" checked={activity.paid} onChange={handleChange} />
          </label>
          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEdit(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <div>Nombre: {activity.name}</div>
          <div>Descripción: {activity.description}</div>
          <div>Fecha: {activity.date?.slice(0,10)}</div>
          <div>Ciudad: {activity.city}</div>
          <div>Costo: {activity.cost}</div>
          <div>Pagado: {activity.paid ? "Sí" : "No"}</div>
          <button onClick={() => setEdit(true)}>Modificar</button>
          <button onClick={handleDelete}>Eliminar</button>
          <div>{msg}</div>
        </>
      )}
    </div>
  );
}