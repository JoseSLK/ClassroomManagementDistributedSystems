import { UniqueConstraintError } from 'sequelize';
import Aula from "../models/rooms.mjs"

async function get_all_rooms(req, res) {
    try {
        const rooms = await Aula.findAll();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function get_room_by_id(req, res) {
    try {
        const { id } = req.params;
        const room = await Aula.findByPk(id);
        if (!room) return res.status(404).json({ error: 'No encontrado' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function create_room(req, res) {
    try {
        const { nombre_aula, ubicacion, capacidad } = req.body;

        if (!nombre_aula || nombre_aula.trim() === '') {
        return res.status(400).json({ error: 'El nombre del aula es obligatorio' });
        }

        if (!ubicacion || ubicacion.trim() === '') {
        return res.status(400).json({ error: 'La ubicación es obligatoria' });
        }

        if (capacidad !== undefined && (isNaN(capacidad) || capacidad <= 0)) {
        return res.status(400).json({ error: 'La capacidad debe ser un número mayor que cero' });
        }

        const nueva = await Aula.create(req.body);
        res.status(201).json(nueva);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            const field = error.errors[0].path;
            return res.status(400).json({ error: `El valor para '${field}' ya existe.` });
        }

        res.status(400).json({ error: error.message });
    }
}

async function delete_room(req, res) {
    try {
        const { id } = req.params;

        const eliminado = await Aula.destroy({ where: { aula_id: id } });
        if (eliminado === 0) {
        return res.status(404).json({ error: 'Aula no encontrada' });
        }

        res.json({ mensaje: 'Aula eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update_room(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
        }

        const { nombre_aula, ubicacion, capacidad, aula_id } = req.body;

        if (aula_id !== undefined) {
        return res.status(400).json({ error: 'No se puede modificar el aula_id' });
        }

        if (nombre_aula !== undefined && nombre_aula.trim() === '') {
        return res.status(400).json({ error: 'El nombre del aula no puede estar vacío' });
        }

        if (ubicacion !== undefined && ubicacion.trim() === '') {
        return res.status(400).json({ error: 'La ubicación no puede estar vacía' });
        }

        if (capacidad !== undefined && (isNaN(capacidad) || capacidad <= 0)) {
        return res.status(400).json({ error: 'La capacidad debe ser mayor que cero' });
        }

        const actualizado = await Aula.update(req.body, { where: { aula_id: id } });
        if (actualizado[0] === 0) {
        return res.status(404).json({ error: 'Aula no encontrada' });
        }

        res.json({ mensaje: 'Aula actualizada' });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            const field = error.errors[0].path;
            return res.status(400).json({ error: `El valor para '${field}' ya existe.` });
        }

        res.status(400).json({ error: error.message });
    }
}

export {
    get_all_rooms,
    get_room_by_id,
    create_room,
    update_room,
    delete_room,
}