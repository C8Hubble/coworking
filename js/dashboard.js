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
            console.log('DELETE: Recurso eliminado');

        } else {
            console.error('PUT falló');
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

document.getElementById('btnNuevoEspacio').addEventListener('click', abrirModal)


async function updateForm(id) {

    const sala = await salas.find(s => String(s.id) === String(id))

    const form = document.getElementById('formNuevoEspacio')
    const inputNombre = document.getElementById('nombre')
    inputNombre.value = sala.titulo
    const inputDescripcion = document.getElementById('descripcion')
    inputDescripcion.value = sala.descripcion
    const selectTipo = document.getElementById('tipo')
    selectTipo.value = sala.categoria
    const selectEstado = document.getElementById('estado')
    const inputCapacidad = document.getElementById('capacidad')
    const inputDisponible = document.getElementById('disponible')
    const inputPrecio = document.getElementById('precio')
    const inputImagen = document.getElementById('imagen')
    const imgPreview = document.getElementById('previewImagen')
    imgPreview.src = sala.img
    const tituloModal = modal.querySelector('h2')
    const btnSubmit = form.querySelector('button[type="submit"]')

    abrirModal()


}