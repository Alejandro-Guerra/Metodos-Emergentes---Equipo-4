document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:3000";

  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) {
    window.location.href = "../Inciodesesion/Index.html";
    return;
  }

  const usuarioId = sesion.id;

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

  const fotoInput = document.getElementById("fotoMascota");
  const previewFoto = document.getElementById("previewFoto");

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
  // 📸 PREVIEW DE IMAGEN
  // =========================
  fotoInput?.addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten imágenes");
        return;
      }

      const reader = new FileReader();

      reader.onload = function(e) {
        previewFoto.src = e.target.result;
        previewFoto.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });

  // =========================
  // 🔄 CARGAR
  // =========================
  async function cargarMascotas() {
    try {
      const res = await fetch(`${API_URL}/mascotas/${usuarioId}`);
      const data = await res.json();
      mascotas = data.mascotas || [];
      render();
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render() {

    const hay = mascotas.length > 0;

    emptyState.style.display = hay ? "none" : "grid";
    listSection.style.display = hay ? "block" : "none";

    mascotasCount.textContent = `${mascotas.length} mascota(s)`;

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
            ${m.foto 
              ? `<img src="${m.foto}" style="width:60px;height:60px;border-radius:50%;">`
              : `<div style="font-size:30px">${getIcono(m.tipo)}</div>`
            }

            <h4>${m.nombre}</h4>

            <p><b>Tipo:</b> ${m.tipo}</p>
            <p><b>Comida:</b> ${m.comida || "No definida"}</p>
            <p><b>Notas:</b> ${m.notas || "Sin notas"}</p>
            <p><b>Última comida:</b> ${ultima}</p>
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
  // 🍖 ACCIONES
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

    let fotoBase64 = "";

    const file = fotoInput.files[0];
    if (file) {
      const reader = new FileReader();
      fotoBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
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
        notas,
        foto: fotoBase64
      })
    });

    backdrop.classList.remove("show");

    nombreInput.value = "";
    tipoInput.value = "";
    comidaInput.value = "";
    notasInput.value = "";
    fotoInput.value = "";
    previewFoto.style.display = "none";

    cargarMascotas();
  });

  // =========================
  // MODAL
  // =========================
  btnAbrirModal.addEventListener("click", () => backdrop.classList.add("show"));
  btnPrimerMascota.addEventListener("click", () => backdrop.classList.add("show"));
  btnCerrarModal.addEventListener("click", () => backdrop.classList.remove("show"));
  btnCancelar.addEventListener("click", () => backdrop.classList.remove("show"));

  cargarMascotas();

});