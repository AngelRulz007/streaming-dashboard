import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase (reemplaza con tus credenciales si es necesario)
const supabaseUrl = 'https://qpbuauzuqniamvnvtwkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYnVhdXp1cW5pYW12bnZ0d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjM0ODIwMjgwMjB9.1pxxxxx'; // Asegúrate de tener tu llave válida
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot', 'dashboard', 'master'
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setView('dashboard');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Error al iniciar sesión: ' + error.message);
    } else {
      setView('dashboard');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage('Error al registrarse: ' + error.message);
    } else {
      setMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView('login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f11', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Barra superior */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ color: '#e50914', margin: 0 }}>RulzStreaming</h2>
        {session && (
          <button onClick={handleLogout} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        )}
      </header>

      {/* Contenido según la vista */}
      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#1a1a1e', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
        {message && <div style={{ background: '#333', padding: '10px', marginBottom: '15px', borderRadius: '5px', fontSize: '14px' }}>{message}</div>}

        {view === 'login' && (
          <form onSubmit={handleLogin}>
            <h3>Iniciar Sesión</h3>
            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '14px' }}>
              <span onClick={() => setView('forgot')} style={{ color: '#aaa', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>
              <span onClick={() => setView('register')} style={{ color: '#e50914', cursor: 'pointer' }}>Registrarse</span>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister}>
            <h3>Crear Cuenta</h3>
            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Registrarse</button>
            <p onClick={() => setView('login')} style={{ textAlign: 'center', marginTop: '15px', color: '#aaa', cursor: 'pointer', fontSize: '14px' }}>← Volver al login</p>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <h3>Recuperar Contraseña</h3>
            <input type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar instrucciones</button>
            <p onClick={() => setView('login')} style={{ textAlign: 'center', marginTop: '15px', color: '#aaa', cursor: 'pointer', fontSize: '14px' }}>← Volver al login</p>
          </form>
        )}

        {view === 'dashboard' && (
          <div>
            <h3>Bienvenido a tu Dashboard</h3>
            <p>Has iniciado sesión correctamente.</p>
            {email === 'angeltime9001@gmail.com' && (
              <button onClick={() => setView('master')} style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Entrar al Panel Master
              </button>
            )}
          </div>
        )}

        {view === 'master' && (
          <div>
            <h3>Panel Master (Administrador)</h3>
            <p>Aquí puedes gestionar perfiles y accesos de streaming.</p>
            <button onClick={() => setView('dashboard')} style={{ width: '100%', padding: '10px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>Volver al Dashboard</button>
          </div>
        )}
      </div>

      {/* Botón flotante de WhatsApp */}
      <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#25d366', color: '#fff', borderRadius: '50%', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', textDecoration: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
        💬
      </a>
    </div>
  );
}
