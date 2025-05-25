import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './styles/LoanForm.css';

// Componente para gestionar préstamos
const PrestamosForm = () => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    aula_id: '',
    fecha_hora_inicio_prestamo: '',
    fecha_hora_fin_prestamo: '',
    fecha_hora_devolucion_real: '',
    actividad_academica: '',
    estado_prestamo: 'Solicitado',
    observaciones_solicitud: '',
    observaciones_devolucion: ''
  });

  const [prestamos, setPrestamos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [prestamoId, setPrestamoId] = useState('');
  const [buscarId, setBuscarId] = useState('');
  const [filtroEstudiante, setFiltroEstudiante] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOAN_API_URL = import.meta.env.VITE_LOAN_SERVICE_URL || 'http://localhost:4000';
  const STUDENT_API_URL = import.meta.env.VITE_STUDENT_SERVICE_URL || 'http://localhost:3500';
  const ROOMS_API_URL = import.meta.env.VITE_ROOMS_SERVICE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPrestamos();
    fetchEstudiantes();
    fetchAulas();
  }, []);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${LOAN_API_URL}/prestamos`);
      if (!response.ok) {
        throw new Error(`Error al cargar préstamos: ${response.statusText}`);
      }
      const data = await response.json();
      setPrestamos(data);
    } catch (error) {
      console.error('Error fetching prestamos:', error);
      setError('Error al cargar la lista de préstamos');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/estudiante`);
      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data);
      }
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  const fetchAulas = async () => {
    try {
      const response = await fetch(`${ROOMS_API_URL}/aula`);
      if (response.ok) {
        const data = await response.json();
        setAulas(data);
      }
    } catch (error) {
      console.error('Error fetching aulas:', error);
    }
  };

  const buscarPrestamo = async () => {
    if (!buscarId) return;
    
    try {
      const response = await fetch(`${LOAN_API_URL}/prestamos/${buscarId}`);
      if (response.ok) {
        const prestamo = await response.json();
        
        // Format dates to remove timezone and milliseconds
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          return new Date(dateString).toISOString().slice(0, 16);
        };

        setFormData({
          estudiante_id: prestamo.estudiante_id,
          aula_id: prestamo.aula_id,
          fecha_hora_inicio_prestamo: formatDateForInput(prestamo.fecha_hora_inicio_prestamo),
          fecha_hora_fin_prestamo: formatDateForInput(prestamo.fecha_hora_fin_prestamo),
          fecha_hora_devolucion_real: formatDateForInput(prestamo.fecha_hora_devolucion_real),
          actividad_academica: prestamo.actividad_academica,
          estado_prestamo: prestamo.estado_prestamo,
          observaciones_solicitud: prestamo.observaciones_solicitud || '',
          observaciones_devolucion: prestamo.observaciones_devolucion || ''
        });
        setPrestamoId(buscarId);
        setModoEdicion(true);
      } else {
        alert('Préstamo no encontrado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al buscar préstamo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = modoEdicion 
      ? `${LOAN_API_URL}/prestamos/${prestamoId}`
      : `${LOAN_API_URL}/prestamos`;

    const requestBody = modoEdicion ? {
      prestamo_id: parseInt(prestamoId),
      estudiante_id: parseInt(formData.estudiante_id),
      aula_id: parseInt(formData.aula_id),
      fecha_hora_inicio_prestamo: formData.fecha_hora_inicio_prestamo,
      fecha_hora_fin_prestamo: formData.fecha_hora_fin_prestamo,
      fecha_hora_devolucion_real: formData.fecha_hora_devolucion_real || null,
      actividad_academica: formData.actividad_academica,
      estado_prestamo: formData.estado_prestamo,
      observaciones_solicitud: formData.observaciones_solicitud,
      observaciones_devolucion: formData.observaciones_devolucion
    } : {
      estudiante_id: parseInt(formData.estudiante_id),
      aula_id: parseInt(formData.aula_id),
      fecha_hora_inicio_prestamo: formData.fecha_hora_inicio_prestamo,
      fecha_hora_fin_prestamo: formData.fecha_hora_fin_prestamo,
      actividad_academica: formData.actividad_academica,
      estado_prestamo: formData.estado_prestamo
    };

    try {
      const response = await fetch(url, {
        method: modoEdicion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        alert(modoEdicion ? 'Préstamo actualizado exitosamente' : 'Préstamo registrado exitosamente');
        setFormData({
          estudiante_id: '',
          aula_id: '',
          fecha_hora_inicio_prestamo: '',
          fecha_hora_fin_prestamo: '',
          fecha_hora_devolucion_real: '',
          actividad_academica: '',
          estado_prestamo: 'Solicitado',
          observaciones_solicitud: '',
          observaciones_devolucion: ''
        });
        setModoEdicion(false);
        setPrestamoId('');
        fetchPrestamos();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servicio de préstamos');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const prestamosFiltrados = prestamos.filter(prestamo =>
    prestamo.Estudiante?.nombres?.toLowerCase().includes(filtroEstudiante.toLowerCase())
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="prestamos-container">
      <div className="prestamos-form">
        <div className="prestamos-form-header">
          <Calendar className="lucide-icon" />
          <h3>Registro de Préstamos</h3>
        </div>
        <div className="search-section">
          <input
            type="number"
            placeholder="Buscar préstamo por ID..."
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
            className="prestamos-list-filter"
          />
          <button onClick={buscarPrestamo} className="search-button">
            Buscar
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Estudiante *</label>
            <select
              name="estudiante_id"
              value={formData.estudiante_id}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Seleccionar estudiante</option>
              {estudiantes.map((estudiante) => (
                <option key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                  {estudiante.nombres} - {estudiante.estudiante_id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Aula *</label>
            <select
              name="aula_id"
              value={formData.aula_id}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Seleccionar aula</option>
              {aulas.map((aula) => (
                <option key={aula.aula_id} value={aula.aula_id}>
                  {aula.nombre_aula} - {aula.ubicacion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Fecha y Hora de Inicio *</label>
            <input
              type="datetime-local"
              name="fecha_hora_inicio_prestamo"
              value={formData.fecha_hora_inicio_prestamo}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Fecha y Hora de Fin *</label>
            <input
              type="datetime-local"
              name="fecha_hora_fin_prestamo"
              value={formData.fecha_hora_fin_prestamo}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Actividad Académica *</label>
            <textarea
              name="actividad_academica"
              value={formData.actividad_academica}
              onChange={handleChange}
              required
              className="form-input"
              rows="3"
              placeholder="Ej: Prueba automatizada"
            />
          </div>
          {modoEdicion && (
            <>
              <div>
                <label className="form-label">Fecha y Hora de Devolución Real</label>
                <input
                  type="datetime-local"
                  name="fecha_hora_devolucion_real"
                  value={formData.fecha_hora_devolucion_real}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Estado del Préstamo</label>
                <select
                  name="estado_prestamo"
                  value={formData.estado_prestamo}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Solicitado">Solicitado</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                  <option value="En Curso">En Curso</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="form-label">Observaciones de Solicitud</label>
                <textarea
                  name="observaciones_solicitud"
                  value={formData.observaciones_solicitud}
                  onChange={handleChange}
                  className="form-input"
                  rows="2"
                />
              </div>
              <div>
                <label className="form-label">Observaciones de Devolución</label>
                <textarea
                  name="observaciones_devolucion"
                  value={formData.observaciones_devolucion}
                  onChange={handleChange}
                  className="form-input"
                  rows="2"
                />
              </div>
            </>
          )}
          <button type="submit" className="form-submit">
            {modoEdicion ? 'Actualizar Préstamo' : 'Registrar Préstamo'}
          </button>
        </form>
      </div>
      <div className="prestamos-list">
        <div className="prestamos-list-header">
          <h3>Listado de Préstamos</h3>
          <input
            type="text"
            placeholder="Buscar por estudiante..."
            value={filtroEstudiante}
            onChange={(e) => setFiltroEstudiante(e.target.value)}
            className="prestamos-list-filter"
          />
        </div>
        {loading ? (
          <div className="loading-message">Cargando préstamos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="prestamos-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estudiante</th>
                <th>Aula</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Actividad</th>
                <th>Estado</th>
                <th>Devolución</th>
              </tr>
            </thead>
            <tbody>
              {prestamosFiltrados.map((prestamo) => (
                <tr key={prestamo.prestamo_id}>
                  <td>{prestamo.prestamo_id}</td>
                  <td>{prestamo.Estudiante?.nombres}</td>
                  <td>{prestamo.Aula?.nombre_aula}</td>
                  <td>{formatDateTime(prestamo.fecha_hora_inicio_prestamo)}</td>
                  <td>{formatDateTime(prestamo.fecha_hora_fin_prestamo)}</td>
                  <td>{prestamo.actividad_academica}</td>
                  <td>{prestamo.estado_prestamo}</td>
                  <td>{formatDateTime(prestamo.fecha_hora_devolucion_real)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PrestamosForm;