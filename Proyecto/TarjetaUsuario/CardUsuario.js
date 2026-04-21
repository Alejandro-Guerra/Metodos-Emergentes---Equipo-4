document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("btnVolver");
  const btnGuardar = document.getElementById("btnGuardar");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnCambiarFoto = document.getElementById("btnCambiarFoto");
  const inputFoto = document.getElementById("inputFoto");
  const fotoPerfil = document.getElementById("fotoPerfil");
  const fotoPlaceholder = document.getElementById("fotoPlaceholder");

  const nombreCompleto = document.getElementById("nombreCompleto");
  const nombreUsuario = document.getElementById("nombreUsuario");
  const edad = document.getElementById("edad");
  const telefono = document.getElementById("telefono");
  const direccion = document.getElementById("direccion");
  const correoSeleccionado = document.getElementById("correoSeleccionado");
  const familiaNombre = document.getElementById("familiaNombre");

  const btnAgregarMiembro = document.getElementById("btnAgregarMiembro");
  const nuevoMiembro = document.getElementById("nuevoMiembro");
  const familyList = document.getElementById("familyList");

  function obtenerTarjetaUsuario() {
    try {
      return JSON.parse(localStorage.getItem("tarjetaUsuario")) || {
        nombreCompleto: "",
        nombreUsuario: "",
        edad: "",
        telefono: "",
        direccion: "",
        correoSeleccionado: "",
        familiaNombre: "",
        miembrosFamilia: [],
        foto: ""
      };
    } catch {
      return {
        nombreCompleto: "",
        nombreUsuario: "",
        edad: "",
        telefono: "",
        direccion: "",
        correoSeleccionado: "",
        familiaNombre: "",
        miembrosFamilia: [],
        foto: ""
      };
    }
  }

  function guardarTarjetaUsuario(data) {
    localStorage.setItem("tarjetaUsuario", JSON.stringify(data));
  }

  function cargarDatos() {
    const data = obtenerTarjetaUsuario();

    nombreCompleto.value = data.nombreCompleto || "";
    nombreUsuario.value = data.nombreUsuario || "";
    edad.value = data.edad || "";
    telefono.value = data.telefono || "";
    direccion.value = data.direccion || "";
    correoSeleccionado.value = data.correoSeleccionado || "";
    familiaNombre.value = data.familiaNombre || "";

    if (data.foto) {
      fotoPerfil.src = data.foto;
      fotoPerfil.style.display = "block";
      fotoPlaceholder.style.display = "none";
    } else {
      fotoPerfil.style.display = "none";
      fotoPlaceholder.style.display = "grid";
    }

    renderMiembros(data.miembrosFamilia || []);
  }

  function renderMiembros(miembros) {
    familyList.innerHTML = "";

    if (miembros.length === 0) {
      familyList.innerHTML = `<li class="family-item">No hay integrantes agregados.</li>`;
      return;
    }

    miembros.forEach((nombre, index) => {
      const li = document.createElement("li");
      li.className = "family-item";
      li.innerHTML = `
        <span>${nombre}</span>
        <button class="btn-delete" type="button" data-index="${index}">🗑️</button>
      `;
      familyList.appendChild(li);
    });
  }

  function guardarFormulario() {
    const actual = obtenerTarjetaUsuario();

    const data = {
      ...actual,
      nombreCompleto: nombreCompleto.value.trim(),
      nombreUsuario: nombreUsuario.value.trim(),
      edad: edad.value.trim(),
      telefono: telefono.value.trim(),
      direccion: direccion.value.trim(),
      correoSeleccionado: correoSeleccionado.value.trim(),
      familiaNombre: familiaNombre.value.trim()
    };

    guardarTarjetaUsuario(data);
    alert("Tarjeta de usuario guardada correctamente.");
  }

  function agregarMiembro() {
    const nombre = nuevoMiembro.value.trim();
    if (!nombre) return;

    const data = obtenerTarjetaUsuario();
    data.miembrosFamilia = data.miembrosFamilia || [];
    data.miembrosFamilia.push(nombre);

    guardarTarjetaUsuario(data);
    nuevoMiembro.value = "";
    renderMiembros(data.miembrosFamilia);
  }

  function eliminarMiembro(index) {
    const data = obtenerTarjetaUsuario();
    data.miembrosFamilia.splice(index, 1);
    guardarTarjetaUsuario(data);
    renderMiembros(data.miembrosFamilia);
  }

  btnVolver?.addEventListener("click", () => {
    window.history.back();
  });

  btnCancelar?.addEventListener("click", () => {
    cargarDatos();
  });

  btnGuardar?.addEventListener("click", guardarFormulario);

  btnCambiarFoto?.addEventListener("click", () => {
    inputFoto.click();
  });

  inputFoto?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const data = obtenerTarjetaUsuario();
      data.foto = event.target.result;
      guardarTarjetaUsuario(data);

      fotoPerfil.src = data.foto;
      fotoPerfil.style.display = "block";
      fotoPlaceholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  });

  btnAgregarMiembro?.addEventListener("click", agregarMiembro);

  familyList?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    eliminarMiembro(Number(btn.dataset.index));
  });

  cargarDatos();
});