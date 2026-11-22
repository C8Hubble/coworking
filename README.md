# Verde Coworking

Verde Coworking es una página web que presenta un espacio de trabajo compartido rodeado de naturaleza. La landing permite conocer el coworking, consultar sus espacios y encontrar el acceso para el equipo administrador.

## Avance actual

En esta primera etapa se construyó el archivo `index.html` con HTML semántico. Se usaron etiquetas como `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` y `<footer>` para organizar el contenido y darle una estructura clara a la página.

La landing incluye:

- Un encabezado con enlaces a Inicio, Espacios, Sobre nosotros y Beneficios.
- Una portada con una breve presentación y un enlace al catálogo.
- Un catálogo con una tarjeta de ejemplo que muestra el nombre, la descripción y la capacidad de un espacio.
- Un pie de página con un enlace al acceso administrador. El acceso también aparece en el menú principal.

Los enlaces del menú usan identificadores como `#espacios` para llevar al visitante a una sección dentro de la misma página. El acceso de administrador se encuentra en `pages/login.html` y dirige al panel `pages/admin.html`.

La carpeta `dist/` contiene archivos generados y está ignorada por Git.

## Próximos pasos

Aplicar los estilos responsivos con Tailwind CSS y conectar el catálogo con los registros de JSON Server.
