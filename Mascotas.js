document.addEventListener("DOMContentLoaded", () => {

  /* ── MODO OSCURO ── */
  const modoOscuro = localStorage.getItem("modoOscuro") === "true";
  document.body.classList.toggle("dark", modoOscuro);

  /* ── SESIÓN ── */
  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Iniciodesesion/Index.html";
    return;
  }

  const tituloHola = document.querySelector("h1");
  if (tituloHola) tituloHola.textContent = `Hola, ${sesion.nombre}`;

  const avatarEl = document.querySelector(".avatar");
  if (avatarEl) avatarEl.textContent = sesion.nombre?.charAt(0).toUpperCase() || "A";

  /* ── ELEMENTOS ── */
  const btnAbrirModal   = document.getElementById("btnAbrirModal");
  const btnPrimerMascota = document.getElementById("btnPrimerMascota");
  const backdrop        = document.getElementById("backdrop");
  const btnCerrarModal  = document.getElementById("btnCerrarModal");
  const btnCancelar     = document.getElementById("btnCancelar");
  const btnCrear        = document.getElementById("btnCrear");
  const tituloModal     = document.getElementById("tituloModal");

  const nombreInput = document.getElementById("nombreMascota");
  const tipoInput   = document.getElementById("tipoMascota");
  const comidaInput = document.getElementById("comidaMascota");
  const notasInput  = document.getElementById("notasMascota");
  const errorNombre = document.getElementById("errorNombre");

  const emptyState    = document.getElementById("emptyState");
  const listSection   = document.getElementById("listSection");
  const cards         = document.getElementById("cards");
  const mascotasCount = document.getElementById("mascotasCount");

  let editingId = null;

  /* ── STORAGE ── */
  function obtenerMascotas() {
    return JSON.parse(localStorage.getItem("mascotas") || "[]");
  }

  function guardarMascotas(lista) {
    localStorage.setItem("mascotas", JSON.stringify(lista));
  }

  function getIcono(tipo) {
    tipo = (tipo || "").toLowerCase();
    if (tipo.includes("perro"))  return "🐶";
    if (tipo.includes("gato"))   return "🐱";
    if (tipo.includes("pez"))    return "🐟";
    if (tipo.includes("conejo")) return "🐰";
    return "🐾";
  }

  /* ── MODAL ── */
  function abrirModalCrear() {
    editingId = null;
    tituloModal.textContent = "Agregar Mascota";
    btnCrear.textContent    = "Guardar";
    nombreInput.value = tipoInput.value = comidaInput.value = notasInput.value = "";
    errorNombre.classList.remove("show");
    backdrop.classList.add("show");
  }

  function abrirModalEditar(mascota) {
    editingId               = mascota.id;
    tituloModal.textContent = "Editar Mascota";
    btnCrear.textContent    = "Guardar Cambios";
    nombreInput.value = mascota.nombre;
    tipoInput.value   = mascota.tipo;
    comidaInput.value = mascota.comida || "";
    notasInput.value  = mascota.notas  || "";
    backdrop.classList.add("show");
  }

  function cerrarModal() { backdrop.classList.remove("show"); editingId = null; }

  /* ── RENDER ── */
  function actualizarStats(mascotas) {
    document.getElementById("mascotasCount").textContent = mascotas.length;

    const promSalud = mascotas.length
      ? Math.round(mascotas.reduce((a, m) => a + m.salud, 0) / mascotas.length) : 100;
    const promFelicidad = mascotas.length
      ? Math.round(mascotas.reduce((a, m) => a + m.felicidad, 0) / mascotas.length) : 100;

    const elSalud = document.getElementById("promedioSalud");
    const elFel   = document.getElementById("promedioFelicidad");
    if (elSalud) elSalud.textContent     = promSalud + "%";
    if (elFel)   elFel.textContent       = promFelicidad + "%";
  }

  function render() {
    const mascotas = obtenerMascotas();
    const hay = mascotas.length > 0;

    emptyState.style.display  = hay ? "none"  : "grid";
    listSection.style.display = hay ? "block" : "none";

    actualizarStats(mascotas);
    cards.innerHTML = "";

    mascotas.forEach(m => {
      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <div class="card-top">
          <div class="pet-header">
            <div class="pet-avatar">${getIcono(m.tipo)}</div>
            <div>
              <h4>${m.nombre}</h4>
              <p class="pet-type">${m.tipo || "Mascota"}</p>
            </div>
          </div>
          <div class="pet-status">Activo</div>
        </div>

        <div class="pet-info">
          <p><b>Comida favorita:</b> ${m.comida || "No definida"}</p>
          <p><b>Notas:</b> ${m.notas || "Sin notas"}</p>
          <p><b>Última comida:</b> ${m.ultimaComida || "Nunca"}</p>
        </div>

        <div class="status">
          <div class="status-row"><span class="status-label">Salud</span><span>${m.salud}%</span></div>
          <div class="bar"><div class="bar-fill bar-salud" style="width:${m.salud}%"></div></div>
          <div class="status-row"><span class="status-label">Felicidad</span><span>${m.felicidad}%</span></div>
          <div class="bar"><div class="bar-fill bar-felicidad" style="width:${m.felicidad}%"></div></div>
          <div class="status-row"><span class="status-label">Energía</span><span>${m.energia}%</span></div>
          <div class="bar"><div class="bar-fill bar-energia" style="width:${m.energia}%"></div></div>
        </div>

        <div class="actions">
          <button class="btn-mini btn-feed" data-action="feed">🍖 Alimentar</button>
          <button class="btn-mini"          data-action="edit">✏️ Editar</button>
          <button class="btn-mini btn-danger" data-action="delete">🗑️ Eliminar</button>
        </div>`;

      card.querySelector('[data-action="feed"]').addEventListener("click",   () => alimentar(m.id));
      card.querySelector('[data-action="edit"]').addEventListener("click",   () => abrirModalEditar(m));
      card.querySelector('[data-action="delete"]').addEventListener("click", () => eliminar(m.id));

      cards.appendChild(card);
    });
  }

  /* ── ALIMENTAR ── */
  function alimentar(id) {
    const mascotas = obtenerMascotas().map(m => {
      if (m.id === id) {
        m.salud       = Math.min(100, m.salud + 10);
        m.felicidad   = Math.min(100, m.felicidad + 8);
        m.energia     = Math.min(100, m.energia + 5);
        m.ultimaComida = new Date().toLocaleTimeString();
      }
      return m;
    });
    guardarMascotas(mascotas);
    render();
  }

  /* ── ELIMINAR ── */
  function eliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta mascota?")) return;
    guardarMascotas(obtenerMascotas().filter(m => m.id !== id));
    render();
  }

  /* ── GUARDAR DESDE MODAL ── */
  function guardarDesdeModal() {
    const nombre = nombreInput.value.trim();
    const tipo   = tipoInput.value.trim();
    const comida = comidaInput.value.trim();
    const notas  = notasInput.value.trim();

    if (!nombre) { errorNombre.classList.add("show"); return; }

    const mascotas = obtenerMascotas();

    if (editingId) {
      const idx = mascotas.findIndex(m => m.id === editingId);
      if (idx !== -1) Object.assign(mascotas[idx], { nombre, tipo, comida, notas });
    } else {
      mascotas.push({
        id: crypto.randomUUID(),
        nombre, tipo, comida, notas,
        salud: 100, felicidad: 100, energia: 100,
        ultimaComida: "Nunca",
        creadoEn: new Date().toISOString()
      });
    }

    guardarMascotas(mascotas);
    cerrarModal();
    render();
  }

  /* ── EVENTOS ── */
  btnAbrirModal.addEventListener("click", abrirModalCrear);
  btnPrimerMascota.addEventListener("click", abrirModalCrear);
  btnCerrarModal.addEventListener("click", cerrarModal);
  btnCancelar.addEventListener("click", cerrarModal);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) cerrarModal(); });
  btnCrear.addEventListener("click", guardarDesdeModal);

  render();
});