import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración con tu clave clásica real de Supabase
const supabaseUrl = 'https://qpbuauzuqniamvnvtwkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYnVhdXp1cW5pYW12bnZ0d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDk0MjYsImV4cCI6MjEwMjkyNTQyNn0.Ylr4O9Xt8iE-0Hs47dgZjc0cJr1PmsH5aRnsoeRHE6c';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('landing');
  const [message, setMessage] = useState('');

  // Cuentas de streaming propias del usuario o administrador
  const [accounts, setAccounts] = useState([
    { id: 1, service: 'Netflix', code: 'NET', active: 2, free: 3 },
    { id: 2, service: 'Max (HBO)', code: 'MAX', active: 1, free: 3 },
    { id: 3, service: 'Disney+', code: 'DS', active: 3, free: 3 },
    { id: 4, service: 'Amazon Prime', code: 'AMA', active: 1, free: 2 },
  ]);

  // Lista de revendedores / subpaneles gestionados por el Dueño o Nivel 2
  const [subPanels, setSubPanels] = useState([
    { id: 1, email: 'revendedor.basico@gmail.com', level: 'Nivel 1', status: 'Activo' }
  ]);

  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubLevel, setNewSubLevel] = useState('Nivel 1');

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
      setMessage('¡Registro exitoso como Revendedor Básico (Nivel 1)! Ya puedes iniciar sesión.');
      setTimeout(() => setView('login'), 2500);
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
    setSubPanels([...subPanels, { id: Date.now(), email: newSubEmail, level: newSubLevel, status: 'Activo' }]);
    setNewSubEmail('');
    alert('¡Subpanel creado y asignado con éxito!');
  };

  const userEmail = session?.user?.email;
  const isOwner = userEmail === 'angeltime900.1@gmail.com' || userEmail === 'angeltime9001@gmail.com';
  
  // Puedes simular que un usuario Nivel 2 tenga "nivel2" en su correo o configurarlo aquí
  const isLevel2 = userEmail?.includes('nivel2') || isOwner;

  // Definición de colores según el nivel (Nivel 1: Azul/Morado | Dueño/Nivel 2: Verde esmeralda)
  const themeColor = isOwner || isLevel2 ? '#25d366' : '#0070f3';
  const sidebarBg = isOwner || isLevel2 ? '#0b1410' : '#0e0b16';

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
              🎁 ¡Sistema Multinivel de Streaming!
            </span>
            <h1 style={{ fontSize: '48px', margin: '20px 0', lineHeight: '1.2' }}>
              Gestiona tus cuentas de <span style={{ color: '#f5c518' }}>streaming</span> de forma profesional
            </h1>
            <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '30px' }}>
              Plataforma automatizada para revendedores de Nivel 1 y Nivel 2.
            </p>
            <button onClick={() => setView('register')} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '15px 30px', fontSize: '16px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Registrarse Gratis (Nivel 1) →
            </button>
          </div>
        </div>
      )}

      {!session && (view === 'login' || view === 'register') && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '400px', background: '#141419', padding: '30px', borderRadius: '10px', border: '1px solid #222' }}>
            {message && <div style={{ background: '#222', padding: '10px', marginBottom: '15px', borderRadius: '5px', fontSize: '13px', color: '#25d366' }}>{message}</div>}
            
            {view === 'login' && (
              <form onSubmit={handleLogin}>
                <h3 style={{ marginBottom: '20px' }}>Iniciar Sesión</h3>
                <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
                <p onClick={() => setView('register')} style={{ textAlign: 'center', marginTop: '15px', color: '#0070f3', cursor: 'pointer', fontSize: '13px' }}>¿No tienes cuenta? Regístrate como Nivel 1</p>
              </form>
            )}

            {view === 'register' && (
              <form onSubmit={handleRegister}>
                <h3 style={{ marginBottom: '20px' }}>Registro Revendedor Nivel 1 (Básico)</h3>
                <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Crear Cuenta Básica</button>
                <p onClick={() => setView('login')} style={{ textAlign: 'center', marginTop: '15px', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}>← Volver al login</p>
              </form>
            )}
            <button onClick={() => setView('landing')} style={{ background: 'transparent', color: '#888', border: 'none', marginTop: '15px', cursor: 'pointer', width: '100%' }}>Volver a la web</button>
          </div>
        </div>
      )}

      {session && (
        <>
          {/* MENÚ LATERAL DINÁMICO SEGÚN ROL (Azul para Nivel 1, Verde para Dueño/Nivel 2) */}
          <aside style={{ width: '260px', background: sidebarBg, borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <div style={{ background: themeColor, width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>RS</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>{isOwner ? '👑 Dueño Master' : isLevel2 ? '⭐ Revendedor Nivel 2' : '📦 Revendedor Nivel 1'}</h4>
                <span style={{ fontSize: '11px', color: '#888' }}>{userEmail}</span>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <button onClick={() => setView('dashboard')} style={{ textAlign: 'left', padding: '12px', background: view === 'dashboard' ? themeColor : 'transparent', color: view === 'dashboard' && isLevel2 ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                📊 Mis Cuentas Streaming
              </button>

              {/* SOLO DUEÑO O NIVEL 2 PUEDEN VER LA GESTIÓN DE SUBPANELES */}
              {isLevel2 && (
                <button onClick={() => setView('subpanels')} style={{ textAlign: 'left', padding: '12px', background: view === 'subpanels' ? themeColor : 'transparent', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ⚙️ Crear Subpaneles Nivel 1
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

          <main style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#0b0b0e' }}>
            
            {view === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '26px', color: isLevel2 ? '#25d366' : '#fff' }}>
                      {isOwner ? '👑 Panel Super Administrador (Dueño)' : isLevel2 ? '⭐ Panel de Control - Nivel 2' : '📦 Panel de Control - Nivel 1 (Básico)'}
                    </h1>
                    <p style={{ color: '#888', margin: '5px 0 0 0' }}>Control y administración de tus servicios de streaming propios</p>
                  </div>
                  <button style={{ background: themeColor, color: isLevel2 ? '#000' : '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + Gestionar Cliente
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Mis Clientes</p>
                    <h2 style={{ margin: 0, color: '#25d366' }}>5</h2>
                  </div>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Por Cobrar</p>
                    <h2 style={{ margin: 0, color: '#f5c518' }}>S/ 75.00</h2>
                  </div>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Cuentas Propias</p>
                    <h2 style={{ margin: 0, color: themeColor }}>7 Activas</h2>
                  </div>
                  <div style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Ganancia Neta</p>
                    <h2 style={{ margin: 0, color: '#25d366' }}>S/ 150.00</h2>
                  </div>
                </div>

                <h3>Control de Cuentas de Streaming Propias</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '15px' }}>
                  {accounts.map(acc => (
                    <div key={acc.id} style={{ background: '#141419', padding: '20px', borderRadius: '10px', border: `1px solid ${themeColor}33` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0 }}>{acc.service}</h4>
                        <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#f5c518' }}>{acc.code}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888' }}>
                        <span>🟢 {acc.active} Usadas</span>
                        <span>📦 {acc.free} Libres</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'subpanels' && isLevel2 && (
              <div>
                <h2>⚙️ Gestión Avanzada: Crear Subpaneles Nivel 1</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>Crea y habilita accesos para nuevos revendedores básicos.</p>

                <form onSubmit={handleCreateSubPanel} style={{ background: '#141419', padding: '25px', borderRadius: '10px', maxWidth: '500px', marginBottom: '30px', border: '1px solid #25d366' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#25d366' }}>Nuevo Panel Nivel 1</h4>
                  <input type="email" placeholder="Correo del revendedor" value={newSubEmail} onChange={(e) => setNewSubEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px', boxSizing: 'border-box' }} />
                  <select value={newSubLevel} onChange={(e) => setNewSubLevel(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#1f1f26', border: '1px solid #333', color: '#fff', borderRadius: '5px' }}>
                    <option value="Nivel 1">Revendedor Nivel 1 (Básico)</option>
                    <option value="Nivel 2">Revendedor Nivel 2 (Avanzado)</option>
                  </select>
                  <button type="submit" style={{ width: '100%', padding: '12px', background: '#25d366', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Crear Subpanel</button>
                </form>

                <h3>Revendedores Bajo tu Cargo</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', background: '#141419', borderRadius: '10px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#1f1f26', color: '#888', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Correo</th>
                      <th style={{ padding: '12px' }}>Nivel</th>
                      <th style={{ padding: '12px' }}>Estado</th>
                      <th style={{ padding: '12px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subPanels.map(sub => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px' }}>{sub.email}</td>
                        <td style={{ padding: '12px', color: '#25d366' }}>{sub.level}</td>
                        <td style={{ padding: '12px', color: '#25d366' }}>{sub.status}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => alert('¡Subpanel ascendido a Nivel 2 con éxito!')} style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            Ascender a Nivel 2 ⚡
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {view === 'promos' && (
              <div>
                <h2>🎁 Configuración de Promociones</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>Gestiona los paquetes y descuentos especiales para tus clientes.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div style={{ background: '#141419', padding: '25px', borderRadius: '10px', border: '1px solid #f5c518' }}>
                    <h3 style={{ color: '#f5c518', marginTop: 0 }}>Paquete 3 Meses</h3>
                    <p style={{ color: '#888' }}>Ideal para retención de clientes con 10% de descuento automático.</p>
                    <button style={{ width: '100%', padding: '10px', background: '#f5c518', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>Activar Promo</button>
                  </div>
                  <div style={{ background: '#141419', padding: '25px', borderRadius: '10px', border: '1px solid #0070f3' }}>
                    <h3 style={{ color: '#0070f3', marginTop: 0 }}>Paquete 6 Meses</h3>
                    <p style={{ color: '#888' }}>Pago semestral con beneficios y 20% de descuento.</p>
                    <button style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>Activar Promo</button>
                  </div>
                  <div style={{ background: '#141419', padding: '25px', borderRadius: '10px', border: '1px solid #e50914' }}>
                    <h3 style={{ color: '#e50914', marginTop: 0 }}>Paquete 12 Meses</h3>
                    <p style={{ color: '#888' }}>Membresía anual exclusiva con máxima rentabilidad.</p>
                    <button style={{ width: '100%', padding: '10px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>Activar Promo</button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </>
      )}

      <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '25px', right: '25px', background: '#25d366', color: '#fff', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', zIndex: 1000 }}>
        💬
      </a>
    </div>
  );
}
