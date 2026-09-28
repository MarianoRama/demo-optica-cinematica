const models = [
 { name: 'Línea Metal', description: 'Precisión en cada detalle.', image: 'assets/metal-catalogo.png', style: 'Líneas rectas · frente liviano', color: 'Gris', detail: 'Una silueta de líneas definidas, con un frente discreto y detalles metálicos. Una referencia para quienes prefieren una presencia sutil.' },
 { name: 'Línea Acetato', description: 'Presencia natural.', image: 'assets/acetato-catalogo.png', style: 'Frente redondeado · textura cálida', color: 'Marrón', detail: 'Curvas suaves y una textura cálida que pone el armazón en primer plano. Una referencia para explorar un estilo con más carácter.' }
];
const hero = document.querySelector('.hero');
const pauseButton = document.querySelector('#pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const brandMarquee = document.querySelector('#brand-marquee');
const brandMotionButton = document.querySelector('#brand-motion');
const brandReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncBrandMotionPreference() { brandMotionButton.hidden = brandReducedMotion.matches; }
brandMotionButton.addEventListener('click', () => {
 const paused = brandMarquee.classList.toggle('is-paused');
 brandMotionButton.setAttribute('aria-pressed', String(paused));
 brandMotionButton.setAttribute('aria-label', paused ? 'Reanudar movimiento de marcas' : 'Pausar movimiento de marcas');
 brandMotionButton.textContent = paused ? 'Reanudar marcas ▶' : 'Pausar marcas Ⅱ';
});
document.addEventListener('visibilitychange', () => brandMarquee.classList.toggle('is-hidden', document.hidden));
brandReducedMotion.addEventListener('change', syncBrandMotionPreference);
syncBrandMotionPreference();
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
function fallback() { videoMode = false; hero.classList.remove('video-active'); video.pause(); video.hidden = true; document.querySelectorAll('.scene-choice').forEach(el => el.hidden = false); scene(current); startTimer(); }
function activateVideo() {
 const url = (window.innerWidth <= 800 ? media.mobileVideo : media.desktopVideo) || media.desktopVideo;
 if (!url || reducedMotion.matches) return;
 video.src = url; videoMode = true; video.hidden = false; hero.classList.add('video-active');
 document.querySelectorAll('.scene-choice').forEach(el => el.hidden = true);
 document.querySelector('#model-index').textContent = 'FILM — 01';
 document.querySelector('#model-name').textContent = 'Una mirada en movimiento';
 document.querySelector('#model-description').textContent = 'Una forma de mirar.';
 video.addEventListener('error', fallback, { once: true });
 video.play().catch(fallback);
}
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => { scene(Number(button.dataset.scene)); startTimer(); }));
const hoverCatalog = window.matchMedia('(hover: hover) and (pointer: fine)');
function setCatalogView(button, angle) {
 const model = models[Number(button.dataset.viewToggle)];
 button.classList.toggle('is-angle', angle);
 button.setAttribute('aria-pressed', String(angle));
 button.setAttribute('aria-label', `${angle ? 'Ver frente' : 'Ver otra vista'} de ${model.name}`);
}
document.querySelectorAll('[data-view-toggle]').forEach(button => {
 button.addEventListener('click', () => setCatalogView(button, !button.classList.contains('is-angle')));
 if (hoverCatalog.matches) {
  button.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') setCatalogView(button, true); });
  button.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') setCatalogView(button, false); });
 }
});
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
 document.querySelector('#detail-photo').style.backgroundImage = `url("${model.image}")`;
 document.querySelector('#detail-photo').setAttribute('aria-label', `${model.name}, vista frontal del armazón de referencia`);
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

const contactConfig = window.LUMINA_CONTACT || {};
const contactValue = value => typeof value === 'string' ? value.trim() : '';
document.querySelector('#contact-address').textContent = contactValue(contactConfig.address) || 'Pendiente en esta demo';
document.querySelector('#contact-hours').textContent = contactValue(contactConfig.hours) || 'Pendiente en esta demo';
const whatsapp = contactValue(contactConfig.whatsapp), whatsappDigits = whatsapp.replace(/\D/g, '');
if (/^\d{7,15}$/.test(whatsappDigits)) {
 const link = document.querySelector('#contact-whatsapp-link');
 link.href = `https://wa.me/${whatsappDigits}`; link.textContent = whatsapp; link.hidden = false;
 document.querySelector('#contact-whatsapp-pending').hidden = true;
}
const phone = contactValue(contactConfig.phone), phoneHref = phone.replace(/[^\d+]/g, '');
if (/^\+?\d{7,15}$/.test(phoneHref)) {
 const link = document.querySelector('#contact-phone-link'); link.href = `tel:${phoneHref}`; link.textContent = phone;
 document.querySelector('#contact-phone-row').hidden = false;
}
const email = contactValue(contactConfig.email);
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 const link = document.querySelector('#contact-email-link'); link.href = `mailto:${email}`; link.textContent = email;
 document.querySelector('#contact-email-row').hidden = false;
}

const mapButton = document.querySelector('#load-map');
mapButton.addEventListener('click', () => {
 const frame = document.createElement('iframe');
 frame.title = 'Mapa de referencia general de Minas, sin marcador de comercio';
 frame.loading = 'lazy';
 frame.referrerPolicy = 'no-referrer';
 frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=-55.25%2C-34.4%2C-55.21%2C-34.36&layer=mapnik';
 document.querySelector('#map-embed').append(frame);
 document.querySelector('#map-embed').hidden = false;
 document.querySelector('#map-placeholder').hidden = true;
});
