const menuMovil = document.querySelector("[data-menu]");

menuMovil.addEventListener("click", (evento) => {
  const enlace = evento.target.closest('a[href^="#"]');
  if (!enlace) return;

  const seccion = document.getElementById(enlace.hash.slice(1));
  if (!seccion) return;

  menuMovil.open = false;
  seccion.tabIndex = -1;
  seccion.focus({ preventScroll: true });
});