/* City Cars Houston TX — Asistente del sitio (versión gratis, sin IA externa).
 * Identidad: el puente (verde #0F5A3C, dorado #F5B700). Responde con VEHICLES.
 * Incluye captura de ficha: genera la ficha del interesado y la manda a
 * WhatsApp con un enlace wa.me prellenado (el visitante la envía con un toque).
 */
(function () {
  'use strict';

  var WA_NUMBER = '12816027044';
  var WA_LINK = 'https://wa.me/' + WA_NUMBER;

  function lang() {
    try {
      var l = (document.documentElement.lang || 'es').toLowerCase();
      return l.indexOf('en') === 0 ? 'en' : 'es';
    } catch (e) { return 'es'; }
  }
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function vehicles() {
    try { return Array.isArray(window.VEHICLES) ? window.VEHICLES : []; }
    catch (e) { return []; }
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function esc(s) { return String(s == null ? '' : s).replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* Puente mini (SVG inline, blanco + dorado sobre verde) */
  function bridgeSVG(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">' +
      '<path d="M10 42h44" stroke="#F5B700" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M18 42V28M46 42V28" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path class="cch-arc" d="M10 28c6-11 16-17 22-17s16 6 22 17" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ---------------- Intenciones ---------------- */
  var INTENTS = [
    ['price', /(precio|price|costo|cuanto cuesta|cuánto|down\s*payment|inicial|enganche|mensual|financiamiento|financing|apr|cuanto al mes)/],
    ['fourbyfour', /(4x4|4 x 4|doble traccion|four wheel|awd|4wd)/],
    ['rows3', /(3 filas|tercera fila|third row|7 pasajeros|8 pasajeros|7 seats|8 seats|familiar|family)/],
    ['interest', /(me interesa|me gusta|lo quiero|quiero (ese|este|esa|esta)|más info|mas info|me lo aparto|apartamelo|como le hago|i'm interested|i am interested|i want (it|this|that|more info)|interested in)/],
    ['lead', /(dejar (mis )?datos|ficha|contactame|contáctame|contact me|call me|llamame|llámame|quiero que me (llamen|contacten)|me pueden llamar)/],
    ['list', /(que carros|qué carros|que tienen|inventario|catalogo|catálogo|ver carros|show.*cars|what.*have|list|cars|opciones|options)/],
    ['contact', /(whatsapp|contacto|contact|hablar|llamar|call|telefono|phone|numero|number)/],
    ['location', /(donde|dónde|where|ubicaci|location|direccion|address|houston)/],
    ['hours', /(horario|hours|abierto|open|cuando abren)/],
    ['greeting', /(hola|hello|hi|buenas|buenos dias|good morning|buenas tardes|good afternoon)/],
  ];

  function classify(text) {
    var t = norm(text);
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i][1].test(t)) return INTENTS[i][0];
    }
    if (findVehicle(text, vehicles())) return 'vehicle';
    return 'fallback';
  }

  function findVehicle(text, list) {
    var t = norm(text);
    if (!t) return null;
    var best = null, bestScore = 0;
    for (var i = 0; i < list.length; i++) {
      var v = list[i], score = 0;
      ['make', 'model'].forEach(function (k) {
        norm(v[k]).split(/\s+/).forEach(function (w) {
          if (w.length > 2 && t.indexOf(w) !== -1) score += (k === 'model' ? 2 : 1);
        });
      });
      if (score > bestScore) { bestScore = score; best = v; }
    }
    return bestScore >= 2 ? best : null;
  }

  function vName(v) { return ((v.year || '') + ' ' + (v.make || '') + ' ' + (v.model || '')).trim(); }
  function vColor(v, l) { return (v.color && (v.color[l] || v.color.es)) || ''; }
  function vSeats(v, l) { return (v.seats && (v.seats[l] || v.seats.es)) || ''; }
  function vSeen(v, l) {
    var s = v.seen && (v.seen[l] || v.seen.es);
    return Array.isArray(s) ? s.join(', ') : '';
  }

  /* ---------------- Respuestas ---------------- */
  var T = {
    es: {
      greeting: [
        '¡Hola! 👋 Soy el asistente de City Cars Houston, el puente que te conecta con dealers en Houston. ¿Buscas troca o SUV?',
        '¡Hola! ¿Cómo estás? Te muestro nuestras trocas y SUVs, o si ya te gustó alguna, dime y te ayudo con tu ficha.',
      ],
      list: function (list) {
        var lines = list.map(function (v, i) {
          return (i + 1) + '. ' + vName(v) + ' — ' + vColor(v, 'es') + ', ' + v.miles + ' millas';
        });
        return 'Esto es lo que tenemos ahora mismo:<br><br>' + lines.join('<br>') +
          '<br><br>¿Te interesa alguno? Pregúntame por el modelo o dime "me interesa".';
      },
      vehicle: function (v) {
        return '🚗 <b>' + esc(vName(v)) + '</b><br>' +
          '• Color: ' + esc(vColor(v, 'es')) + '<br>' +
          '• Millas: ' + esc(v.miles) + '<br>' +
          '• Asientos: ' + esc(vSeats(v, 'es')) +
          (vSeen(v, 'es') ? '<br>• Destaca: ' + esc(vSeen(v, 'es')) : '') +
          '<br><br>¿Te interesa? Dime "me interesa" y te tomo tus datos para que el dealer te contacte.';
      },
      fourbyfour: function (list) {
        var f = list.filter(function (v) { return v.drive === '4x4'; });
        if (!f.length) return 'Ahorita no tengo 4x4 confirmados en el inventario, pero pregúntanos por WhatsApp y te confirmamos.';
        return 'Tenemos estos 4x4:<br><br>' + f.map(function (v) { return '• ' + esc(vName(v)) + ' (' + esc(v.miles) + ' millas)'; }).join('<br>') +
          '<br><br>¿Quieres detalles de alguno?';
      },
      rows3: function (list) {
        var f = list.filter(function (v) { return v.rows3; });
        return 'Para familia con 3 filas tenemos:<br><br>' + f.map(function (v) { return '• ' + esc(vName(v)) + ' — ' + esc(vSeats(v, 'es')); }).join('<br>') +
          '<br><br>¿Te interesa alguno?';
      },
      price: [
        'Los precios y planes los manejan directamente los dealers con licencia. Te conecto por WhatsApp y te dan todos los detalles 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">escríbenos</a>.',
      ],
      contact: [
        'Claro, escríbenos por WhatsApp y te atendemos 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">' + WA_LINK + '</a>',
      ],
      location: [
        'Trabajamos con dealers con licencia en Houston, TX. Escríbenos por WhatsApp y te conectamos con el más cercano 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a>.',
      ],
      hours: [
        'Por WhatsApp te respondemos todos los días. Escríbenos cuando quieras 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a>.',
      ],
      fallback: [
        'Mmm, no estoy seguro de eso. Escríbenos por WhatsApp y una persona te ayuda 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a>. También puedes pedirme la lista de carros o dejarme tus datos.',
      ],
    },
    en: {
      greeting: [
        'Hi! 👋 I\'m the City Cars Houston assistant, the bridge that connects you with dealers in Houston. Looking for a truck or SUV?',
      ],
      list: function (list) {
        var lines = list.map(function (v, i) {
          return (i + 1) + '. ' + vName(v) + ' — ' + vColor(v, 'en') + ', ' + v.miles + ' miles';
        });
        return 'Here\'s what we have right now:<br><br>' + lines.join('<br>') +
          '<br><br>Interested in any? Ask me about the model or say "I\'m interested".';
      },
      vehicle: function (v) {
        return '🚗 <b>' + esc(vName(v)) + '</b><br>' +
          '• Color: ' + esc(vColor(v, 'en')) + '<br>' +
          '• Miles: ' + esc(v.miles) + '<br>' +
          '• Seats: ' + esc(vSeats(v, 'en')) +
          (vSeen(v, 'en') ? '<br>• Highlights: ' + esc(vSeen(v, 'en')) : '') +
          '<br><br>Interested? Say "I\'m interested" and I\'ll take your info so the dealer can contact you.';
      },
      fourbyfour: function (list) {
        var f = list.filter(function (v) { return v.drive === '4x4'; });
        if (!f.length) return 'I don\'t have confirmed 4x4s in stock right now, but ask us on WhatsApp and we\'ll confirm.';
        return 'We have these 4x4s:<br><br>' + f.map(function (v) { return '• ' + esc(vName(v)) + ' (' + esc(v.miles) + ' miles)'; }).join('<br>') +
          '<br><br>Want details on any of them?';
      },
      rows3: function (list) {
        var f = list.filter(function (v) { return v.rows3; });
        return 'For families, these have 3 rows:<br><br>' + f.map(function (v) { return '• ' + esc(vName(v)) + ' — ' + esc(vSeats(v, 'en')); }).join('<br>') +
          '<br><br>Interested in any?';
      },
      price: [
        'Prices and plans are handled directly by licensed dealers. I\'ll connect you on WhatsApp for full details 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">message us</a>.',
      ],
      contact: [
        'Sure, message us on WhatsApp 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">' + WA_LINK + '</a>',
      ],
      location: [
        'We work with licensed dealers in Houston, TX. Message us on WhatsApp and we\'ll connect you with the nearest one 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">here</a>.',
      ],
      hours: [
        'We reply on WhatsApp every day. Message us anytime 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">here</a>.',
      ],
      fallback: [
        'Hmm, not sure about that one. Message us on WhatsApp and a person will help 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">here</a>. You can also ask for the car list or leave your info.',
      ],
    },
  };

  function buildReply(text) {
    var l = lang();
    var list = vehicles();
    var intent = classify(text);
    var t = T[l][intent];
    if (intent === 'vehicle') {
      var v = findVehicle(text, list);
      if (v) return T[l].vehicle(v);
      return pick(T[l].fallback);
    }
    if (typeof t === 'function') return t(list);
    return pick(t);
  }

  /* ---------------- Ficha (lead) → WhatsApp ---------------- */
  var LEAD_TXT = {
    es: {
      start: '¡Perfecto! Te tomo tus datos para que el dealer te contacte. ¿Cuál es tu nombre?',
      askPhone: function (n) { return 'Gracias, ' + n + '. ¿Cuál es tu número de WhatsApp?'; },
      badPhone: 'Ese número no me cuadra, ¿me lo pasas de nuevo? (solo números, con código de área)',
      askVehicle: '¿Qué carro te interesa? (dime el modelo)',
      review: function (d) {
        return 'Revisemos tu ficha:<br>• Nombre: <b>' + esc(d.name) + '</b><br>• WhatsApp: <b>' + esc(d.phone) + '</b><br>• Vehículo: <b>' + esc(d.vehicle) + '</b><br><br>¿Está bien? (sí / corregir)';
      },
      restart: 'Va de nuevo. ¿Cuál es tu nombre?',
      cancel: 'Sin problema, aquí estoy si me necesitas 👍',
      done: function (link) {
        return '¡Listo! 🎉 Toca el botón para enviarnos tu ficha por WhatsApp:<br><br><a class="cch-wa-btn" href="' + link + '" target="_blank" rel="noopener">📲 Enviar mi ficha por WhatsApp</a><br><br><span class="cch-small">Se abrirá tu WhatsApp con la ficha lista, solo dale enviar.</span>';
      },
    },
    en: {
      start: 'Perfect! I\'ll take your info so the dealer can contact you. What\'s your name?',
      askPhone: function (n) { return 'Thanks, ' + n + '. What\'s your WhatsApp number?'; },
      badPhone: 'That number doesn\'t look right, can you send it again? (digits only, with area code)',
      askVehicle: 'Which car are you interested in? (tell me the model)',
      review: function (d) {
        return 'Let\'s review your info:<br>• Name: <b>' + esc(d.name) + '</b><br>• WhatsApp: <b>' + esc(d.phone) + '</b><br>• Vehicle: <b>' + esc(d.vehicle) + '</b><br><br>Is that right? (yes / correct)';
      },
      restart: 'Let\'s start over. What\'s your name?',
      cancel: 'No problem, I\'m here if you need me 👍',
      cancelWord: 'cancel',
      done: function (link) {
        return 'Done! 🎉 Tap the button to send us your info on WhatsApp:<br><br><a class="cch-wa-btn" href="' + link + '" target="_blank" rel="noopener">📲 Send my info on WhatsApp</a><br><br><span class="cch-small">WhatsApp will open with your info ready, just hit send.</span>';
      },
    },
  };

  function todayStr(l) {
    try {
      var d = new Date();
      return d.toLocaleDateString(l === 'en' ? 'en-US' : 'es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) { return ''; }
  }

  function fichaText(d, l) {
    var lines = l === 'en'
      ? ['New lead - City Cars Houston', 'Name: ' + d.name, 'Phone: ' + d.phone, 'Vehicle of interest: ' + d.vehicle, 'Date: ' + todayStr(l)]
      : ['Nueva ficha - City Cars Houston', 'Nombre: ' + d.name, 'Teléfono: ' + d.phone, 'Vehículo de interés: ' + d.vehicle, 'Fecha: ' + todayStr(l)];
    return lines.join('\n');
  }

  function fichaLink(d, l) {
    return WA_LINK + '?text=' + encodeURIComponent(fichaText(d, l));
  }

  function isCancel(t) { return /(cancelar|cancel|olvídalo|olvidalo|never mind)/.test(norm(t)); }
  function digits(s) { return (s || '').replace(/\D/g, ''); }

  function leadStart(l, vehicleHint) {
    var st = { step: 'name', data: {} };
    if (vehicleHint) st.data.vehicle = vehicleHint;
    return { state: st, reply: LEAD_TXT[l].start, done: false };
  }

  function leadStep(st, text, l) {
    var txt = LEAD_TXT[l];
    var t = (text || '').trim();
    if (isCancel(t)) return { state: null, reply: txt.cancel, done: true, cancelled: true };
    var d = st.data;

    if (st.step === 'name') {
      if (!t) return { state: st, reply: txt.start, done: false };
      d.name = t.length > 40 ? t.slice(0, 40) : t;
      st.step = 'phone';
      return { state: st, reply: txt.askPhone(esc(d.name)), done: false };
    }
    if (st.step === 'phone') {
      var dg = digits(t);
      if (dg.length < 7 || dg.length > 15) return { state: st, reply: txt.badPhone, done: false };
      d.phone = dg;
      if (d.vehicle) {
        st.step = 'review';
        return { state: st, reply: txt.review(d), done: false };
      }
      st.step = 'vehicle';
      return { state: st, reply: txt.askVehicle, done: false };
    }
    if (st.step === 'vehicle') {
      var found = findVehicle(t, vehicles());
      d.vehicle = found ? vName(found) : (t.length > 60 ? t.slice(0, 60) : t);
      if (!d.vehicle) return { state: st, reply: txt.askVehicle, done: false };
      st.step = 'review';
      return { state: st, reply: txt.review(d), done: false };
    }
    if (st.step === 'review') {
      var tn = norm(t);
      if (/^(si|sí|yes|esta bien|está bien|correcto|dale|ok|claro)/.test(tn)) {
        var link = fichaLink(d, l);
        return { state: null, reply: txt.done(link), done: true, ficha: fichaText(d, l), link: link };
      }
      st.step = 'name';
      st.data = d.vehicle ? { vehicle: d.vehicle } : {};
      return { state: st, reply: txt.restart, done: false };
    }
    return { state: null, reply: txt.cancel, done: true, cancelled: true };
  }

  /* ---------------- Widget ---------------- */
  function injectWidget() {
    if (document.getElementById('cch-assistant')) return;
    var l = lang();
    var wrap = document.createElement('div');
    wrap.id = 'cch-assistant';
    wrap.innerHTML =
      '<div id="cch-teaser" hidden>' + (l === 'en' ? 'Looking for a truck or SUV? 👋' : '¿Buscas troca o SUV? 👋') + '</div>' +
      '<button id="cch-fab" aria-label="' + (l === 'en' ? 'Chat assistant' : 'Asistente de chat') + '">' + bridgeSVG(34) + '</button>' +
      '<div id="cch-panel" hidden>' +
        '<div id="cch-head">' + bridgeSVG(26) + '<span>' + (l === 'en' ? 'City Cars assistant' : 'Asistente City Cars') + '</span>' +
        '<button id="cch-close" aria-label="×">×</button></div>' +
        '<div id="cch-msgs"></div>' +
        '<div id="cch-chips">' +
          '<button data-chip="cars">' + (l === 'en' ? '🚗 Cars' : '🚗 Carros') + '</button>' +
          '<button data-chip="4x4">4x4</button>' +
          '<button data-chip="lead">' + (l === 'en' ? '📝 Leave my info' : '📝 Dejar mis datos') + '</button>' +
          '<button data-chip="wa">📲 WhatsApp</button>' +
        '</div>' +
        '<div id="cch-inputrow"><input id="cch-input" type="text" placeholder="' +
          (l === 'en' ? 'Ask about a truck or SUV…' : 'Pregunta por una troca o SUV…') +
          '" autocomplete="off"><button id="cch-send" aria-label="➤">➤</button></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var fab = document.getElementById('cch-fab');
    var panel = document.getElementById('cch-panel');
    var teaser = document.getElementById('cch-teaser');
    var msgs = document.getElementById('cch-msgs');
    var input = document.getElementById('cch-input');
    var opened = false;
    var leadState = null;
    var lastVehicle = null;

    function addMsg(html, who) {
      var d = document.createElement('div');
      d.className = 'cch-msg ' + who;
      d.innerHTML = html;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function botSay(html) {
      var typing = document.createElement('div');
      typing.className = 'cch-msg bot cch-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        addMsg(html, 'bot');
      }, 600 + Math.random() * 700);
    }
    function startLead(vehicleHint) {
      var r = leadStart(l, vehicleHint);
      leadState = r.state;
      botSay(r.reply);
    }
    function send(text) {
      var q = (text || '').trim();
      if (!q) return;
      addMsg(esc(q), 'user');
      input.value = '';
      if (leadState) {
        var r = leadStep(leadState, q, l);
        leadState = r.state;
        botSay(r.reply);
        return;
      }
      var intent = classify(q);
      if (intent === 'interest' || intent === 'lead') { startLead(lastVehicle); return; }
      if (intent === 'vehicle') {
        var v = findVehicle(q, vehicles());
        if (v) lastVehicle = vName(v);
      }
      botSay(buildReply(q));
    }
    function toggle(open) {
      panel.hidden = !open;
      fab.classList.toggle('cch-open', open);
      if (teaser) teaser.hidden = true;
      if (open && !opened) {
        opened = true;
        botSay(pick(T[l].greeting));
      }
      if (open) setTimeout(function () { input.focus(); }, 60);
    }

    fab.addEventListener('click', function () { toggle(panel.hidden); });
    document.getElementById('cch-close').addEventListener('click', function () { toggle(false); });
    if (teaser) teaser.addEventListener('click', function () { toggle(true); });
    document.getElementById('cch-send').addEventListener('click', function () { send(input.value); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(input.value); });
    var chips = document.querySelectorAll('#cch-chips button');
    for (var i = 0; i < chips.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var kind = btn.getAttribute('data-chip');
          if (kind === 'lead') { if (panel.hidden) toggle(true); startLead(lastVehicle); }
          else if (kind === 'wa') { window.open(WA_LINK, '_blank'); }
          else if (kind === '4x4') { if (panel.hidden) toggle(true); send('4x4'); }
          else { if (panel.hidden) toggle(true); send(l === 'en' ? 'Show me the cars' : 'Ver carros'); }
        });
      })(chips[i]);
    }

    /* Teaser: aparece para invitar, se esconde al abrir o a los 14s */
    setTimeout(function () {
      if (!opened && teaser) {
        teaser.hidden = false;
        setTimeout(function () { if (teaser) teaser.hidden = true; }, 14000);
      }
    }, 3000);
  }

  function init() {
    try {
      if (!document.body) return;
      injectWidget();
    } catch (e) { /* el sitio sigue funcionando sin el asistente */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CCHAssistant = {
    classify: classify, findVehicle: findVehicle, buildReply: buildReply,
    leadStart: leadStart, leadStep: leadStep, fichaText: fichaText, fichaLink: fichaLink,
    bridgeSVG: bridgeSVG, WA_NUMBER: WA_NUMBER,
  };
})();
