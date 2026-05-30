// routes/observaciones.js
// Rutas API para gestión de observaciones pedagógicas

const express = require('express');
const router = express.Router();
const Observacion = require('../models/Observacion');

// GET - Obtener todas las observaciones
router.get('/', async (req, res, next) => {
  try {
    const { idEstudiante } = req.query;
    const filtros = {};

    if (idEstudiante) filtros.idEstudiante = idEstudiante;

    const observaciones = await Observacion.find(filtros).sort({ fecha: -1 });
    res.json(observaciones);
  } catch (error) {
    next(error);
  }
});

// GET - Obtener observación por ID
router.get('/:id', async (req, res, next) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    if (!observacion) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }
    res.json(observacion);
  } catch (error) {
    next(error);
  }
});

// POST - Crear nueva observación
router.post('/', async (req, res, next) => {
  try {
    const { idEstudiante, nombreEstudiante, observacion, asesor } = req.body;

    // Validación básica
    if (!idEstudiante || !observacion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: idEstudiante, observacion',
      });
    }

    const nuevaObservacion = new Observacion({
      idEstudiante,
      nombreEstudiante,
      observacion,
      asesor,
      fecha: new Date(),
    });

    await nuevaObservacion.save();
    res.status(201).json(nuevaObservacion);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar observación
router.put('/:id', async (req, res, next) => {
  try {
    const { observacion, asesor } = req.body;

    const observacionActualizada = await Observacion.findByIdAndUpdate(
      req.params.id,
      {
        observacion,
        asesor,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!observacionActualizada) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    res.json(observacionActualizada);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar observación
router.delete('/:id', async (req, res, next) => {
  try {
    const observacionEliminada = await Observacion.findByIdAndDelete(req.params.id);

    if (!observacionEliminada) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    res.json({
      mensaje: 'Observación eliminada correctamente',
      observacion: observacionEliminada,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
