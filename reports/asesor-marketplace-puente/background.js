/* Asesor Marketplace v1.0 — service worker (background.js)
 * Evolución del Notificador Marketplace v0.9, en MODO SEGURO:
 *
 *  - Vigila los chats de Messenger/Facebook y avisa al teléfono
 *    (WhatsApp con CallMeBot o Telegram) cuando un cliente escribe.
 *  - NUEVO: el Asesor (Llama 3 vía Groq) lee el mensaje NUEVO junto con
 *    la FICHA del cliente (memoria del embudo) y prepara un BORRADOR
 *    de respuesta siguiendo el guión de ventas de Oswaldo.
 *  - MODO SEGURO ABSOLUTO: esta extensión JAMÁS envía mensajes a los
 *    clientes. El borrador se muestra en un panel dentro del chat y
 *    Oswaldo lo pega y lo envía ÉL con el botón normal de Messenger.
 *  - Si el caso se sale del guión, no hay borrador: el panel dice
 *    "Esto te toca a ti" y Oswaldo recibe el aviso por Telegram.
 */
'use strict';

const TAG = '[AM-bg]';
const DEFAULTS = { enabled: true, marketplaceOnly: true, channel: 'whatsapp', phone: '', apikey: '', tg_token: '', tg_chatid: '', groq_key: '', asesor_enabled: false, dealer_address: '' };
const COOLDOWN_MS = 120 * 1000;      // no avisar 2 veces del mismo chat en 2 min
const DEDUPE_MS = 30 * 60 * 1000;     // no repetir el mismo aviso en 30 min

// Registro de actividad (últimos 20 eventos) para la página de opciones
async function mnLog(msg) {
  try {
    const d = await chrome.storage.local.get('mn_log');
    const log = d.mn_log || [];
    const ts = new Date().toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    log.push(ts + ' — ' + msg);
    while (log.length > 20) log.shift();
    await chrome.storage.local.set({ mn_log: log });
  } catch (e) { /* noop */ }
}

// Garantiza que el despertador exista siempre (también si recargas la
// extensión sin reinstalar, caso en que onInstalled no se dispara).
ensureAlarm();
function ensureAlarm() {
  chrome.alarms.get('mn-keepalive').then((a) => {
    if (!a) chrome.alarms.create('mn-keepalive', { periodInMinutes: 1 });
  }).catch(() => {
    chrome.alarms.create('mn-keepalive', { periodInMinutes: 1 });
  });
}

/* ------------------------------------------------------------------
 * Función inyectable en la pestaña: OJO, debe ser autocontenida
 * (no puede usar variables de fuera). Se ejecuta dentro de la página.
 * ------------------------------------------------------------------ */
function mnCollectThreads() {
  function tid(href) {
    const m = String(href || '').match(/\/t\/(\d+)/);
    return m ? m[1] : null;
  }
  function unread(link) {
    const label = (link.getAttribute('aria-label') || '').toLowerCase();
    if (/unread|no le[ií]do|sin leer/.test(label)) return true;
    const cands = link.querySelectorAll('[aria-hidden="true"]');
    for (const el of cands) {
      const cs = getComputedStyle(el);
      const w = parseFloat(cs.width) || 0;
      const h = parseFloat(cs.height) || 0;
      if (w <= 0 || w > 14 || h <= 0 || h > 14) continue;
      const br = (cs.borderRadius || '').replace(/\s/g, '');
      const round = br === '50%' || (parseFloat(br) || 0) >= Math.min(w, h) / 2;
      const bg = cs.backgroundColor || '';
      if (round && /0,\s*132,\s*255|24,\s*119,\s*242|8,\s*102,\s*255|59,\s*89,\s*152/.test(bg)) return true;
    }
    const sp = link.querySelector('span');
    if (sp) {
      const fw = parseInt(getComputedStyle(sp).fontWeight || '400', 10);
      if (fw >= 600) return true;
    }
    return false;
  }
  const out = [];
  const links = document.querySelectorAll('a[href*="/t/"]');
  for (const link of links) {
    const t = tid(link.getAttribute('href'));
    if (!t) continue;
    const text = (link.innerText || '').trim();
    if (!text) continue;
    const lines = text.split('\n').map(function (s) { return s.trim(); })
      .filter(function (s) { return s && !/^[·•]$/.test(s) && !/^\d+\s?(s|m|min|h|hr|d|w|sem|a)\.?$/i.test(s) && !/^(ahora|now|ayer|yesterday)$/i.test(s); });
    if (!lines.length) continue;
    out.push({
      tid: t,
      name: lines[0].slice(0, 60),
      snippet: lines.slice(1).join(' ').replace(/\s*[·•]\s*(\d+\s?(s|m|min|h|hr|d|w|sem|a)\.?|ahora|now|ayer|yesterday)\s*$/i, '').slice(0, 160),
      isMarketplace: /marketplace/i.test(text),
      unread: unread(link)
    });
  }
  return out;
}

/* ------------------------- despertador ------------------------- */
chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(ensureAlarm);
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm && alarm.name === 'mn-keepalive') {
    keepaliveScan().catch((e) => console.error(TAG, e));
  }
});

// Revisa los chats directamente en cada pestaña de Facebook/Messenger,
// aunque la pestaña esté dormida o la ventana minimizada.
async function keepaliveScan() {
  const s = await getSettings();
  if (!s.enabled) return;
  let tabs = [];
  try {
    tabs = await chrome.tabs.query({
      url: ['https://www.facebook.com/*', 'https://www.messenger.com/*']
    });
  } catch (e) {
    return;
  }
  if (!tabs.length) {
    await noteNoTabs();
    return;
  }
  let totalThreads = 0, unreadThreads = 0;
  for (const tab of tabs) {
    try {
      const res = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: mnCollectThreads
      });
      const threads = (res && res[0] && res[0].result) || [];
      totalThreads += threads.length;
      unreadThreads += threads.filter((t) => t.unread).length;
      await processThreads(threads, false);
    } catch (e) {
      /* pestaña descartada o sin acceso: se intenta en el próximo minuto */
    }
  }
  await mnLog('Revisión automática: ' + totalThreads + ' chats, ' + unreadThreads + ' sin leer');
  await chrome.storage.local.set({ mn_notabs_count: 0 });
}

