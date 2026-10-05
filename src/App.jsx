import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qpbuauzuqniamvnvtwkl.supabase.co';
const supabaseKey = 'sb_publishable_PHHCoLCpNLCQe3Lh9GKz_A_OAGMe...'; // Tu llave real
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('landing');
  const [message, setMessage] = useState('');

  // Estados para el Panel Master (Gestión de cuentas y clientes)
  const [accounts, setAccounts] = useState([
    { id: 1, service: 'Netflix', email: 'net_master@rulz.com', profiles: 5, activeProfiles: 4, expiry: '2026-11-15' },
    { id: 2, service: 'Disney+', email: 'disney_master@rulz.com', profiles: 7, activeProfiles: 6, expiry: '2026-11-20' },
    { id: 3, service: 'Max (HBO)', email: 'max_master@rulz.com', profiles: 5, activeProfiles: 3, expiry: '2026-11-10' }
  ]);
  const [clients, setClients] = useState([
    { id: 1, name: 'Juan Pérez', service: 'Netflix - Perfil 2', phone: '51999888777', status: 'Activo' },
    { id: 2, name: 'María Gómez', service: 'Disney+ - Perfil 4', phone: '51911223344', status: 'Por Renovar' }
  ]);

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

  const userEmail = session?.user?.email;
  const isAdmin = userEmail === 'angeltime900.1@gmail.com' || userEmail === 'angeltime9001@gmail.com';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f11', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Barra superior */}
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

      {/* Landing Page */}
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

      {/* Formularios */}
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

      {/* Dashboard de Usuario */}
      {view === 'dashboard' && session && (
        <div style={{ maxWidth: '600px', margin: '60px auto', background: '#1a1a1e', padding: '30px', borderRadius: '10px' }}>
          <h3>Panel de Usuario</h3>
          <p style={{ color: '#aaa' }}>Bienvenido: {userEmail}</p>
          <hr style={{ borderColor: '#333', margin: '20px 0' }} />
          <p>Aquí puedes ver tus perfiles y servicios activos de streaming.</p>

          {isAdmin && (
            <button onClick={() => setView('master')} style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
              ⚙️ Entrar al Panel Master (Administrador)
            </button>
          )}
        </div>
      )}

      {/* PANEL MASTER AVANZADO CON FUNCIONES */}
      {view === 'master' && isAdmin && (
        <div style={{ maxWidth: '900px', margin: '40px auto', background: '#1a1a1e', padding: '30px', borderRadius: '10px', border: '1px solid #0070f3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#0070f3', margin: 0 }}>Panel Master - Control Total</h2>
            <button onClick={() => setView('dashboard')} style={{ padding: '8px 15px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              ← Volver al Dashboard
            </button>
          </div>
          <p style={{ color: '#aaa', marginBottom: '25px' }}>Gestión completa de proveedores, cuentas de streaming y renovaciones de clientes.</p>

          {/* Sección de Cuentas */}
          <div style={{ background: '#25252b', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
            <h3 style={{ marginBottom: '15px', color: '#f5c518' }}>📺 Cuentas y Pantallas Maestras</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444', color: '#aaa' }}>
                  <th style={{ padding: '8px' }}>Servicio</th>
                  <th style={{ padding: '8px' }}>Correo de Cuenta</th>
                  <th style={{ padding: '8px' }}>Perfiles Activos</th>
                  <th style={{ padding: '8px' }}>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{acc.service}</td>
                    <td style={{ padding: '10px', color: '#ccc' }}>{acc.email}</td>
                    <td style={{ padding: '10px' }}>{acc.activeProfiles} / {acc.profiles}</td>
                    <td style={{ padding: '10px', color: '#e50914' }}>{acc.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sección de Clientes y Cobros */}
          <div style={{ background: '#25252b', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '15px', color: '#25d366' }}>💬 Clientes y Cobros por WhatsApp</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444', color: '#aaa' }}>
                  <th style={{ padding: '8px' }}>Cliente</th>
                  <th style={{ padding: '8px' }}>Servicio Asignado</th>
                  <th style={{ padding: '8px' }}>Estado</th>
                  <th style={{ padding: '8px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{client.name}</td>
                    <td style={{ padding: '10px', color: '#ccc' }}>{client.service}</td>
                    <td style={{ padding: '10px', color: client.status === 'Activo' ? '#25d366' : '#f5c518' }}>{client.status}</td>
                    <td style={{ padding: '10px' }}>
                      <a href={`https://wa.me/${client.phone}?text=Hola%20${client.name},%20te%20escribo%20sobre%20tu%20cuenta%20de%20streaming.`} target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', color: '#fff', padding: '5px 10px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                        Cobrar WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '25px', right: '25px', background: '#25d366', color: '#fff', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', zIndex: 1000 }}>
        💬
      </a>
    </div>
  );
}
