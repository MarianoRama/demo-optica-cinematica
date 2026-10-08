# Lúmina — Óptica cinematográfica

Concepto de demostración con dos imágenes aportadas por el usuario. No representa una óptica real ni disponibilidad de productos.

## Experiencia
- Portada de pantalla completa que recorre los modelos en orden (Metal → Carey en video → Acetato), con fundido, selección manual y pausa. Las fotos duran 7 segundos; el video avanza al terminar.
- Respeta preferencias de movimiento reducido; se detiene con la pestaña oculta.
- Composición adaptada a celular, catálogo con vista frontal y tres cuartos (hover, toque o teclado), franja continua de marcas con pausa y consulta editable/copiable.
- Mapa general de Minas cargado solo al pulsar “Ver mapa de referencia”; no contiene pin del comercio ni dirección real.
- No recibe datos en un servidor, confirma visitas ni cobra.

## Datos de contacto de la demo
`dist/contact-config.js` deja dirección, WhatsApp, horario, teléfono, correo y pin como valores nulos hasta que se confirmen. No completar con datos supuestos. Las consultas preparadas se copian en el navegador; no se envían. El mapa se carga al pedirlo y el enlace externo a OpenStreetMap queda disponible como respaldo.

## Catálogo y marcas
`dist/assets/metal-catalogo.webp` y `dist/assets/acetato-catalogo.webp` (originales en `.png`) son sprites de demostración con una vista frontal y otra a tres cuartos. No son fotografías exactas de productos disponibles. Las marcas del bloque “Marcas” son ejemplos ilustrativos y no afirman representación ni disponibilidad.

## Publicación
Sitio estático en `dist/`, sin dependencias ni compilación. GitHub Actions publica esa carpeta con cada cambio en main. Abrir mediante un servidor HTTP para probar la copia al portapapeles y los archivos.

## Sumar un modelo a la portada
1. Guardar la imagen (`.webp`, ~1376 × 768) o el video (MP4 breve, sin audio, comprimido para web) en `dist/assets/`. Conservar los PNG originales como respaldo; la web usa los `.webp`.
2. En `dist/media-config.js`, agregar una línea a `slides` con `type` (`'image'` o `'video'`), `src`, `label` (texto del selector), `name` y `description`. El primero tiene que ser una imagen: es la que se ve mientras carga.
3. Cada modelo usa el mismo fundido inferior que oculta la base acrílica. Con una toma distinta, revisar en celular que no tape el armazón.
4. Si un video falla o el navegador no permite reproducirlo, se salta y la portada sigue con las imágenes. Con movimiento reducido o ahorro de datos no se cargan videos.
5. Los textos se editan en HTML, no deben estar dibujados dentro del video.

Ver `PROMPTS-FLOW.md` para los briefs. La versión inicial usa imágenes animadas con fundido; no pretende ser un video generado.

## Video recibido y base acrílica
El archivo optica-film.mp4 es el original aportado por el usuario (8 segundos, 1280 × 720). La portada aplica un fundido inferior para ocultar la base acrílica; no se ha eliminado el objeto de los fotogramas ni restaurado el video. No reutilizar esa máscara automáticamente con otra toma: podría ocultar el producto. El prompt actualizado pide un estudio vacío sin base.
