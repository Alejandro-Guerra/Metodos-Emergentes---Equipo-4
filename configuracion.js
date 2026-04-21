document.addEventListener("DOMContentLoaded", () => {

  /* ── MODO OSCURO — aplicar antes de que el usuario vea nada ── */
  const modoOscuro = localStorage.getItem("modoOscuro") === "true";
  document.body.classList.toggle("dark", modoOscuro);

  /* ── SESIÓN ── */
  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Inciodesesion/Index.html"; // ← ruta exacta de tu carpeta
    return;
  }

  /* ── ELEMENTOS ── */
  const saludoNombre     = document.getElementById("saludoNombre");
  const avatarLetra      = document.getElementById("avatarLetra");
  const inputNombre      = document.getElementById("inputNombre");
  const btnGuardarNombre = document.getElementById("btnGuardarNombre");
  const errorNombre      = document.getElementById("errorNombre");
  const successNombre    = document.getElementById("successNombre");
  const darkToggle       = document.getElementById("darkToggle");
  const btnCerrarSesion  = document.getElementById("btnCerrarSesion");
  const toast            = document.getElementById("toast");

  /* ── INICIALIZAR UI ── */
  function inicializarNombre() {
    const nombre = sesion.nombre || "";
    saludoNombre.textContent = `Hola, ${nombre}`;
    avatarLetra.textContent  = nombre.charAt(0).toUpperCase() || "A";
    inputNombre.value        = nombre;
  }

  inicializarNombre();

  /* ── TOAST ── */
  function showToast(msg, type = "success", duration = 2500) {
    toast.textContent = msg;
    toast.className   = `toast show ${type === "error" ? "error-toast" : "success"}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.className = "toast"; }, duration);
  }

  /* ══════════════════════════════════
     GUARDAR NOMBRE — solo localStorage
  ══════════════════════════════════ */
  btnGuardarNombre.addEventListener("click", () => {
    const nuevoNombre = inputNombre.value.trim();

    if (!nuevoNombre) {
      errorNombre.classList.add("show");
      inputNombre.focus();
      return;
    }

    errorNombre.classList.remove("show");
    successNombre.classList.remove("show");

    sesion.nombre = nuevoNombre;
    localStorage.setItem("sesionActiva", JSON.stringify(sesion));

    saludoNombre.textContent = `Hola, ${nuevoNombre}`;
    avatarLetra.textContent  = nuevoNombre.charAt(0).toUpperCase() || "A";

    successNombre.classList.add("show");
    setTimeout(() => successNombre.classList.remove("show"), 3000);
    showToast("✅ Nombre actualizado correctamente");
  });

  inputNombre.addEventListener("input", () => errorNombre.classList.remove("show"));

  /* ══════════════════════════════════
     MODO OSCURO
  ══════════════════════════════════ */
  function aplicarModoOscuro(activar) {
    document.body.classList.toggle("dark", activar);
    darkToggle.checked = activar;
    localStorage.setItem("modoOscuro", activar ? "true" : "false");
  }

  darkToggle.checked = modoOscuro;

  darkToggle.addEventListener("change", () => {
    aplicarModoOscuro(darkToggle.checked);
    showToast(darkToggle.checked ? "🌙 Modo oscuro activado" : "☀️ Modo claro activado");
  });

  /* ══════════════════════════════════
     CERRAR SESIÓN — ruta corregida
  ══════════════════════════════════ */
  btnCerrarSesion.addEventListener("click", () => {
    const ok = confirm("¿Deseas cerrar sesión?");
    if (!ok) return;
    localStorage.removeItem("sesionActiva");
    window.location.href = "../Inciodesesion/Index.html"; // ← ruta exacta de tu carpeta
  });

});