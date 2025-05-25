// models/Estudiante.mjs
import { Model, DataTypes } from 'sequelize';
import db from '../db_driver/driverdb.mjs';

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
    allowNull: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,               
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: db,
  modelName: 'Estudiante',
  tableName: 'estudiantes',
  schema: "public",
  timestamps: false,
});

await db.sync();
export default Estudiante;
