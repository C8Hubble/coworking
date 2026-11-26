const host = "http://localhost:3000"
const modal = document.getElementById('modalEspacio')
let salas = []

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

    salas.forEach(sala => {
        const tabla = document.getElementById('tabla-espacios')
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

function createForm() {

    const form = document.getElementById('formNuevoEspacio')
    const inputNombre = document.getElementById('nombre')
    const inputDescripcion = document.getElementById('descripcion')
    const selectTipo = document.getElementById('tipo')
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
    const inputCapacidad = document.getElementById('capacidad')
    const inputDisponible = document.getElementById('disponible')
    const inputImagen = document.getElementById('imagen')
    const imgPreview = document.getElementById('previewImagen')
    const tituloModal = modal.querySelector('h2')

    inputNombre.value = sala.titulo
    inputDescripcion.value = sala.descripcion
    selectTipo.value = sala.categoria
    inputCapacidad.value = sala.capacidad
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
        sala.capacidad = Number(inputCapacidad.value)
        sala.disponible = Number(inputDisponible.value)
        sala.img = inputImagen.value

        updateSala(host, sala)
    }
}