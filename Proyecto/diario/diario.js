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
  const btnAbrir   = document.getElementById("btnAbrirModal");
  const btnPrimera = document.getElementById("btnPrimeraEntrada");
  const btnCerrar  = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnGuardar = document.getElementById("btnGuardar");
  const backdrop   = document.getElementById("backdrop");

  const mood     = document.getElementById("mood");
  const texto    = document.getElementById("textoDia");
  const lista    = document.getElementById("listaDia");
  const positivo = document.getElementById("positivoDia");

  const cards = document.getElementById("cards");
  const empty = document.getElementById("emptyState");
  const list  = document.getElementById("listSection");
  const count = document.getElementById("entradasCount");

  /* ── STORAGE ── */
  function obtener() {
    return JSON.parse(localStorage.getItem("diario") || "[]");
  }

  function guardar(data) {
    localStorage.setItem("diario", JSON.stringify(data));
  }

  /* ── MODAL ── */
  function abrir() {
    texto.value = lista.value = positivo.value = "";
    backdrop.classList.add("show");
  }

  function cerrar() { backdrop.classList.remove("show"); }

  btnAbrir.onclick    = abrir;
  btnPrimera.onclick  = abrir;
  btnCerrar.onclick   = cerrar;
  btnCancelar.onclick = cerrar;

  backdrop.addEventListener("click", e => { if (e.target === backdrop) cerrar(); });

  /* ── GUARDAR ── */
  btnGuardar.onclick = () => {
    let data = obtener();
    data.push({
      id:       crypto.randomUUID(),
      mood:     mood.value,
      texto:    texto.value,
      lista:    lista.value,
      positivo: positivo.value,
      fecha:    new Date().toLocaleDateString()
    });
    guardar(data);
    cerrar();
    render();
  };

  /* ── ELIMINAR ── */
  function eliminar(id) {
    if (!confirm("¿Eliminar esta entrada?")) return;
    guardar(obtener().filter(e => e.id !== id));
    render();
  }

  /* ── RENDER ── */
  function render() {
    const data = obtener();
    cards.innerHTML = "";

    if (data.length === 0) {
      empty.style.display = "grid";
      list.style.display  = "none";
    } else {
      empty.style.display = "none";
      list.style.display  = "block";
    }

    count.textContent = data.length + " entradas registradas";

    data.forEach(d => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h4>${d.mood} ${d.fecha}</h4>
        <p><b>Hoy:</b> ${d.texto || "—"}</p>
        <p><b>Importante:</b> ${d.lista || "—"}</p>
        <p><b>Positivo:</b> ${d.positivo || "—"}</p>
        <div class="actions">
          <button class="btn-mini btn-danger" data-id="${d.id}">🗑 Eliminar</button>
        </div>`;

      card.querySelector("button").addEventListener("click", () => eliminar(d.id));
      cards.appendChild(card);
    });
  }

  render();
});
