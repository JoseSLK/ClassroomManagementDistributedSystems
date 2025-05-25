import { Model, DataTypes } from 'sequelize';
import sequelize from '../db_driver/driverdb.mjs'; 

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

export default Aula;
