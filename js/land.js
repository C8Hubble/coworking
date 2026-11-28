const espacios = [
  {
    nombre: "Invernadero Norte",
    tipo: "Sala de trabajo",
    descripcion: "Un espacio silencioso bajo techo de cristal, ideal para concentrarse y desarrollar proyectos con luz natural todo el día.",
    capacidad: 12,
    cupos: 8,
    estado: "disponible",
    imagen: "./img/invernadero-norte.jpg"
  },
  {
    nombre: "Sala Bambú",
    tipo: "Sala de reuniones",
    descripcion: "Sala de reuniones con vista al jardín tropical, pantalla y mesa de madera para sesiones de equipo y presentaciones.",
    capacidad: 10,
    cupos: 0,
    estado: "ocupado",
    imagen: "./img/sala-bambu.jpg"
  },
  {
    nombre: "Terraza Jardín",
    tipo: "Zona colaborativa",
    descripcion: "Zona colaborativa al aire libre bajo una pérgola de enredaderas. Perfecta para crear, conversar y conectar.",
    capacidad: 24,
    cupos: 15,
    estado: "disponible",
    imagen: "./img/terraza-jardin.jpg"
  },
  {
    nombre: "Cabina Musgo",
    tipo: "Escritorio individual",
    descripcion: "Cabina individual con muro de musgo natural y luz cálida. Silencio total para llamadas y trabajo profundo.",
    capacidad: 1,
    cupos: 1,
    estado: "disponible",
    imagen: "./img/cabina-musgo.jpg"
  },
  {
    nombre: "Estudio Bosque",
    tipo: "Sala de trabajo",
    descripcion: "Gran estudio con tragaluces y árboles interiores. Mesas compartidas para equipos que necesitan amplitud.",
    capacidad: 20,
    cupos: 0,
    estado: "mantenimiento",
    imagen: "./img/estudio-bosque.jpg"
  },
  {
    nombre: "Taller Raíces",
    tipo: "Sala de reuniones",
    descripcion: "Sala creativa con mesa redonda, tablero y ventanal al bosque. Pensada para talleres y lluvias de ideas.",
    capacidad: 8,
    cupos: 3,
    estado: "disponible",
    imagen: "./img/taller-raices.jpg"
  }
];

const API_URL = "http://localhost:3000";

const estadosEspacio = {
  disponible: {
    etiqueta: "Disponible",
    boton: "Reservar espacio ↗",
    aviso: ""
  },
  ocupado: {
    etiqueta: "Ocupado",
    boton: "Sin cupos disponibles",
    aviso: "Actualmente no hay cupos disponibles en esta sala."
  },
  mantenimiento: {
    etiqueta: "Mantenimiento",
    boton: "En mantenimiento",
    aviso: "Estamos cuidando este espacio. Las reservas volverán pronto."
  }
};

const listaEspacios = document.getElementById("lista-espacios");
const plantillaEspacio = document.getElementById("tarjeta-espacio");
const resultadoEspacios = document.getElementById("resultado-espacios");
const botonesFiltro = document.querySelectorAll("#filtros-espacios button");
const modalReserva = document.getElementById("modal-reserva");
const formularioReserva = document.getElementById("form-reserva");
const mensajeReserva = document.getElementById("mensaje-reserva");
let espacioSeleccionado = null;

const reservasGuardadas = () =>
  JSON.parse(localStorage.getItem("reservasVerde") || "[]");

function abrirModalReserva(espacio) {
  espacioSeleccionado = espacio;

  document.getElementById("modal-imagen").src = espacio.imagen;
  document.getElementById("modal-imagen").alt = `Imagen de ${espacio.nombre}`;
  document.getElementById("modal-tipo").textContent = espacio.tipo;
  document.getElementById("modal-nombre").textContent = espacio.nombre;
  document.getElementById("modal-descripcion").textContent = espacio.descripcion;
  document.getElementById("modal-capacidad").textContent = `${espacio.capacidad} personas`;
  document.getElementById("modal-cupos").textContent = `${espacio.cupos} cupos`;

  const campoCupos = document.getElementById("reserva-cupos");
  campoCupos.max = espacio.cupos;
  campoCupos.value = 1;
  document.getElementById("reserva-fecha").min = new Date().toISOString().split("T")[0];
  mensajeReserva.textContent = "";
  formularioReserva.reset();
  campoCupos.value = 1;
  modalReserva.showModal();
}

function cerrarModalReserva() {
  modalReserva.close();
  formularioReserva.reset();
  espacioSeleccionado = null;
}

function filtrarEspacios(filtro) {
  if (filtro === "todos") {
    return espacios;
  }

  return espacios.filter((espacio) => espacio.estado === filtro);
}

