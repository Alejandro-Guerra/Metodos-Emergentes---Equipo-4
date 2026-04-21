document.addEventListener("DOMContentLoaded", () => {
  const modoOscuro = localStorage.getItem("modoOscuro") === "true";
  document.body.classList.toggle("dark", modoOscuro);

  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Iniciodesesion/Index.html";
    return;
  }

  const tituloHola = document.querySelector("h1");
  if (tituloHola) tituloHola.textContent = `Hola, ${sesion.nombre}`;

  const avatarEl = document.querySelector(".avatar");
  if (avatarEl) avatarEl.textContent = sesion.nombre?.charAt(0).toUpperCase() || "A";

  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnPrimerHabito = document.getElementById("btnPrimerHabito");
  const backdrop = document.getElementById("backdrop");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const nombreHabito = document.getElementById("nombreHabito");
  const descHabito = document.getElementById("descHabito");
  const errorNombre = document.getElementById("errorNombre");
  const errorDias = document.getElementById("errorDias");
  const iconGrid = document.getElementById("iconGrid");
  const diasHabito = document.getElementById("diasHabito");
  const emptyState = document.getElementById("emptyState");
  const listSection = document.getElementById("listSection");
  const cards = document.getElementById("cards");
  const habitosCount = document.getElementById("habitosCount");
  const btnCrear = document.getElementById("btnCrear");
  const tituloModal = document.getElementById("tituloModal");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  let selectedIcon = "🎯";
  let editingId = null;

  const DIAS_SEMANA = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo"
  ];

  const LETRAS_DIAS = {
    "Lunes": "L",
    "Martes": "M",
    "Miércoles": "X",
    "Jueves": "J",
    "Viernes": "V",
    "Sábado": "S",
    "Domingo": "D"
  };

  function obtenerHabitos() {
    try {
      return JSON.parse(localStorage.getItem("habitos")) || [];
    } catch {
      return [];
    }
  }

  function guardarHabitos(lista) {
    localStorage.setItem("habitos", JSON.stringify(lista));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function obtenerDiasSeleccionados() {
    return [...diasHabito.querySelectorAll('input[type="checkbox"]:checked')]
      .map(input => input.value);
  }

  function marcarDiasSeleccionados(dias = []) {
    diasHabito.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = dias.includes(input.value);
    });
  }

  function abrirModal() {
    backdrop.classList.add("show");
    errorNombre.classList.remove("show");
    errorDias?.classList.remove("show");
    setTimeout(() => nombreHabito.focus(), 0);
  }

  function cerrarModal() {
    backdrop.classList.remove("show");
  }

  function limpiarForm() {
    nombreHabito.value = "";
    descHabito.value = "";
    selectedIcon = "🎯";

    document.querySelectorAll(".icon-tile").forEach(el => el.classList.remove("selected"));
    document.querySelector('.icon-tile[data-icon="🎯"]')?.classList.add("selected");

    marcarDiasSeleccionados([]);
    errorNombre.classList.remove("show");
    errorDias?.classList.remove("show");
  }

  function abrirModalCrear() {
    editingId = null;
    tituloModal.textContent = "Agregar Nuevo Hábito";
    btnCrear.textContent = "Crear Hábito";
    limpiarForm();
    abrirModal();
  }

  function abrirModalEditar(habito) {
    editingId = habito.id;
    tituloModal.textContent = "Editar Hábito";
    btnCrear.textContent = "Guardar Cambios";

    nombreHabito.value = habito.nombre || "";
    descHabito.value = habito.descripcion || "";
    selectedIcon = habito.icono || "🎯";

    document.querySelectorAll(".icon-tile").forEach(el => {
      el.classList.toggle("selected", el.dataset.icon === selectedIcon);
    });

    marcarDiasSeleccionados(habito.dias || []);
    abrirModal();
  }

  function calcularProgreso(dias = [], completados = []) {
    if (dias.length === 0) return 0;
    return Math.round((completados.length / dias.length) * 100);
  }

  function renderDias(habito) {
    const dias = habito.dias || [];
    const completados = habito.completados || [];

    return DIAS_SEMANA.map(dia => {
      const activo = dias.includes(dia);
      const hecho = completados.includes(dia);

      return `
        <div class="day ${activo ? "day-active" : "day-disabled"}"
             data-dia="${dia}"
             data-habito-id="${habito.id}">
          <div class="dot ${activo ? "enabled" : ""} ${hecho ? "on" : ""}"></div>
          <div>${LETRAS_DIAS[dia]}</div>
        </div>
      `;
    }).join("");
  }

  function renderHabitos() {
    const habitos = obtenerHabitos();
    const hay = habitos.length > 0;

    emptyState.style.display = hay ? "none" : "grid";
    listSection.style.display = hay ? "block" : "none";
    habitosCount.textContent = `${habitos.length} hábito${habitos.length === 1 ? "" : "s"} activo${habitos.length === 1 ? "" : "s"}`;

    cards.innerHTML = "";

    habitos.forEach(h => {
      const dias = h.dias || [];
      const completados = h.completados || [];
      const progreso = calcularProgreso(dias, completados);

      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = h.id;

      card.innerHTML = `
        <div class="card-top">
          <div>
            <h4><span class="icon">${h.icono || "🎯"}</span> ${escapeHtml(h.nombre)}</h4>
            <p class="desc">${dias.length} día${dias.length === 1 ? "" : "s"}</p>
          </div>
          <div class="actions">
            <button class="btn-mini" data-action="edit" title="Editar" type="button">✏️</button>
            <button class="btn-mini btn-danger" data-action="delete" title="Eliminar" type="button">🗑️</button>
          </div>
        </div>

        <div class="progress-row">
          <span>Progreso</span>
          <span>${progreso}%</span>
        </div>

        <div class="bar"><div style="width:${progreso}%"></div></div>
        <div class="days">${renderDias(h)}</div>
      `;

      cards.appendChild(card);
    });
  }

  function guardarDesdeModal() {
    const nombre = nombreHabito.value.trim();
    const descripcion = descHabito.value.trim();
    const dias = obtenerDiasSeleccionados();

    if (!nombre) {
      errorNombre.classList.add("show");
      nombreHabito.focus();
      return;
    }

    if (dias.length === 0) {
      errorDias?.classList.add("show");
      return;
    }

    errorNombre.classList.remove("show");
    errorDias?.classList.remove("show");

    const habitos = obtenerHabitos();

    if (editingId) {
      const idx = habitos.findIndex(h => h.id === editingId);
      if (idx !== -1) {
        const completadosActuales = habitos[idx].completados || [];
        habitos[idx] = {
          ...habitos[idx],
          nombre,
          descripcion,
          icono: selectedIcon,
          dias,
          completados: completadosActuales.filter(dia => dias.includes(dia))
        };
      }
    } else {
      habitos.push({
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
        nombre,
        descripcion,
        icono: selectedIcon,
        dias,
        completados: [],
        creadoEn: new Date().toISOString()
      });
    }

    guardarHabitos(habitos);
    cerrarModal();
    limpiarForm();
    editingId = null;
    renderHabitos();
  }

  function eliminarHabito(id) {
    if (!confirm("¿Seguro que quieres eliminar este hábito?")) return;
    guardarHabitos(obtenerHabitos().filter(h => h.id !== id));
    renderHabitos();
  }

  function toggleDiaCompletado(habitoId, dia) {
    const habitos = obtenerHabitos();
    const idx = habitos.findIndex(h => h.id === habitoId);

    if (idx === -1) return;

    const habito = habitos[idx];
    const dias = habito.dias || [];

    if (!dias.includes(dia)) return;

    if (!Array.isArray(habito.completados)) {
      habito.completados = [];
    }

    const yaEsta = habito.completados.includes(dia);

    if (yaEsta) {
      habito.completados = habito.completados.filter(d => d !== dia);
    } else {
      habito.completados.push(dia);
    }

    habitos[idx] = habito;
    guardarHabitos(habitos);
    renderHabitos();
  }

  function cerrarSesion() {
    if (!confirm("¿Deseas cerrar sesión?")) return;
    localStorage.removeItem("sesionActiva");
    window.location.href = "../Iniciodesesion/Index.html";
  }

  btnCerrarSesion?.addEventListener("click", cerrarSesion);
  btnAbrirModal?.addEventListener("click", abrirModalCrear);
  btnPrimerHabito?.addEventListener("click", abrirModalCrear);

  btnCerrarModal?.addEventListener("click", () => {
    cerrarModal();
    editingId = null;
  });

  btnCancelar?.addEventListener("click", () => {
    cerrarModal();
    editingId = null;
  });

  backdrop?.addEventListener("click", e => {
    if (e.target === backdrop) {
      cerrarModal();
      editingId = null;
    }
  });

  iconGrid?.addEventListener("click", e => {
    const tile = e.target.closest(".icon-tile");
    if (!tile) return;

    document.querySelectorAll(".icon-tile").forEach(el => el.classList.remove("selected"));
    tile.classList.add("selected");
    selectedIcon = tile.dataset.icon || "🎯";
  });

  btnCrear?.addEventListener("click", guardarDesdeModal);

  cards?.addEventListener("click", e => {
    const actionBtn = e.target.closest("button[data-action]");
    if (actionBtn) {
      const card = actionBtn.closest(".card");
      const id = card?.dataset.id;
      if (!id) return;

      const habito = obtenerHabitos().find(h => h.id === id);

      if (actionBtn.dataset.action === "edit" && habito) abrirModalEditar(habito);
      if (actionBtn.dataset.action === "delete") eliminarHabito(id);
      return;
    }

    const diaEl = e.target.closest(".day[data-dia][data-habito-id]");
    if (diaEl) {
      toggleDiaCompletado(diaEl.dataset.habitoId, diaEl.dataset.dia);
    }
  });

  document.querySelector('.icon-tile[data-icon="🎯"]')?.classList.add("selected");
  renderHabitos();
});