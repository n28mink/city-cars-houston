/* Asesor Marketplace v1.0 — popup.js
 * Muestra el estado de la configuración y la lista de clientes con su
 * etapa del embudo, leída de chrome.storage.local (asesor_clients). */
'use strict';

const ETAPA_ES = {
  nuevo: 'Nuevo', calificando: 'Calificando', datos_listos: 'Datos listos',
  cita_propuesta: 'Cita propuesta', cita_confirmada: '✅ Cita confirmada',
  escalado: '🙋 Te toca a ti', cerrado: 'Cerrado'
};

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function refreshState() {
  const s = await chrome.storage.local.get('mn_settings');
  const cfg = s.mn_settings || {};
  const channel = cfg.channel || 'whatsapp';
  const ok = channel === 'telegram'
    ? (cfg.tg_token && cfg.tg_chatid)
    : (cfg.phone && cfg.apikey);
  const el = document.getElementById('state');
  if (!ok) {
    el.textContent = '⚠️ Falta configurar los avisos. Abre Configuración y elige WhatsApp o Telegram.';
  } else {
    const asesor = (cfg.asesor_enabled === true)
      ? (cfg.groq_key ? 'Asesor ACTIVO (modo seguro: él envía)' : 'Asesor activo pero SIN clave de Groq')
      : 'Asesor apagado';
    el.textContent = '✅ Avisos por ' + (channel === 'telegram' ? 'Telegram' : 'WhatsApp') + ' ' +
      (cfg.enabled === false ? 'APAGADOS' : 'activos') + '. ' + asesor + '.';
  }
}

async function refreshClients() {
  const box = document.getElementById('clients');
  const d = await chrome.storage.local.get('asesor_clients');
  const clients = d.asesor_clients || {};
  const rows = Object.keys(clients).map((tid) => Object.assign({ _tid: tid }, clients[tid]));
  rows.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  if (!rows.length) {
    box.innerHTML = '<span class="empty">Todavía no hay clientes en el embudo. Cuando un cliente te escriba y el Asesor prepare un borrador, aparecerá aquí.</span>';
    return;
  }
  box.innerHTML = rows.map((c) => {
    const name = c.nombre || c.nombre_chat || 'Cliente';
    const etapa = ETAPA_ES[c.etapa] || c.etapa || 'Nuevo';
    const badgeCls = c.etapa === 'cita_confirmada' ? 'badge ok' : (c.etapa === 'escalado' ? 'badge warn' : 'badge');
    const parts = [];
    if (c.vehiculo) parts.push('🚗 ' + esc(c.vehiculo));
    if (c.telefono) parts.push('📞 ' + esc(c.telefono));
    if (c.down !== null && c.down !== undefined && c.down !== '') parts.push('Down: $' + Number(c.down).toLocaleString('en-US'));
    if (c.dia_cita) parts.push('📅 ' + esc(c.dia_cita) + (c.hora_cita ? ' ' + esc(c.hora_cita) : ''));
    return '<div class="client"><div class="top"><span class="name">' + esc(name) + '</span>' +
      '<span class="' + badgeCls + '">' + esc(etapa) + '</span></div>' +
      (parts.length ? '<div class="data">' + parts.join(' · ') + '</div>' : '') + '</div>';
  }).join('');
}

document.getElementById('test').addEventListener('click', () => {
  const el = document.getElementById('state');
  el.textContent = '⏳ Enviando prueba…';
  chrome.runtime.sendMessage({ type: 'MN_TEST' }, (res) => {
    void chrome.runtime.lastError;
    el.textContent = (res && res.ok ? '✅ ' : '❌ ') + ((res && res.msg) || 'sin respuesta de la extensión');
  });
});

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

refreshState();
refreshClients();
