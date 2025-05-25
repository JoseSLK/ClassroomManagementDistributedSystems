import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import './Statistics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Statistics = () => {
  const [actividadesData, setActividadesData] = useState([]);
  const [aulasData, setAulasData] = useState([]);
  const [estudiantesData, setEstudiantesData] = useState([]);
  const [reporteData, setReporteData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Frecuencia de actividades
        const actividadesResponse = await fetch('http://localhost:4000/prestamos/frecuencia-actividades');
        const actividadesJson = await actividadesResponse.json();
        // Convertir frecuencia a número
        const actividadesDataFixed = actividadesJson.map(item => ({
          ...item,
          frecuencia: parseInt(item.frecuencia, 10)
        }));
        setActividadesData(actividadesDataFixed);

        // Frecuencia de aulas
        const aulasResponse = await fetch('http://localhost:4000/prestamos/frecuencia-aulas');
        const aulasJson = await aulasResponse.json();
        setAulasData(aulasJson);

        // Frecuencia de estudiantes
        const estudiantesResponse = await fetch('http://localhost:4000/prestamos/frecuencia-estudiantes');
        const estudiantesJson = await estudiantesResponse.json();
        setEstudiantesData(estudiantesJson);

        // Reporte general
        const reporteResponse = await fetch('http://localhost:4000/prestamos/reporte');
        const reporteJson = await reporteResponse.json();
        const reporteDataFixed = reporteJson.map(item => ({
          ...item,
          cantidad: parseInt(item.cantidad, 10)
          // Eliminamos la conversión a timestamp para mantener el formato original de la fecha
        }));
        setReporteData(reporteDataFixed);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="statistics-container">
      <h2>Estadísticas de Préstamos</h2>
      
      <div className="statistics-grid">
        {/* Gráfico de Actividades Académicas */}
        <div className="chart-section">
          <h3>Frecuencia de Actividades Académicas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={actividadesData}
                dataKey="frecuencia"
                nameKey="actividad_academica"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {actividadesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Frecuencia de Aulas */}
        <div className="chart-section">
          <h3>Frecuencia de Uso de Aulas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={aulasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Aula.nombre_aula" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frecuencia" fill="#8884d8" name="Frecuencia de uso" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Estudiantes Frecuentes */}
        <div className="chart-section">
          <h3>Estudiantes más Frecuentes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estudiantesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Estudiante.nombres" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frecuencia" fill="#82ca9d" name="Cantidad de préstamos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Imagen decorativa */}
        <div className="chart-section image-section">
          <img src="https://i.imgur.com/yTgdS0r.png" alt="Estadísticas decorativas" />
        </div>

        {/* Gráfico de Línea de Tiempo de Préstamos */}
        <div className="chart-section full-width">
          <h3>Línea de Tiempo de Préstamos</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis
                dataKey="dia"
                name="Día"
                tickFormatter={(value) => {
                  // Asegurarnos de que value sea una fecha válida
                  if (!value) return '';
                  const [year, month, day] = value.split('-');
                  return `${day}/${month}/${year}`;
                }}
              />
              <YAxis
                dataKey="hora"
                name="Hora"
                domain={[0, 24]}
                tickFormatter={(value) => `${value}:00`}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name, props) => [
                  `${props.payload.cantidad} préstamos`,
                  `${props.payload.Aula.nombre_aula}`
                ]}
                labelFormatter={(label) => {
                  if (!label) return '';
                  const [year, month, day] = label.split('-');
                  return `${day}/${month}/${year}`;
                }}
              />
              <Legend />
              {Array.from(new Set(reporteData.map(item => item.Aula.nombre_aula))).map((aula, index) => (
                <Scatter
                  key={aula}
                  name={aula}
                  data={reporteData.filter(item => item.Aula.nombre_aula === aula)}
                  fill={COLORS[index % COLORS.length]}
                  shape="circle"
                >
                  {reporteData
                    .filter(item => item.Aula.nombre_aula === aula)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        radius={Math.sqrt(entry.cantidad) * 10}
                      />
                    ))}
                </Scatter>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;