import express from 'express';
import {
    get_all_student,
    get_student_by_id,
    create_student,
    delete_student,
    update_student
} from "../controll/user_controll.mjs";


const router = express.Router();

router.get('/', get_all_student);
router.get('/:id', get_student_by_id);
router.post('/', create_student);
router.put('/:id', update_student);
router.delete('/:id', delete_student);

export default router;