// Si no hay ninguna pestaña de Facebook abierta, no hay nada que vigilar:
// avisa una vez al día para que no creas que está funcionando.
async function noteNoTabs() {
  const d = await chrome.storage.local.get(['mn_notabs_count', 'mn_notabs_day']);
  const count = (d.mn_notabs_count || 0) + 1;
  const today = new Date().toISOString().slice(0, 10);
  await chrome.storage.local.set({ mn_notabs_count: count });
  if (count >= 30 && d.mn_notabs_day !== today) {
    await chrome.storage.local.set({ mn_notabs_day: today });
    await notifyPC(
      'Asesor Marketplace',
      'No veo ninguna pestaña de Facebook abierta. Abre facebook.com en Chrome para que pueda avisarte de los mensajes.'
    );
  }
}

/* ------------------------- mensajes ------------------------- */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;
  if (msg.type === 'MN_THREADS') {
    processThreads(msg.threads || [], !!msg.watching, msg.current || null).catch((e) => console.error(TAG, e));
  } else if (msg.type === 'MN_TEST') {
    handleTest().then(sendResponse).catch((e) => sendResponse({ ok: false, msg: String(e).slice(0, 200) }));
    return true; // la respuesta es asíncrona
  } else if (msg.type === 'MN_TEST_AI') {
    testAI().then(sendResponse).catch((e) => sendResponse({ ok: false, error: String(e).slice(0, 200) }));
    return true; // la respuesta es asíncrona
  } else if (msg.type === 'MN_DIAGNOSE') {
    diagnose().then(sendResponse).catch((e) => sendResponse({ ok: false, error: String(e).slice(0, 200) }));
    return true; // la respuesta es asíncrona
  } else if (msg.type === 'MN_GETLOG') {
    chrome.storage.local.get('mn_log').then((d) => sendResponse({ ok: true, log: d.mn_log || [] }));
    return true; // la respuesta es asíncrona
  } else if (msg.type === 'AM_CLEAR_DRAFT') {
    // El panel del chat informa que Oswaldo ya usó o descartó el borrador.
    clearDraft(msg.tid).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
    return true; // la respuesta es asíncrona
  }
});

// Diagnóstico: qué ve la extensión en las pestañas de Facebook
async function diagnose() {
  const s = await getSettings();
  const out = {
    ok: true,
    channel: s.channel || 'whatsapp',
    enabled: s.enabled !== false,
    marketplaceOnly: s.marketplaceOnly !== false,
    ai: (s.asesor_enabled === true && !!String(s.groq_key || '').trim()) ? 'activado' : 'apagado',
    tabs: 0, threads: [], note: ''
  };
  let tabs = [];
  try {
    tabs = await chrome.tabs.query({
      url: ['https://www.facebook.com/*', 'https://www.messenger.com/*']
    });
  } catch (e) {
    out.note = 'No se pudieron leer las pestañas: ' + String(e).slice(0, 120);
    return out;
  }
  out.tabs = tabs.length;
  for (const tab of tabs) {
    try {
      const res = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: mnCollectThreads
      });
      const threads = (res && res[0] && res[0].result) || [];
      for (const th of threads) {
        out.threads.push({
          name: th.name,
          unread: th.unread,
          marketplace: th.isMarketplace,
          snippet: String(th.snippet || '').slice(0, 60)
        });
      }
    } catch (e) {
      out.note = 'Una pestaña no dejó leer los chats (prueba recargarla).';
    }
  }
  return out;
}

async function getSettings() {
  const s = await chrome.storage.local.get('mn_settings');
  return Object.assign({}, DEFAULTS, s.mn_settings || {});
}

// Núcleo: compara los chats con lo ya visto y actúa si hay algo nuevo.
// Solo una pasada a la vez: el content script (cada 4 s, una por pestaña)
// y la alarma pueden llegar casi juntos y, sin este candado, avisarían
// dos veces del mismo mensaje. Si ya hay una pasada en curso, esta se
// salta: la siguiente llega en pocos segundos con los mismos datos.
let scanBusy = false;
const OWN_PREFIX = /^(you|t[uú]|usted|vos)\s*:/i; // vista previa de un mensaje MÍO
const SEEN_MAX = 400;

async function processThreads(threads, watching, current) {
  if (scanBusy) return;
  scanBusy = true;
  try {
    await processThreadsLocked(threads, watching, current);
  } finally {
    scanBusy = false;
  }
}

