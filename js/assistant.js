/* City Cars Houston TX — Asistente del sitio (versión gratis, sin IA externa).
 * Responde con los datos de VEHICLES (js/vehicles.js). Bilingüe ES/EN.
 * Nunca inventa precios, mensualidades ni datos que no estén en el inventario:
 * eso se ve directo con el dealer por WhatsApp.
 */
(function () {
  'use strict';

  var WA_LINK = 'https://wa.me/12816027044';
  var WA_LABEL = { es: 'WhatsApp', en: 'WhatsApp' };

  function lang() {
    try {
      var l = (document.documentElement.lang || 'es').toLowerCase();
      return l.indexOf('en') === 0 ? 'en' : 'es';
    } catch (e) { return 'es'; }
  }
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function vehicles() {
    try { return Array.isArray(window.VEHICLES) ? window.VEHICLES : []; }
    catch (e) { return []; }
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------------- Intenciones ---------------- */
  var INTENTS = [
    ['price', /(precio|price|costo|cuanto cuesta|cuánto|down\s*payment|inicial|enganche|mensual|financiamiento|financing|apr|cuanto al mes)/],
    ['fourbyfour', /(4x4|4 x 4|doble traccion|four wheel|awd|4wd)/],
    ['rows3', /(3 filas|tercera fila|third row|7 pasajeros|8 pasajeros|7 seats|8 seats|familiar|family)/],
    ['list', /(que carros|qué carros|que tienen|inventario|catalogo|catálogo|ver carros|show.*cars|what.*have|list|opciones|options)/],
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
    // ¿Menciona un vehículo concreto?
    if (findVehicle(text, vehicles())) return 'vehicle';
    return 'fallback';
  }

  function findVehicle(text, list) {
    var t = norm(text);
    if (!t) return null;
    var best = null, bestScore = 0;
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var vt = norm(v.year + ' ' + v.make + ' ' + v.model + ' ' + (v.slug || ''));
      var score = 0;
      ['make', 'model'].forEach(function (k) {
        norm(v[k]).split(/\s+/).forEach(function (w) {
          if (w.length > 2 && t.indexOf(w) !== -1) score += (k === 'model' ? 2 : 1);
        });
      });
      if (score > bestScore) { bestScore = score; best = v; }
    }
    return bestScore >= 2 ? best : null;
  }

  function vName(v, l) { return (v.year + ' ' + v.make + ' ' + v.model).trim(); }
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
        '¡Hola! 👋 Soy el asistente de City Cars Houston. ¿Buscas troca o SUV? Pregúntame por un modelo o dime qué necesitas.',
        '¡Hola! ¿Cómo estás? Te puedo mostrar nuestras trocas y SUVs, o buscarte algo específico. ¿Qué tienes en mente?',
      ],
      list: function (list) {
        var lines = list.map(function (v, i) {
          return (i + 1) + '. ' + vName(v, 'es') + ' — ' + vColor(v, 'es') + ', ' + v.miles + ' millas';
        });
        return 'Esto es lo que tenemos ahora mismo:<br><br>' + lines.join('<br>') +
          '<br><br>¿Te interesa alguno? Pregúntame por el modelo y te doy los detalles.';
      },
      vehicle: function (v) {
        return '🚗 <b>' + vName(v, 'es') + '</b><br>' +
          '• Color: ' + vColor(v, 'es') + '<br>' +
          '• Millas: ' + v.miles + '<br>' +
          '• Asientos: ' + vSeats(v, 'es') +
          (vSeen(v, 'es') ? '<br>• Destaca: ' + vSeen(v, 'es') : '') +
          '<br><br>¿Te conecto por WhatsApp con el dealer para precio y disponibilidad?';
      },
      fourbyfour: function (list) {
        var f = list.filter(function (v) { return v.drive === '4x4'; });
        if (!f.length) return 'Ahorita no tengo 4x4 confirmados en el inventario, pero pregúntanos por WhatsApp y te confirmamos.';
        return 'Tenemos estos 4x4:<br><br>' + f.map(function (v) { return '• ' + vName(v, 'es') + ' (' + v.miles + ' millas)'; }).join('<br>') +
          '<br><br>¿Quieres detalles de alguno?';
      },
      rows3: function (list) {
        var f = list.filter(function (v) { return v.rows3; });
        return 'Para familia con 3 filas tenemos:<br><br>' + f.map(function (v) { return '• ' + vName(v, 'es') + ' — ' + vSeats(v, 'es'); }).join('<br>') +
          '<br><br>¿Te interesa alguno?';
      },
      price: [
        'Los precios y planes los manejan directamente los dealers con licencia. Te conecto por WhatsApp y te dan todos los detalles 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">escríbenos</a>.',
        'De precios te habla directo el dealer por WhatsApp, así te da el dato exacto del carro que te guste 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a>.',
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
        'Mmm, no estoy seguro de eso. Escríbenos por WhatsApp y una persona te ayuda 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a>. También puedes preguntarme por un modelo o pedirme la lista de carros.',
        'Esa no me la sé 😅. Por WhatsApp te responden directo 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a>. ¿Te muestro los carros que tenemos?',
      ],
    },
    en: {
      greeting: [
        'Hi! 👋 I\'m the City Cars Houston assistant. Looking for a truck or SUV? Ask me about a model or tell me what you need.',
        'Hello! How are you? I can show you our trucks and SUVs, or find something specific. What do you have in mind?',
      ],
      list: function (list) {
        var lines = list.map(function (v, i) {
          return (i + 1) + '. ' + vName(v, 'en') + ' — ' + vColor(v, 'en') + ', ' + v.miles + ' miles';
        });
        return 'Here\'s what we have right now:<br><br>' + lines.join('<br>') +
          '<br><br>Interested in any of them? Ask me about the model for details.';
      },
      vehicle: function (v) {
        return '🚗 <b>' + vName(v, 'en') + '</b><br>' +
          '• Color: ' + vColor(v, 'en') + '<br>' +
          '• Miles: ' + v.miles + '<br>' +
          '• Seats: ' + vSeats(v, 'en') +
          (vSeen(v, 'en') ? '<br>• Highlights: ' + vSeen(v, 'en') : '') +
          '<br><br>Want me to connect you on WhatsApp with the dealer for price and availability?';
      },
      fourbyfour: function (list) {
        var f = list.filter(function (v) { return v.drive === '4x4'; });
        if (!f.length) return 'I don\'t have confirmed 4x4s in stock right now, but ask us on WhatsApp and we\'ll confirm.';
        return 'We have these 4x4s:<br><br>' + f.map(function (v) { return '• ' + vName(v, 'en') + ' (' + v.miles + ' miles)'; }).join('<br>') +
          '<br><br>Want details on any of them?';
      },
      rows3: function (list) {
        var f = list.filter(function (v) { return v.rows3; });
        return 'For families, these have 3 rows:<br><br>' + f.map(function (v) { return '• ' + vName(v, 'en') + ' — ' + vSeats(v, 'en'); }).join('<br>') +
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
        'Hmm, not sure about that one. Message us on WhatsApp and a person will help 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">here</a>. You can also ask me about a model or for the car list.',
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

  /* ---------------- Widget ---------------- */
  var CSS_ID = 'cch-assistant-css';
  function injectWidget() {
    if (document.getElementById('cch-assistant')) return;
    var l = lang();
    var wrap = document.createElement('div');
    wrap.id = 'cch-assistant';
    wrap.innerHTML =
      '<button id="cch-fab" aria-label="' + (l === 'en' ? 'Chat assistant' : 'Asistente de chat') + '">💬</button>' +
      '<div id="cch-panel" hidden>' +
        '<div id="cch-head"><span>' + (l === 'en' ? 'City Cars assistant' : 'Asistente City Cars') + '</span>' +
        '<button id="cch-close" aria-label="×">×</button></div>' +
        '<div id="cch-msgs"></div>' +
        '<div id="cch-chips">' +
          '<button data-q="' + (l === 'en' ? 'Show me the cars' : 'Ver carros') + '">' + (l === 'en' ? '🚗 Cars' : '🚗 Carros') + '</button>' +
          '<button data-q="4x4">4x4</button>' +
          '<button data-q="' + (l === 'en' ? 'WhatsApp' : 'WhatsApp') + '">📲 WhatsApp</button>' +
        '</div>' +
        '<div id="cch-inputrow"><input id="cch-input" type="text" placeholder="' +
          (l === 'en' ? 'Ask about a truck or SUV…' : 'Pregunta por una troca o SUV…') +
          '" autocomplete="off"><button id="cch-send" aria-label="➤">➤</button></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var fab = document.getElementById('cch-fab');
    var panel = document.getElementById('cch-panel');
    var msgs = document.getElementById('cch-msgs');
    var input = document.getElementById('cch-input');
    var opened = false;

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
        typing.remove();
        addMsg(html, 'bot');
      }, 600 + Math.random() * 700);
    }
    function send(text) {
      var q = (text || '').trim();
      if (!q) return;
      addMsg(q.replace(/</g, '&lt;'), 'user');
      input.value = '';
      botSay(buildReply(q));
    }

    fab.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      fab.textContent = panel.hidden ? '💬' : '✕';
      if (!panel.hidden && !opened) {
        opened = true;
        botSay(pick(T[l].greeting));
      }
      if (!panel.hidden) setTimeout(function () { input.focus(); }, 50);
    });
    document.getElementById('cch-close').addEventListener('click', function () {
      panel.hidden = true; fab.textContent = '💬';
    });
    document.getElementById('cch-send').addEventListener('click', function () { send(input.value); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(input.value); });
    var chips = document.querySelectorAll('#cch-chips button');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () { send(this.getAttribute('data-q')); });
    }
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

  // Hooks para pruebas
  window.CCHAssistant = { classify: classify, findVehicle: findVehicle, buildReply: buildReply, lang: lang };
})();
