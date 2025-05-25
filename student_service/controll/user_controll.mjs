import Estudiante from "../models/student.mjs"

async function get_all_student(req, res) {
    try {
        const estudiantes = await Estudiante.findAll();
        res.json(estudiantes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function get_student_by_id(req, res) {
    try {
        const { id } = req.params;
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
        res.json(estudiante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function create_student(req, res) {
    try {
        const { email, estudiante_id } = req.body;

        if (!email.endsWith('@uptc.edu.co')) {
            return res.status(400).json({ error: 'El email debe terminar en @uptc.edu.co' });
        }
    
        if (estudiante_id === undefined) {
            return res.status(400).json({ error: 'No se puede definir estudiante_id manualmente' });
        }
        const new_student = await Estudiante.create(req.body);
        res.status(201).json(new_student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function delete_student(req, res) {
    try {
        const { id } = req.params;
        const eliminado = await Estudiante.destroy({
        where: { estudiante_id: id }
        });
        if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
        res.json({ mensaje: 'Estudiante eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update_student(req, res) {
    try {
        const { id } = req.params;
        const { email, estudiante_id } = req.body;

        if (estudiante_id !== undefined) {
            return res.status(400).json({ error: 'No se puede modificar el estudiante_id' });
        }

        if (email && !email.endsWith('@uptc.edu.co')) {
             return res.status(400).json({ error: 'El email debe terminar en @uptc.edu.co' });
        }
        const updated = await Estudiante.update(req.body, {
            where: { estudiante_id: id }
        });
        if (updated[0] === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ mensaje: 'Estudiante actualizado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export {
    get_all_student,
    get_student_by_id,
    create_student,
    delete_student,
    update_student,
}