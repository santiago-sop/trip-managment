"use client";
import { useEffect, useState } from "react";

export default function AddTrip() {
  const [user, setUser] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || '{}');
    setUser({
      email: storedUser.email || "",
      password: storedUser.password || "",
      firstName: storedUser.firstName || "",
      lastName: storedUser.lastName || ""
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Modificando usuario...");
    try {
      const res = await fetch("https://trip-managment.onrender.com/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMsg("Usuario modificado correctamente");
        localStorage.setItem("user", JSON.stringify(user));
        //window.location.href = "/";
      } else {
        setMsg(data.message || "Error al modificar usuario");
      }
    } catch (err) {
      setMsg("Error de conexión");
    }
  };

  const handleDelete = async () => {
    setMsg("Eliminando usuario...");
    try {
      const res = await fetch(`https://trip-managment.onrender.com/api/users/email/${user.email}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMsg("Usuario eliminado correctamente");
        localStorage.removeItem("user");
        localStorage.removeItem("loggedIn");
        document.cookie = "loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/login";
      } else {
        setMsg(data.message || "Error al eliminar usuario");
      }
    } catch (err) {
      setMsg("Error de conexión");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Datos del usuario</h2>
      <form onSubmit={handleModify}>
        <label>Email:</label>
        <input name="email" type="email" value={user.email} disabled style={{ width: "100%" }} />
        <label>Contraseña:</label>
        <input name="password" type="password" value={user.password} onChange={handleChange} style={{ width: "100%" }} required />
        <label>Nombre:</label>
        <input name="firstName" type="text" value={user.firstName} onChange={handleChange} style={{ width: "100%" }} required />
        <label>Apellido:</label>
        <input name="lastName" type="text" value={user.lastName} onChange={handleChange} style={{ width: "100%" }} required />
        <button type="submit" style={{ marginTop: 16 }}>Modificar</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: 16, background: "#c00", color: "#fff" }}>Eliminar usuario</button>
      <p>{msg}</p>
    </div>
  );
}
