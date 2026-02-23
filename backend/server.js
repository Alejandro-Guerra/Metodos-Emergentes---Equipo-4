const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Apphabitos")
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.log("❌ Error:", err));

// Modelo
const usuarioSchema = new mongoose.Schema(
  {
    nombre_completo: { type: String, required: true },
    correo_electronico: { type: String, required: true, unique: true },
    contraseña_hash: { type: String, required: true }
  },
  { timestamps: true }
);

const Usuario = mongoose.model("usuarios", usuarioSchema);

// Ruta prueba
app.get("/ping", (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
});

// Registro
app.post("/registro", async (req, res) => {
  const { nombre_completo, correo_electronico, contraseña, confirmar_contraseña } = req.body;

  if (!nombre_completo || !correo_electronico || !contraseña || !confirmar_contraseña) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
  }

  if (contraseña !== confirmar_contraseña) {
    return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
  }

  const hash = await bcrypt.hash(contraseña, 10);

  try {
    const nuevo = await Usuario.create({
      nombre_completo,
      correo_electronico: correo_electronico.toLowerCase().trim(),
      contraseña_hash: hash
    });

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: { id: nuevo._id, nombre: nuevo.nombre_completo, email: nuevo.correo_electronico }
    });
  } catch (e) {
    if (e.code === 11000)
      return res.status(409).json({ mensaje: "El correo ya existe" });

    res.status(500).json({ mensaje: "Error al registrar", error: e.message });
  }
});

/* ─────────────────────────────
   ✅ LOGIN (AGREGADO)
───────────────────────────── */
app.post("/login", async (req, res) => {
  try {
    const { correo_electronico, contraseña } = req.body;

    if (!correo_electronico || !contraseña) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const email = correo_electronico.toLowerCase().trim();

    const user = await Usuario.findOne({ correo_electronico: email });

    if (!user) {
      return res.status(404).json({ mensaje: "No encontramos una cuenta con ese correo." });
    }

    const ok = await bcrypt.compare(contraseña, user.contraseña_hash);

    if (!ok) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta. Inténtalo de nuevo." });
    }

    // Respuesta mínima (sin contraseña_hash)
    return res.json({
      mensaje: "Login correcto",
      usuario: {
        id: user._id,
        nombre: user.nombre_completo,
        email: user.correo_electronico
      }
    });
  } catch (err) {
    return res.status(500).json({ mensaje: "Error del servidor", error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));