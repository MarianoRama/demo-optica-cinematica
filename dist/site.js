const models = [
 { name: 'Línea Metal', description: 'Precisión en cada detalle.', image: 'assets/metal-catalogo.webp', style: 'Líneas rectas · frente liviano', color: 'Gris', detail: 'Una silueta de líneas definidas, con un frente discreto y detalles metálicos. Una referencia para quienes prefieren una presencia sutil.' },
 { name: 'Línea Acetato', description: 'Presencia natural.', image: 'assets/acetato-catalogo.webp', style: 'Frente redondeado · textura cálida', color: 'Marrón', detail: 'Curvas suaves y una textura cálida que pone el armazón en primer plano. Una referencia para explorar un estilo con más carácter.' }
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
const media = window.LUMINA_MEDIA || {};
const imageMs = (media.imageSeconds || 7) * 1000;
const saveData = navigator.connection?.saveData === true;
const heroVisual = document.querySelector('#hero-visual');
const sceneControls = document.querySelector('#scene-controls');
const slides = (media.slides?.length ? media.slides : [
 { type: 'image', src: 'assets/metal.webp', label: 'Metal', name: 'Línea Metal', description: 'Precisión en cada detalle.' },
 { type: 'image', src: 'assets/acetato.webp', label: 'Acetato', name: 'Línea Acetato', description: 'Presencia natural.' }
]).filter(s => s.type !== 'video' || (!reducedMotion.matches && !saveData));
let current = 0, target = 0, paused = reducedMotion.matches, running = false, timer = 0, pending = 0, remaining = 0, startedAt = 0, token = 0;

slides.forEach((s, i) => {
 if (i === 0 && s.type === 'image') { s.el = heroVisual.querySelector('.hero-frame'); s.loaded = true; }
 else if (s.type === 'video') {
  const v = document.createElement('video');
  v.className = 'hero-frame hero-film'; v.muted = true; v.playsInline = true; v.preload = 'none';
  v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  v.addEventListener('ended', () => { if (slides[current] === s) next(); });
  v.addEventListener('error', () => { if (s.loaded) skip(i); });
  s.el = v; heroVisual.append(v);
 } else {
  const img = new Image(); img.className = 'hero-frame'; img.alt = ''; img.decoding = 'async';
  s.el = img; heroVisual.append(img);
 }
 const button = document.createElement('button');
 button.type = 'button'; button.className = 'scene-choice'; button.setAttribute('aria-pressed', 'false');
 const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2, '0');
 button.append(number, ` ${s.label}`, document.createElement('i'));
 button.addEventListener('click', () => go(i));
 sceneControls.insertBefore(button, pauseButton);
 s.button = button;
});

function load(s) { if (s.loaded) return; s.loaded = true; if (s.type === 'video') s.el.preload = 'auto'; s.el.src = s.src; }
function nextIndex(i) { let k = i; do { k = (k + 1) % slides.length; } while (slides[k].failed && k !== i); return k; }
function next() { go(nextIndex(current)); }
function skip(i) { const s = slides[i]; if (s.failed) return; s.failed = true; s.button.hidden = true; s.el.pause?.(); if (target === i) go(nextIndex(i)); }
function refreshPause() { pauseButton.textContent = paused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-label', paused ? 'Reproducir animación' : 'Pausar animación'); }

function setActive(i) {
 const prev = slides[current], s = slides[i];
 if (prev === s) { s.button.classList.remove('is-active'); void s.button.offsetWidth; }
 current = i;
 slides.forEach((x, k) => { x.el.classList.toggle('is-active', k === i); x.button.classList.toggle('is-active', k === i); x.button.setAttribute('aria-pressed', String(k === i)); });
 if (prev !== s && prev.type === 'video') setTimeout(() => { if (slides[current] !== prev) prev.el.pause(); }, 1700);
 hero.classList.toggle('video-active', s.type === 'video');
 document.querySelector('#model-index').textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
 document.querySelector('#model-name').textContent = s.name;
 document.querySelector('#model-description').textContent = s.description;
}
function schedule(ms) { clearTimeout(timer); remaining = ms; startedAt = performance.now(); if (running) timer = setTimeout(next, ms); }
function hold() { const s = slides[current]; if (s.type === 'video') s.el.pause(); else { clearTimeout(timer); remaining = Math.max(0, remaining - (performance.now() - startedAt)); } }
function resume() { const s = slides[current]; if (s.type === 'video') s.el.play().catch(() => skip(current)); else { startedAt = performance.now(); clearTimeout(timer); timer = setTimeout(next, remaining); } }
function sync() {
 hero.classList.toggle('is-paused', paused); hero.classList.toggle('is-hidden', document.hidden);
 const shouldRun = !paused && !document.hidden;
 if (shouldRun === running) return;
 running = shouldRun; running ? resume() : hold();
}

function go(i) {
 const my = ++token, s = slides[i];
 target = i;
 clearTimeout(timer); clearTimeout(pending);
 load(s); load(slides[nextIndex(i)]);
 if (s.type === 'image') {
  const ready = s.el.complete && s.el.naturalWidth ? Promise.resolve() : new Promise(r => { s.el.addEventListener('load', r, { once: true }); s.el.addEventListener('error', r, { once: true }); });
  ready.then(() => { if (my !== token) return; hero.style.setProperty('--slide-duration', `${imageMs / 1000}s`); setActive(i); schedule(imageMs); });
  return;
 }
 const v = s.el;
 const start = () => {
  if (my !== token) return;
  clearTimeout(pending);
  hero.style.setProperty('--slide-duration', `${Number.isFinite(v.duration) && v.duration ? v.duration : 8}s`);
  setActive(i);
  if (!running) v.pause();
 };
 pending = setTimeout(() => { if (my === token) skip(i); }, 8000);
 if (v.readyState >= 1) v.currentTime = 0;
 if (running) { v.addEventListener('playing', start, { once: true }); v.play().catch(() => { if (my === token) skip(i); }); }
 else if (v.readyState >= 2) start();
 else v.addEventListener('loadeddata', start, { once: true });
}
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
pauseButton.addEventListener('click', () => { paused = !paused; refreshPause(); sync(); });
document.addEventListener('visibilitychange', sync);
reducedMotion.addEventListener('change', e => { paused = e.matches; refreshPause(); sync(); });
refreshPause();
hero.style.setProperty('--slide-duration', `${imageMs / 1000}s`);
setActive(0);
running = !paused && !document.hidden;
sync();
schedule(imageMs);
if (slides.length > 1) load(slides[nextIndex(0)]);

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
