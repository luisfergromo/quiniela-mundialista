import React, { useState, useEffect } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import './index.css';

// 48 teams distributed in 4 pots with ISO codes
const defaultTeams = [
  { id: 1, name: "México", pot: 1, iso: "MX" }, { id: 2, name: "Estados Unidos", pot: 1, iso: "US" }, { id: 3, name: "Canadá", pot: 1, iso: "CA" }, { id: 4, name: "Argentina", pot: 1, iso: "AR" },
  { id: 5, name: "Francia", pot: 1, iso: "FR" }, { id: 6, name: "Inglaterra", pot: 1, iso: "GB" }, { id: 7, name: "Bélgica", pot: 1, iso: "BE" }, { id: 8, name: "Brasil", pot: 1, iso: "BR" },
  { id: 9, name: "Países Bajos", pot: 1, iso: "NL" }, { id: 10, name: "Portugal", pot: 1, iso: "PT" }, { id: 11, name: "España", pot: 1, iso: "ES" }, { id: 12, name: "Italia", pot: 1, iso: "IT" },
  
  { id: 13, name: "Croacia", pot: 2, iso: "HR" }, { id: 14, name: "Uruguay", pot: 2, iso: "UY" }, { id: 15, name: "Marruecos", pot: 2, iso: "MA" }, { id: 16, name: "Colombia", pot: 2, iso: "CO" },
  { id: 17, name: "Senegal", pot: 2, iso: "SN" }, { id: 18, name: "Alemania", pot: 2, iso: "DE" }, { id: 19, name: "Japón", pot: 2, iso: "JP" }, { id: 20, name: "Suiza", pot: 2, iso: "CH" },
  { id: 21, name: "Irán", pot: 2, iso: "IR" }, { id: 22, name: "Dinamarca", pot: 2, iso: "DK" }, { id: 23, name: "Corea del Sur", pot: 2, iso: "KR" }, { id: 24, name: "Austria", pot: 2, iso: "AT" },
  
  { id: 25, name: "Australia", pot: 3, iso: "AU" }, { id: 26, name: "Suecia", pot: 3, iso: "SE" }, { id: 27, name: "Hungría", pot: 3, iso: "HU" }, { id: 28, name: "Gales", pot: 3, iso: "GB" },
  { id: 29, name: "Polonia", pot: 3, iso: "PL" }, { id: 30, name: "Ecuador", pot: 3, iso: "EC" }, { id: 31, name: "Serbia", pot: 3, iso: "RS" }, { id: 32, name: "Perú", pot: 3, iso: "PE" },
  { id: 33, name: "Escocia", pot: 3, iso: "GB" }, { id: 34, name: "Turquía", pot: 3, iso: "TR" }, { id: 35, name: "Ucrania", pot: 3, iso: "UA" }, { id: 36, name: "Chile", pot: 3, iso: "CL" },
  
  { id: 37, name: "Panamá", pot: 4, iso: "PA" }, { id: 38, name: "Túnez", pot: 4, iso: "TN" }, { id: 39, name: "Argelia", pot: 4, iso: "DZ" }, { id: 40, name: "Egipto", pot: 4, iso: "EG" },
  { id: 41, name: "Noruega", pot: 4, iso: "NO" }, { id: 42, name: "Camerún", pot: 4, iso: "CM" }, { id: 43, name: "Rumania", pot: 4, iso: "RO" }, { id: 44, name: "Costa Rica", pot: 4, iso: "CR" },
  { id: 45, name: "Grecia", pot: 4, iso: "GR" }, { id: 46, name: "República Checa", pot: 4, iso: "CZ" }, { id: 47, name: "Arabia Saudita", pot: 4, iso: "SA" }, { id: 48, name: "Nueva Zelanda", pot: 4, iso: "NZ" }
];

const playBubbleSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { console.error(e); }
};

const playTadaSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.type = 'triangle';
    osc2.type = 'triangle';
    osc3.type = 'triangle';
    
    // C major chord
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc3.frequency.setValueAtTime(783.99, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc3.start(ctx.currentTime);
    
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
    osc3.stop(ctx.currentTime + 1.5);
  } catch (e) { console.error(e); }
};

