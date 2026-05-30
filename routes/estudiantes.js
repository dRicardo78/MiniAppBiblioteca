// routes/estudiantes.js
// Rutas API para gestión de estudiantes

const express = require('express');
const router = express.Router();

// Para esta versión, usamos datos de prueba
// En producción, estos se guardarían en MongoDB

let estudiantes = [
  { _id: '1', id: '1', nombre: 'Juan Pérez', nombreEstudiante: 'Juan Pérez' },
  { _id: '2', id: '2', nombre: 'María García', nombreEstudiante: 'María García' },
  { _id: '3', id: '3', nombre: 'Carlos López', nombreEstudiante: 'Carlos López' },
  { _id: '4', id: '4', nombre: 'Ana Rodríguez', nombreEstudiante: 'Ana Rodríguez' },
  { _id: '5', id: '5', nombre: 'Luis Martínez', nombreEstudiante: 'Luis Martínez' },
];

// GET - Obtener todos los estudiantes
router.get('/', (req, res) => {
  res.json(estudiantes);
});

// GET - Obtener estudiante por ID
router.get('/:id', (req, res) => {
  const estudiante = estudiantes.find(e => e._id === req.params.id || e.id === req.params.id);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }
  res.json(estudiante);
});

// POST - Crear nuevo estudiante
router.post('/', (req, res) => {
  const { nombre, nombreEstudiante } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  
  const nuevoEstudiante = {
    _id: String(estudiantes.length + 1),
    id: String(estudiantes.length + 1),
    nombre,
    nombreEstudiante: nombreEstudiante || nombre
  };
  
  estudiantes.push(nuevoEstudiante);
  res.status(201).json(nuevoEstudiante);
});

// PUT - Actualizar estudiante
router.put('/:id', (req, res) => {
  const estudiante = estudiantes.find(e => e._id === req.params.id || e.id === req.params.id);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }
  
  const { nombre, nombreEstudiante } = req.body;
  if (nombre) estudiante.nombre = nombre;
  if (nombreEstudiante) estudiante.nombreEstudiante = nombreEstudiante;
  
  res.json(estudiante);
});

// DELETE - Eliminar estudiante
router.delete('/:id', (req, res) => {
  const index = estudiantes.findIndex(e => e._id === req.params.id || e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }
  
  const eliminado = estudiantes.splice(index, 1);
  res.json({ mensaje: 'Estudiante eliminado', estudiante: eliminado[0] });
});

module.exports = router;
