/* Asesor Marketplace v1.0 — content script (content.js)
 * 1) Lee la lista de chats y se la pasa al background, que decide si
 *    avisa al teléfono y le pide un borrador al Asesor.
 * 2) PANEL DEL ASESOR: si hay un borrador guardado para la conversación
 *    abierta, muestra una tarjeta dentro de la página con el borrador
 *    y tres botones: "Pegar en el chat", "Copiar" y "No usar".
 *
 * MODO SEGURO: este script JAMÁS envía mensajes. "Pegar en el chat"
 * solo ESCRIBE el texto en el cuadro de mensaje (sin Enter, sin clic
 * en enviar): Oswaldo lo revisa y lo envía él con el botón normal de
 * Messenger. El módulo de envío automático de v0.9 fue eliminado.
 */
(() => {
  'use strict';
  const SCAN_MS = 4000;
  const PANEL_MS = 2500;

  function threadIdFromHref(href) {
    const m = String(href || '').match(/\/t\/(\d+)/);
    return m ? m[1] : null;
  }

  // Lee el id del chat desde la URL actual (https://www.messenger.com/t/123...)
  function threadIdFromUrl() {
    return threadIdFromHref(window.location.href);
  }

  function looksUnread(link) {
    const label = (link.getAttribute('aria-label') || '').toLowerCase();
    if (/unread|no le[ií]do|sin leer/.test(label)) return true;
    const candidates = link.querySelectorAll('[aria-hidden="true"]');
    for (const el of candidates) {
      const cs = getComputedStyle(el);
      const w = parseFloat(cs.width) || 0;
      const h = parseFloat(cs.height) || 0;
      if (w <= 0 || w > 14 || h <= 0 || h > 14) continue;
      const br = (cs.borderRadius || '').replace(/\s/g, '');
      const round = br === '50%' || (parseFloat(br) || 0) >= Math.min(w, h) / 2;
      const bg = cs.backgroundColor || '';
      if (round && /0,\s*132,\s*255|24,\s*119,\s*242|8,\s*102,\s*255|59,\s*89,\s*152/.test(bg)) return true;
    }
    const firstSpan = link.querySelector('span');
    if (firstSpan) {
      const fw = parseInt(getComputedStyle(firstSpan).fontWeight || '400', 10);
      if (fw >= 600) return true;
    }
    return false;
  }

  function collectThreads() {
    const out = [];
    const links = document.querySelectorAll('a[href*="/t/"]');
    for (const link of links) {
      const tid = threadIdFromHref(link.getAttribute('href'));
      if (!tid) continue;
      const text = (link.innerText || '').trim();
      if (!text) continue;
      // Misma limpieza que en background.js: fuera la hora ("· 5m"), que
      // cambia sola y se confundiría con un mensaje nuevo.
      const lines = text.split('\n').map((s) => s.trim())
        .filter((s) => s && !/^[·•]$/.test(s) && !/^\d+\s?(s|m|min|h|hr|d|w|sem|a)\.?$/i.test(s) && !/^(ahora|now|ayer|yesterday)$/i.test(s));
      if (lines.length === 0) continue;
      out.push({
        tid: tid,
        name: lines[0].slice(0, 60),
        snippet: lines.slice(1).join(' ').replace(/\s*[·•]\s*(\d+\s?(s|m|min|h|hr|d|w|sem|a)\.?|ahora|now|ayer|yesterday)\s*$/i, '').slice(0, 160),
        isMarketplace: /marketplace/i.test(text),
        unread: looksUnread(link)
      });
    }
    return out;
  }

  // Intenta detectar el vehículo del anuncio en la cabecera de la
  // conversación abierta (Marketplace muestra el título del anuncio,
  // ej. "$5,000 - 2021 Ford F150 Lariat", arriba del chat).
  function detectOpenVehicle() {
    try {
      const rePrecio = /\$\s?[\d,.]+\s*[-–—]\s*((?:19|20)\d{2}\s+[^•|]{2,60})/;
      const reAnio = /((?:19|20)\d{2}\s+(?:Ford|Chevrolet|Chevy|GMC|Ram|Toyota|Nissan|Jeep|Honda|Dodge|Hyundai|Kia|Mazda|Subaru|Volkswagen|VW|BMW|Mercedes|Lexus|Acura|Buick|Cadillac|Chrysler|Infiniti|Mitsubishi|Lincoln|Tesla|Volvo)[^•|]{0,45})/i;
      // Solo el área de la conversación: la lista lateral de chats
      // también muestra anuncios y daría el vehículo de OTRO cliente.
      const root = document.querySelector('[role="main"]') || document;
      const els = root.querySelectorAll('h1, h2, h3, [role="heading"], a, span');
      for (const el of els) {
        if (el.closest('a[href*="/t/"]')) continue;
        const r = el.getBoundingClientRect();
        if (r.top < 0 || r.top > 520 || r.width === 0) continue;
        const t = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
        if (!t || t.length > 140) continue;
        let m = t.match(rePrecio);
        if (m) return m[1].trim().slice(0, 70);
        m = t.match(reAnio);
        if (m) return m[1].trim().slice(0, 70);
      }
    } catch (e) { /* detección opcional: si falla, no pasa nada */ }
    return null;
  }

  function report() {
    try {
      const tid = threadIdFromUrl();
      const payload = {
        type: 'MN_THREADS',
        watching: !document.hidden && document.hasFocus(),
        threads: collectThreads()
      };
      if (tid) {
        payload.current = { tid: tid, vehicle: detectOpenVehicle() };
      }
      chrome.runtime.sendMessage(payload);
    } catch (e) {
      /* Si el background está dormido, el despertador (alarma) lo cubre. */
    }
  }

  setInterval(report, SCAN_MS);
  setTimeout(report, 1500);

  /* ================================================================
   * PANEL DEL ASESOR
   * Tarjeta fija abajo a la derecha de la conversación. Muestra el
   * borrador guardado por el background para ESTE chat (clave: el id
   * de la conversación en la URL). Tres casos:
   *   - kind "borrador": textarea editable con el texto + botones.
   *   - kind "escalar":  aviso "Esto te toca a ti" + motivo.
   *   - kind "error":    aviso de que el Asesor no pudo preparar nada.
   * Ningún botón de esta tarjeta envía mensajes.
   * ================================================================ */

  const ETAPA_ES = {
    nuevo: 'Nuevo', calificando: 'Calificando', datos_listos: 'Datos listos',
    cita_propuesta: 'Cita propuesta', cita_confirmada: 'Cita confirmada',
    escalado: 'Te toca a ti', cerrado: 'Cerrado'
  };

  let panelEl = null;
  let panelDraftTs = 0;    // ts del borrador actualmente mostrado
  let dismissedTs = 0;     // ts descartado con la X (no volver a mostrar ese)
  let panelNote = '';      // nota temporal dentro del panel ("pegado ✅", errores...)
  let editedReply = null;  // lo que Oswaldo editó en el textarea (sobrevive a re-renders)
  let holdUntil = 0;       // mientras dure, no quitar el panel aunque el borrador ya se haya borrado

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // Busca la caja de mensaje del chat (varios selectores por si
  // Facebook cambia el diseño; devuelve la que se ve en pantalla).
  function findComposer() {
    const selectors = [
      'div[contenteditable="true"][role="textbox"]',
      'div[role="textbox"][contenteditable="true"]',
      'div[contenteditable="true"][aria-label]'
    ];
    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width > 100 && r.height > 10 && r.bottom <= window.innerHeight + 200) return el;
      }
    }
    return null;
  }

  async function waitForComposer(timeoutMs) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const el = findComposer();
      if (el) return el;
      await sleep(400);
    }
    return null;
  }

  // ESCRIBE el texto en el cuadro de mensaje. SOLO escribir: jamás
  // manda Enter ni pulsa el botón de enviar. Oswaldo envía él.
  async function pasteIntoComposer(text) {
    const composer = await waitForComposer(8000);
    if (!composer) return { ok: false, error: 'No encontré el cuadro de mensaje de este chat. Usa el botón Copiar y pégalo tú con Ctrl+V.' };
    const previo = (composer.innerText || '').trim();
    if (previo) {
      return { ok: false, error: 'El cuadro de mensaje ya tiene texto escrito. Bórralo o envíalo primero y vuelve a pulsar "Pegar en el chat".' };
    }
    composer.focus();
    try {
      const range = document.createRange();
      range.selectNodeContents(composer);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) { /* si falla el cursor, se escribe igual */ }
    // Línea por línea con salto de línea SUAVE (insertLineBreak = Shift+Enter):
    // un "\n" suelto dentro de insertText puede comportarse como Enter en
    // algunos editores. Aquí nunca se pulsa Enter ni el botón de enviar.
    let ok = false;
    try {
      const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
      ok = true;
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) ok = document.execCommand('insertLineBreak') && ok;
        if (lines[i]) ok = document.execCommand('insertText', false, lines[i]) && ok;
      }
    } catch (e) { ok = false; }
    if (!ok || !(composer.innerText || '').trim()) {
      // Plan B: escribir el contenido y avisar a React con un evento input
      composer.textContent = text;
      composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }
    if ((composer.innerText || '').trim()) return { ok: true };
    return { ok: false, error: 'No pude escribir en el cuadro de mensaje. Usa el botón Copiar y pégalo tú con Ctrl+V.' };
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Plan B para navegadores/páginas donde el portapapeles directo falla
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return !!ok;
      } catch (e2) {
        return false;
      }
    }
  }

  function clearDraftInBackground(tid) {
    try {
      chrome.runtime.sendMessage({ type: 'AM_CLEAR_DRAFT', tid: String(tid) });
    } catch (e) { /* noop */ }
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function stateSummary(st) {
    if (!st) return '';
    const parts = [];
    if (st.vehiculo) parts.push('🚗 ' + st.vehiculo);
    if (st.uso) parts.push('Uso: ' + st.uso);
    if (st.personas) parts.push('👥 ' + st.personas);
    if (st.horario) parts.push('🕒 ' + st.horario);
    if (st.telefono) parts.push('📞 ' + st.telefono);
    if (st.dia_cita) parts.push('📅 ' + st.dia_cita + (st.hora_cita ? ' ' + st.hora_cita : ''));
    return parts.join(' · ');
  }

  function removePanel() {
    if (panelEl) { panelEl.remove(); panelEl = null; }
    panelDraftTs = 0;
    panelNote = '';
    editedReply = null;
  }

  function renderPanel(tid, draft, state) {
    if (!panelEl) {
      panelEl = document.createElement('div');
      panelEl.id = 'am-panel';
      panelEl.style.cssText =
        'position:fixed;right:14px;bottom:86px;width:368px;max-width:calc(100vw - 28px);z-index:2147483000;' +
        'background:#ffffff;border:2px solid #1877f2;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.28);' +
        'font-family:Arial,sans-serif;color:#1c1e21;font-size:13px;overflow:hidden;';
      document.body.appendChild(panelEl);
    }
    const etapa = draft.etapa || (state && state.etapa) || '';
    const etapaTxt = etapa ? (ETAPA_ES[etapa] || etapa) : '';
    let head = '🤖 <b>Asesor</b> — ' + esc(draft.name || 'Cliente');
    if (etapaTxt) head += ' · <span style="background:#e7f0fe;border-radius:8px;padding:1px 7px;font-size:11px">' + esc(etapaTxt) + '</span>';

    let body = '';
    const replyText = editedReply !== null ? editedReply : draft.reply;
    if (draft.kind === 'borrador') {
      body =
        '<div style="margin-bottom:6px">✍️ <b>Borrador sugerido</b> — revísalo, edítalo si quieres, pégalo y envíalo TÚ:</div>' +
        '<textarea id="am-reply" rows="6" style="width:100%;box-sizing:border-box;font-family:Arial,sans-serif;font-size:13px;padding:8px;border:1px solid #ccd0d5;border-radius:8px;resize:vertical">' + esc(replyText) + '</textarea>' +
        '<div style="display:flex;gap:6px;margin-top:8px">' +
        '<button id="am-paste" style="flex:1;background:#1877f2;color:#fff;border:0;border-radius:8px;padding:9px 4px;font-size:13px;cursor:pointer">📋 Pegar en el chat</button>' +
        '<button id="am-copy" style="flex:1;background:#e4e6eb;color:#1c1e21;border:0;border-radius:8px;padding:9px 4px;font-size:13px;cursor:pointer">Copiar</button>' +
        '<button id="am-dismiss" style="flex:1;background:#e4e6eb;color:#1c1e21;border:0;border-radius:8px;padding:9px 4px;font-size:13px;cursor:pointer">No usar</button>' +
        '</div>' +
        '<div style="font-size:11px;color:#65676b;margin-top:6px">“Pegar” solo escribe el texto en el cuadro de mensaje. El envío lo haces tú con el botón de Messenger. Esta extensión nunca envía sola.</div>';
    } else if (draft.kind === 'escalar') {
      body =
        '<div style="font-size:14px;margin-bottom:6px">🙋 <b>Esto te toca a ti</b></div>' +
        '<div style="margin-bottom:6px">El cliente escribió:<br><i>“' + esc(draft.snippet) + '”</i></div>' +
        '<div style="margin-bottom:8px"><b>Motivo:</b> ' + esc(draft.motivo || 'El caso se salió del guión.') + '</div>' +
        '<div style="font-size:11px;color:#65676b;margin-bottom:8px">También te llegó el aviso por Telegram. No hay borrador para este mensaje.</div>' +
        '<button id="am-dismiss" style="width:100%;background:#e4e6eb;color:#1c1e21;border:0;border-radius:8px;padding:9px 4px;font-size:13px;cursor:pointer">Entendido</button>';
    } else { // error
      body =
        '<div style="font-size:14px;margin-bottom:6px">⚠️ <b>El Asesor no pudo preparar el borrador</b></div>' +
        '<div style="margin-bottom:6px">El cliente escribió:<br><i>“' + esc(draft.snippet) + '”</i></div>' +
        '<div style="margin-bottom:8px">' + esc(draft.motivo || 'Falló la conexión con la IA.') + '</div>' +
        '<button id="am-dismiss" style="width:100%;background:#e4e6eb;color:#1c1e21;border:0;border-radius:8px;padding:9px 4px;font-size:13px;cursor:pointer">Entendido</button>';
    }

    const sum = stateSummary(state);
    panelEl.innerHTML =
      '<div style="background:#e7f0fe;padding:8px 12px;display:flex;justify-content:space-between;align-items:center">' +
      '<span>' + head + '</span>' +
      '<span id="am-close" title="Cerrar por ahora" style="cursor:pointer;font-weight:bold;padding:0 4px">✕</span>' +
      '</div>' +
      '<div style="padding:10px 12px">' + body +
      (sum ? '<div style="font-size:11px;color:#3a5a80;margin-top:8px;border-top:1px solid #e4e6eb;padding-top:6px">' + esc(sum) + '</div>' : '') +
      (panelNote ? '<div id="am-note" style="font-size:12px;margin-top:8px;font-weight:bold">' + esc(panelNote) + '</div>' : '') +
      '</div>';

    const closeBtn = panelEl.querySelector('#am-close');
    if (closeBtn) closeBtn.addEventListener('click', () => { dismissedTs = draft.ts || 0; removePanel(); });

    if (draft.kind === 'borrador') {
      const ta = panelEl.querySelector('#am-reply');
      ta.addEventListener('input', () => { editedReply = ta.value; });
      panelEl.querySelector('#am-paste').addEventListener('click', async () => {
        editedReply = ta.value;
        panelNote = '⏳ Pegando en el cuadro de mensaje…';
        renderPanel(tid, draft, state);
        const r = await pasteIntoComposer(ta.value);
        if (r.ok) {
          panelNote = '✅ Texto pegado en el cuadro de mensaje. Revísalo y envíalo TÚ con el botón de Messenger.';
          // Mantener la confirmación visible unos segundos aunque el
          // borrador ya se borre del storage.
          holdUntil = Date.now() + 6000;
          clearDraftInBackground(tid);
          dismissedTs = draft.ts || 0;
          renderPanel(tid, draft, state);
          setTimeout(() => { if (panelDraftTs === (draft.ts || 0)) removePanel(); }, 6000);
        } else {
          panelNote = '❌ ' + r.error;
          renderPanel(tid, draft, state);
        }
      });
      panelEl.querySelector('#am-copy').addEventListener('click', async () => {
        const ok = await copyToClipboard(ta.value);
        panelNote = ok ? '✅ Borrador copiado. Pégalo en el cuadro de mensaje con Ctrl+V y envíalo tú.' : '❌ No pude copiar automáticamente: selecciona el texto del borrador y cópialo con Ctrl+C.';
        if (ok) {
          // El panel (con el texto) se queda un minuto para que lo pegues.
          holdUntil = Date.now() + 60000;
          clearDraftInBackground(tid);
        }
        renderPanel(tid, draft, state);
      });
      panelEl.querySelector('#am-dismiss').addEventListener('click', () => {
        clearDraftInBackground(tid);
        dismissedTs = draft.ts || 0;
        removePanel();
      });
    } else {
      const btn = panelEl.querySelector('#am-dismiss');
      if (btn) btn.addEventListener('click', () => {
        clearDraftInBackground(tid);
        dismissedTs = draft.ts || 0;
        removePanel();
      });
    }
    panelDraftTs = draft.ts || 0;
  }

  async function checkPanel() {
    const tid = threadIdFromUrl();
    if (!tid) { if (panelEl) removePanel(); return; }
    let data;
    try {
      data = await chrome.storage.local.get(['asesor_drafts', 'asesor_clients']);
    } catch (e) { return; }
    const draft = (data.asesor_drafts || {})[tid];
    if (!draft) {
      if (panelEl && Date.now() < holdUntil) return; // dejar ver la confirmación
      if (panelEl) removePanel();
      return;
    }
    if ((draft.ts || 0) === dismissedTs) return;          // ya descartado por Oswaldo
    if (panelEl && panelDraftTs === (draft.ts || 0)) return; // ya mostrado, no re-renderizar
    const state = (data.asesor_clients || {})[tid] || null;
    panelNote = '';
    editedReply = null;
    renderPanel(tid, draft, state);
  }

  setInterval(checkPanel, PANEL_MS);
  setTimeout(checkPanel, 1800);
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.asesor_drafts) checkPanel();
    });
  } catch (e) { /* el sondeo cada 2.5 s lo cubre */ }
})();

