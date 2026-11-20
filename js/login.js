const datos = [
    {
        "img": "",
        "categoria": "Escritorio individual",
        "titulo": "Cabina musgo",
        "descripcion": "Cabina individual con muro de musgo natural y luz cálida. Silencio total para llamadas y trabajo",
        "capacidad": 10,
        "disponible": 1
    },
    {
        "img": "",
        "categoria": "sala",
        "titulo": "Cabina musgo",
        "descripcion": "Cabina individual con muro de musgo natural y luz cálida. Silencio total para llamadas y trabajo",
        "capacidad": 10,
        "disponible": 1
    },
    {
        "img": "",
        "categoria": "Escritorio individual",
        "titulo": "Cabina musgo",
        "descripcion": "Cabina individual con muro de musgo natural y luz cálida. Silencio total para llamadas y trabajo",
        "capacidad": 10,
        "disponible": 1
    }
]

const body = document.getElementById("body")

datos.forEach(dato => {
    tr = `<tr>
        <td>${dato.img}</td>
        <td>${dato.categoria}</td>
        <td>${dato.titulo}</td>
        <td${dato.descripcion}</td$>
        <td>${dato.capacidad}</td>
        <td>${dato.disponible}</td>
    </tr>`
    body.innerHTML += tr
});