async function processThreadsLocked(threads, watching, current) {
  const s = await getSettings();
  if (!s.enabled || !threads.length) return;

  // Si el content script detectó el vehículo del chat abierto, se
  // aprovecha para completar la ficha de ese cliente (si aún no tiene).
  if (s.asesor_enabled === true && current && current.tid && current.vehicle) {
    await noteVehicle(String(current.tid), String(current.vehicle));
  }
  const openTid = current && current.tid ? String(current.tid) : '';

  const data = await chrome.storage.local.get(['mn_seen', 'mn_warmed']);
  const seen = data.mn_seen || {};
  let warmed = data.mn_warmed === true;
  const now = Date.now();

  for (const th of threads) {
    const prev = seen[th.tid];
    const snippetChanged = !prev || prev.snippet !== th.snippet;
    if (snippetChanged) {
      seen[th.tid] = { snippet: th.snippet, alertAt: prev ? prev.alertAt || 0 : 0, seenAt: now };
    }
    if (!warmed || !snippetChanged) continue; // primera pasada: solo memorizar
    // En el chat que Oswaldo tiene abierto, Facebook lo marca como leído al
    // instante: se considera mensaje nuevo del cliente si el texto cambió
    // y no es un mensaje que él mismo envió ("Tú: ..." / "You: ...").
    const isOpenChat = openTid && th.tid === openTid && !OWN_PREFIX.test(th.snippet);
    if (!th.unread && !isOpenChat) continue;
    if (OWN_PREFIX.test(th.snippet)) continue;
    if (s.marketplaceOnly && !th.isMarketplace && !isOpenChat) continue;

    // El aviso al teléfono tiene enfriamiento; el Asesor NO: si el cliente
    // escribe dos mensajes seguidos, el borrador debe cubrir el último.
    const lastAlert = (seen[th.tid] && seen[th.tid].alertAt) || 0;
    if (now - lastAlert >= COOLDOWN_MS) {
      seen[th.tid].alertAt = now;
      if (watching) {
        await mnLog('Mensaje nuevo de ' + th.name + ', pero lo estabas mirando: sin aviso al teléfono');
      } else {
        await alertNewMessage(th);
      }
    }
    // El Asesor trabaja SIEMPRE (también si Oswaldo está mirando el
    // chat): su panel vive dentro de la página y ahí lo necesita.
    await processAsesor(th);
  }
  if (!warmed) warmed = true;

  // Poda: la memoria de chats vistos no crece sin límite.
  const keys = Object.keys(seen);
  if (keys.length > SEEN_MAX) {
    keys.sort((a, b) => (seen[a].seenAt || 0) - (seen[b].seenAt || 0));
    for (const k of keys.slice(0, keys.length - SEEN_MAX)) delete seen[k];
  }
  await chrome.storage.local.set({ mn_seen: seen, mn_warmed: warmed });
}

// Guarda el vehículo detectado en la cabecera del chat abierto, solo si
// la ficha del cliente aún no tiene vehículo.
async function noteVehicle(tid, vehicle) {
  const veh = String(vehicle || '').trim().slice(0, 70);
  if (!veh) return;
  const d = await chrome.storage.local.get('asesor_clients');
  const clients = d.asesor_clients || {};
  const prev = clients[tid];
  if (prev && prev.vehiculo) return;
  const base = mergeClientState(prev || null, { vehiculo: veh }, null, Date.now());
  if (prev && prev.nombre_chat) base.nombre_chat = prev.nombre_chat;
  clients[tid] = base;
  await chrome.storage.local.set({ asesor_clients: clients });
}

async function alertNewMessage(th) {
  const sig = th.tid + '|' + th.snippet;
  const d = await chrome.storage.local.get('mn_dedupe');
  const dd = d.mn_dedupe || {};
  const now = Date.now();
  for (const k of Object.keys(dd)) {
    if (now - dd[k] > DEDUPE_MS) delete dd[k];
  }
  if (dd[sig] && now - dd[sig] < DEDUPE_MS) return;
  dd[sig] = now;
  await chrome.storage.local.set({ mn_dedupe: dd });

  const text =
    '🔔 *Nuevo mensaje en Marketplace*\n\n' +
    'De: ' + th.name + '\n' +
    '"' + th.snippet + '"\n\n' +
    'Abre Messenger: el Asesor ya te está preparando el borrador.';

  const r = await sendNotification(text);
  const s2 = await getSettings();
  const canal = (s2.channel || 'whatsapp') === 'telegram' ? 'Telegram' : 'WhatsApp';
  if (r.ok) {
    await mnLog('Aviso enviado a ' + canal + ': ' + th.name);
    await notifyPC('Asesor Marketplace', 'Aviso enviado a ' + canal + ': ' + th.name);
  } else if (r.reason !== 'missing-config') {
    await mnLog('FALLÓ el envío a ' + canal + ': ' + (r.body || r.reason));
    await notifyPC('Asesor Marketplace', 'No se pudo enviar el aviso: ' + (r.body || r.reason));
  }
}

async function notifyPC(title, message) {
  try {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: title,
      message: message
    });
  } catch (e) {
    console.error(TAG, 'no se pudo mostrar la notificación del PC', e);
  }
}

async function sendWhatsApp(text) {
  const s = await getSettings();
  const phone = String(s.phone || '').replace(/\D/g, '');
  const apikey = String(s.apikey || '').trim();

  if (!phone || !apikey) {
    await notifyPC(
      'Asesor Marketplace',
      'Falta configurar tu número de WhatsApp y la clave de CallMeBot. Abre la configuración de la extensión.'
    );
    return { ok: false, reason: 'missing-config' };
  }

  const url =
    'https://api.callmebot.com/whatsapp.php' +
    '?phone=' + encodeURIComponent(phone) +
    '&text=' + encodeURIComponent(text) +
    '&apikey=' + encodeURIComponent(apikey);

  let body = '';
  try {
    const res = await fetch(url);
    body = await res.text();
  } catch (e) {
    return { ok: false, reason: 'network', body: String(e).slice(0, 200) };
  }

  const ok = /message\s+(sent|queued)/i.test(body);
  return { ok: ok, body: body.slice(0, 200) };
}

