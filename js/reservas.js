const API_URL = 'http://localhost:3000';

const tbodyReservas = document.getElementById('reservas');
const inputBuscador = document.getElementById('buscador');
const selectEspacios = document.getElementById('espacios');
const botonesTabs = document.querySelectorAll('[role="tab"]');


let todasLasReservas = [];
let todasLasSalas = [];
let filtroEstado = 'todas'; 

async function cargarDatos() {
  try {
    const [resReservas, resSalas] = await Promise.all([
      fetch(`${API_URL}/reservas`),
      fetch(`${API_URL}/salas`)
    ]);

    if (!resReservas.ok || !resSalas.ok) throw new Error('Error al conectar con el servidor');

    todasLasReservas = await resReservas.json();
    todasLasSalas = await resSalas.json();

    llenarSelectEspacios();
    actualizarContadoresTabs();

    // Pintar la tabla por primera vez
    aplicarFiltros();

  } catch (error) {
    console.error('Error:', error);
    tbodyReservas.innerHTML = `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-red-500 font-semibold">
          No se pudieron cargar las reservas. Verifica que json-server esté corriendo.
        </td>
      </tr>
    `;
  }
}

// 2. LLENAR EL SELECT CON LAS SALAS REALES DEL DB.JSON
function llenarSelectEspacios() {
  selectEspacios.innerHTML = '<option value="">Todos los espacios</option>';
  todasLasSalas.forEach((sala) => {
    selectEspacios.innerHTML += `<option value="${sala.id}">${sala.titulo}</option>`;
  });
}

// 3. ACTUALIZAR LOS NÚMEROS EN LAS PESTAÑAS (Todas * X, Confirmadas * Y...)
function actualizarContadoresTabs() {
  const total = todasLasReservas.length;
  const confirmadas = todasLasReservas.filter((r) => r.estado === true).length;
  const canceladas = todasLasReservas.filter((r) => r.estado === false).length;

  botonesTabs[0].textContent = `Todas * ${total}`;
  botonesTabs[1].textContent = `Confirmadas * ${confirmadas}`;
  botonesTabs[2].textContent = `Canceladas * ${canceladas}`;
}

// 4. LÓGICA DE FILTRADO COMBINADO
function aplicarFiltros() {
  const textoBusqueda = inputBuscador.value.toLowerCase().trim();
  const salaSeleccionada = selectEspacios.value;

  const reservasFiltradas = todasLasReservas.filter((reserva) => {
    // Filtro A: Por pestaña de estado
    if (filtroEstado === 'confirmadas' && !reserva.estado) return false;
    if (filtroEstado === 'canceladas' && reserva.estado) return false;

    // Filtro B: Por sala seleccionada en el <select>
    if (salaSeleccionada !== '' && reserva.salaId !== salaSeleccionada) {
      return false;
    }

    // Filtro C: Por texto en el buscador (busca por cliente, correo o nombre de sala)
    if (textoBusqueda !== '') {
      const sala = todasLasSalas.find((s) => s.id === reserva.salaId);
      const nombreSala = sala ? sala.titulo.toLowerCase() : '';
      const cliente = reserva.Cliente.toLowerCase();
      const correo = reserva.Correo.toLowerCase();

      const coincide =
        cliente.includes(textoBusqueda) ||
        correo.includes(textoBusqueda) ||
        nombreSala.includes(textoBusqueda);

      if (!coincide) return false;
    }

    return true; // Si pasa todos los filtros, se incluye en la tabla
  });

  renderizarTabla(reservasFiltradas);
}

