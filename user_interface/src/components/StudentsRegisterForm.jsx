import React from "react";
import { useState } from "react";
import { Users } from "lucide-react";
import './styles/StudentsRegisterForm.css';

// Componente para registrar estudiantes
const EstudiantesForm = () => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    nombres: '',
    email: '',
    programa_academico: ''
  });

  const API_BASE_URL = import.meta.env.VITE_STUDENT_SERVICE_URL || 'http://localhost:3500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/estudiante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudiante_id: parseInt(formData.estudiante_id),
          nombres: formData.nombres,
          email: formData.email,
          programa_academico: formData.programa_academico
        })
      });
      
      if (response.ok) {
        alert('Estudiante registrado exitosamente');
        setFormData({
          estudiante_id: '',
          nombres: '',
          email: '',
          programa_academico: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Error al registrar estudiante: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servicio de estudiantes');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="estudiantes-container">
      <div className="estudiantes-form">
        <div className="estudiantes-form-header">
          <Users className="lucide-icon" />
          <h3>Registro de Estudiantes</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">ID del Estudiante *</label>
            <input
              type="number"
              name="estudiante_id"
              value={formData.estudiante_id}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ej: 20231234"
            />
          </div>
          <div>
            <label className="form-label">Nombres *</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              maxLength="100"
              required
              className="form-input"
              placeholder="Ej: Mohammed Al-Rahman"
            />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength="255"
              required
              className="form-input"
              placeholder="Ej: mohammed.rahman@uptc.edu.co"
            />
          </div>
          <div>
            <label className="form-label">Programa Académico</label>
            <input
              type="text"
              name="programa_academico"
              value={formData.programa_academico}
              onChange={handleChange}
              maxLength="100"
              className="form-input"
              placeholder="Ej: Ingeniería de Sistemas"
            />
          </div>
          <button type="submit" className="form-submit">
            Registrar Estudiante
          </button>
        </form>
      </div>
      <div className="estudiantes-list">
        <img 
          src="https://i.imgur.com/4QMhpem.jpeg" 
          alt="Estudiantes" 
          className="estudiantes-image"
        />
      </div>
    </div>
  );
};

export default EstudiantesForm;