async function sendTelegram(text) {
  const s = await getSettings();
  const token = String(s.tg_token || '').trim();
  const chatId = String(s.tg_chatid || '').trim();

  if (!token || !chatId) {
    await notifyPC(
      'Asesor Marketplace',
      'Falta configurar el token de tu bot y tu ID de Telegram. Abre la configuración de la extensión.'
    );
    return { ok: false, reason: 'missing-config' };
  }

  // Telegram no usa el formato *negrita* de WhatsApp: se quitan los asteriscos
  const plain = text.replace(/\*/g, '');

  let body = '';
  try {
    const res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: plain })
    });
    body = await res.text();
  } catch (e) {
    return { ok: false, reason: 'network', body: String(e).slice(0, 200) };
  }

  let ok = false;
  try {
    ok = JSON.parse(body).ok === true;
  } catch (e) {
    ok = false;
  }
  return { ok: ok, body: ok ? body.slice(0, 200) : telegramErrorEs(body) };
}

// Traduce los errores de Telegram a un español que dice qué hacer
function telegramErrorEs(body) {
  let desc = '';
  try {
    desc = JSON.parse(body).description || '';
  } catch (e) {
    desc = String(body || '');
  }
  const d = desc.toLowerCase();
  if (d.includes('chat not found')) {
    return 'Telegram no encuentra ese chat: abre tu bot en Telegram, pulsa Start (o escríbele "hola") y confirma que el ID sea el número que te dio @userinfobot.';
  }
  if (d.includes('unauthorized')) {
    return 'El token no es válido: cópialo de nuevo desde @BotFather.';
  }
  if (d.includes('bot was blocked')) {
    return 'Tienes bloqueado al bot en Telegram: desbloquéalo y pulsa Start.';
  }
  if (d.includes('chat_id')) {
    return 'El ID está mal: usa solo el número que te dio @userinfobot, sin @ ni espacios.';
  }
  return desc || String(body || '').slice(0, 200);
}

// Manda el aviso por el canal elegido en la configuración
async function sendNotification(text) {
  const s = await getSettings();
  if ((s.channel || 'whatsapp') === 'telegram') return sendTelegram(text);
  return sendWhatsApp(text);
}

async function handleTest() {
  const s = await getSettings();
  const where = (s.channel || 'whatsapp') === 'telegram' ? 'tu Telegram' : 'tu WhatsApp';
  const r = await sendNotification(
    '✅ *Prueba del Asesor Marketplace*\n\nSi lees esto, los avisos a tu teléfono ya funcionan.'
  );
  if (r.ok) {
    await notifyPC('Asesor Marketplace', 'Mensaje de prueba enviado a ' + where + '. Revisa tu teléfono.');
    return { ok: true, msg: 'Mensaje de prueba enviado a ' + where + '. Revisa tu teléfono.' };
  }
  if (r.reason === 'missing-config') {
    return { ok: false, msg: 'Falta configurar los datos del canal elegido. Complétalos y pulsa Guardar.' };
  }
  await notifyPC('Asesor Marketplace', 'Falló la prueba: ' + (r.body || r.reason));
  return { ok: false, msg: 'Falló la prueba: ' + (r.body || r.reason) };
}

/* ================================================================
 * MÓDULO ASESOR (v1.0) — MODO SEGURO
 * Cuando llega un mensaje nuevo de un cliente, el Asesor lee ese
 * mensaje JUNTO con la ficha del cliente (memoria del embudo) y
 * prepara un BORRADOR. Ese borrador se guarda en el storage y el
 * content script lo muestra en un panel dentro del chat.
 *
 * ESTA EXTENSIÓN NUNCA ENVÍA ESE BORRADOR. Oswaldo lo pega en el
 * cuadro de mensaje y lo envía él mismo. No existe ninguna ruta de
 * auto-envío en este archivo (la de v0.9 fue eliminada).
 *
 * Si la IA decide que el caso se sale del guión (accion "escalar"),
 * no hay borrador: el panel avisa "Esto te toca a ti" y Oswaldo
 * recibe el aviso por Telegram con el mensaje y el motivo.
 * Si Groq falla o su respuesta no se entiende, NO se inventa ningún
 * borrador: el panel muestra el aviso y se escala por Telegram.
 * ================================================================ */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Groq retira modelos sin mucho aviso: llama-3.3-70b-versatile y
// llama-3.1-8b-instant se apagaron el 2026-08-16 (ver
// console.groq.com/docs/deprecations). Se prueban los modelos en este
// orden y se usa el primero que responda; si uno desaparece, el
// siguiente toma su lugar automáticamente.
const GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
const GROQ_TIMEOUT_MS = 30000;

// ¿El error significa "este modelo ya no existe"? (cambiar de modelo
// sí lo arregla; 401 clave o 429 límite no).
function groqModelGone(status, body) {
  if (status === 404) return true;
  if (status === 400 || status === 403) {
    return /model_decommissioned|model_not_found|decommissioned|does not exist|no longer supported/i.test(String(body || ''));
  }
  return false;
}

// Llama a Groq probando los modelos en orden. Devuelve {res, body, model}
// con la primera respuesta útil; si el modelo ya no existe prueba el
// siguiente, y ante cualquier otro error se detiene.
async function groqChat(key, payload) {
  let last = null;
  for (const model of GROQ_MODELS) {
    const extra = { model: model };
    // reasoning_effort solo lo aceptan los modelos gpt-oss; "low" deja
    // casi todos los tokens para la respuesta (no para "pensar").
    if (model.indexOf('openai/gpt-oss') === 0) extra.reasoning_effort = 'low';
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), GROQ_TIMEOUT_MS);
    let res, body;
    try {
      res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify(Object.assign({}, payload, extra)),
        signal: ctl.signal
      });
      body = await res.text();
    } finally {
      clearTimeout(timer);
    }
    last = { res: res, body: body, model: model };
    if (res.ok || !groqModelGone(res.status, body)) return last;
    await mnLog('Asesor: el modelo ' + model + ' ya no está disponible en Groq; probando el siguiente.');
  }
  return last;
}
const ASESOR_DONE_TTL_MS = 24 * 60 * 60 * 1000; // no procesar 2 veces el mismo mensaje en 24 h

