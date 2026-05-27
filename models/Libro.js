// models/Libro.js
// Esquema de datos para Libros

const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema(
  {
    idLibro: {
      type: String,
      required: [true, 'El ID del libro es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [10, 'ID máximo 10 caracteres'],
      minlength: [1, 'ID mínimo 1 carácter'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del libro es obligatorio'],
      trim: true,
      maxlength: [100, 'Nombre máximo 100 caracteres'],
    },
    editorial: {
      type: String,
      trim: true,
      maxlength: [100, 'Editorial máximo 100 caracteres'],
      default: '',
    },
    autor: {
      type: String,
      trim: true,
      maxlength: [100, 'Autor máximo 100 caracteres'],
      default: '',
    },
    numCopias: {
      type: Number,
      required: [true, 'Número de copias es obligatorio'],
      min: [1, 'Mínimo 1 copia'],
      max: [999, 'Máximo 999 copias'],
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Índice para búsquedas más rápidas
libroSchema.index({ nombre: 'text', autor: 'text' });

module.exports = mongoose.model('Libro', libroSchema);
