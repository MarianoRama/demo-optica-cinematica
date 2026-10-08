// Portada: los modelos se recorren en este orden, con fundido entre uno y otro.
// Para sumar un modelo: guardar la imagen (.webp) o el video (.mp4, sin audio) en assets/ y agregar una línea.
// El primero debe ser una imagen: es la que se ve mientras carga la página.
window.LUMINA_MEDIA = {
 imageSeconds: 7,
 slides: [
  { type: 'image', src: 'assets/metal.webp', label: 'Metal', name: 'Línea Metal', description: 'Precisión en cada detalle.' },
  { type: 'video', src: 'assets/optica-film.mp4', label: 'Carey', name: 'Línea Carey', description: 'Un clásico, en movimiento.' },
  { type: 'image', src: 'assets/acetato.webp', label: 'Acetato', name: 'Línea Acetato', description: 'Presencia natural.' }
 ]
};
