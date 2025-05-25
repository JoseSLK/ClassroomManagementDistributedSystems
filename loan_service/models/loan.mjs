import { Model, DataTypes } from 'sequelize';
import sequelize from '../db_driver/driverdb.mjs'; 

class Estudiante extends Model {}

Estudiante.init({
  estudiante_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  programa_academico: {
    type: DataTypes.STRING(100),
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Estudiante',
  tableName: 'estudiantes',
  timestamps: false,
});

class Aula extends Model {}
Aula.init({
  aula_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nombre_aula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  ubicacion: {
    type: DataTypes.STRING(100),
  },
  capacidad: {
    type: DataTypes.INTEGER,
  },
  tipo_aula: {
    type: DataTypes.STRING(50),
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  descripcion_adicional: {
    type: DataTypes.TEXT,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Aula',
  tableName: 'aulas',
  timestamps: false,
});

class Prestamo extends Model {}
Prestamo.init({
  prestamo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estudiante,
      key: 'estudiante_id',
    },
  },
  aula_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Aula,
      key: 'aula_id',
    },
  },
  fecha_hora_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_hora_inicio_prestamo: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_hora_fin_prestamo: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_hora_devolucion_real: {
    type: DataTypes.DATE,
  },
  actividad_academica: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  estado_prestamo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Solicitado', 'Aprobado', 'Rechazado', 'En Curso', 'Finalizado', 'Cancelado']],
    },
  },
  observaciones_solicitud: {
    type: DataTypes.TEXT,
  },
  observaciones_devolucion: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'Prestamo',
  tableName: 'prestamos',
  timestamps: false,
});

Estudiante.hasMany(Prestamo, { foreignKey: 'estudiante_id' });
Prestamo.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });

Aula.hasMany(Prestamo, { foreignKey: 'aula_id' });
Prestamo.belongsTo(Aula, { foreignKey: 'aula_id' });

export { Prestamo, Estudiante, Aula };