const ASESOR_SYSTEM =
'Eres el asistente de City Cars Houston TX, que atiende por Facebook Marketplace. City Cars NO es dealer ni prestamista: es un PUENTE entre compradores de Houston y dealers con licencia en Texas. ' +
'Preparas BORRADORES de respuesta para que el dueño los revise y los envíe él mismo; tú nunca hablas directamente con el cliente.\n\n' +
'TONO: asesor profesional, cordial y respetuoso, nunca agresivo ni insistente, sin presión ni urgencia inventada. ' +
'Responde en el idioma del cliente: español por defecto; si el cliente escribe en inglés, el borrador va en inglés.\n\n' +
'EL EMBUDO (avanza de a UN paso por mensaje; preguntas cortas; el cliente debe hablar la mayor parte del tiempo):\n' +
'1) Saludo breve + ¿lo busca para trabajo o para familia?\n' +
'2) ¿Cuántas personas suelen viajar? (para recomendar asientos y tamaño)\n' +
'3) Su nombre y su número de teléfono (para que lo contacten por WhatsApp).\n' +
'4) Cierre por elección: proponer un día y DOS horarios para que elija cuándo ir a ver el vehículo o cuándo le escriben.\n' +
'5) Al confirmar, resumir: vehículo, día y hora. Solo ENTONCES se puede dar la dirección (si hay una configurada); si no, decir que se le envía a su teléfono.\n\n' +
'REGLAS DURAS (nunca las rompas):\n' +
'- NUNCA des ni inventes precios, enganche o inicial, mensualidad, APR, plazos ni cifras de dinero. Tampoco preguntes por ellos. Si el cliente pregunta cuánto cuesta o cuánto de inicial: "No publicamos precios: cada dealer con licencia maneja los suyos. El dealer te da el precio, la inicial y los términos por escrito antes de firmar." Luego vuelve al paso del embudo donde ibas.\n' +
'- NUNCA preguntes por su crédito, ingresos, empleo ni presupuesto mensual, y NUNCA pidas ni aceptes por chat ITIN, SSN, números de licencia o identificación, ni datos bancarios. Si el cliente habla de crédito, ITIN o falta de papeles, solo di: "Muchos de nuestros dealers trabajan con ITIN, sin crédito o crédito dañado. La decisión la toma el dealer o el financiador según tu caso."\n' +
'- NUNCA prometas ni insinúes aprobación, ni digas que se financia a todos, ni "sin importar el crédito". Frases prohibidas: "financiamos a todos", "aprobación garantizada", "sin importar tu crédito", "everyone approved".\n' +
'- NUNCA afirmes cosas del vehículo que no estén en el contexto (título, historial, condición, accidentes, disponibilidad). Solo puedes hablar de lo visible: año, millas, tipo, color, equipamiento. Si pregunta por título, historial, disponibilidad o condición, devuelve accion "escalar" con el motivo.\n' +
'- NUNCA inventes reseñas, testimonios ni cuántos dealers hay.\n' +
'- NUNCA compartas la dirección antes de que haya una cita CONFIRMADA con día, hora y teléfono. Excepción: si en el contexto dice que hay una dirección configurada Y el cliente acaba de confirmar su cita, el borrador de confirmación puede incluir esa dirección exacta.\n' +
'- NUNCA compartas datos de un cliente con otro.\n' +
'- Si el cliente se sale del embudo o no sabes qué responder — enojo o insultos, canje (vehículo a cuenta), entrega a domicilio, apartados, depósitos o pagos, temas legales, título o historial del vehículo, regateo insistente, o cualquier tema fuera del guión — devuelve accion "escalar" con el motivo breve.\n\n' +
'FORMATO DE LOS BORRADORES: longitud tipo Messenger, 2 a 5 líneas normalmente, ni telegramas ni discursos. Cuando toque avanzar el embudo, cierra el borrador con la pregunta del siguiente paso.\n\n' +
'EXTRACCIÓN DE DATOS: con cada mensaje del cliente, actualiza la ficha. Ejemplos: "la necesito para mi trabajo" → uso="trabajo"; "somos 5" → personas="5"; un número de 10 dígitos → telefono; "viernes" → dia_cita="viernes"; "6 de la tarde" → hora_cita="6:00 pm"; "por la noche me va mejor" → horario="noche"; su nombre → nombre. No repitas en el borrador preguntas de pasos que la ficha ya tiene respondidos.\n\n' +
'Devuelve SOLO un JSON válido, sin texto fuera del JSON, con esta forma exacta:\n' +
'{"accion":"borrador"|"escalar", "reply":"texto del borrador (vacío si es escalar)", "estado":{solo los campos de la ficha que cambian: vehiculo, uso, personas, horario, nombre, telefono, dia_cita, hora_cita, historial_resumen}, "etapa":"nuevo"|"calificando"|"datos_listos"|"cita_propuesta"|"cita_confirmada"|"escalado"|"cerrado", "motivo":"solo si es escalar, motivo breve en español"}.\n' +
'historial_resumen: una sola línea que resume la conversación hasta ahora (clientes, datos y acuerdos), actualízala en cada respuesta.';

/* ASESOR-CORE-START
 * Funciones puras (sin chrome, sin fetch, sin DOM) para probarlas con
 * node: parser de la decisión del Asesor, merge de la ficha del
 * cliente y detección de vehículo en el texto del chat. */
const ASESOR_ETAPAS = ['nuevo', 'calificando', 'datos_listos', 'cita_propuesta', 'cita_confirmada', 'escalado', 'cerrado'];
const ASESOR_CAMPOS_TEXTO = { vehiculo: 70, uso: 40, personas: 30, horario: 40, nombre: 80, telefono: 25, dia_cita: 40, hora_cita: 20, historial_resumen: 500 };
const ASESOR_CAMPOS_NUM = []; // City Cars no maneja cifras de dinero en la ficha

