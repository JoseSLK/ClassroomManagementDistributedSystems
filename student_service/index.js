import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/student_route.mjs';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = new express();

app.use(cors());
app.use(express.json());
app.use('/estudiante', router);

app.listen(PORT, () => {
    console.log(`Student module service running ${PORT}`);
});