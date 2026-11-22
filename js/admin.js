const datos = [
    {
        img: "",
        categoria: "Escritorio individual",
        titulo: "Cabina musgo",
        descripcion: "Cabina individual con muro de musgo natural y luz cálida. Silencio total para llamadas y trabajo",
        capacidad: 10,
        disponible: true
    },
    {
        img: "",
        categoria: "Sala",
        titulo: "Sala helecho",
        descripcion: "Sala amplia para reuniones y trabajo en equipo.",
        capacidad: 10,
        disponible: true
    },
    {
        img: "",
        categoria: "Escritorio individual",
        titulo: "Rincón bambú",
        descripcion: "Puesto individual rodeado de plantas y luz natural.",
        capacidad: 1,
        disponible: true
    }
];

const body = document.getElementById("body");

datos.forEach((dato) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${dato.img || "Sin imagen"}</td>
        <td>${dato.categoria}</td>
        <td>${dato.titulo}</td>
        <td>${dato.descripcion}</td>
        <td>${dato.capacidad}</td>
        <td>${dato.disponible ? "Sí" : "No"}</td>
    `;
    body.appendChild(fila);
});
