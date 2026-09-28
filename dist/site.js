const models = [
 { name: 'Línea Metal', description: 'Precisión en cada detalle.', image: 'assets/metal.png', style: 'Líneas rectas · frente liviano', color: 'Gris', detail: 'Una silueta de líneas definidas, con un frente discreto y detalles metálicos. Una referencia para quienes prefieren una presencia sutil.' },
 { name: 'Línea Acetato', description: 'Presencia natural.', image: 'assets/acetato.png', style: 'Frente redondeado · textura cálida', color: 'Marrón', detail: 'Curvas suaves y una textura cálida que pone el armazón en primer plano. Una referencia para explorar un estilo con más carácter.' }
];
const hero = document.querySelector('.hero');
const pauseButton = document.querySelector('#pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = 0, paused = reducedMotion.matches, timer;
const video = document.querySelector('#hero-film');
const media = window.LUMINA_MEDIA || {};
let videoMode = false;
function refreshPause() { hero.classList.toggle('is-paused', paused); pauseButton.textContent = paused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-label', paused ? 'Reproducir animación' : 'Pausar animación'); }
function scene(index) {
 current = index;
 document.querySelectorAll('.hero-frame').forEach((frame, i) => frame.classList.toggle('is-active', i === current));
 document.querySelectorAll('.scene-choice').forEach((button, i) => { button.classList.toggle('is-active', i === current); button.setAttribute('aria-pressed', String(i === current)); });
 document.querySelector('#model-index').textContent = `0${current + 1} / 02`;
 document.querySelector('#model-name').textContent = models[current].name;
 document.querySelector('#model-description').textContent = models[current].description;
}
function startTimer() { clearInterval(timer); if (!paused && !document.hidden && !videoMode) timer = setInterval(() => scene((current + 1) % models.length), 7000); }
function fallback() { videoMode = false; video.pause(); video.hidden = true; document.querySelectorAll('.scene-choice').forEach(el => el.hidden = false); scene(current); startTimer(); }
function activateVideo() {
 const url = (window.innerWidth <= 800 ? media.mobileVideo : media.desktopVideo) || media.desktopVideo;
 if (!url || reducedMotion.matches) return;
 video.src = url; videoMode = true; video.hidden = false;
 document.querySelectorAll('.scene-choice').forEach(el => el.hidden = true);
 document.querySelector('#model-name').textContent = 'La colección, en movimiento';
 document.querySelector('#model-description').textContent = 'Una forma de mirar.';
 video.addEventListener('error', fallback, { once: true });
 video.play().catch(fallback);
}
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => { scene(Number(button.dataset.scene)); startTimer(); }));
pauseButton.addEventListener('click', () => { paused = !paused; refreshPause(); if (videoMode) { if (paused) video.pause(); else video.play().catch(fallback); } startTimer(); });
document.addEventListener('visibilitychange', () => { if (videoMode) { if (document.hidden) video.pause(); else if (!paused) video.play().catch(fallback); } startTimer(); });
reducedMotion.addEventListener('change', e => { paused = e.matches; if (paused && videoMode) video.pause(); refreshPause(); startTimer(); });
refreshPause(); activateVideo(); startTimer();

const dialogOpeners = new WeakMap();
function openDialog(dialog) { dialogOpeners.set(dialog, document.activeElement); dialog.showModal(); document.body.style.overflow = 'hidden'; }
function closeDialog(dialog) { dialog.close(); }
document.querySelectorAll('dialog').forEach(dialog => { dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) { document.body.style.overflow = ''; dialogOpeners.get(dialog)?.focus(); } }); dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(dialog); }); dialog.querySelector('[data-close]').addEventListener('click', () => closeDialog(dialog)); });
const detail = document.querySelector('#detail-dialog');
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
 const index = Number(button.dataset.detail), model = models[index];
 document.querySelector('#detail-title').textContent = model.name;
 document.querySelector('#detail-category').textContent = `0${index + 1} — COLECCIÓN`;
 document.querySelector('#detail-photo').src = model.image;
 document.querySelector('#detail-photo').alt = `${model.name}, armazón de referencia`;
 document.querySelector('#detail-description').textContent = model.detail;
 document.querySelector('#detail-style').textContent = model.style;
 document.querySelector('#detail-color').textContent = model.color;
 document.querySelector('#detail-consult').dataset.line = model.name;
 openDialog(detail);
}));
const consultation = document.querySelector('#consult-dialog');
function consult(line) { if (detail.open) detail.close(); document.querySelector('#consult-line').value = line; document.querySelector('#consult-result').hidden = true; openDialog(consultation); }
document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => consult(button.dataset.consult)));
document.querySelector('#detail-consult').addEventListener('click', e => consult(e.currentTarget.dataset.line));
const form = document.querySelector('#consult-form');
form.addEventListener('input', () => { document.querySelector('#consult-result').hidden = true; document.querySelector('#copy-status').textContent = ''; });
form.addEventListener('submit', e => {
 e.preventDefault(); const data = new FormData(form), name = String(data.get('name')).trim();
 if (!name) { form.elements.name.setCustomValidity('Ingresá tu nombre.'); form.elements.name.reportValidity(); return; }
 const notes = String(data.get('notes')).trim();
 document.querySelector('#consult-message').value = `Hola, soy ${name}. Me interesa ${data.get('line')}. Quisiera consultar por los modelos y coordinar una visita.${notes ? '\n' + notes : ''}`;
 document.querySelector('#consult-result').hidden = false; document.querySelector('#copy-status').textContent = ''; document.querySelector('#consult-result').scrollIntoView({ block: 'nearest' });
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
document.querySelector('#copy-message').addEventListener('click', async () => { const text = document.querySelector('#consult-message'); try { await navigator.clipboard.writeText(text.value); document.querySelector('#copy-status').textContent = 'Mensaje copiado. Todavía no se envió.'; } catch { text.focus(); text.select(); document.querySelector('#copy-status').textContent = 'Seleccioná y copiá el mensaje para continuar.'; } });
