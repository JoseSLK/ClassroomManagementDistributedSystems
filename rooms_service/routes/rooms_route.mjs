import express from 'express';
import {
    get_all_rooms,
    get_room_by_id,
    create_room,
    update_room,
    delete_room
} from "../controll/room_controll.mjs";


const router = express.Router();

router.get('/', get_all_rooms);
router.get('/:id', get_room_by_id);
router.post('/', create_room);
router.put('/:id', update_room);
router.delete('/:id', delete_room);

export default router;