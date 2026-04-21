const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const Mascota = require("./models/Mascota");
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

app.put("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo } = req.body;

const actualizado = await Usuario.findByIdAndUpdate(
  id,
  { nombre_completo },
  { returnDocument: 'after' }
);

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar" });
  }
});

app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));

// ============================
// 🐾 MASCOTAS
// ============================

// Crear mascota
app.post("/mascotas", async (req, res) => {
  const { usuario_id, nombre, tipo, comida, notas, dias } = req.body;

  if (!usuario_id || !nombre) {
    return res.status(400).json({ mensaje: "Faltan campos" });
  }

  try {
    const mascota = await Mascota.create({
      usuario_id,
      nombre,
      tipo,
      comida,
      notas,
      dias,
      salud: 100,
      felicidad: 100,
      energia: 100,
      ultimaComida: new Date()
    });

    res.status(201).json({ mascota });
  } catch (e) {
    res.status(500).json({ mensaje: "Error al crear mascota" });
  }
});


// Obtener mascotas por usuario
app.get("/mascotas/:usuarioId", async (req, res) => {
  try {
    const mascotas = await Mascota.find({
      usuario_id: req.params.usuarioId
    });

    const ahora = new Date();

    mascotas.forEach(m => {
      if (m.ultimaComida) {
        const horas = (ahora - new Date(m.ultimaComida)) / (1000 * 60 * 60);

        if (horas > 1) {
          m.salud = Math.max(0, m.salud - Math.floor(horas));
          m.felicidad = Math.max(0, m.felicidad - Math.floor(horas / 2));
        }
      }
    });

    res.json({ mascotas });

  } catch (e) {
    res.status(500).json({ mensaje: "Error al obtener mascotas" });
  }
});


// Alimentar mascota
app.patch("/mascotas/:id/alimentar", async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id);

    if (!mascota) {
      return res.status(404).json({ mensaje: "Mascota no encontrada" });
    }

    mascota.salud = Math.min(100, mascota.salud + 10);
    mascota.felicidad = Math.min(100, mascota.felicidad + 8);
    mascota.energia = Math.min(100, mascota.energia + 5);
    mascota.ultimaComida = new Date();

    await mascota.save();

    res.json({ mascota });
  } catch (e) {
    res.status(500).json({ mensaje: "Error al alimentar mascota" });
  }
});


// Eliminar mascota
app.delete("/mascotas/:id", async (req, res) => {
  try {
    await Mascota.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Mascota eliminada" });
  } catch (e) {
    res.status(500).json({ mensaje: "Error al eliminar mascota" });
  }
});