"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TransferPage() {
  const { transferId } = useParams();
  const router = useRouter();
  const [transfer, setTransfer] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`https://trip-managment.onrender.com/api/trips/transfer/${transferId}`)
      .then(res => res.json())
      .then(data => setTransfer(data.payload));
  }, [transferId]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setTransfer((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/transfer/${transferId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transfer)
    });
    if (res.ok) setMsg("¡Traslado modificado!");
    else setMsg("Error al modificar");
    setEdit(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/transfer/${transferId}`, {
      method: "DELETE"
    });
    if (res.ok) router.push("/");
    else setMsg("Error al eliminar");
  };

  if (!transfer) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Traslado</h2>
      {edit ? (
        <>
          <input name="name" value={transfer.name} onChange={handleChange} />
          <input name="startDate" type="date" value={transfer.startDate?.slice(0,10)} onChange={handleChange} />
          <input name="startTime" value={transfer.startTime} onChange={handleChange} />
          <input name="startLocation" value={transfer.startLocation} onChange={handleChange} />
          <input name="endDate" type="date" value={transfer.endDate?.slice(0,10)} onChange={handleChange} />
          <input name="endTime" value={transfer.endTime} onChange={handleChange} />
          <input name="endLocation" value={transfer.endLocation} onChange={handleChange} />
          <input name="cost" type="number" value={transfer.cost} onChange={handleChange} />
          <label>
            Pagado <input name="paid" type="checkbox" checked={transfer.paid} onChange={handleChange} />
          </label>
          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEdit(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <div>Nombre: {transfer.name}</div>
          <div>Fecha inicio: {transfer.startDate?.slice(0,10)}</div>
          <div>Hora inicio: {transfer.startTime}</div>
          <div>Desde: {transfer.startLocation}</div>
          <div>Fecha fin: {transfer.endDate?.slice(0,10)}</div>
          <div>Hora fin: {transfer.endTime}</div>
          <div>Hasta: {transfer.endLocation}</div>
          <div>Costo: {transfer.cost}</div>
          <div>Pagado: {transfer.paid ? "Sí" : "No"}</div>
          <button onClick={() => setEdit(true)}>Modificar</button>
          <button onClick={handleDelete}>Eliminar</button>
          <div>{msg}</div>
        </>
      )}
    </div>
  );
}