// 5. PINTAR LA TABLA EN EL HTML
function renderizarTabla(listaReservas) {
  tbodyReservas.innerHTML = '';

  // Mensaje amigable si ningún registro coincide con la búsqueda
  if (listaReservas.length === 0) {
    tbodyReservas.innerHTML = `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-(--muted-foreground)">
          No se encontraron reservas con los filtros seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  listaReservas.forEach((reserva) => {
    const salaEncontrada = todasLasSalas.find((sala) => sala.id === reserva.salaId);
    const nombreSala = salaEncontrada ? salaEncontrada.titulo : 'Espacio no asignado';
    const categoriaSala = salaEncontrada ? salaEncontrada.categoria : '';

    const badgeEstado = reserva.estado
      ? `<span class="inline-flex items-center bg-status-available/15 text-status-available gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold">Confirmado</span>`
      : `<span class="inline-flex items-center bg-(--muted) text-(--muted-foreground) gap-1.5 rounded-full border border-(--border) px-2.5 py-1 text-xs font-bold">Cancelado</span>`;

    // Solo mostrar botón cancelar si está confirmada
    const botonCancelar = reserva.estado
      ? `<button data-id="${reserva.id}" class="btn-cancelar grid size-9 cursor-pointer place-items-center rounded-3xl border border-(--border) bg-card text-destructive transition-all hover:translate-y-0.5" title="Cancelar reserva">
            <i class="fa-regular fa-circle-xmark"></i>
          </button>`
      : '';

    tbodyReservas.innerHTML += `
      <tr class="border-b border-(--border) transition-colors last:border-0 hover:bg-surface">
        <td class="px-5 py-3">
          <p class="font-bold">${reserva.Cliente}</p>
          <p class="text-xs text-(--muted-foreground)">${reserva.Correo}</p>
        </td>
        <td class="px-5 py-3">
          <p class="font-bold">${nombreSala}</p>
          <p class="text-xs text-(--muted-foreground)">${categoriaSala}</p>
        </td>
        <td class="px-5 py-3 font-semibold">
          <p>${reserva.fecha}</p>
        </td>
        <td class="px-5 py-3">
          <p class="font-semibold">${reserva.jornada}</p>
          <p class="text-xs text-muted-foreground">${reserva['hora-entrada']} – ${reserva['hora-final']}</p>
        </td>
        <td class="px-5 py-3 font-display font-bold">${reserva.cupos}</td>
        <td class="px-5 py-3">${badgeEstado}</td>
        <td class="px-5 py-3">
          <div class="flex justify-end gap-1.5">
            <button data-id="${reserva.id}" class="btn-ver grid size-9 cursor-pointer place-items-center rounded-3xl border border-(--border) bg-card hover:translate-y-0.5" title="Ver detalles">
              <i class="fa-regular fa-eye"></i>
            </button>
            ${botonCancelar}
          </div>
        </td>
      </tr>
    `;
  });
}

// 6. EVENTOS DE LOS FILTROS
// Evento al escribir en el buscador
inputBuscador.addEventListener('input', aplicarFiltros);

// Evento al cambiar el select de espacios
selectEspacios.addEventListener('change', aplicarFiltros);

// Eventos al hacer clic en las pestañas (Todas, Confirmadas, Canceladas)
const estadosPorIndice = ['todas', 'confirmadas', 'canceladas'];

botonesTabs.forEach((boton, index) => {
  boton.addEventListener('click', () => {
    // Actualizar qué pestaña está seleccionada visualmente
    botonesTabs.forEach((b) => {
      b.setAttribute('aria-selected', 'false');
      b.classList.remove('bg-card', 'shadow-soft');
    });
    boton.setAttribute('aria-selected', 'true');
    boton.classList.add('bg-card', 'shadow-soft');

    // Cambiar el filtro de estado y volver a filtrar la tabla
    filtroEstado = estadosPorIndice[index];
    aplicarFiltros();
  });
});

// Arrancar la aplicación
document.addEventListener('DOMContentLoaded', cargarDatos);

const modalDetalle = document.getElementById('modal-detalle');
const btnCerrarX = document.getElementById('btn-cerrar-x');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnModalCancelar = document.getElementById('modal-btn-cancelar');

// Detectar clic en los botones de la tabla usando delegación de eventos
tbodyReservas.addEventListener('click', (e) => {
  // .closest() asegura que funcione si hacen clic en el botón o en el ícono <i> adentro
  const botonVer = e.target.closest('.btn-ver');

  if (botonVer) {
    const idReserva = botonVer.dataset.id;
    abrirModalDetalle(idReserva);
  }
});

// Función para llenar los datos y abrir el modal
function abrirModalDetalle(idReserva) {
  // 1. Buscar la reserva y su sala en los arreglos que ya tenemos en memoria
  const reserva = todasLasReservas.find((r) => r.id === idReserva);
  if (!reserva) return;

  const sala = todasLasSalas.find((s) => s.id === reserva.salaId);
  const nombreSala = sala ? sala.titulo : 'Espacio no asignado';

  // 2. Llenar los textos del modal
  document.getElementById('modal-codigo').textContent = `RESERVA RES-100${reserva.id}`;
  document.getElementById('modal-sala').textContent = nombreSala;
  document.getElementById('modal-creacion').textContent = reserva.fechaRegistro
    ? `Registrada el ${reserva.fechaRegistro}`
    : 'Detalle de la reservación';

  document.getElementById('modal-cliente').textContent = reserva.Cliente;
  document.getElementById('modal-correo').textContent = reserva.Correo;
  document.getElementById('modal-fecha').textContent = reserva.fecha;
  document.getElementById('modal-jornada').textContent = `${reserva.jornada} · ${reserva['hora-entrada']} – ${reserva['hora-final']}`;
  document.getElementById('modal-cupos').textContent = reserva.cupos;

  // 3. Pintar el badge de estado (Confirmada vs Cancelada)
  const contenedorBadge = document.getElementById('modal-badge');
  if (reserva.estado) {
    contenedorBadge.innerHTML = `
      <span class="inline-flex items-center gap-2 rounded-full bg-status-available/15 px-3.5 py-1 text-xs font-bold text-status-available">
        <span class="size-2 rounded-full bg-current"></span>
        Confirmada
      </span>
    `;
    // Mostrar botón "Cancelar reserva" y pasarle el ID de esta reserva
    btnModalCancelar.classList.remove('hidden');
    btnModalCancelar.dataset.id = reserva.id;
  } else {
    contenedorBadge.innerHTML = `
      <span class="inline-flex items-center gap-2 rounded-full bg-(--muted) px-3.5 py-1 text-xs font-bold text-(--muted-foreground)">
        <span class="size-2 rounded-full bg-current"></span>
        Cancelada
      </span>
    `;
    // Ocultar botón "Cancelar reserva" si ya está cancelada
    btnModalCancelar.classList.add('hidden');
  }

  // 4. Abrir el modal nativo
  modalDetalle.showModal();
}

// Eventos para cerrar el modal (Botón X, Botón Cerrar, o clic fuera en el fondo oscuro)
btnCerrarX.addEventListener('click', () => modalDetalle.close());
btnCerrarModal.addEventListener('click', () => modalDetalle.close());

modalDetalle.addEventListener('click', (e) => {
  if (e.target === modalDetalle) {
    modalDetalle.close();
  }
});

// ==========================================
// 8. LÓGICA DEL MODAL DE CANCELACIÓN Y FETCH PATCH
// ==========================================
const modalCancelar = document.getElementById('modal-cancelar');
const textoModalCancelar = document.getElementById('modal-cancelar-texto');
const btnAbortarCancelacion = document.getElementById('btn-abortar-cancelacion');
const btnConfirmarCancelacion = document.getElementById('btn-confirmar-cancelacion');

let idReservaACancelar = null;

// A. Detectar clic en el botón de la equis (.btn-cancelar) dentro de la tabla
tbodyReservas.addEventListener('click', (e) => {
  const botonCancelarTabla = e.target.closest('.btn-cancelar');
  if (botonCancelarTabla) {
    prepararCancelacion(botonCancelarTabla.dataset.id);
  }
});

// B. Detectar clic en el botón "Cancelar reserva" dentro del modal de detalle
btnModalCancelar.addEventListener('click', () => {
  const idDesdeDetalle = btnModalCancelar.dataset.id;
  modalDetalle.close(); // Cerramos el modal de detalle primero
  prepararCancelacion(idDesdeDetalle);
});

// C. Llenar los datos dinámicos y abrir el modal de confirmación
function prepararCancelacion(idReserva) {
  const reserva = todasLasReservas.find((r) => r.id === idReserva);
  if (!reserva) return;

  const sala = todasLasSalas.find((s) => s.id === reserva.salaId);
  const nombreSala = sala ? sala.titulo : 'el espacio asignado';

  // Guardamos el ID en nuestra variable global
  idReservaACancelar = idReserva;

  // Insertamos el mensaje exactamente como en tu diseño
  textoModalCancelar.innerHTML = `
    La reserva de <strong class="font-bold text-gray-900">${reserva.Cliente}</strong> en ${nombreSala} quedará cancelada y se liberarán ${reserva.cupos} cupo(s).
  `;

  modalCancelar.showModal();
}

// D. Ejecutar los PATCH en json-server al confirmar
btnConfirmarCancelacion.addEventListener('click', async () => {
  if (!idReservaACancelar) return;

  const reserva = todasLasReservas.find((r) => r.id === idReservaACancelar);
  const sala = todasLasSalas.find((s) => s.id === reserva.salaId);

  try {
    // Deshabilitar botón mientras guarda para evitar doble clic
    btnConfirmarCancelacion.disabled = true;
    btnConfirmarCancelacion.textContent = 'Cancelando...';

    // 1. Cambiar estado de la reserva a false (PATCH)
    const resReserva = await fetch(`${API_URL}/reservas/${reserva.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: false })
    });

    if (!resReserva.ok) throw new Error('No se pudo cancelar la reserva');

    // 2. Devolver los cupos liberados a la sala (PATCH)
    if (sala) {
      // Nos aseguramos de no superar la capacidad máxima de la sala
      const nuevosCuposDisponibles = Math.min(sala.capacidad, sala.disponible + Number(reserva.cupos));

      await fetch(`${API_URL}/salas/${sala.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponible: nuevosCuposDisponibles })
      });

      // Actualizar también en nuestra memoria local
      sala.disponible = nuevosCuposDisponibles;
    }

    // 3. Actualizar la reserva en memoria local, cerrar modal y refrescar vista
    reserva.estado = false;
    modalCancelar.close();
    actualizarContadoresTabs(); // Actualiza los números de "Confirmadas * X" y "Canceladas * Y"
    aplicarFiltros(); // Vuelve a pintar la tabla ocultando la equis de esa fila

  } catch (error) {
    console.error('Error al cancelar:', error);
    alert('Ocurrió un error al intentar cancelar la reserva.');
  } finally {
    // Restaurar botón
    btnConfirmarCancelacion.disabled = false;
    btnConfirmarCancelacion.textContent = 'Sí, cancelar reserva';
    idReservaACancelar = null;
  }
});

// E. Cerrar modal sin hacer cambios
btnAbortarCancelacion.addEventListener('click', () => {
  idReservaACancelar = null;
  modalCancelar.close();
});

modalCancelar.addEventListener('click', (e) => {
  if (e.target === modalCancelar) {
    idReservaACancelar = null;
    modalCancelar.close();
  }
});
