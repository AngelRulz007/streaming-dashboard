import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración oficial con tu clave real integrada
const supabaseUrl = 'https://qpbuauzuqniamvnvtwkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYnVhdXp1cW5pYW12bnZ0d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDk0MjYsImV4cCI6MjEwMjkyNTQyNn0.Ylr4O9Xt8iE-0Hs47dgZjc0cJr1PmsH5aRnsoeRHE6c';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('landing');
  const [message, setMessage] = useState('');

  const [accounts, setAccounts] = useState([
    { id: 1, service: 'Netflix', code: 'NET', active: 0, free: 5 },
    { id: 2, service: 'Max (HBO)', code: 'MAX', active: 0, free: 4 },
    { id: 3, service: 'Disney+', code: 'DS', active: 0, free: 6 },
    { id: 4, service: 'Amazon Prime', code: 'AMA', active: 0, free: 3 },
  ]);

  const [subPanels, setSubPanels] = useState([
    { id: 1, email: 'revendedor_demo@gmail.com', role: 'nivel1', status: 'Activo' }
  ]);

  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubLevel, setNewSubLevel] = useState('nivel1');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setView('dashboard');
    }).catch(() => {});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setView('dashboard');
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
      setMessage('¡Registro exitoso! Ya puedes iniciar sesión.');
      setTimeout(() => setView('login'), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView('landing');
  };

  const handleCreateSubPanel = (e) => {
    e.preventDefault();
    if (!newSubEmail) return;
    setSubPanels([...subPanels, { id: Date.now(), email: newSubEmail, role: newSubLevel, status: 'Activo' }]);
    setNewSubEmail('');
    alert('¡Subpanel creado con éxito!');
  };

  const userEmail = session?.user?.email;
  const isOwner = userEmail === 'angeltime900.1@gmail.com' || userEmail === 'angeltime9001@gmail.com';
  const isLevel2 = userEmail?.includes('nivel2') || isOwner;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0b0e', color: '#fff', fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      
      {!session && view === 'landing' && (
        <div style={{ width: '100%' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #222' }}>
            <h2 style={{ color: '#e50914', margin: 0 }}>RulzStreaming</h2>
            <button onClick={() => setView('login')} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Iniciar sesión
            </button>
          </header>
          <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ background: 'rgba(229, 9, 20, 0.2)', color: '#e50914', padding: '6px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
              🎁 ¡Promociones 3, 6 y 12 Meses Disponibles!
            </span>
            <h1 style={{ fontSize: '48px', margin: '20px 0', lineHeight: '1.2' }}>
              Lleva tu venta de <span style={{ color: '#f5c518' }}>streaming</span> al siguiente nivel
            </h1>
            <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '30px' }}>
              Organiza cuentas, perfiles y revendedores con automatización por WhatsApp.
            </p>
            <button onClick={() => setView('register')} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '15px 30px', fontSize: '16px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Comenzar Ahora →
            </button>
          </div>
        </div>
      )}

      {!session && (view === 'login' || view === 'register') && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '400px', background: '#141419', padding: '30px', borderRadius: '10px', border: '1px solid #222' }}>
            {message && <div style={{ background: '#333', padding: '10px', marginBottom: '15px', borderRadius: '5px', fontSize: '13px' }}>{message}</div>}
            
            {view === 'login' && (
              <form onSubmit={handleLogin}>
                <h3 style={{ marginBottom: '20px' }}>Iniciar Sesión</h3>
                <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
                <p onClick={() => setView('register')} style={{ textAlign: 'center', marginTop: '15px', color: '#e50914', cursor: 'pointer', fontSize: '13px' }}>¿No tienes cuenta? Regístrate</p>
              </form>
            )}

            {view === 'register' && (
              <form onSubmit={handleRegister}>
                <h3 style={{ marginBottom: '20px' }}>Crear Cuenta de Revendedor</h3>
                <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Registrarse</button>
                <p onClick={() => setView('login')} style={{ textAlign: 'center', marginTop: '15px', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}>← Volver al login</p>
              </form>
            )}
            <button onClick={() => setView('landing')} style={{ background: 'transparent', color: '#888', border: 'none', marginTop: '15px', cursor: 'pointer', width: '100%' }}>Volver a la web</button>
          </div>
        </div>
      )}

      {session && (
        <>
          <aside style={{ width: '260px', background: '#111116', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <div style={{ background: isOwner ? '#f5c518' : '#e50914', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>RS</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>{isOwner ? '👑 Dueño Master' : '📦 Panel Revendedor'}</h4>
                <span style={{ fontSize: '11px', color: '#888' }}>{userEmail}</span>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <button onClick={() => setView('dashboard')} style={{ textAlign: 'left', padding: '12px', background: view === 'dashboard' ? '#e50914' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                📊 Panel General
              </button>

              {isLevel2 && (
                <button onClick={() => setView('subpanels')} style={{ textAlign: 'left', padding: '12px', background: view === 'subpanels' ? '#0070f3' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ⚙️ Crear Subpaneles
                </button>
              )}

              <button onClick={() => setView('promos')} style={{ textAlign: 'left', padding: '12px', background: view === 'promos' ? '#f5c518' : 'transparent', color: view === 'promos' ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                🎁 Promos (3, 6, 12 Meses)
              </button>
            </nav>

            <button onClick={handleLogout} style={{ padding: '10px', background: '#222', color: '#ff4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cerrar Sesión
            </button>
          </aside>

          <main style={{ flex: 1, padding: '40px', overflowY: 'auto', background: isOwner ? '#0e0e13' : '#0b0b0e' }}>
            
            {view === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '26px' }}>
                      {isOwner ? '👑 Panel Super Administrador (Dueño)' : 'Panel de Control - Revendedor'}
                    </h1>
                    <p style={{ color: '#888', margin: '5px 0 0 0' }}>Resumen en vivo de tus servicios de streaming</p>
                  </div>
                  <button style={{ background: '#e50914', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + Asignar Cliente / Pantalla
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Mis Clientes</p>
                    <h2 style={{ margin: 0, color: '#25d366' }}>0</h2>
                  </div>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Por Cobrar</p>
                    <h2 style={{ margin: 0, color: '#f5c518' }}>S/ 0.00</h2>
                  </div>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Cuentas Activas</p>
                    <h2 style={{ margin: 0, color: '#0070f3' }}>0</h2>
                  </div>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Ganancia Neta</p>
                    <h2 style={{ margin: 0, color: '#25d366' }}>S/ 0.00</h2>
                  </div>
                </div>

                <h3>Disponibilidad por Plataforma</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '15px' }}>
                  {accounts.map(acc => (
                    <div key={acc.id} style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0 }}>{acc.service}</h4>
                        <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#f5c518' }}>{acc.code}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888' }}>
                        <span>🟢 {acc.active} Activas</span>
                        <span>📦 {acc.free} Libres</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'subpanels' && isLevel2 && (
              <div>
                <h2>⚙️ Gestión y Creación de Subpaneles</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>Crea accesos y habilita paneles para tus revendedores.</p>

                <form onSubmit={handleCreateSubPanel} style={{ background: '#141419', padding: '25px', borderRadius: '10px', maxWidth: '500px', marginBottom: '30px', border: '1px solid #222' }}>
                  <h4 style={{ margin: '0 0 15px 0' }}>Nuevo Panel de Revendedor</h4>
                  <input type="email" placeholder="Correo del revendedor" value={newSubEmail} onChange={(e) => setNewSubEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                  <select value={newSubLevel} onChange={(e) => setNewSubLevel(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px' }}>
                    <option value="nivel1">Revendedor Nivel 1</option>
                    <option value="nivel2">Revendedor Nivel 2 (Con opción a subpaneles)</option>
                  </select>
                  <button type="submit" style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Crear Subpanel</button>
                </form>

                <h3>Revendedores Activos</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', background: '#141419', borderRadius: '10px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#1f1f26', color: '#888', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Correo</th>
                      <th style={{ padding: '12px' }}>Nivel / Rol</th>
                      <th style={{ padding: '12px' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subPanels.map(sub => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px' }}>{sub.email}</td>
                        <td style={{ padding: '12px', color: '#f5c518' }}>{sub.role}</td>
                        <td style={{ padding: '12px', color: '#25d366' }}>{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {view === 'promos' && (
              <div>
                <h2>🎁 Configuración de Promociones</h2>
