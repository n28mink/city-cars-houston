/* Asesor Marketplace v1.0 — options.js */
'use strict';

const DEFAULTS = {
  enabled: true, marketplaceOnly: true, channel: 'whatsapp',
  phone: '', apikey: '', tg_token: '', tg_chatid: '',
  groq_key: '', asesor_enabled: false, dealer_address: ''
};

function currentChannel() {
  const r = document.querySelector('input[name="channel"]:checked');
  return r ? r.value : 'whatsapp';
}

function toggleSections() {
  const ch = currentChannel();
  document.getElementById('secWhatsapp').style.display = ch === 'telegram' ? 'none' : '';
  document.getElementById('secTelegram').style.display = ch === 'telegram' ? '' : 'none';
}

async function load() {
  const s = await chrome.storage.local.get('mn_settings');
  const cfg = Object.assign({}, DEFAULTS, s.mn_settings || {});
  document.getElementById('phone').value = cfg.phone;
  document.getElementById('apikey').value = cfg.apikey;
  document.getElementById('tg_token').value = cfg.tg_token;
  document.getElementById('tg_chatid').value = cfg.tg_chatid;
  document.getElementById('enabled').checked = cfg.enabled !== false;
  document.getElementById('marketplaceOnly').checked = cfg.marketplaceOnly !== false;
  document.getElementById('asesor_enabled').checked = cfg.asesor_enabled === true;
  document.getElementById('groq_key').value = cfg.groq_key || '';
  document.getElementById('dealer_address').value = cfg.dealer_address || '';
  const radio = document.querySelector('input[name="channel"][value="' + cfg.channel + '"]');
  if (radio) radio.checked = true;
  toggleSections();
}

function status(msg, ok) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.style.color = ok ? 'green' : '#c00';
}

async function saveSettings() {
  const cfg = {
    channel: currentChannel(),
    phone: document.getElementById('phone').value.trim(),
    apikey: document.getElementById('apikey').value.trim(),
    tg_token: document.getElementById('tg_token').value.trim(),
    tg_chatid: document.getElementById('tg_chatid').value.trim(),
    enabled: document.getElementById('enabled').checked,
    marketplaceOnly: document.getElementById('marketplaceOnly').checked,
    asesor_enabled: document.getElementById('asesor_enabled').checked,
    groq_key: document.getElementById('groq_key').value.trim(),
    dealer_address: document.getElementById('dealer_address').value.trim()
  };
  await chrome.storage.local.set({ mn_settings: cfg });
  status('✅ Guardado.', true);
}

document.getElementById('save').addEventListener('click', saveSettings);

document.getElementById('test').addEventListener('click', async () => {
  // Guarda primero (y espera) por si cambió algo; luego pide la prueba
  await saveSettings();
  status('⏳ Enviando prueba…', true);
  chrome.runtime.sendMessage({ type: 'MN_TEST' }, (res) => {
    if (chrome.runtime.lastError) {
      status('❌ No se pudo pedir la prueba: ' + chrome.runtime.lastError.message, false);
      return;
    }
    status((res && res.ok ? '✅ ' : '❌ ') + ((res && res.msg) || 'sin respuesta de la extensión'), !!(res && res.ok));
  });
});

document.getElementById('testAI').addEventListener('click', async () => {
  // Guarda primero (y espera) por si cambió la clave; luego pide la prueba
  await saveSettings();
  status('⏳ Probando la conexión con la IA…', true);
  chrome.runtime.sendMessage({ type: 'MN_TEST_AI' }, (res) => {
    if (chrome.runtime.lastError) {
      status('❌ Falló la prueba de la IA: ' + chrome.runtime.lastError.message, false);
      return;
    }
    if (res && res.ok) {
      status('✅ La IA respondió: ' + res.reply, true);
    } else {
      status('❌ Falló la prueba de la IA: ' + ((res && res.error) || 'sin respuesta de la extensión'), false);
    }
  });
});

document.querySelectorAll('input[name="channel"]').forEach((r) => {
  r.addEventListener('change', toggleSections);
});

document.getElementById('diag').addEventListener('click', () => {
  const el = document.getElementById('diagResult');
  el.style.whiteSpace = 'pre-line';
  el.style.color = '';
  el.textContent = '⏳ Revisando tus pestañas de Facebook…';
  chrome.runtime.sendMessage({ type: 'MN_DIAGNOSE' }, (res) => {
    if (chrome.runtime.lastError || !res || !res.ok) {
      el.textContent = 'No se pudo diagnosticar: ' + ((res && res.error) || (chrome.runtime.lastError && chrome.runtime.lastError.message) || 'sin respuesta de la extensión');
      return;
    }
    const lines = [];
    lines.push('Pestañas de Facebook abiertas: ' + res.tabs);
    lines.push('Chats detectados: ' + res.threads.length);
    const unread = res.threads.filter((t) => t.unread);
    lines.push('Chats sin leer: ' + unread.length + (unread.length ? ' (' + unread.map((t) => t.name).join(', ') + ')' : ''));
    const mp = res.threads.filter((t) => t.marketplace);
    lines.push('Chats de Marketplace: ' + mp.length);
    lines.push('Filtro Marketplace: ' + (res.marketplaceOnly ? 'activado' : 'apagado') + ' | Canal: ' + res.channel + ' | Avisos: ' + (res.enabled ? 'activados' : 'apagados') + ' | Asesor: ' + (res.ai || '?'));
    if (res.note) lines.push(res.note);
    el.textContent = lines.join('\n');
  });
});

function loadLog() {
  const el = document.getElementById('activityLog');
  if (!el) return;
  chrome.runtime.sendMessage({ type: 'MN_GETLOG' }, (res) => {
    void chrome.runtime.lastError;
    const log = (res && res.log) || [];
    el.textContent = log.length ? log.join('\n') : '(sin actividad todavía — espera un minuto con Facebook abierto)';
  });
}

document.getElementById('refreshLog').addEventListener('click', loadLog);

load();
loadLog();
