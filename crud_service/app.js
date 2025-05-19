import express from 'express';
import aulasRoutes from './routes/aulas.js';

const app = express();
app.use(express.json());
app.use('/aulas', aulasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CRUD service listening on port ${PORT}`);
});
