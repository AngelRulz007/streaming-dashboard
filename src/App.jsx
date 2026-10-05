import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con tus credenciales reales
const supabaseUrl = 'https://qpbuauzuqniamvnvtwkl.supabase.co';
const supabaseKey = 'sb_publishable_PHHCoLCpNLCQe3Lh9GKz_A_OAGMe...'; // Asegúrate de copiar tu llave completa desde Supabase si falta un fragmento
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('landing'); // 'landing', 'login', 'register', 'forgot', 'dashboard', 'master'
  const [message, setMessage] = useState('');

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
    setView('landing');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f11', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Barra de navegación superior */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #222' }}>
        <h2 style={{ color: '#e50914', margin: 0, cursor: 'pointer' }} onClick={() => setView('landing')}>RulzStreaming</h2>
        <div>
          {!session ? (
            <button onClick={() => setView('login')} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Iniciar sesión
            </button>
          ) : (
            <button onClick={handleLogout} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      {/* VISTA 1: LANDING PAGE */}
      {view === 'landing' && (
        <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ background: 'rgba(229, 9, 20, 0.2)', color: '#e50914', padding: '6px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            🎁 ¡Prueba Gratis de 30 Días sin compromiso!
          </span>
          <h1 style={{ fontSize: '48px', margin: '20px 0', lineHeight: '1.2' }}>
            Lleva tu venta de <span style={{ color: '#f5c518' }}>streaming</span> al siguiente nivel con RulzStreaming
          </h1>
          <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '30px' }}>
            Organiza proveedores, cuentas, perfiles y cobros con un flujo de trabajo automatizado por WhatsApp en un solo clic.
          </p>
          <button onClick={() => setView('register')} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '15px 30px', fontSize: '16px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Comenzar Prueba Gratis →
          </button>
        </div>
      )}

      {/* CONTENEDOR DE FORMULARIOS Y PANELES */}
      {(view === 'login' || view === 'register' || view === 'forgot') && (
        <div style={{ maxWidth: '400px', margin: '60px auto', background: '#1a1a1e', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
          {message && <div style={{ background: '#333', padding: '10px', marginBottom: '15px', borderRadius: '5px', fontSize: '14px' }}>{message}</div>}

          {view === 'login' && (
            <form onSubmit={handleLogin}>
              <h3 style={{ marginBottom: '20px' }}>Iniciar Sesión</h3>
              <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
              <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '13px' }}>
                <span onClick={() => setView('forgot')} style={{ color: '#aaa', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>
                <span onClick={() => setView('register')} style={{ color: '#e50914', cursor: 'pointer' }}>Registrarse</span>
              </div>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister}>
              <h3 style={{ marginBottom: '20px' }}>Crear Cuenta</h3>
              <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
              <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Registrarse</button>
              <p onClick={() => setView('login')} style={{ textAlign: 'center', marginTop: '15px', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}>← Volver al login</p>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword}>
              <h3 style={{ marginBottom: '20px' }}>Recuperar Contraseña</h3>
              <input type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#2a2a30', border: '1px solid #444', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar instrucciones</button>
              <p onClick={() => setView('login')} style={{ textAlign: 'center', marginTop: '15px', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}>← Volver al login</p>
            </form>
          )}
        </div>
      )}

      {/* VISTA 2: DASHBOARD DE CLIENTE */}
      {view === 'dashboard' && session && (
        <div style={{ maxWidth: '600px', margin: '60px auto', background: '#1a1a1e', padding: '30px', borderRadius: '10px' }}>
          <h3>Panel de Usuario</h3>
          <p style={{ color: '#aaa' }}>Bienvenido: {session.user.email}</p>
          <hr style={{ borderColor: '#333', margin: '20px 0' }} />
          <p>Aquí puedes ver tus perfiles y servicios activos de streaming.</p>

          {/* Botón especial para entrar al Panel Master si eres el administrador */}
          {session.user.email === 'angeltime9001@gmail.com' && (
            <button onClick={() => setView('master')} style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
              ⚙️ Entrar al Panel Master (Administrador)
            </button>
          )}
        </div>
      )}

      {/* VISTA 3: PANEL MASTER EXCLUSIVO */}
      {view === 'master' && session?.user.email === 'angeltime9001@gmail.com' && (
        <div style={{ maxWidth: '800px', margin: '40px auto', background: '#1a1a1e', padding: '30px', borderRadius: '10px', border: '1px solid #0070f3' }}>
          <h2 style={{ color: '#0070f3' }}>Panel Master - Control Total</h2>
          <p style={{ color: '#aaa' }}>Sección exclusiva para gestión de cuentas, clientes y cobros de streaming.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
            <div style={{ background: '#25252b', padding: '20px', borderRadius: '8px' }}>
              <h4>Gestión de Cuentas</h4>
              <p style={{ fontSize: '14px', color: '#aaa' }}>Agregar, editar o revisar pantallas activas.</p>
            </div>
            <div style={{ background: '#25252b', padding: '20px', borderRadius: '8px' }}>
              <h4>Clientes y Cobros</h4>
              <p style={{ fontSize: '14px', color: '#aaa' }}>Control de renovaciones y accesos de WhatsApp.</p>
            </div>
          </div>
          <button onClick={() => setView('dashboard')} style={{ padding: '10px 20px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '25px' }}>
            ← Volver al Dashboard
          </button>
        </div>
      )}

      {/* Botón flotante de WhatsApp */}
      <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '25px', right: '25px', background: '#25d366', color: '#fff', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', zIndex: 1000 }}>
        💬
      </a>
    </div>
  );
}
