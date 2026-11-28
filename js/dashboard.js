const host = "http://localhost:3000"
const modal = document.getElementById('modalEspacio')
let salas = []
let filtroEstado = 'todos'

const buscarInput = document.getElementById('buscarInput')

buscarInput.addEventListener('input', aplicarFiltros)

function listar(salas) {
    const tabla = document.getElementById('tabla-espacios')
    tabla.innerHTML = ''
    salas.forEach(sala => {
        tabla.innerHTML += `                        <tr>
                            <td>${sala.titulo}</td>
                            <td>${sala.disponible}</td>
                            <td>${sala.capacidad}</td>
                            <td>${sala.disponible}</td>
                            <td>                       
                        <button onclick="borrar('${sala.id}')">Eliminar</button>
                        <button onclick="updateForm('${sala.id}')">Editar</button></td>
                        </tr>`
    });
}

async function getSalas(host) {
    try {
        const res = await fetch(`${host}/salas`)
        const data = await res.json()
        return data
    } catch (e) {
        console.error("error: " + e)
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    salas = await getSalas(host)
    if (!Array.isArray(salas)) {
        console.error('No se pudieron cargar las salas para calcular las métricas')
        return
    }

    actualizarMetricas(salas)
    aplicarFiltros()


})

async function deleteSala(host, id) {
    try {
        const res = await fetch(`${host}/salas/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            console.log('DELETE: Recurso eliminado');

            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        } else {
            console.error('DELETE falló');
        }
    } catch (error) {
        console.error('Error en DELETE:', error);
    }
}

async function borrar(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteSala(host, id)
        }
    });
}

async function updateSala(host, sala) {
    try {
        const res = await fetch(`${host}/salas/${sala.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sala)
        })

        if (res.ok) {
            console.log('PUT: Recurso actualizado');

        } else {
            console.error('PUT falló');
        }
    } catch (error) {
        console.error(error)

    }

}

