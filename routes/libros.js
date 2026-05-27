// routes/libros.js
// Rutas API para gestión de libros

const express = require('express');
const router = express.Router();
const Libro = require('../models/Libro');

// GET - Obtener todos los libros
router.get('/', async (req, res, next) => {
  try {
    const libros = await Libro.find().sort({ fechaIngreso: -1 });
    res.json(libros);
  } catch (error) {
    next(error);
  }
});

// GET - Obtener un libro por ID
router.get('/:id', async (req, res, next) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(libro);
  } catch (error) {
    next(error);
  }
});

// POST - Crear nuevo libro
router.post('/', async (req, res, next) => {
  try {
    const { idLibro, nombre, editorial, autor, numCopias } = req.body;

    // Validación básica
    if (!idLibro || !nombre || !numCopias) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: idLibro, nombre, numCopias',
      });
    }

    const nuevoLibro = new Libro({
      idLibro,
      nombre,
      editorial: editorial || '',
      autor: autor || '',
      numCopias,
    });

    const libroGuardado = await nuevoLibro.save();
    res.status(201).json(libroGuardado);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar libro
router.put('/:id', async (req, res, next) => {
  try {
    const { idLibro, nombre, editorial, autor, numCopias } = req.body;

    // No permitir cambiar idLibro (es la clave única)
    if (idLibro) {
      delete req.body.idLibro;
    }

    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        editorial: editorial || '',
        autor: autor || '',
        numCopias,
      },
      { new: true, runValidators: true }
    );

    if (!libroActualizado) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libroActualizado);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar libro
router.delete('/:id', async (req, res, next) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);

    if (!libroEliminado) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ mensaje: 'Libro eliminado correctamente', libro: libroEliminado });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
