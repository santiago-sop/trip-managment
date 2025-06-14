"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ActivityPage() {
  const { tripId, activityId } = useParams();
  const router = useRouter();
  type Activity = {
    name: string;
    description: string;
    date: string;
    city: string;
    cost: number;
    paid: boolean;
    // ...otros campos
  };
  const [activity, setActivity] = useState<Activity | null>(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log("Fetching activity with ID:", activityId);
    fetch(`https://trip-managment.onrender.com/api/trips/activity/${tripId}/${activityId}`)
      .then(res => res.json())
      .then(data => setActivity(data.payload.activities[0]));
  }, [activityId, tripId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setActivity((prev) => ({
      ...prev!,
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
      <div>
        <div>
          <span>Nombre: </span>
          {edit ? (
            <input name="name" value={activity.name || ""} onChange={handleChange} />
          ) : (
            <span>{activity.name}</span>
          )}
        </div>
        <div>
          <span>Descripción: </span>
          {edit ? (
            <input name="description" value={activity.description || ""} onChange={handleChange} />
          ) : (
            <span>{activity.description}</span>
          )}
        </div>
        <div>
          <span>Fecha: </span>
          {edit ? (
            <input name="date" type="date" value={activity.date?.slice(0,10) || ""} onChange={handleChange} />
          ) : (
            <span>{activity.date?.slice(0,10)}</span>
          )}
        </div>
        <div>
          <span>Ciudad: </span>
          {edit ? (
            <input name="city" value={activity.city || ""} onChange={handleChange} />
          ) : (
            <span>{activity.city}</span>
          )}
        </div>
        <div>
          <span>Costo: </span>
          {edit ? (
            <input name="cost" type="number" value={activity.cost || ""} onChange={handleChange} />
          ) : (
            <span>{activity.cost}</span>
          )}
        </div>
        <div>
          <span>Pagado: </span>
          {edit ? (
            <input name="paid" type="checkbox" checked={!!activity.paid} onChange={handleChange} />
          ) : (
            <span>{activity.paid ? "Sí" : "No"}</span>
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