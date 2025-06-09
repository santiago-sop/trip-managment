'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./login.module.css";

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const params = useSearchParams();

  //**Verificar si el usuario ya está logueado**
  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      router.push(params.get('redirect') || '/'); // Redirigir si ya está autenticado
    }
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Cargando...');

    try {
      let res;

      if (mode === 'login') {
        res = await fetch(`https://trip-managment.onrender.com/api/users/email/${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        res = await fetch('https://trip-managment.onrender.com/api/users/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, firstName, lastName })
        });
      }

      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      if (res.ok && data.status === 'success') {
        localStorage.setItem('loggedIn', '1');
        const redirectTo = params.get('redirect') || '/';
        console.log('Redirigiendo a:', redirectTo);
        router.push(redirectTo); // Ahora sí usamos router.push()
      } else {
        setMsg(data.message || 'Error en la autenticación');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setMsg('Error de conexión');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <>
            <input type="text" placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </>
        )}
        <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{mode === 'login' ? 'Entrar' : 'Registrarse'}</button>
      </form>
      <p className="msg">{msg}</p>
      <p>
        {mode === 'login'
          ? <>¿No tienes cuenta? <button onClick={() => setMode('signup')}>Regístrate</button></>
          : <>¿Ya tienes cuenta? <button onClick={() => setMode('login')}>Ingresar</button></>
        }
      </p>
    </div>
  );
}
