const mongoose = require("mongoose");

const mascotaSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuarios",
      required: true
    },
    nombre: { type: String, required: true },
    tipo: { type: String },
    salud: { type: Number, default: 100 },
    felicidad: { type: Number, default: 100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("mascotas", mascotaSchema);