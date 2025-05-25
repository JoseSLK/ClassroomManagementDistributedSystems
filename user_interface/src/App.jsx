import { useState } from 'react';
import StudentsRegisterForm from './components/StudentsRegisterForm.jsx';
import AulasRegisterForm from './components/AulasRegisterForm.jsx';
import LoanForm from './components/LoanForm.jsx';
import Statistics from './components/Statistics.jsx';

// Componente principal
const App = () => {
  const [seccionActiva, setSeccionActiva] = useState('estudiantes');

  const scrollToSection = (seccion) => {
    setSeccionActiva(seccion);
    const elemento = document.getElementById(seccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="header-container">
        <div className="header-content">
          <div className="header-title">
            <h1>Sistema de Gestión de Préstamos de Aulas</h1>
            <p className="university-name">Universidad Pedagógica y Tecnológica de Colombia</p>
          </div>
          <div className="header-logo">
            <img 
              src="https://i.imgur.com/Cj7rlJB.png" 
              alt="Logo UPTC" 
              className="university-logo"
            />
          </div>
        </div>
      </header>

      {/* Navegación */}
      <div className="nav-container">
        <div className="nav-content">
          <nav className="nav-list">
            <button
              onClick={() => scrollToSection('estudiantes')}
              className={`nav-button ${seccionActiva === 'estudiantes' ? 'active' : ''}`}
            >
              Estudiantes
            </button>
            <button
              onClick={() => scrollToSection('aulas')}
              className={`nav-button ${seccionActiva === 'aulas' ? 'active' : ''}`}
            >
              Aulas
            </button>
            <button
              onClick={() => scrollToSection('prestamos')}
              className={`nav-button ${seccionActiva === 'prestamos' ? 'active' : ''}`}
            >
              Préstamos
            </button>
            <button
              onClick={() => scrollToSection('estadisticas')}
              className={`nav-button ${seccionActiva === 'estadisticas' ? 'active' : ''}`}
            >
              Estadísticas
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-container">
        <div className="main-content">
          {/* Sección Estudiantes */}
          <section id="estudiantes" className="section">
            <StudentsRegisterForm />
          </section>

          {/* Sección Aulas */}
          <section id="aulas" className="section">
            <AulasRegisterForm />
          </section>

          {/* Sección Préstamos */}
          <section id="prestamos" className="section">
            <LoanForm />
          </section>
          
          {/* Sección Estadísticas */}
          <section id="estadisticas" className="section">
            <Statistics />
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;
