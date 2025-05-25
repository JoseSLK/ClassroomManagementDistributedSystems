import { UniqueConstraintError } from 'sequelize';
import { Prestamo, Estudiante, Aula } from '../models/loan.mjs';
import { Sequelize, Op } from 'sequelize';

function validateLoanData(data) {
    const errors = [];

    if (!data.estudiante_id || typeof data.estudiante_id !== 'number') {
        errors.push("ID de estudiante inválido");
    }
    if (!data.aula_id || typeof data.aula_id !== 'number') {
        errors.push("ID de aula inválido");
    }
    if (!data.fecha_hora_inicio_prestamo || isNaN(Date.parse(data.fecha_hora_inicio_prestamo))) {
        errors.push("Fecha de inicio de préstamo inválida");
    }
    if (!data.fecha_hora_fin_prestamo || isNaN(Date.parse(data.fecha_hora_fin_prestamo))) {
        errors.push("Fecha de fin de préstamo inválida");
    }
    if (new Date(data.fecha_hora_fin_prestamo) <= new Date(data.fecha_hora_inicio_prestamo)) {
        errors.push("La fecha de fin debe ser posterior a la fecha de inicio");
    }
    if (!data.actividad_academica || typeof data.actividad_academica !== 'string') {
        errors.push("Actividad académica requerida y debe ser texto");
    }
    if (!data.estado_prestamo || !['Solicitado', 'Aprobado', 'Rechazado', 'En Curso', 'Finalizado', 'Cancelado'].includes(data.estado_prestamo)) {
        errors.push("Estado de préstamo inválido");
    }

    return errors;
}

async function create_loan(req, res) {
    try {
        console.log("Body recibido:", req.body);

        const errors = validateLoanData(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const newloan = await Prestamo.create(req.body);
        return res.status(201).json(newloan);

    } catch (err) {
        console.error("Error en create_loan:", err);
        return res.status(500).json({ error: err.message });
    }
}


async function get_all_loans(req, res) {
    try {
        const loans = await Prestamo.findAll({
            include: [
                {
                    model: Estudiante,
                    attributes: ['estudiante_id', 'nombres']
                },
                {
                    model: Aula,
                    attributes: ['aula_id', 'nombre_aula']
                }
            ]
        });

        if (loans.length === 0) {
            return res.status(404).json({ message: 'No hay préstamos registrados.' });
        }

        res.json(loans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function get_loan_by_id(req, res) {
    try {
        const { id } = req.params;
        const loan = await Prestamo.findByPk(id, {
            include: [
                {
                    model: Estudiante,
                    attributes: ['estudiante_id', 'nombres']
                },
                {
                    model: Aula,
                    attributes: ['aula_id', 'nombre_aula']
                }
            ]
        });

        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }

        res.json(loan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function update_loan(req, res) {
    try {
        const { id } = req.params;
        const loan = await Prestamo.findByPk(id);
        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }

        const errors = validateLoanData(req.body);
        if (errors.length > 0) return res.status(400).json({ errors });

        await loan.update(req.body);
        res.json(loan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function delete_loan(req, res) {
    try {
        const { id } = req.params;
        const loan = await Prestamo.findByPk(id);
        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }
        await loan.destroy();
        res.json({ message: 'Préstamo eliminado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function most_frequent_rooms(req, res) {
    try {
        const result = await Prestamo.findAll({
            attributes: [
                'aula_id',
                [Sequelize.fn('COUNT', Sequelize.col('Prestamo.aula_id')), 'frecuencia']
            ],
            include: [{
                model: Aula,
                attributes: ['nombre_aula']
            }],
            group: ['Prestamo.aula_id', 'Aula.aula_id', 'Aula.nombre_aula'],
            order: [[Sequelize.literal('frecuencia'), 'DESC']]
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function loan_report(req, res) {
    const { tipo, fechaInicio, fechaFin } = req.query;
    try {
        const whereClause = {};
        if (fechaInicio && fechaFin) {
            whereClause.fecha_hora_inicio_prestamo = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }

        const prestamos = await Prestamo.findAll({
            attributes: [
                'aula_id',
                [Sequelize.fn('DATE', Sequelize.col('fecha_hora_inicio_prestamo')), 'dia'],
                [Sequelize.fn('COUNT', '*'), 'cantidad'],
                [Sequelize.fn('EXTRACT', Sequelize.literal('HOUR FROM fecha_hora_inicio_prestamo')), 'hora']
            ],
            where: whereClause,
            include: [{
                model: Aula,
                attributes: ['nombre_aula']
            }],
            group: [
                'Prestamo.aula_id',
                'Aula.aula_id',
                'Aula.nombre_aula',
                Sequelize.fn('DATE', Sequelize.col('fecha_hora_inicio_prestamo')),
                Sequelize.literal('hora')
            ],
            order: [['dia', 'ASC'], ['hora', 'ASC']]
        });

        res.json(prestamos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function students_by_frequency(req, res) {
    try {
        const result = await Prestamo.findAll({
            attributes: [
                'estudiante_id',
                [Sequelize.fn('COUNT', Sequelize.col('Prestamo.estudiante_id')), 'frecuencia']
            ],
            include: [{
                model: Estudiante,
                attributes: ['nombres']
            }],
            group: ['Prestamo.estudiante_id', 'Estudiante.estudiante_id', 'Estudiante.nombres'],
            order: [[Sequelize.literal('frecuencia'), 'DESC']]
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function top_academic_activities(req, res) {
    try {
        const result = await Prestamo.findAll({
            attributes: [
                'actividad_academica',
                [Sequelize.fn('COUNT', Sequelize.col('actividad_academica')), 'frecuencia']
            ],
            group: ['actividad_academica'],
            order: [[Sequelize.literal('frecuencia'), 'DESC']]
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export {
    create_loan,
    get_all_loans,
    get_loan_by_id,
    update_loan,
    delete_loan,
    most_frequent_rooms,
    loan_report,
    students_by_frequency,
    top_academic_activities,
}
