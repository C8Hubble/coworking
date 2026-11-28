const correoAdmin = "admin@verdecoworking.com";
const claveAdmin = "Admin123";

const formulario = document.getElementById("form-login");
const correo = document.getElementById("correo");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje-login");
const botonMostrar = document.getElementById("mostrar-clave");

botonMostrar.addEventListener("click", () => {
  const claveOculta = clave.type === "password";

  clave.type = claveOculta ? "text" : "password";
  botonMostrar.textContent = claveOculta
    ? "Ocultar contraseña"
    : "Mostrar contraseña";
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const correoIngresado = correo.value.toLowerCase();
  const credencialesValidas =
    correoIngresado === correoAdmin && clave.value === claveAdmin;

  if (!credencialesValidas) {
    mensaje.textContent = "El correo electrónico o la contraseña son incorrectos.";
    return;
  }

  sessionStorage.setItem("sesionVerde", "admin");
  window.location.href = "./reservas.html";
});

