import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    retry: {
      max: 10
    },
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error);
    process.exit(1);
  }
})();

export default sequelize;
