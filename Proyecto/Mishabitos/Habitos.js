const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnPrimerHabito = document.getElementById("btnPrimerHabito");

const backdrop = document.getElementById("backdrop");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelar");

const nombreHabito = document.getElementById("nombreHabito");
const descHabito = document.getElementById("descHabito");
const errorNombre = document.getElementById("errorNombre");

const iconGrid = document.getElementById("iconGrid");

const emptyState = document.getElementById("emptyState");
const listSection = document.getElementById("listSection");
const cards = document.getElementById("cards");
const habitosCount = document.getElementById("habitosCount");

const btnCrear = document.getElementById("btnCrear");
const tituloModal = document.getElementById("tituloModal");

let selectedIcon = "🎯";
let editingId = null; 
function obtenerHabitos() {
  try {
    const raw = localStorage.getItem("habitos");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function guardarHabitos(lista) {
  localStorage.setItem("habitos", JSON.stringify(lista));
}

function abrirModalCrear() {
  editingId = null;
  if (tituloModal) tituloModal.textContent = "Agregar Nuevo Hábito";
  if (btnCrear) btnCrear.textContent = "Crear Hábito";
  limpiarForm();
  abrirModal();
}

function abrirModalEditar(habito) {
  editingId = habito.id;
  if (tituloModal) tituloModal.textContent = "Editar Hábito";
  if (btnCrear) btnCrear.textContent = "Guardar Cambios";

  if (nombreHabito) nombreHabito.value = habito.nombre || "";
  if (descHabito) descHabito.value = habito.descripcion || "";

  selectedIcon = habito.icono || "🎯";
  document.querySelectorAll(".icon-tile").forEach(el => {
    el.classList.toggle("selected", el.dataset.icon === selectedIcon);
  });

  abrirModal();
}

function abrirModal() {
  backdrop?.classList.add("show");
  errorNombre?.classList.remove("show");
  setTimeout(() => nombreHabito?.focus(), 0);
}

function cerrarModal() {
  backdrop?.classList.remove("show");
}

function limpiarForm() {
  if (nombreHabito) nombreHabito.value = "";
  if (descHabito) descHabito.value = "";
  selectedIcon = "🎯";
  document.querySelectorAll(".icon-tile").forEach(el => el.classList.remove("selected"));
  document.querySelector('.icon-tile[data-icon="🎯"]')?.classList.add("selected");
}

function renderHabitos() {
  const habitos = obtenerHabitos();

  const hay = habitos.length > 0;
  if (emptyState) emptyState.style.display = hay ? "none" : "grid";
  if (listSection) listSection.style.display = hay ? "block" : "none";

  if (habitosCount) {
    habitosCount.textContent = `${habitos.length} hábito${habitos.length === 1 ? "" : "s"} activo${habitos.length === 1 ? "" : "s"}`;
  }

  if (!cards) return;
  cards.innerHTML = "";

  habitos.forEach((h) => {
    const progreso = Math.min(100, 20 + (h.nombre.length % 5) * 15);

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = h.id;

    card.innerHTML = `
      <div class="card-top">
        <div>
          <h4><span class="icon">${h.icono || "🎯"}</span> ${escapeHtml(h.nombre)}</h4>
          <p class="desc">${h.descripcion ? escapeHtml(h.descripcion) : "Sin descripción"}</p>
        </div>

        <div class="actions">
          <button class="btn-mini" data-action="edit" title="Editar">✏️</button>
          <button class="btn-mini btn-danger" data-action="delete" title="Eliminar">🗑️</button>
        </div>
      </div>

      <div class="progress-row">
        <span>Progreso</span>
        <span>${progreso}%</span>
      </div>
      <div class="bar"><div style="width:${progreso}%"></div></div>

      <div class="days">
        ${renderDias()}
      </div>
    `;

    cards.appendChild(card);
  });
}

function renderDias() {
  const labels = ["L", "M", "X", "J", "V", "S", "D"];
  return labels.map((l, i) => `
    <div class="day">
      <div class="dot ${i % 2 === 0 ? "on" : ""}"></div>
      <div>${l}</div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function guardarDesdeModal() {
  const nombre = (nombreHabito?.value || "").trim();
  const descripcion = (descHabito?.value || "").trim();

  if (!nombre) {
    errorNombre?.classList.add("show");
    nombreHabito?.focus();
    return;
  }

  errorNombre?.classList.remove("show");

  const habitos = obtenerHabitos();

  if (editingId) {
    const idx = habitos.findIndex(h => h.id === editingId);
    if (idx !== -1) {
      habitos[idx] = {
        ...habitos[idx],
        nombre,
        descripcion,
        icono: selectedIcon
      };
    }
  } else {
    habitos.push({
      id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
      nombre,
      descripcion,
      icono: selectedIcon,
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
  const ok = confirm("¿Seguro que quieres eliminar este hábito?");
  if (!ok) return;

  const habitos = obtenerHabitos().filter(h => h.id !== id);
  guardarHabitos(habitos);
  renderHabitos();
}

btnAbrirModal?.addEventListener("click", abrirModalCrear);
btnPrimerHabito?.addEventListener("click", abrirModalCrear);

btnCerrarModal?.addEventListener("click", () => { cerrarModal(); editingId = null; });
btnCancelar?.addEventListener("click", () => { cerrarModal(); editingId = null; });

backdrop?.addEventListener("click", (e) => {
  if (e.target === backdrop) { cerrarModal(); editingId = null; }
});

iconGrid?.addEventListener("click", (e) => {
  const tile = e.target.closest(".icon-tile");
  if (!tile) return;
  document.querySelectorAll(".icon-tile").forEach(el => el.classList.remove("selected"));
  tile.classList.add("selected");
  selectedIcon = tile.dataset.icon || "🎯";
});

btnCrear?.addEventListener("click", guardarDesdeModal);

cards?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const card = btn.closest(".card");
  const id = card?.dataset.id;
  if (!id) return;

  const habitos = obtenerHabitos();
  const habito = habitos.find(h => h.id === id);

  if (action === "edit" && habito) abrirModalEditar(habito);
  if (action === "delete") eliminarHabito(id);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.icon-tile[data-icon="🎯"]')?.classList.add("selected");
  renderHabitos();
});
