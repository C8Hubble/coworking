
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
    const host = "http://localhost:3000"
    const salas = await getSalas(host)


    salas.forEach(sala => {
        const tabla = document.getElementById('tabla-espacios')
        tabla.innerHTML += `                        <tr>
                            <td>${sala.titulo}</td>
                            <td>${sala.disponible}</td>
                            <td>${sala.capacidad}</td>
                            <td>${sala.disponible}</td>
                            <td>ver eliminar editar</td>
                        </tr>`
    });

})

