import express from 'express';
import {
    create_loan,
    get_all_loans,
    get_loan_by_id,
    update_loan,
    delete_loan,
    most_frequent_rooms,
    loan_report,
    students_by_frequency,
    top_academic_activities,
} from "../control/control.mjs";


const router = express.Router();

router.post('/', create_loan);
router.get('/', get_all_loans);
router.get('/frecuencia-aulas', most_frequent_rooms);
router.get('/reporte', loan_report);
router.get('/frecuencia-estudiantes', students_by_frequency);
router.get('/frecuencia-actividades', top_academic_activities);

router.get('/:id', get_loan_by_id);
router.put('/:id', update_loan);
router.delete('/:id', delete_loan);

export default router;