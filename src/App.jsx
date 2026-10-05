import React, { useState } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'forgot_password', 'dashboard'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'master' o 'demo'

  // Configuración de WhatsApp y enlace
  const shareableLink = "https://streaming-dashboard-rust.vercel.app/";
  const whatsappNumber = "51970643781";
  const whatsappMessage = encodeURIComponent("Hola, deseo más información sobre los planes de streaming o activar mi cuenta oficial.");

  // Lista de demos para el panel Master
  const [demosList, setDemosList] = useState([
    { id: 1, email: 'cliente_prueba01@gmail.com', created_at: '2026-10-01', selectedPlan: '1' },
    { id: 2, email: 'demo_user99@gmail.com', created_at: '2026-10-03', selectedPlan: '6' }
  ]);

  // Validación de correo oficial
  const validateOfficialEmail = (mail) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
  };

  // Inicio de sesión y detección de rol Master
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateOfficialEmail(email)) {
      alert("⚠️️ Por favor, ingresa un correo electrónico oficial y válido.");
      return;
    }

    setLoading(true);
    try {
      if (email === 'angeltime9001@gmail.com') {
        setUserRole('master');
      } else {
        setUserRole('demo');
      }
      setCurrentView('dashboard');
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Recuperación de contraseña
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    if (!validateOfficialEmail(email)) {
      alert("⚠️ Ingresa un correo oficial válido para recuperar tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: shareableLink,
      });
      if (error) throw error;

      alert("📧 ¡Correo de recuperación enviado con éxito! Revisa tu bandeja.");
      setCurrentView('login');
    } catch (error) {
      alert("Error al enviar recuperación: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones del panel Master
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    alert("🔗 ¡Enlace de Vercel copiado al portapapeles!");
  };

  const handlePlanChange = (id, plan) => {
    setDemosList(demosList.map(demo => demo.id === id ? { ...demo, selectedPlan: plan } : demo));
  };

  const handleActivateDemo = (targetEmail, plan) => {
    alert(`¡Cuenta ${targetEmail} activada a oficial por un plan de ${plan} mes(es)!`);
  };

  const handleDeleteDemo = (id) => {
    setDemosList(demosList.filter(demo => demo.id !== id));
    alert("Cuenta demo eliminada para liberar espacio en el sistema.");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f11', color: '#fff', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* BOTÓN DE WHATSAPP FLOTANTE EN LA ESQUINA */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#2ed573',
          color: '#000',
          padding: '10px 18px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        💬 Comunícate al WhatsApp
      </a>

      {/* 1. PANTALLA DE LOGIN */}
      {currentView === 'login' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ background: '#1c1c1e', padding: '40px', borderRadius: '12px', width: '380px', border: '1px solid #333' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#fff' }}>Iniciar Sesión</h2>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Correo Oficial</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="tucorreo@gmail.com"
                  style={{ width: '100%', padding: '10px', background: '#2c2c2e', border: '1px solid #444', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px', background: '#2c2c2e', border: '1px solid #444', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ marginTop: '10px', padding: '12px', background: '#d60036', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => setCurrentView('forgot_password')} 
                style={{ background: 'none', border: 'none', color: '#00d2d3', cursor: 'pointer', fontSize: '13px' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PANTALLA DE RECUPERACIÓN DE CONTRASEÑA */}
      {currentView === 'forgot_password' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ background: '#1c1c1e', padding: '40px', borderRadius: '12px', width: '380px', border: '1px solid #333' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Recuperar Contraseña</h3>
            <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', marginBottom: '20px' }}>
              Ingresa tu correo oficial registrado para enviarte el enlace de recuperación.
            </p>

            <form onSubmit={handlePasswordRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="tucorreo@gmail.com"
                style={{ width: '100%', padding: '10px', background: '#2c2c2e', border: '1px solid #444', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }}
              />

              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: '12px', background: '#00d2d3', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {loading ? 'Enviando...' : 'Enviar Enlace al Correo'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => setCurrentView('login')} 
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}
              >
                ← Volver al login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DASHBOARD SEGÚN EL ROL (MASTER VS CLIENTE DEMO) */}
      {currentView === 'dashboard' && (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* CABECERA DIFERENCIADA POR COLOR SEGÚN EL ROL */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px',
            padding: '20px',
            borderRadius: '10px',
            background: userRole === 'master' ? '#3d0c11' : '#141416', // Color rojo oscuro si eres Master, gris oscuro si eres Demo
            border: userRole === 'master' ? '1px solid #ff4757' : '1px solid #222'
          }}>
            <div>
              <h1 style={{ margin: 0 }}>{userRole === 'master' ? '⚡ Panel Maestro (Administrador)' : '🎬 Dashboard de Cliente'}</h1>
              <p style={{ color: '#aaa', margin: '5px 0 0 0' }}>Conectado como: <b>{email}</b> ({userRole.toUpperCase()})</p>
            </div>
            <button 
              onClick={() => { setCurrentView('login'); setUserRole(null); }} 
              style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Cerrar Sesión
            </button>
          </div>

          {/* VISTA SI ES CLIENTE DEMO */}
          {userRole === 'demo' && (
            <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
              <h3>⏳ Estado de tu Cuenta: Demo Activa (30 Días)</h3>
              <p style={{ fontSize: '15px', color: '#bbb', margin: '15px 0', lineHeight: '1.5' }}>
                Tu cuenta cuenta con un periodo de prueba oficial de <b>30 días</b> vinculado a tu correo oficial registrado. Al finalizar este plazo, tu acceso se suspenderá hasta que actives tu plan oficial.
              </p>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '12px 24px', background: '#2ed573', color: '#000', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}
                >
                  💬 Activar Plan Oficial por WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* VISTA SI ERES MASTER ADMIN CON SU PANEL DE DEMOS */}
          {userRole === 'master' && (
            <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '10px', border: '1px solid #ff4757' }}>
              <h2>Herramientas de Control Master</h2>
              <p style={{ color: '#aaa', marginBottom: '20px' }}>Aquí tienes acceso exclusivo para administrar los demos, limpiar registros y activar cuentas a 1, 6 o 12 meses.</p>
              
              <div style={{ background: '#141416', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#00d2d3', fontWeight: 'bold' }}>Enlace de tu plataforma:</span>
                  <button 
                    onClick={handleCopyLink}
                    style={{ background: '#2ed573', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Copiar Enlace
                  </button>
                </div>
                <input 
                  type="text" 
                  readOnly 
                  value={shareableLink} 
                  style={{ background: '#2c2c2e', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #444', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Tabla de Demos */}
              <div style={{ background: '#141416', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <h3 style={{ marginBottom: '15px' }}>Listado de Cuentas Demo Activas</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333', color: '#00d2d3' }}>
                      <th style={{ padding: '10px' }}>Correo Demo</th>
                      <th style={{ padding: '10px' }}>Creado</th>
                      <th style={{ padding: '10px' }}>Plan</th>
                      <th style={{ padding: '10px' }}>Activar</th>
                      <th style={{ padding: '10px' }}>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demosList.map((demo) => (
                      <tr key={demo.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '10px' }}>{demo.email}</td>
                        <td style={{ padding: '10px', color: '#888' }}>{demo.created_at}</td>
                        <td style={{ padding: '10px' }}>
                          <select 
                            value={demo.selectedPlan} 
                            onChange={(e) => handlePlanChange(demo.id, e.target.value)}
                            style={{ background: '#2c2c2e', color: '#fff', padding: '5px', borderRadius: '4px', border: '1px solid #444' }}
                          >
                            <option value="1">1 Mes</option>
                            <option value="6">6 Meses</option>
                            <option value="12">12 Meses</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button 
                            onClick={() => handleActivateDemo(demo.email, demo.selectedPlan)}
                            style={{ background: '#00d2d3', color: '#000', border: 'none', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Activar
                          </button>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button 
                            onClick={() => handleDeleteDemo(demo.id)}
                            style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}