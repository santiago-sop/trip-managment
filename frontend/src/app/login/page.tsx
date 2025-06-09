'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import styles from "./login.module.css";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFisrtName] = useState('');
  const [lastName, setLastName] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const params = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Llamada a tu endpoint con el email en la ruta
    const res = await fetch(`https://trip-managment.onrender.com/api/users/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      localStorage.setItem('loggedIn', '1');
      const redirectTo = params.get('redirect') || '/';
      router.push(redirectTo);
    } else {
      setMsg(data.message || 'Error de login');
    }
  };

  const createNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Llamada a tu endpoint para crear un nuevo usuario
    const res = await fetch('https://trip-managment.onrender.com/api/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      localStorage.setItem('loggedIn', '1');
      const redirectTo = params.get('redirect') || '/';
      router.push(redirectTo);
    } else {
      setMsg(data.message || 'Error de login');
    }
  };

  return (
    <div className={styles.login}>
      <h1 >Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
               onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password}
               onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        
      </form>
      <form onSubmit={createNewUser}>
        <input type="email" placeholder="Email" value={email}
               onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password}
               onChange={e=>setPassword(e.target.value)} required />
               <input type="text" placeholder="Nombre" value={firstName}
               onChange={e=>setFisrtName(e.target.value)} required />
        <input type="text" placeholder="apellido" value={lastName}
               onChange={e=>setLastName(e.target.value)} required />
        <button type="submit">crear usuario</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