function App() {
  const { width, height } = useWindowSize();
  const initialParticipants = [];
  const [participants, setParticipants] = useState(initialParticipants);
  const [newName, setNewName] = useState('');
  const [results, setResults] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawProgress, setDrawProgress] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // START PAUSED BY DEFAULT

  useEffect(() => {
    if (results.length > 0 && revealedCount < results.length && !isPaused) {
      const timer = setTimeout(() => {
        playBubbleSound();
        setRevealedCount(prev => prev + 1);
      }, 500); 
      return () => clearTimeout(timer);
    } else if (results.length > 0 && revealedCount === results.length && !showConfetti) {
      playTadaSound();
      setShowConfetti(true);
    }
  }, [results, revealedCount, showConfetti, isPaused]);

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!newName.trim() || participants.length >= 24) return;
    
    const newNames = newName.split('\n').map(n => n.trim()).filter(n => n);
    let currentParticipants = [...participants];
    
    for (const name of newNames) {
      if (currentParticipants.length >= 24) break;
      currentParticipants.push({ id: Date.now() + Math.random(), name });
    }
    
    setParticipants(currentParticipants);
    setNewName('');
  };

  const handleRemoveParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const clearAllParticipants = () => {
    if(window.confirm("¿Seguro que deseas borrar toda la lista actual?")) {
      setParticipants([]);
    }
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleDraw = () => {
    if (participants.length !== 24) return;
    
    playBubbleSound();
    
    setIsDrawing(true);
    setShowConfetti(false);
    setIsPaused(true); // Always ensure it starts paused
    setRevealedCount(0);
    setDrawProgress('Moviendo las esferas de los Bombos...');

    setTimeout(() => {
      const group12 = defaultTeams.filter(t => t.pot === 1 || t.pot === 2);
      const group34 = defaultTeams.filter(t => t.pot === 3 || t.pot === 4);

      const shuffled12 = shuffleArray(group12);
      const shuffled34 = shuffleArray(group34);
      const shuffledParticipants = shuffleArray(participants);

      setDrawProgress('Preparando la Cascada de Resultados...');

      setTimeout(() => {
        const newResults = shuffledParticipants.map((p, index) => {
          const t1 = shuffled12[index % shuffled12.length];
          const t2 = shuffled34[index % shuffled34.length];
          return {
            participant: p.name,
            team1: t1,
            team2: t2
          };
        });

        setResults(newResults);
        setRevealedCount(1); // Reveal ONLY the first one
        setIsDrawing(false);
        playBubbleSound(); // Sound for the first card
      }, 1500);
    }, 1500);
  };

  const exportToCSV = () => {
    if (results.length === 0) return;
    
    const headers = "Participante,Equipo 1,Bombo E1,Equipo 2,Bombo E2\n";
    const rows = results.map(r => 
      `"${r.participant}","${r.team1.name}","${r.team1.pot}","${r.team2.name}","${r.team2.pot}"`
    ).join("\n");

    const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Resultados_Quiniela_Mundial.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetRaffle = () => {
    setResults([]);
    setRevealedCount(0);
    setShowConfetti(false);
    setIsPaused(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderFlag = (isoCode, className) => {
    const FlagComponent = Flags[isoCode];
    if (FlagComponent) {
      return <FlagComponent title={isoCode} className={className} />;
    }
    return <span className={className}>🏳️</span>;
  };

  const renderPot = (potNumber) => {
    const teamsInPot = defaultTeams.filter(t => t.pot === potNumber);
    return (
      <div className="pot-container">
        <h3 className="pot-title">Bombo {potNumber}</h3>
        <div className="pot-teams">
          {teamsInPot.map(team => (
            <div key={team.id} className="pot-team-card">
              {renderFlag(team.iso, "pot-flag")}
              <span className="pot-name">{team.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <a 
        href="https://github.com/luisfergromo/quiniela-mundialista" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '20px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.6,
          transition: 'opacity 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
      >
        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <span>GitHub</span>
      </a>
      
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={1200} gravity={0.12} />}
      
      {isDrawing && (
        <div className="draw-overlay">
          <div className="spinner"></div>
          <div className="draw-text">{drawProgress}</div>
        </div>
      )}

      {results.length === 0 ? (
        <main>
          <div className="grid-3-dash" style={{marginBottom: '1rem'}}>
            
            {/* Left Column: Participants */}
            <div className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2>Participantes</h2>
                <button onClick={clearAllParticipants} className="btn-danger" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Borrar Todos</button>
              </div>
              <form onSubmit={handleAddParticipant} style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                <textarea 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Escribe o pega aquí tu lista..."
                  disabled={participants.length >= 24}
                  rows="3"
                  style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical', fontFamily: 'inherit'}}
                />
                <button type="submit" className="btn-primary" disabled={participants.length >= 24 || !newName.trim()}>
                  Agregar
                </button>
              </form>

              <ul style={{listStyle: 'none', marginTop: '1rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem', maxHeight: '450px'}} className="participant-list">
                {participants.map(p => (
                  <li key={p.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.4rem', borderRadius: '6px'}}>
                    <span style={{fontWeight: '600', fontSize: '0.9rem'}}>{p.name}</span>
                    <button className="btn-danger" onClick={() => handleRemoveParticipant(p.id)} style={{padding: '0.2rem 0.5rem'}}>X</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center Column: Title & Main Button */}
            <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
              <header className="header" style={{marginBottom: '2rem'}}>
                <h1 style={{fontSize: '3.5rem', lineHeight: '1.1'}}><span className="text-gradient">Quiniela Mundialista</span></h1>
                <h2 style={{fontSize: '2rem', color: 'white'}}>2026</h2>
                <p style={{marginTop: '1rem', fontSize: '1.1rem'}}>Oficina - Evento en Vivo</p>
              </header>
              
              <div className="stats-bar" style={{width: '100%', marginBottom: '2rem'}}>
                <div className="stat-item">
                  <div className="stat-value text-gold">{participants.length}/24</div>
                  <div className="stat-label">Registrados</div>
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={handleDraw}
                disabled={participants.length !== 24}
                style={{fontSize: '1.5rem', padding: '1.2rem 3rem', width: '100%'}}
              >
                {participants.length === 24 ? "¡INICIAR SORTEO!" : `Faltan ${24 - participants.length} personas`}
              </button>
            </div>

            {/* Right Column: Rules */}
            <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
              <h2 className="text-gradient" style={{fontSize: '2rem', marginBottom: '1.5rem'}}>Las Reglas</h2>
              <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.5'}}>
                Utilizamos el algoritmo matemático <strong style={{color: 'white'}}>Fisher-Yates Shuffle</strong>. Garantiza 100% de aleatoriedad y cero sesgos en la asignación.
              </p>
              <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)', marginBottom: '1rem', width: '100%'}}>
                <h3 style={{marginBottom: '0.5rem'}}>Equipo 1</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Sorteado del Bombo 1 o 2. Aquí están las grandes potencias mundiales.</p>
              </div>
              <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-secondary)', width: '100%'}}>
                <h3 style={{marginBottom: '0.5rem'}}>Equipo 2</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Sorteado del Bombo 3 o 4. Equipos revelación y sorpresas.</p>
              </div>
            </div>
            
          </div>

          <div className="pots-overview">
            <div className="grid-4-pots">
              {renderPot(1)}
              {renderPot(2)}
              {renderPot(3)}
              {renderPot(4)}
            </div>
          </div>
        </main>
      ) : (
        <main style={{justifyContent: 'flex-start', paddingTop: '1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 2rem'}}>
            <h2 style={{fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.05em'}} className="text-gradient">
              Resultados Oficiales
            </h2>
            
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              {revealedCount < results.length && (
                <>
                  {isPaused && (
                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        playBubbleSound();
                        setRevealedCount(prev => prev + 1);
                      }} 
                      style={{padding: '0.6rem 1.2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                    >
                      Siguiente (+1)
                    </button>
                  )}
                  <button 
                    className={isPaused ? "btn-success" : "btn-danger"} 
                    onClick={() => setIsPaused(!isPaused)} 
                    style={{padding: '0.6rem 1.2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  >
                    {isPaused ? "▶ Automático" : "⏸ Pausar"}
                  </button>
                </>
              )}
              {revealedCount === results.length && (
                <>
                  <button className="btn-danger" onClick={resetRaffle} style={{padding: '0.6rem 1.2rem', fontSize: '0.9rem'}}>Nuevo Sorteo</button>
                  <button className="btn-success" onClick={exportToCSV} style={{padding: '0.6rem 1.2rem', fontSize: '0.9rem'}}>📥 Extraer a Excel</button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid-results" style={{marginBottom: '2rem', padding: '0 2rem', paddingBottom: '2rem'}}>
            {results.slice(0, revealedCount).map((res, i) => (
              <div key={i} className="result-card-compact">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem', marginBottom: '0.6rem'}}>
                  <div className="result-name-compact">{res.participant}</div>
                </div>
                
                <div className="team-assigned-compact pot-1-2">
                  {renderFlag(res.team1.iso, "team-flag-compact")}
                  <span style={{fontSize: '0.9rem', fontWeight: '700'}}>{res.team1.name}</span>
                </div>
                <div className="team-assigned-compact pot-3-4">
                  {renderFlag(res.team2.iso, "team-flag-compact")}
                  <span style={{fontSize: '0.9rem', fontWeight: '700'}}>{res.team2.name}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
