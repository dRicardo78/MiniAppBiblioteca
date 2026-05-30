// models/Observacion.js
// Esquema para observaciones pedagógicas

const mongoose = require('mongoose');

const observacionSchema = new mongoose.Schema(
  {
    idEstudiante: {
      type: String,
      required: true,
      index: true,
    },
    nombreEstudiante: String,
    observacion: {
      type: String,
      required: true,
      maxlength: 500,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    asesor: String, // Nombre del asesor que registró
  },
  { timestamps: true }
);

module.exports = mongoose.model('Observacion', observacionSchema);
