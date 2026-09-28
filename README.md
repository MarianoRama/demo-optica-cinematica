# Lúmina — Óptica cinematográfica

Concepto de demostración con dos imágenes aportadas por el usuario. No representa una óptica real ni disponibilidad de productos.

## Experiencia
- Portada de pantalla completa: transición suave cada 7 segundos, selección manual y pausa.
- Respeta preferencias de movimiento reducido; se detiene con la pestaña oculta.
- Composición adaptada a celular, fichas de dos líneas y consulta editable/copiable.
- No recibe datos en un servidor, confirma visitas ni cobra.

## Publicación
Sitio estático en `dist/`, sin dependencias ni compilación. GitHub Actions publica esa carpeta con cada cambio en main. Abrir mediante un servidor HTTP para probar la copia al portapapeles y los archivos.

## Integrar el video de Flow
1. Conservar los PNG como respaldo.
2. Guardar el MP4 o WebM en `dist/assets/`. Preferir un archivo breve, sin pista de audio y comprimido para web.
3. En `dist/media-config.js`, configurar `desktopVideo: 'assets/optica-desktop.mp4'` y, si hay versión vertical, `mobileVideo: 'assets/optica-mobile.mp4'`.
4. La portada muestra el video y mantiene el control de pausa. Los selectores de imágenes se ocultan durante el video, para evitar cambios desincronizados. Si el video falla o no se permite autoplay, vuelve a las imágenes; con movimiento reducido se conservan imágenes quietas.
5. Los textos se editan en HTML, no deben estar dibujados dentro del video. Probar móvil después de reemplazar assets.

Ver `PROMPTS-FLOW.md` para los briefs. La versión inicial usa imágenes animadas con fundido; no pretende ser un video generado.

## Video recibido y base acrílica
El archivo optica-film.mp4 es el original aportado por el usuario (8 segundos, 1280 × 720). La portada aplica un fundido inferior para ocultar la base acrílica; no se ha eliminado el objeto de los fotogramas ni restaurado el video. No reutilizar esa máscara automáticamente con otra toma: podría ocultar el producto. El prompt actualizado pide un estudio vacío sin base.
