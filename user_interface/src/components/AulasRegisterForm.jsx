import React, { useState, useEffect } from 'react';
import { MapPin, Building2 } from 'lucide-react';
import './styles/AulasRegisterForm.css';

// Componente para registrar aulas
const AulasForm = () => {
  const [formData, setFormData] = useState({
    aula_id: '',
    nombre_aula: '',
    ubicacion: '',
    capacidad: '',
    tipo_aula: '',
    disponible: true,
    descripcion_adicional: ''
  });

  const [aulas, setAulas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_ROOMS_SERVICE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/aula`);
      if (!response.ok) {
        throw new Error(`Error al cargar aulas: ${response.statusText}`);
      }
      const data = await response.json();
      setAulas(data);
    } catch (error) {
      console.error('Error fetching aulas:', error);
      setError('Error al cargar la lista de aulas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/aula`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aula_id: parseInt(formData.aula_id),
          nombre_aula: formData.nombre_aula,
          ubicacion: formData.ubicacion,
          capacidad: parseInt(formData.capacidad),
          tipo_aula: formData.tipo_aula,
          disponible: formData.disponible,
          descripcion_adicional: formData.descripcion_adicional
        })
      });
      
      if (response.ok) {
        alert('Aula registrada exitosamente');
        setFormData({
          aula_id: '',
          nombre_aula: '',
          ubicacion: '',
          capacidad: '',
          tipo_aula: '',
          disponible: true,
          descripcion_adicional: ''
        });
        fetchAulas(); // Recargar la lista después de agregar
      } else {
        const errorData = await response.json();
        alert(`Error al registrar aula: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servicio de aulas');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const aulasFiltradas = aulas.filter(aula =>
    aula.nombre_aula.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="aulas-container">
      <div className="aulas-image">
        <img src="https://i.imgur.com/57ynVp2.jpeg" alt="Aula universitaria" />
      </div>
      <div className="aulas-form">
        <div className="aulas-form-header">
          <Building2 className="lucide-icon" />
          <h3>Registro de Aulas</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">ID del Aula *</label>
            <input
              type="number"
              name="aula_id"
              value={formData.aula_id}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ej: 4"
            />
          </div>
          <div>
            <label className="form-label">Nombre del Aula *</label>
            <input
              type="text"
              name="nombre_aula"
              value={formData.nombre_aula}
              onChange={handleChange}
              maxLength="100"
              required
              className="form-input"
              placeholder="Ej: Sala Cómputo 4"
            />
          </div>
          <div>
            <label className="form-label">Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              maxLength="100"
              required
              className="form-input"
              placeholder="Ej: Edificio TIC - Piso 1"
            />
          </div>
          <div>
            <label className="form-label">Capacidad *</label>
            <input
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              min="1"
              required
              className="form-input"
              placeholder="Ej: 30"
            />
          </div>
          <div>
            <label className="form-label">Tipo de Aula *</label>
            <input
              type="text"
              name="tipo_aula"
              value={formData.tipo_aula}
              onChange={handleChange}
              maxLength="100"
              required
              className="form-input"
              placeholder="Ej: Sala de Cómputo"
            />
          </div>
          <div>
            <label className="form-label">Descripción Adicional</label>
            <textarea
              name="descripcion_adicional"
              value={formData.descripcion_adicional}
              onChange={handleChange}
              maxLength="255"
              className="form-input"
              placeholder="Ej: sala de cómputo con computadores"
            />
          </div>
          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
              />
              Aula Disponible
            </label>
          </div>
          <button type="submit" className="form-submit">
            Registrar Aula
          </button>
        </form>
      </div>
      <div className="aulas-list">
        <div className="aulas-list-header">
          <h3>Listado de Aulas</h3>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="aulas-list-filter"
          />
        </div>
        {loading ? (
          <div className="loading-message">Cargando aulas...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="aulas-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Tipo</th>
                <th>Disponible</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
              </tr>
            </thead>
            <tbody>
              {aulasFiltradas.map((aula) => (
                <tr key={aula.aula_id}>
                  <td>{aula.aula_id}</td>
                  <td>{aula.nombre_aula}</td>
                  <td>{aula.ubicacion}</td>
                  <td>{aula.capacidad}</td>
                  <td>{aula.tipo_aula}</td>
                  <td>{aula.disponible ? 'Sí' : 'No'}</td>
                  <td>{aula.descripcion_adicional}</td>
                  <td>{formatDate(aula.fecha_creacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AulasForm;