async function createSala(host, sala) {
    try {
        const res = await fetch(`${host}/salas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sala)
        })

        if (res.ok) {
            console.log('POST: Recurso creado');

        } else {
            console.error('POST falló');
        }
    } catch (error) {
        console.error(error)

    }

}

function abrirModal() {
    modal.showModal()
}

function cerrarModal() {
    modal.close()
}

document.getElementById('btnNuevoEspacio').addEventListener('click', createForm)

document.getElementById('estado').addEventListener('change', event => {
    const estado = event.currentTarget.value
    const inputDisponible = document.getElementById('disponible')
    const inputCapacidad = document.getElementById('capacidad')

    if (estado === '2') {
        inputDisponible.value = '0'
    } else if (estado === '1' && Number(inputDisponible.value) === 0) {
        inputDisponible.value = inputCapacidad.value
    }
})

function createForm() {

    const form = document.getElementById('formNuevoEspacio')
    const inputNombre = document.getElementById('nombre')
    const inputDescripcion = document.getElementById('descripcion')
    const selectTipo = document.getElementById('tipo')
    const selectEstado = document.getElementById('estado')
    const inputCapacidad = document.getElementById('capacidad')
    const inputDisponible = document.getElementById('disponible')
    const inputImagen = document.getElementById('imagen')
    const imgPreview = document.getElementById('previewImagen')
    const tituloModal = modal.querySelector('h2')

    tituloModal.innerText = 'Crear sala'

    abrirModal()


    form.onsubmit = (e) => {
        e.preventDefault()
        const sala = {
            titulo: inputNombre.value,
            descripcion: inputDescripcion.value,
            categoria: selectTipo.value,
            estado: Number(selectEstado.value),
            capacidad: Number(inputCapacidad.value),
            disponible: Number(inputDisponible.value),
            img: inputImagen.value
        }



        createSala(host, sala)
    }

}


function updateForm(id) {
    const sala = salas.find(s => String(s.id) === String(id))
    if (!sala) return

    const form = document.getElementById('formNuevoEspacio')
    const inputNombre = document.getElementById('nombre')
    const inputDescripcion = document.getElementById('descripcion')
    const selectTipo = document.getElementById('tipo')
    const selectEstado = document.getElementById('estado')
    const inputCapacidad = document.getElementById('capacidad')
    const inputDisponible = document.getElementById('disponible')
    const inputImagen = document.getElementById('imagen')
    const imgPreview = document.getElementById('previewImagen')
    const tituloModal = modal.querySelector('h2')

    inputNombre.value = sala.titulo
    inputDescripcion.value = sala.descripcion
    selectTipo.value = sala.categoria
    const estadoGuardado = String(sala.estado ?? '').toLowerCase()
    selectEstado.value = estadoGuardado === '3' || estadoGuardado === 'mantenimiento'
        ? '3'
        : Number(sala.disponible) > 0 ? '1' : '2'
    inputCapacidad.value = sala.capacidad
    inputDisponible.setAttribute('max', `${inputCapacidad.value}`)
    inputDisponible.value = sala.disponible
    inputImagen.value = sala.img
    imgPreview.src = sala.img.replace('./img/', '../img/')
    tituloModal.innerText = 'Editar sala'

    abrirModal()


    form.onsubmit = (e) => {
        e.preventDefault()

        sala.titulo = inputNombre.value
        sala.descripcion = inputDescripcion.value
        sala.categoria = selectTipo.value
        sala.estado = Number(selectEstado.value)
        sala.capacidad = Number(inputCapacidad.value)
        sala.disponible = Number(inputDisponible.value)
        sala.img = inputImagen.value

        updateSala(host, sala)
    }
}

document.getElementById('estado').addEventListener('change', event => {
    const selectEstado = event.currentTarget
    const inputDisponible = document.getElementById('disponible')
    const inputCapacidad = document.getElementById('capacidad')

    if (selectEstado.value === '2') {
        inputDisponible.value = '0'
    } else if (selectEstado.value === '1' && Number(inputDisponible.value) === 0) {
        inputDisponible.value = inputCapacidad.value
    }
})

document.querySelectorAll('[data-filtro-estado]').forEach(boton => {
    boton.addEventListener('click', () => {
        filtroEstado = boton.dataset.filtroEstado
        document.querySelectorAll('[data-filtro-estado]').forEach(opcion => {
            const activo = opcion === boton
            opcion.setAttribute('aria-pressed', String(activo))
            opcion.classList.toggle('bg-[#edf3e6]', activo)
            opcion.classList.toggle('text-[#2f4d2d]', activo)
            opcion.classList.toggle('font-bold', activo)
            opcion.classList.toggle('font-semibold', !activo)
        })
        aplicarFiltros()
    })
})

function obtenerOcupacion(sala) {
    const capacidadValor = Number(sala.capacidad)
    const disponiblesValor = Number(sala.disponible)
    const capacidad = Number.isFinite(capacidadValor) && capacidadValor > 0 ? capacidadValor : 0
    const disponibles = Number.isFinite(disponiblesValor)
        ? Math.min(capacidad, Math.max(0, disponiblesValor))
        : 0
    const estadoGuardado = String(sala.estado ?? '').trim().toLowerCase()
    const mantenimiento = ['3', 'mantenimiento', 'en mantenimiento'].includes(estadoGuardado)
    const ocupados = capacidad - disponibles
    const porcentaje = capacidad > 0 ? Math.round((ocupados / capacidad) * 100) : 0
    const estado = mantenimiento
        ? 'mantenimiento'
        : capacidad > 0 && disponibles === 0 ? 'ocupado' : 'disponible'

    return { capacidad, disponibles, ocupados, porcentaje, mantenimiento, estado }
}

function actualizarMetricas(salas) {
    const ocupaciones = salas.map(obtenerOcupacion)
    const espaciosActivos = ocupaciones.filter(espacio => !espacio.mantenimiento)
    const capacidadTotal = ocupaciones.reduce((total, espacio) => total + espacio.capacidad, 0)
    const capacidadActiva = espaciosActivos.reduce((total, espacio) => total + espacio.capacidad, 0)
    const cuposDisponibles = espaciosActivos.reduce((total, espacio) => total + espacio.disponibles, 0)
    const cuposOcupados = espaciosActivos.reduce((total, espacio) => total + espacio.ocupados, 0)

    document.getElementById('total-espacios').textContent = salas.length
    document.getElementById('puestos-totales').textContent = `${capacidadTotal} puestos en total`
    document.getElementById('espacios-disponibles').textContent =
        espaciosActivos.filter(espacio => espacio.disponibles > 0).length
    document.getElementById('cupos-libres').textContent = `${cuposDisponibles} cupos libres`
    document.getElementById('espacios-ocupados').textContent =
        espaciosActivos.filter(espacio => espacio.capacidad > 0 && espacio.disponibles === 0).length
    document.getElementById('espacios-mantenimiento').textContent =
        ocupaciones.filter(espacio => espacio.mantenimiento).length
    document.getElementById('reservas-registradas').textContent = '0'
    document.getElementById('ocupacion-global').textContent = capacidadActiva > 0
        ? Math.round((cuposOcupados / capacidadActiva) * 100)
        : 0

    renderizarOcupacion(salas, ocupaciones)
}

function renderizarOcupacion(salas, ocupaciones) {
    const lista = document.getElementById('ocupacion-espacios')
    lista.replaceChildren()

    if (salas.length === 0) {
        const vacio = document.createElement('p')
        vacio.className = 'text-sm text-[#748071]'
        vacio.textContent = 'No hay espacios registrados.'
        lista.append(vacio)
        return
    }

    salas.forEach((sala, indice) => {
        const ocupacion = ocupaciones[indice]
        const fila = document.createElement('div')
        fila.className = 'space-y-1.5'

        const encabezado = document.createElement('div')
        encabezado.className = 'flex items-center justify-between gap-3 text-sm'

        const nombre = document.createElement('h3')
        nombre.className = 'truncate font-bold'
        nombre.textContent = sala.titulo

        const detalle = document.createElement('p')
        detalle.className = 'shrink-0 text-xs font-semibold text-[#748071]'
        detalle.textContent = ocupacion.mantenimiento
            ? 'Mantenimiento'
            : `${ocupacion.ocupados}/${ocupacion.capacidad} · ${ocupacion.porcentaje}%`

        const pista = document.createElement('div')
        pista.className = 'mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#edf1e9]'
        pista.setAttribute('role', 'progressbar')
        pista.setAttribute('aria-label', `Ocupación de ${sala.titulo}`)
        pista.setAttribute('aria-valuemin', '0')
        pista.setAttribute('aria-valuemax', '100')
        pista.setAttribute('aria-valuenow', String(ocupacion.porcentaje))

        const barra = document.createElement('div')
        barra.className = 'h-full rounded-full transition-all duration-700'
        if (ocupacion.mantenimiento) {
            barra.classList.add('bg-[#d29a3d]')
            pista.setAttribute('aria-valuetext', 'En mantenimiento')
        } else if (ocupacion.estado === 'ocupado') {
            barra.classList.add('bg-[#c85c4d]')
        } else {
            barra.classList.add('bg-gradient-to-r', 'from-[#9fbd67]', 'to-[#527b3e]')
        }
        barra.style.width = `${ocupacion.porcentaje}%`

        encabezado.append(nombre, detalle)
        pista.append(barra)
        fila.append(encabezado, pista)
        lista.append(fila)
    })
}

function aplicarFiltros() {
    const texto = buscarInput.value.trim().toLowerCase()
    const salasFiltradas = salas.filter(sala => {
        const coincideNombre = sala.titulo.toLowerCase().includes(texto)
        const coincideEstado = filtroEstado === 'todos' || obtenerOcupacion(sala).estado === filtroEstado
        return coincideNombre && coincideEstado
    })

    listar(salasFiltradas)
}