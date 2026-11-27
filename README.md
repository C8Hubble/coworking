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

## Estilos con Tailwind CSS

El proyecto utiliza Tailwind CSS `v4.3.5` mediante `@tailwindcss/cli`. Los estilos personalizados se encuentran en `src/styles.css` y se compilan en `dist/output.css`.

Para generar el archivo CSS durante el desarrollo:

```bash
npx @tailwindcss/cli -i ./src/styles.css -o ./dist/output.css --watch
```

Las páginas cargan únicamente la hoja compilada desde `dist/output.css`; no se utiliza el CDN de Tailwind. Esto permite que la aplicación funcione correctamente como sitio estático en GitHub Pages. El archivo generado `dist/output.css` debe incluirse en la publicación.

## Próximos pasos

Continuar mejorando los estilos responsivos y conectar el catálogo con los registros de JSON Server.
