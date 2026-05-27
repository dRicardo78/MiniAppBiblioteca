// routes/evidencias.js
// Rutas API para gestión de evidencias

const express = require('express');
const router = express.Router();
const Evidencia = require('../models/Evidencia');

// GET - Obtener todas las evidencias
router.get('/', async (req, res, next) => {
  try {
    const { estudiante, tipo, estado } = req.query;
    const filtros = {};

    if (estudiante) filtros.estudiante = estudiante;
    if (tipo) filtros.tipo = tipo;
    if (estado) filtros.estado = estado;

    const evidencias = await Evidencia.find(filtros).sort({ fechaCarga: -1 });
    res.json(evidencias);
  } catch (error) {
    next(error);
  }
});

// GET - Obtener evidencia por ID
router.get('/:id', async (req, res, next) => {
  try {
    const evidencia = await Evidencia.findById(req.params.id);
    if (!evidencia) {
      return res.status(404).json({ error: 'Evidencia no encontrada' });
    }
    res.json(evidencia);
  } catch (error) {
    next(error);
  }
});

// POST - Crear nueva evidencia
router.post('/', async (req, res, next) => {
  try {
    const { estudiante, tipo, nombre, descripcion, archivo } = req.body;

    // Validación básica
    if (!estudiante || !tipo || !nombre || !descripcion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: estudiante, tipo, nombre, descripcion',
      });
    }

    const nuevaEvidencia = new Evidencia({
      estudiante,
      tipo,
      nombre,
      descripcion,
      archivo: archivo || null,
    });

    const evidenciaGuardada = await nuevaEvidencia.save();
    res.status(201).json(evidenciaGuardada);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar evidencia
router.put('/:id', async (req, res, next) => {
  try {
    const { estudiante, tipo, nombre, descripcion, archivo, estado } = req.body;

    const evidenciaActualizada = await Evidencia.findByIdAndUpdate(
      req.params.id,
      {
        estudiante,
        tipo,
        nombre,
        descripcion,
        archivo: archivo || undefined,
        estado: estado || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!evidenciaActualizada) {
      return res.status(404).json({ error: 'Evidencia no encontrada' });
    }

    res.json(evidenciaActualizada);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar evidencia
router.delete('/:id', async (req, res, next) => {
  try {
    const evidenciaEliminada = await Evidencia.findByIdAndDelete(req.params.id);

    if (!evidenciaEliminada) {
      return res.status(404).json({ error: 'Evidencia no encontrada' });
    }

    res.json({ mensaje: 'Evidencia eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
