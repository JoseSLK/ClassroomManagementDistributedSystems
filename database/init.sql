-- Archivo: init.sql
-- Script de inicialización para la base de datos de Préstamo de Aulas DTIC's

BEGIN;

-- Tabla: Estudiantes
CREATE TABLE IF NOT EXISTS Estudiantes (
    estudiante_id INTEGER PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    programa_academico VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Aulas
CREATE TABLE IF NOT EXISTS Aulas (
    aula_id SERIAL PRIMARY KEY,
    nombre_aula VARCHAR(50) UNIQUE NOT NULL,
    ubicacion VARCHAR(100),
    capacidad INTEGER,
    tipo_aula VARCHAR(50),
    disponible BOOLEAN DEFAULT TRUE,
    descripcion_adicional TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Prestamos
CREATE TABLE IF NOT EXISTS Prestamos (
    prestamo_id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    aula_id INTEGER NOT NULL,
    fecha_hora_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_inicio_prestamo TIMESTAMP NOT NULL,
    fecha_hora_fin_prestamo TIMESTAMP NOT NULL,
    fecha_hora_devolucion_real TIMESTAMP,
    actividad_academica VARCHAR(255) NOT NULL,
    estado_prestamo VARCHAR(20) NOT NULL CHECK (estado_prestamo IN ('Solicitado', 'Aprobado', 'Rechazado', 'En Curso', 'Finalizado', 'Cancelado')),
    observaciones_solicitud TEXT,
    observaciones_devolucion TEXT,
    CONSTRAINT fk_estudiante
        FOREIGN KEY(estudiante_id)
        REFERENCES Estudiantes(estudiante_id)
        ON DELETE SET NULL, -- O ON DELETE CASCADE si se prefiere borrar préstamos si se borra el estudiante
    CONSTRAINT fk_aula
        FOREIGN KEY(aula_id)
        REFERENCES Aulas(aula_id)
        ON DELETE SET NULL -- O ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_prestamos_estudiante_id ON Prestamos (estudiante_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_aula_id ON Prestamos (aula_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_fechas ON Prestamos (fecha_hora_inicio_prestamo, fecha_hora_fin_prestamo);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON Prestamos (estado_prestamo);
CREATE INDEX IF NOT EXISTS idx_aulas_nombre ON Aulas (nombre_aula);

-- Comentarios sobre las tablas y columnas (opcional, pero buena práctica)
COMMENT ON TABLE Estudiantes IS 'Almacena la información de los estudiantes que pueden solicitar préstamos.';
COMMENT ON TABLE Aulas IS 'Contiene la información de las aulas disponibles para préstamo.';
COMMENT ON COLUMN Aulas.nombre_aula IS 'Nombre o código identificador único del aula (ej. "Sala A", "301").';
COMMENT ON TABLE Prestamos IS 'Registra cada transacción de préstamo de un aula a un estudiante.';
COMMENT ON COLUMN Prestamos.estado_prestamo IS 'Estado actual del préstamo: Solicitado, Aprobado, Rechazado, En Curso, Finalizado, Cancelado.';


INSERT INTO Estudiantes (estudiante_id, nombres, email, programa_academico) VALUES
(20231001, 'Juan Alberto', 'juan.perez@example.com', 'Ingeniería de Sistemas'),
(20222005, 'Ana Lucía', 'ana.martinez@example.com', 'Ingeniería Electrónica');

INSERT INTO Aulas (nombre_aula, ubicacion, capacidad, tipo_aula) VALUES
('Sala Cómputo 1', 'Edificio TIC - Piso 1', 30, 'Sala de Cómputo'),
('Auditorio Menor', 'Bloque B - Piso 2', 100, 'Auditorio'),
('Laboratorio Redes', 'Edificio TIC - Piso 2', 20, 'Laboratorio Especializado');

INSERT INTO Prestamos (estudiante_id, aula_id, fecha_hora_inicio_prestamo, fecha_hora_fin_prestamo, actividad_academica, estado_prestamo) VALUES
((SELECT estudiante_id FROM Estudiantes WHERE estudiante_id = 20231001),
(SELECT aula_id FROM Aulas WHERE nombre_aula = 'Sala Cómputo 1'),
'2025-05-20 10:00:00',
'2025-05-20 12:00:00',
'Desarrollo Proyecto Final Programación III',
'Aprobado');


COMMIT;