document.addEventListener("DOMContentLoaded", () => {

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const btnLogin = document.getElementById("btnLogin");

  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");
  const errorGlobal = document.getElementById("errorGlobal");

  // Usuario simulado (como si viniera de base de datos)
  const usuarioRegistrado = {
    email: "admin@demo.com",
    password: encriptar("123456")
  };

  function encriptar(texto) {
    // Simulación de encriptación
    return btoa(texto);
  }

  function validarCampos(email, password) {
    let valido = true;

    if (!email) {
      errorEmail.classList.add("show");
      valido = false;
    } else {
      errorEmail.classList.remove("show");
    }

    if (!password) {
      errorPassword.classList.add("show");
      valido = false;
    } else {
      errorPassword.classList.remove("show");
    }

    return valido;
  }

  btnLogin.addEventListener("click", () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    errorGlobal.classList.remove("show");

    if (!validarCampos(email, password)) return;

    const passwordEncriptada = encriptar(password);

    if (
      email === usuarioRegistrado.email &&
      passwordEncriptada === usuarioRegistrado.password
    ) {

      // Guardar sesión
      localStorage.setItem("usuarioActivo", email);

      // Redirigir al sistema
      window.location.href = "../Mishabitos/Index.html";

    } else {
      errorGlobal.classList.add("show");
    }

  });

});
