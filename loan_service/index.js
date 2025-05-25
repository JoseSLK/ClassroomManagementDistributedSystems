import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/routes.mjs';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = new express();

app.use(cors());
app.use(express.json());
app.use('/prestamos', router);

app.listen(PORT, () => {
    console.log(`Loan service running ${PORT}`);
});