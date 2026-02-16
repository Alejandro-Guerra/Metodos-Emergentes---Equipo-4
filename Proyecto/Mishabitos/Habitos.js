
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

let selectedIcon = "🎯";

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
  const def = document.querySelector('.icon-tile[data-icon="🎯"]');
  def?.classList.add("selected");
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
    card.innerHTML = `
      <div class="card-top">
        <div>
          <h4><span class="icon">${h.icono || "🎯"}</span> ${escapeHtml(h.nombre)}</h4>
          <p class="desc">${h.descripcion ? escapeHtml(h.descripcion) : "Sin descripción"}</p>
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

function crearHabito() {
  const nombre = (nombreHabito?.value || "").trim();
  const descripcion = (descHabito?.value || "").trim();

  if (!nombre) {
    errorNombre?.classList.add("show");
    nombreHabito?.focus();
    return;
  }

  errorNombre?.classList.remove("show");

  const habitos = obtenerHabitos();
  habitos.push({
    id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
    nombre,
    descripcion,
    icono: selectedIcon,
    creadoEn: new Date().toISOString()
  });

  guardarHabitos(habitos);
  cerrarModal();
  limpiarForm();
  renderHabitos();
}

btnAbrirModal?.addEventListener("click", abrirModal);
btnPrimerHabito?.addEventListener("click", abrirModal);

btnCerrarModal?.addEventListener("click", cerrarModal);
btnCancelar?.addEventListener("click", cerrarModal);

backdrop?.addEventListener("click", (e) => {
  if (e.target === backdrop) cerrarModal();
});

iconGrid?.addEventListener("click", (e) => {
  const tile = e.target.closest(".icon-tile");
  if (!tile) return;
  document.querySelectorAll(".icon-tile").forEach(el => el.classList.remove("selected"));
  tile.classList.add("selected");
  selectedIcon = tile.dataset.icon || "🎯";
});

document.getElementById("btnCrear")?.addEventListener("click", crearHabito);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.icon-tile[data-icon="🎯"]')?.classList.add("selected");
  renderHabitos();
});
