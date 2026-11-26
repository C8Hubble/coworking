const host = "http://localhost:3000"
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

    const salas = await getSalas(host)


    salas.forEach(sala => {
        const tabla = document.getElementById('tabla-espacios')
        tabla.innerHTML += `                        <tr>
                            <td>${sala.titulo}</td>
                            <td>${sala.disponible}</td>
                            <td>${sala.capacidad}</td>
                            <td>${sala.disponible}</td>
                            <td>                        <button>Ver</button>
                        <button onclick="borrar('${sala.id}')">Eliminar</button>
                        <button>Editar</button></td>
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