function asesorEmptyState() {
  return {
    vehiculo: '', uso: '', personas: '', horario: '',
    nombre: '', telefono: '', dia_cita: '',
    hora_cita: '', etapa: 'nuevo', historial_resumen: '', updated: 0
  };
}

function asesorToNumber(v) {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^0-9.]/g, ''));
    return isFinite(n) ? n : null;
  }
  return null;
}

// Deja solo los campos conocidos, con el tipo y tamaño correctos.
// Los valores vacíos NO se incluyen (así nunca borran datos previos).
function asesorCleanUpdates(u) {
  const out = {};
  if (!u || typeof u !== 'object') return out;
  for (const k of Object.keys(ASESOR_CAMPOS_TEXTO)) {
    if (u[k] === undefined || u[k] === null) continue;
    const v = String(u[k]).trim().slice(0, ASESOR_CAMPOS_TEXTO[k]);
    if (v) out[k] = v;
  }
  for (const k of ASESOR_CAMPOS_NUM) {
    if (u[k] === undefined || u[k] === null || u[k] === '') continue;
    const n = asesorToNumber(u[k]);
    if (n !== null) out[k] = n;
  }
  return out;
}

function asesorValidEtapa(e) {
  const v = String(e || '').toLowerCase().trim();
  return ASESOR_ETAPAS.indexOf(v) !== -1 ? v : '';
}

// Interpreta la respuesta de Groq. Devuelve el objeto de decisión o
// null si no es válida (en ese caso NO se inventa ningún borrador).
function parseAsesorDecision(raw) {
  try {
    let t = String(raw || '').trim();
    const fence = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fence) t = fence[1].trim();
    let o;
    try {
      o = JSON.parse(t);
    } catch (e2) {
      // Algunos modelos (gpt-oss) pueden anteponer texto al JSON:
      // se rescata el primer objeto {...} completo que aparezca.
      const a = t.indexOf('{'), b = t.lastIndexOf('}');
      if (a < 0 || b <= a) return null;
      o = JSON.parse(t.slice(a, b + 1));
    }
    if (!o || typeof o !== 'object') return null;
    const accion = String(o.accion || '').toLowerCase().trim();
    if (accion !== 'borrador' && accion !== 'escalar') return null;
    const reply = String(o.reply || '').trim().slice(0, 1500);
    if (accion === 'borrador' && !reply) return null; // un borrador vacío no sirve
    return {
      accion: accion,
      reply: reply,
      estado: asesorCleanUpdates(o.estado),
      etapa: asesorValidEtapa(o.etapa),
      motivo: String(o.motivo || '').trim().slice(0, 300)
    };
  } catch (e) {
    return null;
  }
}

// Aplica actualizaciones parciales sobre la ficha anterior SIN borrar
// los datos que ya existían. `etapa` solo cambia si es una etapa válida.
function mergeClientState(prev, updates, etapa, nowTs) {
  const base = asesorEmptyState();
  if (prev && typeof prev === 'object') {
    const prevClean = asesorCleanUpdates(prev);
    for (const k of Object.keys(prevClean)) base[k] = prevClean[k];
    const pe = asesorValidEtapa(prev.etapa);
    if (pe) base.etapa = pe;
  }
  const clean = asesorCleanUpdates(updates);
  for (const k of Object.keys(clean)) base[k] = clean[k];
  const ne = asesorValidEtapa(etapa);
  if (ne) base.etapa = ne;
  base.updated = (typeof nowTs === 'number' && nowTs > 0) ? nowTs : Date.now();
  return base;
}