function crearTarjeta(espacio) {
  const tarjeta = plantillaEspacio.content.cloneNode(true);
  const estado = estadosEspacio[espacio.estado];

  // Tailwind usa este atributo para cambiar el color de los cupos y la barra.
  tarjeta.querySelector("article").dataset.estado = espacio.estado;

  const imagen = tarjeta.querySelector("img");

  imagen.addEventListener("error", () => {
    imagen.classList.add("hidden");
  });

  imagen.src = espacio.imagen;

  const etiqueta = tarjeta.querySelector("[data-etiqueta-estado]");
  etiqueta.dataset.estado = espacio.estado;
  etiqueta.textContent = estado.etiqueta;

  tarjeta.querySelector("[data-tipo]").textContent = espacio.tipo;
  tarjeta.querySelector("[data-nombre]").textContent = espacio.nombre;
  tarjeta.querySelector("[data-descripcion]").textContent = espacio.descripcion;

  const unidadCapacidad = espacio.capacidad === 1 ? "persona" : "personas";
  const unidadCupos = espacio.cupos === 1 ? "cupo" : "cupos";

  tarjeta.querySelector("[data-capacidad]").textContent =
    `${espacio.capacidad} ${unidadCapacidad}`;

  tarjeta.querySelector("[data-cupos]").textContent =
    `${espacio.cupos} ${unidadCupos}`;

  // Ejemplo: 4 puestos ocupados de 12 se muestran como 33 %.
  const puestosOcupados = espacio.capacidad - espacio.cupos;
  const ocupacion = Math.round((puestosOcupados / espacio.capacidad) * 100);

  tarjeta.querySelector("[data-porcentaje]").textContent =
    `${ocupacion}% de ocupación`;

  const medidor = tarjeta.querySelector("[data-medidor]");
  medidor.setAttribute("aria-valuenow", ocupacion);
  tarjeta.querySelector("[data-barra]").style.width = `${ocupacion}%`;

  tarjeta.querySelector("[data-ocupacion]").hidden =
    espacio.estado === "mantenimiento";

  const aviso = tarjeta.querySelector("[data-aviso]");
  aviso.textContent = estado.aviso;
  aviso.hidden = estado.aviso === "";

  const botonReserva = tarjeta.querySelector("[data-reservar]");
  botonReserva.dataset.estado = espacio.estado;
  botonReserva.textContent = estado.boton;
  botonReserva.disabled = espacio.estado !== "disponible";
  botonReserva.addEventListener("click", () => abrirModalReserva(espacio));

  return tarjeta;
}

function mostrarEspacios(filtro) {
  const espaciosFiltrados = filtrarEspacios(filtro);
  const tarjetas = espaciosFiltrados.map(crearTarjeta);

  listaEspacios.replaceChildren(...tarjetas);
  resultadoEspacios.textContent = `Espacios mostrados: ${tarjetas.length}.`;
}

botonesFiltro.forEach((boton) => {
  const filtro = boton.dataset.filtro;
  boton.querySelector("[data-conteo]").textContent = filtrarEspacios(filtro).length;

  boton.addEventListener("click", () => {
    botonesFiltro.forEach((otroBoton) => {
      otroBoton.setAttribute("aria-pressed", otroBoton === boton);
    });

    mostrarEspacios(filtro);
  });
});

document.getElementById("cerrar-modal-reserva").addEventListener("click", cerrarModalReserva);
document.getElementById("cancelar-reserva").addEventListener("click", cerrarModalReserva);

modalReserva.addEventListener("click", (evento) => {
  if (evento.target === modalReserva) {
    cerrarModalReserva();
  }
});

formularioReserva.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (!espacioSeleccionado) return;

  const datosFormulario = new FormData(formularioReserva);
  const cupos = Number(datosFormulario.get("cupos"));

  if (cupos < 1 || cupos > espacioSeleccionado.cupos) {
    mensajeReserva.textContent = `Solo hay ${espacioSeleccionado.cupos} cupos disponibles.`;
    return;
  }

  const jornadaSeleccionada = datosFormulario.get("jornada");
  const partesJornada = jornadaSeleccionada.split(" · ");
  const horario = partesJornada[1] || "";
  const [horaEntrada, horaFinal] = horario.split(" – ");
  const indiceEspacio = espacios.indexOf(espacioSeleccionado);

  // Este formato coincide con el recurso "reservas" de db.json.
  const reserva = {
    id: crypto.randomUUID(),
    salaId: String(indiceEspacio + 1),
    Cliente: datosFormulario.get("nombre"),
    Correo: datosFormulario.get("correo"),
    fecha: datosFormulario.get("fecha"),
    cupos,
    jornada: partesJornada[0],
    "hora-entrada": horaEntrada || "",
    "hora-final": horaFinal || "",
    estado: true,
    fechaRegistro: new Date().toISOString()
  };

  const botonEnviar = formularioReserva.querySelector("[type='submit']");
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Guardando...";
  mensajeReserva.textContent = "";

  try {
    const respuesta = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva)
    });

    if (!respuesta.ok) throw new Error("No se pudo guardar la reserva");

    const reservaGuardada = await respuesta.json();
    localStorage.setItem("reservasVerde", JSON.stringify([...reservasGuardadas(), reservaGuardada]));
    cerrarModalReserva();
    alert("Reserva guardada correctamente.");
  } catch (error) {
    console.error(error);
    mensajeReserva.textContent = "No se pudo guardar. Verifica que json-server esté ejecutándose en el puerto 3000.";
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Confirmar reserva";
  }
});

mostrarEspacios("todos");
