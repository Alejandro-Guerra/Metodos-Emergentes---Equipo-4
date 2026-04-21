document.addEventListener("DOMContentLoaded", () => {

    /* ── MODO OSCURO ── */
  const modoOscuro = localStorage.getItem("modoOscuro") === "true";
  document.body.classList.toggle("dark", modoOscuro);

  const API_URL = "http://localhost:3000";

  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Inciodesesion/Index.html";
    return;
  }

  const usuarioId = sesion.id;

  const tituloHola = document.querySelector("h1");
  if (tituloHola) {
    tituloHola.textContent = `Hola, ${sesion.nombre}`;
  }

  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnPrimerMascota = document.getElementById("btnPrimerMascota");
  const backdrop = document.getElementById("backdrop");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnCrear = document.getElementById("btnCrear");
  const nombreInput = document.getElementById("nombreMascota");
  const tipoInput = document.getElementById("tipoMascota");
  const comidaInput = document.getElementById("comidaMascota");
  const notasInput = document.getElementById("notasMascota");

  const errorNombre = document.getElementById("errorNombre");

  const emptyState = document.getElementById("emptyState");
  const listSection = document.getElementById("listSection");
  const cards = document.getElementById("cards");
  const mascotasCount = document.getElementById("mascotasCount");

  let mascotas = [];

  function getIcono(tipo) {
    tipo = (tipo || "").toLowerCase();
    if (tipo.includes("perro")) return "🐶";
    if (tipo.includes("gato")) return "🐱";
    return "🐾";
  }

  // =========================
  // 🔄 CARGAR DESDE MONGODB
  // =========================
  async function cargarMascotas() {
    const res = await fetch(`${API_URL}/mascotas/${usuarioId}`);
    const data = await res.json();
    mascotas = data.mascotas || [];
    render();
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render() {

    const hay = mascotas.length > 0;

    emptyState.style.display = hay ? "none" : "grid";
    listSection.style.display = hay ? "block" : "none";

    mascotasCount.textContent =
      `${mascotas.length} mascota${mascotas.length === 1 ? "" : "s"} activa${mascotas.length === 1 ? "" : "s"}`;

    cards.innerHTML = "";

    mascotas.forEach(m => {

      const ultima = m.ultimaComida
        ? new Date(m.ultimaComida).toLocaleTimeString()
        : "Nunca";

      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <div class="card-top">
          <div>
            <h4>${getIcono(m.tipo)} ${m.nombre}</h4>
            <p><b>Tipo:</b> ${m.tipo}</p>
            <p><b>Comida:</b> ${m.comida || "No definida"}</p>
            <p><b>Notas:</b> ${m.notas || "Sin notas"}</p>
            <p><b>Última comida:</b> ${ultima}</p>

            <div class="status">

              <div class="status-row">
                <span>Salud</span>
                <span>${m.salud}%</span>
              </div>
              <div class="bar">
                <div class="bar-fill bar-salud" style="width:${m.salud}%"></div>
              </div>

              <div class="status-row">
                <span>Felicidad</span>
                <span>${m.felicidad}%</span>
              </div>
              <div class="bar">
                <div class="bar-fill bar-felicidad" style="width:${m.felicidad}%"></div>
              </div>

              <div class="status-row">
                <span>Energía</span>
                <span>${m.energia}%</span>
              </div>
              <div class="bar">
                <div class="bar-fill bar-energia" style="width:${m.energia}%"></div>
              </div>

            </div>
          </div>

          <div class="actions">
            <button class="btn-mini" data-feed="${m._id}">🍖</button>
            <button class="btn-mini btn-danger" data-delete="${m._id}">🗑️</button>
          </div>
        </div>
      `;

      cards.appendChild(card);
    });
  }

  // =========================
  // 🍖 ALIMENTAR
  // =========================
  cards.addEventListener("click", async (e) => {

    if (e.target.dataset.feed) {
      await fetch(`${API_URL}/mascotas/${e.target.dataset.feed}/alimentar`, {
        method: "PATCH"
      });
      cargarMascotas();
    }

    if (e.target.dataset.delete) {
      await fetch(`${API_URL}/mascotas/${e.target.dataset.delete}`, {
        method: "DELETE"
      });
      cargarMascotas();
    }

  });

  // =========================
  // 💾 CREAR
  // =========================
  btnCrear.addEventListener("click", async () => {

    const nombre = nombreInput.value.trim();
    const tipo = tipoInput.value.trim();
    const comida = comidaInput.value.trim();
    const notas = notasInput.value.trim();

    if (!nombre) {
      errorNombre.classList.add("show");
      return;
    }

    await fetch(`${API_URL}/mascotas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usuario_id: usuarioId,
        nombre,
        tipo,
        comida,
        notas
      })
    });

    backdrop.classList.remove("show");

    nombreInput.value = "";
    tipoInput.value = "";
    comidaInput.value = "";
    notasInput.value = "";

    cargarMascotas();
  });

  // MODAL
  btnAbrirModal.addEventListener("click", () => backdrop.classList.add("show"));
  btnPrimerMascota.addEventListener("click", () => backdrop.classList.add("show"));
  btnCerrarModal.addEventListener("click", () => backdrop.classList.remove("show"));
  btnCancelar.addEventListener("click", () => backdrop.classList.remove("show"));

  // 🚀 INICIO
  cargarMascotas();

});