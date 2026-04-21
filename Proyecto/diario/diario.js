document.addEventListener("DOMContentLoaded", () => {

  /* ── MODO OSCURO ── */
  const modoOscuro = localStorage.getItem("modoOscuro") === "true";
  document.body.classList.toggle("dark", modoOscuro);

  /* ── SESIÓN ── */
  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Inciodesesion/Index.html";
    return;
  }

  const avatarPerfil = document.getElementById("avatarPerfil");
  avatarPerfil?.addEventListener("click", () => {
    window.location.href = "../TarjetaUsuario/CardUsuario.html";
  });

  const tituloHola = document.querySelector("h1");
  if (tituloHola) tituloHola.textContent = `Hola, ${sesion.nombre}`;

  const avatarEl = document.querySelector(".avatar");
  if (avatarEl) avatarEl.textContent = sesion.nombre?.charAt(0).toUpperCase() || "A";

  const btnAbrir = document.getElementById("btnAbrirModal");
  const btnPrimera = document.getElementById("btnPrimeraEntrada");
  const btnCerrar = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnGuardar = document.getElementById("btnGuardar");
  const backdrop = document.getElementById("backdrop");

  const mensajeUsuario = document.getElementById("mensajeUsuario");

  const cards = document.getElementById("cards");
  const empty = document.getElementById("emptyState");
  const list = document.getElementById("listSection");
  const count = document.getElementById("entradasCount");

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function obtener() {
    try {
      return JSON.parse(localStorage.getItem("diarioChat")) || [];
    } catch {
      return [];
    }
  }

  function guardar(data) {
    localStorage.setItem("diarioChat", JSON.stringify(data));
  }

  function analizarEstado(texto) {
    const t = texto.toLowerCase();

    if (
      t.includes("bien") ||
      t.includes("feliz") ||
      t.includes("contento") ||
      t.includes("contenta") ||
      t.includes("genial") ||
      t.includes("excelente") ||
      t.includes("muy bien") ||
      t.includes("alegre")
    ) {
      return {
        estado: "bien",
        respuesta: "Qué bueno que te sientas así. Sigue aprovechando ese ánimo y guarda este momento positivo."
      };
    }

    if (
      t.includes("mal") ||
      t.includes("triste") ||
      t.includes("cansado") ||
      t.includes("cansada") ||
      t.includes("agotado") ||
      t.includes("agotada") ||
      t.includes("solo") ||
      t.includes("sola")
    ) {
      return {
        estado: "mal",
        respuesta: "Lamento que te sientas así. Recuerda que descansar, respirar y expresar lo que sientes también ayuda."
      };
    }

    if (
      t.includes("estresado") ||
      t.includes("estresada") ||
      t.includes("enojado") ||
      t.includes("enojada") ||
      t.includes("molesto") ||
      t.includes("molesta") ||
      t.includes("frustrado") ||
      t.includes("frustrada")
    ) {
      return {
        estado: "estresado",
        respuesta: "Parece que fue un día pesado. Tomarte unos minutos para respirar y ordenar tus ideas puede ayudarte mucho."
      };
    }

    return {
      estado: "neutral",
      respuesta: "Gracias por compartir cómo te sientes. Expresar tus emociones ya es un paso importante."
    };
  }

  function abrir() {
    mensajeUsuario.value = "";
    backdrop.classList.add("show");
    setTimeout(() => mensajeUsuario.focus(), 0);
  }

  function cerrar() {
    backdrop.classList.remove("show");
  }

  btnAbrir?.addEventListener("click", abrir);
  btnPrimera?.addEventListener("click", abrir);
  btnCerrar?.addEventListener("click", cerrar);
  btnCancelar?.addEventListener("click", cerrar);

  backdrop?.addEventListener("click", e => {
    if (e.target === backdrop) cerrar();
  });

  btnGuardar?.addEventListener("click", () => {
    const mensaje = mensajeUsuario.value.trim();
    if (!mensaje) return;

    const analisis = analizarEstado(mensaje);
    const data = obtener();

    data.unshift({
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      fecha: new Date().toLocaleDateString(),
      mensajeUsuario: mensaje,
      respuestaBot: analisis.respuesta,
      estado: analisis.estado
    });

    guardar(data);
    cerrar();
    render();
  });

  function eliminar(id) {
    if (!confirm("¿Eliminar esta conversación?")) return;
    guardar(obtener().filter(item => item.id !== id));
    render();
  }

  function render() {
    const data = obtener();
    cards.innerHTML = "";

    if (data.length === 0) {
      empty.style.display = "grid";
      list.style.display = "none";
    } else {
      empty.style.display = "none";
      list.style.display = "block";
    }

    count.textContent = `${data.length} conversación${data.length === 1 ? "" : "es"} guardada${data.length === 1 ? "" : "s"}`;

    data.forEach(d => {
      const card = document.createElement("div");
      card.className = `card chat-card ${d.estado}`;

      card.innerHTML = `
        <div class="chat-date">${escapeHtml(d.fecha)}</div>
        <div class="chat-bubble user">
          <strong>Tú:</strong> ${escapeHtml(d.mensajeUsuario)}
        </div>
        <div class="chat-bubble bot">
          <strong>Bot:</strong> ${escapeHtml(d.respuestaBot)}
        </div>
        <div class="actions">
          <button class="btn-mini btn-danger" type="button">🗑 Eliminar</button>
        </div>
      `;

      card.querySelector("button").addEventListener("click", () => eliminar(d.id));
      cards.appendChild(card);
    });
  }

  render();
});