// Detecta el vehículo en el texto de la lista de chats. En Marketplace
// el anuncio suele venir como "$5,000 - 2021 Ford F150 Lariat".
function extractVehicle(text) {
  const t = String(text || '').replace(/\s+/g, ' ');
  function clean(v) {
    let out = v.replace(/["“”]/g, '')
      .replace(/\s+(¿|cuanto|cuánto|cuesta|precio|hola|buenas|me interesa|info)\b.*$/i, '')
      .replace(/[.,;:\s]+$/, '')
      .trim();
    // Los títulos de anuncio van en Mayúsculas (2021 Ford F150 Lariat);
    // el mensaje del cliente que sigue en el mismo texto suele empezar
    // en minúscula ("...Lariat la necesito para mi trabajo"): se corta ahí.
    if (/^(?:19|20)\d{2}\s/.test(out)) {
      const words = out.split(' ');
      const kept = [words[0]];
      for (let i = 1; i < words.length; i++) {
        if (/^[a-záéíóúñ]/.test(words[i])) break;
        kept.push(words[i]);
      }
      out = kept.join(' ');
    }
    return out.slice(0, 70) || null;
  }
  let m = t.match(/\$\s?[\d,.]+\s*[-–—]\s*((?:19|20)\d{2}\s+[^•|\n]{2,60})/);
  if (m) return clean(m[1]);
  m = t.match(/((?:19|20)\d{2}\s+(?:Ford|Chevrolet|Chevy|GMC|Ram|Toyota|Nissan|Jeep|Honda|Dodge|Hyundai|Kia|Mazda|Subaru|Volkswagen|VW|BMW|Mercedes|Lexus|Acura|Buick|Cadillac|Chrysler|Infiniti|Mitsubishi|Lincoln|Tesla|Volvo)[^•|\n]{0,45})/i);
  if (m) return clean(m[1]);
  return null;
}
// Candado en código (no solo en el prompt): un borrador con frases prohibidas
// por la regla de publicidad de Texas, o con cifras de dinero, se descarta.
const ASESOR_FRASES_PROHIBIDAS = /financiamos a todos|aprobaci[oó]n garantizada|sin importar (tu|su) cr[eé]dito|everyone approved|we finance (everyone|anyone)|guaranteed approval|no credit (is )?rejected/i;
const ASESOR_DINERO = /\$\s?\d|\b\d[\d,.]*\s?(d[oó]lares|usd|dollars)\b/i;
function asesorReplyViolation(reply) {
  const t = String(reply || '');
  if (ASESOR_FRASES_PROHIBIDAS.test(t)) return 'El borrador usaba una frase prohibida de publicidad.';
  if (ASESOR_DINERO.test(t)) return 'El borrador traía una cifra de dinero.';
  return '';
}
/* ASESOR-CORE-END */

function groqErrorEs(status, body) {
  if (status === 401) return 'La clave de Groq no es válida: pégala de nuevo desde console.groq.com/keys.';
  if (status === 429) return 'Groq dice que hay demasiadas peticiones: espera un minuto e inténtalo de nuevo.';
  if (status === 400) return 'Groq rechazó la petición: ' + String(body || '').slice(0, 120);
  return 'Groq respondió con error ' + status + ': ' + String(body || '').slice(0, 120);
}

/* ------------------------- borradores (storage) ------------------------- */
async function saveDraft(tid, draft) {
  const d = await chrome.storage.local.get('asesor_drafts');
  const drafts = d.asesor_drafts || {};
  drafts[String(tid)] = draft;
  await chrome.storage.local.set({ asesor_drafts: drafts });
}

async function clearDraft(tid) {
  if (!tid) return;
  const d = await chrome.storage.local.get('asesor_drafts');
  const drafts = d.asesor_drafts || {};
  if (drafts[String(tid)]) {
    delete drafts[String(tid)];
    await chrome.storage.local.set({ asesor_drafts: drafts });
  }
}

// Aviso de escalación a Oswaldo: Telegram si está configurado; si no,
// el canal elegido (WhatsApp). Devuelve el resultado del envío.
async function sendEscalation(text) {
  const s = await getSettings();
  if (String(s.tg_token || '').trim() && String(s.tg_chatid || '').trim()) {
    return sendTelegram(text);
  }
  return sendNotification(text);
}

/* ------------------------- cerebro (Groq) ------------------------- */
// Le pregunta al Asesor qué hacer con el mensaje nuevo del cliente,
// dándole la ficha actual. Devuelve la decisión parseada o null si
// algo falló (red, clave, JSON inválido): en ese caso no se inventa
// ningún borrador.
async function groqAsesor(state, clientName, snippet, settings) {
  const key = String(settings.groq_key || '').trim();
  if (!key) return null;
  const ficha = {};
  for (const k of Object.keys(asesorEmptyState())) {
    if (k !== 'updated') ficha[k] = state[k];
  }
  const direccion = String(settings.dealer_address || '').trim();
  const user =
    'Nombre del cliente en el chat: ' + clientName + '\n' +
    'Ficha actual del cliente (JSON): ' + JSON.stringify(ficha) + '\n' +
    'Dirección del dealer configurada: ' + (direccion ? '"' + direccion + '"' : 'NO configurada (si se confirma la cita, el borrador dice que la dirección se le envía a su teléfono)') + '\n' +
    'Mensaje nuevo del cliente: "' + snippet + '"';
  let res, body = '';
  try {
    const out = await groqChat(key, {
      temperature: 0.5,
      max_completion_tokens: 3000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: ASESOR_SYSTEM },
        { role: 'user', content: user }
      ]
    });
    res = out.res;
    body = out.body;
  } catch (e) {
    await mnLog('Asesor: no se pudo contactar a Groq (¿hay internet?). No se preparó borrador.');
    return null;
  }
  if (!res.ok) {
    await mnLog('Asesor: ' + groqErrorEs(res.status, body));
    return null;
  }
  try {
    const data = JSON.parse(body);
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    const parsed = parseAsesorDecision(content);
    if (!parsed) await mnLog('Asesor: la respuesta de Groq no se entendió (JSON inválido). No se preparó borrador.');
    return parsed;
  } catch (e) {
    await mnLog('Asesor: respuesta de Groq inválida. No se preparó borrador.');
    return null;
  }
}

let asesorKeyWarned = false; // para no llenar el registro si falta la clave

/* Punto de entrada del Asesor: se llama cuando se detectó un mensaje
 * nuevo de un cliente (ya se mandó el aviso al teléfono). NUNCA envía
 * nada al cliente: solo guarda un borrador (o el aviso de escalación)
 * para el panel del chat. */
