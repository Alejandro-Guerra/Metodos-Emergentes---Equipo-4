
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnPrimerHabito = document.getElementById("btnPrimerHabito");

const backdrop = document.getElementById("backdrop");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelar");

const nombreHabito = document.getElementById("nombreHabito");
const descHabito = document.getElementById("descHabito");
const errorNombre = document.getElementById("errorNombre");

const iconGrid = document.getElementById("iconGrid");
let selectedIcon = "🎯"; 

function abrirModal() {
  if (!backdrop) return;
  backdrop.classList.add("show");
  if (errorNombre) errorNombre.classList.remove("show");
  setTimeout(() => nombreHabito?.focus(), 0);
}

function cerrarModal() {
  if (!backdrop) return;
  backdrop.classList.remove("show");
}

function limpiarForm() {
  if (nombreHabito) nombreHabito.value = "";
  if (descHabito) descHabito.value = "";
  selectedIcon = "🎯";
  document.querySelectorAll(".icon-tile").forEach(el => el.classList.remove("selected"));
  const def = document.querySelector('.icon-tile[data-icon="🎯"]');
  if (def) def.classList.add("selected");
}

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

function crearHabito() {
  const nombre = (nombreHabito?.value || "").trim();
  const descripcion = (descHabito?.value || "").trim();

  if (!nombre) {
    if (errorNombre) errorNombre.classList.add("show");
    nombreHabito?.focus();
    return;
  }

  if (errorNombre) errorNombre.classList.remove("show");

  const habitos = obtenerHabitos();
  habitos.push({
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
    nombre,
    descripcion,
    icono: selectedIcon,
    creadoEn: new Date().toISOString()
  });

  guardarHabitos(habitos);

  alert("Hábito creado ✅ (en #26 ya se mostrará en lista)");
  cerrarModal();
  limpiarForm();
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
  const def = document.querySelector('.icon-tile[data-icon="🎯"]');
  if (def) def.classList.add("selected");
});
