document.addEventListener("DOMContentLoaded", () => {

  /* ── CONFIG API ── */
  const API_URL = "http://localhost:3000";

  /* ── ELEMENTOS ── */
  const tabLogin     = document.getElementById("tabLogin");
  const tabRegister  = document.getElementById("tabRegister");
  const loginForm    = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toast        = document.getElementById("toast");

  // Login
  const loginEmail    = document.getElementById("loginEmail");
  const loginPass     = document.getElementById("loginPass");
  const loginEmailErr = document.getElementById("loginEmailErr");
  const loginPassErr  = document.getElementById("loginPassErr");
  const loginFormErr  = document.getElementById("loginFormErr");

  // Registro
  const regName           = document.getElementById("regName");
  const regEmail          = document.getElementById("regEmail");
  const regPass           = document.getElementById("regPass");
  const regPassConfirm    = document.getElementById("regPassConfirm");
  const regNameErr        = document.getElementById("regNameErr");
  const regEmailErr       = document.getElementById("regEmailErr");
  const regPassErr        = document.getElementById("regPassErr");
  const regPassConfirmErr = document.getElementById("regPassConfirmErr");
  const regFormErr        = document.getElementById("regFormErr");

  const strengthFill  = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthLabel");

  /* ── UTILIDADES ── */
  function showToast(msg, type = "success", duration = 2500) {
    toast.textContent = msg;
    toast.className = `toast show ${type === "error" ? "error-toast" : "success"}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.className = "toast"; }, duration);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function showError(el, msg) {
    if (msg) el.textContent = msg;
    el.classList.add("show");
  }

  function clearErrors(...els) {
    els.forEach(el => el.classList.remove("show"));
  }

function saveSession(user) {
  localStorage.setItem("sesionActiva", JSON.stringify({
    id: user.id,
    nombre: user.nombre,
    email: user.email
  }));
}
  /* ── TABS ── */
  function switchTab(tab) {
    const isLogin = tab === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabRegister.classList.toggle("active", !isLogin);
    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);
    clearErrors(
      loginEmailErr, loginPassErr, loginFormErr,
      regNameErr, regEmailErr, regPassErr, regPassConfirmErr, regFormErr
    );
  }

  tabLogin.addEventListener("click",    () => switchTab("login"));
  tabRegister.addEventListener("click", () => switchTab("register"));

  /* ── TOGGLE CONTRASEÑA ── */
  document.querySelectorAll(".toggle-pass").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "🙈" : "👁️";
    });
  });

  /* ── FUERZA CONTRASEÑA ── */
  regPass.addEventListener("input", () => {
    const val = regPass.value;
    const score = getPasswordScore(val);
    const configs = [
      { pct: 0,   color: "#E2E8F0", label: "Ingresa una contraseña" },
      { pct: 25,  color: "#ef4444", label: "Muy débil" },
      { pct: 50,  color: "#f97316", label: "Débil" },
      { pct: 75,  color: "#eab308", label: "Moderada" },
      { pct: 100, color: "#10B7B3", label: "Fuerte 💪" },
    ];
    const cfg = configs[score];
    strengthFill.style.width      = cfg.pct + "%";
    strengthFill.style.background = cfg.color;
    strengthLabel.textContent     = cfg.label;
    strengthLabel.style.color     = score === 4 ? "var(--primary)" : "var(--muted)";
  });

  function getPasswordScore(pass) {
    if (!pass) return 0;
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  }

  /* ── LOGIN (MongoDB) ── */
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(loginEmailErr, loginPassErr, loginFormErr);

    const email = loginEmail.value.trim();
    const pass  = loginPass.value;
    let valid = true;

    if (!email || !isValidEmail(email)) { showError(loginEmailErr); valid = false; }
    if (!pass)                           { showError(loginPassErr);  valid = false; }
    if (!valid) return;

    try {
      const resp = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_electronico: email,
          contraseña: pass
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        showError(loginFormErr, data.mensaje || "Error al iniciar sesión.");
        return;
      }

saveSession({
  id: data.usuario.id,
  nombre: data.usuario.nombre,
  email: data.usuario.email
});
      showToast(`👋 ¡Hola de nuevo, ${data.usuario.nombre.split(" ")[0]}!`);
      setTimeout(() => { window.location.href = "../Mishabitos/Index.html"; }, 1800);

    } catch (err) {
      showError(loginFormErr, "No se pudo conectar al servidor. ¿Está encendido el backend?");
    }
  });

  /* ── REGISTRO (MongoDB) ── */
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(regNameErr, regEmailErr, regPassErr, regPassConfirmErr, regFormErr);

    const nombre  = regName.value.trim();
    const email   = regEmail.value.trim();
    const pass    = regPass.value;
    const passC   = regPassConfirm.value;
    let valid = true;

    if (!nombre)                             { showError(regNameErr);  valid = false; }
    if (!email || !isValidEmail(email))      { showError(regEmailErr, "Ingresa un correo válido."); valid = false; }
    if (!pass || pass.length < 6)            { showError(regPassErr);  valid = false; }
    if (!passC || passC !== pass)            { showError(regPassConfirmErr, "Las contraseñas no coinciden."); valid = false; }
    if (!valid) return;

    try {
      const resp = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: nombre,
          correo_electronico: email,
          contraseña: pass,
          confirmar_contraseña: passC
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        showError(regFormErr, data.mensaje || "Error al registrar.");
        return;
      }

saveSession({
  id: data.usuario.id,
  nombre,
  email
});
      registerForm.reset();
      strengthFill.style.width  = "0%";
      strengthLabel.textContent = "Ingresa una contraseña";

      showToast(`🎉 ¡Cuenta creada! Bienvenido, ${nombre.split(" ")[0]}`);
      setTimeout(() => { window.location.href = "../Mishabitos/Index.html"; }, 1800);

    } catch (err) {
      showError(regFormErr, "No se pudo conectar al servidor. ¿Está encendido el backend?");
    }
  });

  /* ── Limpiar error al escribir ── */
  [
    [loginEmail, loginEmailErr],
    [loginPass,  loginPassErr],
    [regName,    regNameErr],
    [regEmail,   regEmailErr],
    [regPass,    regPassErr],
    [regPassConfirm, regPassConfirmErr],
  ].forEach(([input, err]) => {
    input.addEventListener("input", () => err.classList.remove("show"));
  });

});