async function processAsesor(th) {
  const s = await getSettings();
  if (s.asesor_enabled !== true) return; // Asesor apagado: solo el aviso normal
  const key = String(s.groq_key || '').trim();
  if (!key) {
    if (!asesorKeyWarned) {
      asesorKeyWarned = true;
      await mnLog('Asesor activado pero sin clave de Groq: pégala en la configuración.');
    }
    return;
  }
  const snippet = String(th.snippet || '').trim();
  if (!snippet) return;

  const sig = th.tid + '|' + snippet;
  const dd = await chrome.storage.local.get('asesor_done');
  const done = dd.asesor_done || {};
  const now = Date.now();
  let pruned = false;
  for (const k of Object.keys(done)) {
    if (now - done[k] > ASESOR_DONE_TTL_MS) { delete done[k]; pruned = true; }
  }
  if (done[sig]) {
    if (pruned) await chrome.storage.local.set({ asesor_done: done });
    return; // este mensaje ya se procesó: no preparar dos borradores
  }
  done[sig] = now;
  await chrome.storage.local.set({ asesor_done: done });

  // Ficha actual del cliente (+ vehículo detectado del anuncio)
  const cd = await chrome.storage.local.get('asesor_clients');
  const clients = cd.asesor_clients || {};
  const prev = clients[th.tid] || null;
  let base = mergeClientState(prev, {}, '', now);
  if (!base.vehiculo) {
    const veh = extractVehicle(snippet);
    if (veh) base = mergeClientState(base, { vehiculo: veh }, '', now);
  }

  let dec = await groqAsesor(base, th.name, snippet, s);
  if (!dec) {
    await asesorFail(th, snippet);
    return;
  }

  // Candado en código (no solo en el prompt): la dirección del dealer
  // jamás sale en un borrador si la cita no quedó CONFIRMADA.
  const direccion = String(s.dealer_address || '').trim();
  if (dec.accion === 'borrador' && direccion && dec.reply.toLowerCase().indexOf(direccion.toLowerCase()) !== -1) {
    const etapaFinal = dec.etapa || base.etapa;
    if (etapaFinal !== 'cita_confirmada') {
      await mnLog('Asesor: se descartó un borrador para ' + th.name + ' porque traía la dirección sin cita confirmada.');
      dec = { accion: 'escalar', reply: '', estado: dec.estado, etapa: 'escalado', motivo: 'El borrador incluía la dirección antes de confirmar la cita. Respóndele tú.' };
    }
  }

  if (dec.accion === 'borrador') {
    const viol = asesorReplyViolation(dec.reply);
    if (viol) {
      await mnLog('Asesor: se descartó un borrador para ' + th.name + ': ' + viol);
      dec = { accion: 'escalar', reply: '', estado: dec.estado, etapa: 'escalado', motivo: viol + ' Respóndele tú.' };
    }
  }

  if (dec.accion === 'escalar') {
    const st = mergeClientState(base, dec.estado, dec.etapa || 'escalado', Date.now());
    st.nombre_chat = th.name;
    clients[th.tid] = st;
    await chrome.storage.local.set({ asesor_clients: clients });
    await saveDraft(th.tid, {
      kind: 'escalar',
      name: th.name,
      snippet: snippet,
      motivo: dec.motivo || 'El caso se salió del guión del Asesor.',
      etapa: st.etapa,
      ts: Date.now()
    });
    const text =
      '🙋 *Asesor: esto te toca a ti* (no preparé borrador)\n\n' +
      'De: ' + th.name + '\n' +
      '"' + snippet + '"\n\n' +
      'Motivo: ' + (dec.motivo || 'fuera del guión');
    const r = await sendEscalation(text);
    if (r.ok) {
      await mnLog('Asesor: caso de ' + th.name + ' escalado a Oswaldo.');
    } else if (r.reason !== 'missing-config') {
      await mnLog('Asesor: FALLÓ el escalado de ' + th.name + ': ' + (r.body || r.reason));
    }
    return;
  }

  // accion === 'borrador': guardar ficha y borrador para el panel.
  const st = mergeClientState(base, dec.estado, dec.etapa, Date.now());
  st.nombre_chat = th.name;
  clients[th.tid] = st;
  await chrome.storage.local.set({ asesor_clients: clients });
  await saveDraft(th.tid, {
    kind: 'borrador',
    name: th.name,
    snippet: snippet,
    reply: dec.reply,
    etapa: st.etapa,
    ts: Date.now()
  });
  await mnLog('Asesor: borrador listo para ' + th.name + ' (etapa: ' + st.etapa + '). Esperando en el panel del chat.');
  await notifyPC('Asesor Marketplace', 'Borrador listo para ' + th.name + '. Ábrelo en su chat: pégalo y envíalo tú.');
}

// Groq falló o respondió algo inválido: SIN borrador inventado.
// El panel muestra el aviso y Oswaldo recibe la escalación.
async function asesorFail(th, snippet) {
  await saveDraft(th.tid, {
    kind: 'error',
    name: th.name,
    snippet: snippet,
    motivo: 'El Asesor no pudo preparar el borrador (falló la conexión con la IA o su respuesta no se entendió). Responde tú este mensaje.',
    ts: Date.now()
  });
  const text =
    '⚠️ *Asesor: no pude preparar el borrador*\n\n' +
    'De: ' + th.name + '\n' +
    '"' + snippet + '"\n\n' +
    'Responde tú este mensaje, por favor.';
  const r = await sendEscalation(text);
  if (r.ok) {
    await mnLog('Asesor: fallo con ' + th.name + ' escalado a Oswaldo.');
  } else if (r.reason !== 'missing-config') {
    await mnLog('Asesor: FALLÓ el aviso de fallo de ' + th.name + ': ' + (r.body || r.reason));
  }
}

// Prueba manual desde la configuración: verifica que la clave de Groq sirva.
async function testAI() {
  const s = await getSettings();
  const key = String(s.groq_key || '').trim();
  if (!key) {
    return { ok: false, error: 'Pega primero tu clave de Groq en la configuración.' };
  }
  let res, body = '', usedModel = '';
  try {
    const out = await groqChat(key, {
      temperature: 0,
      max_completion_tokens: 600,
      messages: [
        { role: 'system', content: 'Responde únicamente con la palabra OK.' },
        { role: 'user', content: 'prueba' }
      ]
    });
    res = out.res;
    body = out.body;
    usedModel = out.model;
  } catch (e) {
    return { ok: false, error: 'No se pudo contactar a Groq (¿hay internet?).' };
  }
  if (!res.ok) return { ok: false, error: groqErrorEs(res.status, body) };
  try {
    const data = JSON.parse(body);
    const content = String(data.choices[0].message.content || '').trim();
    if (!content) return { ok: false, error: 'Groq respondió vacío (' + usedModel + '). Vuelve a intentarlo.' };
    return { ok: true, reply: content.slice(0, 60) + ' (' + usedModel + ')' };
  } catch (e) {
    return { ok: false, error: 'Groq respondió algo inesperado.' };
  }
}
