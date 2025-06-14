"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TransferPage() {
  const { tripId, transferId } = useParams();
  const router = useRouter();
  type Transfer = {
    name: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    cost: number;
    paid: boolean;
    // ...otros campos
  };
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`https://trip-managment.onrender.com/api/trips/transfer/${tripId}/${transferId}`)
      .then(res => res.json())
      .then(data => setTransfer(data.payload.transfers[0]));
  }, [transferId, tripId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTransfer((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/transfer/${tripId}/${transferId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transfer)
    });
    if (res.ok) setMsg("¡Traslado modificado!");
    else setMsg("Error al modificar");
    setEdit(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`https://trip-managment.onrender.com/api/trips/transfer/${tripId}/${transferId}`, {
      method: "DELETE"
    });
    if (res.ok) router.push("/");
    else setMsg("Error al eliminar");
  };

  if (!transfer) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Traslado</h2>
      <div>
        <div>
          <span>Nombre: </span>
          {edit ? (
            <input name="name" value={transfer.name || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.name}</span>
          )}
        </div>
        <div>
          <span>Fecha inicio: </span>
          {edit ? (
            <input name="startDate" type="date" value={transfer.startDate?.slice(0,10) || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.startDate?.slice(0,10)}</span>
          )}
        </div>
        <div>
          <span>Hora inicio: </span>
          {edit ? (
            <input name="startTime" value={transfer.startTime || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.startTime}</span>
          )}
        </div>
        <div>
          <span>Desde: </span>
          {edit ? (
            <input name="startLocation" value={transfer.startLocation || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.startLocation}</span>
          )}
        </div>
        <div>
          <span>Fecha fin: </span>
          {edit ? (
            <input name="endDate" type="date" value={transfer.endDate?.slice(0,10) || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.endDate?.slice(0,10)}</span>
          )}
        </div>
        <div>
          <span>Hora fin: </span>
          {edit ? (
            <input name="endTime" value={transfer.endTime || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.endTime}</span>
          )}
        </div>
        <div>
          <span>Hasta: </span>
          {edit ? (
            <input name="endLocation" value={transfer.endLocation || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.endLocation}</span>
          )}
        </div>
        <div>
          <span>Costo: </span>
          {edit ? (
            <input name="cost" type="number" value={transfer.cost || ""} onChange={handleChange} />
          ) : (
            <span>{transfer.cost}</span>
          )}
        </div>
        <div>
          <span>Pagado: </span>
          {edit ? (
            <input name="paid" type="checkbox" checked={!!transfer.paid} onChange={handleChange} />
          ) : (
            <span>{transfer.paid ? "Sí" : "No"}</span>
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