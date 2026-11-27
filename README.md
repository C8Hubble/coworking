# Verde Coworking

Verde Coworking es una página web que presenta un espacio de trabajo compartido rodeado de naturaleza. La landing permite conocer el coworking, consultar sus espacios y encontrar el acceso para el equipo administrador.

## Avance actual

El archivo `index.html` presenta una landing page responsive construida con HTML semántico y Tailwind CSS. Se usan secciones para la portada, la información del coworking, los espacios de trabajo y los beneficios.

La landing incluye:

- Un encabezado con enlaces a Inicio, Espacios, Sobre nosotros y Beneficios.
- Una portada visual con imagen de fondo, mensaje principal, indicador de disponibilidad y accesos a las secciones.
- Un bloque informativo sobre Verde Coworking con estadísticas de espacios, puestos, plantas y conexión con la naturaleza.
- Una sección de espacios de trabajo preparada para mostrar el catálogo.
- Una sección de beneficios con cuatro tarjetas: naturaleza, productividad, tranquilidad y comunidad.
- Imágenes con carga diferida en las secciones secundarias y textos alternativos descriptivos.
- Un pie de página con un enlace al acceso administrador.

Los enlaces de la página usan identificadores como `#nosotros` y `#espacios` para llevar al visitante a una sección dentro de la misma página. El acceso de administrador se encuentra en `pages/login.html` y dirige al panel `pages/admin.html`.

La página utiliza Montserrat para los títulos y Nunito Sans para el texto, cargadas desde Google Fonts. La imagen principal y algunas imágenes de disponibilidad se cargan desde recursos externos; las imágenes de las secciones internas se encuentran en la carpeta `img/`.

## Estilos con Tailwind CSS

El proyecto utiliza Tailwind CSS `v4.3.5` mediante `@tailwindcss/cli`. Los estilos personalizados se encuentran en `src/styles.css` y se compilan en `dist/output.css`.

Para generar el archivo CSS durante el desarrollo:

```bash
npx @tailwindcss/cli -i ./src/styles.css -o ./dist/output.css --watch
```

Las páginas cargan únicamente la hoja compilada desde `dist/output.css`; no se utiliza el CDN de Tailwind. Esto permite que la aplicación funcione correctamente como sitio estático en GitHub Pages. El archivo generado `dist/output.css` debe incluirse en la publicación.

## Próximos pasos

Continuar mejorando los estilos responsivos, tambien indicarle a la ia como podre ahcer los estilos modales
