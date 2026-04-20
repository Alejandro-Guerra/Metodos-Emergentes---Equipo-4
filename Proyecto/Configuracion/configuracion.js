document.addEventListener("DOMContentLoaded", () => {

  /* ── SESIÓN ── */
  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Inciodesesion/Index.html";
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

  /* ── INICIALIZAR UI con datos de sesión ── */
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

btnGuardarNombre.addEventListener("click", async () => {
  const nuevoNombre = inputNombre.value.trim();

  if (!nuevoNombre) {
    errorNombre.classList.add("show");
    inputNombre.focus();
    return;
  }

  errorNombre.classList.remove("show");
  successNombre.classList.remove("show");

  try {
    const usuario = JSON.parse(localStorage.getItem("sesionActiva"));

    const res = await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre_completo: nuevoNombre })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensaje);
    }

    // actualizar UI
    saludoNombre.textContent = `Hola, ${nuevoNombre}`;
    avatarLetra.textContent  = nuevoNombre.charAt(0).toUpperCase() || "A";

    // opcional: mantener sincronizado localStorage
    sesion.nombre = nuevoNombre;
    localStorage.setItem("sesionActiva", JSON.stringify(sesion));

    successNombre.classList.add("show");
    setTimeout(() => successNombre.classList.remove("show"), 3000);

    showToast("✅ Nombre actualizado correctamente");

  } catch (error) {
    console.error(error);
    showToast("❌ Error al actualizar", "error");
  }
});

  // Limpiar error al escribir
  inputNombre.addEventListener("input", () => errorNombre.classList.remove("show"));

  /* ══════════════════════════════════
     MODO OSCURO — persiste en localStorage
  ══════════════════════════════════ */
  function aplicarModoOscuro(activar) {
    document.body.classList.toggle("dark", activar);
    darkToggle.checked = activar;
    localStorage.setItem("modoOscuro", activar ? "true" : "false");
  }

  // Aplicar preferencia guardada al cargar la página
  const modoGuardado = localStorage.getItem("modoOscuro") === "true";
  aplicarModoOscuro(modoGuardado);

  // Escuchar cambios en el toggle
  darkToggle.addEventListener("change", () => {
    aplicarModoOscuro(darkToggle.checked);
    showToast(darkToggle.checked ? "🌙 Modo oscuro activado" : "☀️ Modo claro activado");
  });

  /* ══════════════════════════════════
     CERRAR SESIÓN
  ══════════════════════════════════ */
});
document.addEventListener("DOMContentLoaded", () => {

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  btnCerrarSesion.addEventListener("click", () => {
    const ok = confirm("¿Desea cerrar su sesión?");
    if (!ok) return;

    localStorage.removeItem("sesionActiva");
    window.location.href = "../Inciodesesion/Index.html";
  });

});