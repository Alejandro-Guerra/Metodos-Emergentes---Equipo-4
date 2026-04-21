const mongoose = require("mongoose");

const mascotaSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuarios",
      required: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    tipo: {
      type: String,
      trim: true
    },

    comida: {
      type: String,
      trim: true
    },

    notas: {
      type: String,
      trim: true
    },

    dias: [
      {
        type: String
      }
    ],

    salud: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },

    felicidad: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },

    energia: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },

    ultimaComida: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("mascotas", mascotaSchema);