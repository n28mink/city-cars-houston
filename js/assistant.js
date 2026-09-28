/* City Cars Houston TX — Asistente del sitio (versión gratis, sin IA externa).
 * Identidad: el puente (verde #0F5A3C, dorado #F5B700). Responde con VEHICLES
 * y con el contenido del sitio (cómo funciona, financiamiento, documentos).
 * Genera links individuales por vehículo (?vehiculo=<slug>).
 * Captura de ficha: genera la ficha y la manda a WhatsApp con wa.me prellenado.
 * Nunca inventa precios, mensualidades, APR ni disponibilidad.
 */
(function () {
  'use strict';

  var WA_NUMBER = '12816027044';
  var WA_LINK = 'https://wa.me/' + WA_NUMBER;
  var LIST_MAX = 8;

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

  /* Link individual del vehículo: ficha propia es/carro/<slug>/ o en/car/<slug>/ */
  function siteRoot() {
    try {
      var h = String(location.href).split('?')[0].split('#')[0];
      var m = h.match(/^(.*\/(es|en))(\/|$)/);
      if (m) return { root: m[1] + '/', lang: m[2] };
    } catch (e) { /* noop */ }
    return { root: '', lang: lang() };
  }
  function vehLink(v) {
    var r = siteRoot();
    if (!r.root) return '';
    return r.root + (r.lang === 'en' ? 'car/' : 'carro/') + encodeURIComponent(v.slug) + '/';
  }
  function vMotor(v, l) {
    try {
      var sp = window.SPECS && window.SPECS[v.slug];
      if (sp) {
        var m = l === 'en' ? sp.motor_en : sp.motor_es;
        if (m && m !== 'Por confirmar' && m !== 'To be confirmed') return m;
      }
    } catch (e) { /* noop */ }
    return '';
  }

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
    ['financing', /(itin|sin credito|credito dañado|credito danado|no tengo credito|mal credito|sin seguro|no social|matricula consular|pasaporte|repo|bancarrota|efectivo|por mi cuenta|aprobacion|aprobación|financiamiento|financing|financiar|credit)/],
    ['price', /(precio|price|costo|cuanto cuesta|cuánto|down\s*payment|inicial|enganche|mensual|apr|cuanto al mes|cuanto de inicial)/],
    ['docs', /(documentos|documents|que necesito|requisitos|requirements|papeles|identificacion|licencia)/],
    ['how', /(como funciona|cómo funciona|como trabaja|how (does|it) work|que es city cars|qué es city cars|quienes son|quiénes son)/],
    ['dealer', /(son dealer|es dealer|son un dealer|dealership|concesionario|venden ustedes|ustedes venden)/],
    ['scam', /(estafa|scam|fraude|confiable|seguro|legitimo|legítimo|fake)/],
    ['sedan', /(sedan|sedán|carro chico|altima|civic|corolla|sentra|jetta)/],
    ['truck', /(troca|truck|pickup|camioneta|pick up|f-?150|silverado|\bram\b|sierra|tundra)/],
    ['suv', /(suv|tahoe|yukon|suburban|wrangler|compass|wagoneer|expedition|escalade)/],
    ['fourbyfour', /(4x4|4 x 4|doble traccion|four wheel|awd|4wd)/],
    ['rows3', /(3 filas|tercera fila|third row|7 pasajeros|8 pasajeros|7 seats|8 seats|familiar|family)/],
    ['interest', /(me interesa|me gusta|lo quiero|quiero (ese|este|esa|esta)|más info|mas info|me lo aparto|apartamelo|como le hago|i'm interested|i am interested|i want (it|this|that|more info)|interested in)/],
    ['lead', /(dejar (mis )?datos|ficha|contactame|contáctame|contact me|call me|llamame|llámame|quiero que me (llamen|contacten)|me pueden llamar)/],
    ['list', /(que carros|qué carros|que tienen|inventario|catalogo|catálogo|ver carros|show.*cars|what.*have|list|cars|opciones|options|todos)/],
    ['contact', /(whatsapp|contacto|contact|hablar con alguien|llamar|call|telefono|phone|numero|number)/],
    ['location', /(donde|dónde|where|ubicaci|location|direccion|address|houston)/],
    ['hours', /(horario|hours|abierto|open|cuando abren|a que hora)/],
    ['greeting', /(hola|\bhello\b|\bhi\b|buenas|buenos dias|good morning|buenas tardes|good afternoon)/],
  ];

  function classify(text) {
    var t = norm(text);
    if (findVehicle(text, vehicles())) return 'vehicle';
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i][1].test(t)) return INTENTS[i][0];
    }
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
  function vType(v, l) {
    var m = { truck: { es: 'Troca', en: 'Truck' }, suv: { es: 'SUV', en: 'SUV' }, sedan: { es: 'Sedán', en: 'Sedan' } };
    return (m[v.type] && m[v.type][l]) || v.type;
  }
  function vLine(v, l) {
    var milesWord = l === 'en' ? 'miles' : 'millas';
    var link = vehLink(v);
    var name = link ? '<a href="' + link + '" target="_blank" rel="noopener">' + esc(vName(v)) + '</a>' : esc(vName(v));
    return '• ' + name + ' — ' + esc(vColor(v, l)) + ', ' + esc(v.miles) + ' ' + milesWord;
  }

  /* ---------------- Respuestas (contenido real del sitio + inventario) ---------------- */
  var T = {
    es: {
      greeting: [
        '¡Hola! 👋 Soy el asistente de City Cars Houston, el puente que te conecta con dealers en Houston. ¿Buscas troca, SUV o sedán?',
        '¡Hola! ¿Cómo estás? Tenemos trocas, SUVs y sedanes. Dime qué buscas o toca "🚗 Carros" para ver el inventario.',
      ],
      list: function (list) {
        var shown = list.slice(0, LIST_MAX);
        var lines = shown.map(function (v) { return vLine(v, 'es'); });
        var more = list.length > LIST_MAX
          ? '<br><br>…y ' + (list.length - LIST_MAX) + ' más. Dime qué buscas (troca, SUV, sedán, 4x4, 3 filas) y te muestro.'
          : '';
        return 'Tenemos <b>' + list.length + ' vehículos</b>. Aquí van algunos:<br><br>' + lines.join('<br>') + more +
          '<br><br>Toca el nombre para ver fotos y detalles de cada uno.';
      },
      typeList: function (list, typeEs) {
        var f = list.filter(function (v) { return v.type === typeEs; });
        if (!f.length) return 'Ahorita no tengo ' + typeEs + ' en el inventario. Pregunta por WhatsApp y te confirmamos.';
        var shown = f.slice(0, LIST_MAX);
        var more = f.length > LIST_MAX ? '<br><br>…y ' + (f.length - LIST_MAX) + ' más. Dime un modelo y te doy detalles.' : '';
        return 'Tenemos <b>' + f.length + '</b> ' + typeEs + ':<br><br>' +
          shown.map(function (v) { return vLine(v, 'es'); }).join('<br>') + more;
      },
      vehicle: function (v) {
        var milesWord = 'millas';
        var link = vehLink(v);
        return '🚗 <b>' + esc(vName(v)) + '</b><br>' +
          '• Tipo: ' + esc(vType(v, 'es')) + '<br>' +
          '• Color: ' + esc(vColor(v, 'es')) + '<br>' +
          '• Millas: ' + esc(v.miles) + ' ' + milesWord + '<br>' +
          '• Asientos: ' + esc(vSeats(v, 'es')) +
          (vMotor(v, 'es') ? '<br>• Motor: ' + esc(vMotor(v, 'es')) : '') +
          (v.drive === '4x4' ? '<br>• Tracción: 4x4' : '') +
          (vSeen(v, 'es') ? '<br>• Se ve: ' + esc(vSeen(v, 'es')) : '') +
          (link ? '<br><br>🔗 <a href="' + link + '" target="_blank" rel="noopener">Ver ficha completa con fotos</a>' : '') +
          '<br><br>¿Te interesa? Dime "me interesa" y te tomo tus datos para que el dealer te contacte.';
      },
      fourbyfour: function (list) {
        var f = list.filter(function (v) { return v.drive === '4x4'; });
        if (!f.length) return 'Ahorita no tengo 4x4 confirmados en el inventario, pero pregúntanos por WhatsApp y te confirmamos.';
        var shown = f.slice(0, LIST_MAX);
        return 'Tenemos <b>' + f.length + '</b> 4x4:<br><br>' +
          shown.map(function (v) { return vLine(v, 'es'); }).join('<br>') +
          '<br><br>¿Quieres detalles de alguno? Toca el nombre.';
      },
      rows3: function (list) {
        var f = list.filter(function (v) { return v.rows3; });
        return 'Para familia con 3 filas tenemos:<br><br>' +
          f.map(function (v) { return vLine(v, 'es'); }).join('<br>') +
          '<br><br>¿Te interesa alguno?';
      },
      price: [
        'No publicamos precios en la página: cada dealer con licencia maneja los suyos. Lo que sí te puedo decir de cada vehículo es el año, las millas, el color y los detalles visibles. El dealer te da por escrito el precio, la inicial y los términos antes de firmar. ¿De cuál quieres detalles? O déjame tus datos con "📝 Dejar mis datos" y te contactan.',
      ],
      financing: [
        'Buena noticia: muchos de nuestros dealers trabajan con <b>ITIN, sin crédito o crédito dañado</b>, y también con matrícula consular o pasaporte. La aprobación la decide el dealer o el financiador según tu caso. Cuéntanos tu situación por WhatsApp 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a> y te decimos con honestidad qué esperar.',
      ],
      docs: [
        'Normalmente piden: <b>una identificación, un comprobante de ingresos y uno de domicilio</b>. El dealer te dice exactamente cuáles. Ojo: aquí nunca te pedimos números de documentos.',
      ],
      how: [
        'Así funciona el puente, en 4 salidas:<br><b>1.</b> Nos cuentas tu caso (plan de 1 minuto o WhatsApp).<br><b>2.</b> Te conectamos con dealers con licencia en Houston que trabajan con tu situación.<br><b>3.</b> Vas a ver el vehículo al dealer, con tu familia si quieres.<br><b>4.</b> El dealer te da los números por escrito: aprobación, precio, inicial y términos.',
      ],
      dealer: [
        'No somos dealer: <b>te conectamos con dealers con licencia en Texas</b>. Ellos venden los vehículos y, con sus financiadores, deciden la aprobación y los términos.',
      ],
      scam: [
        'Nuestro único WhatsApp oficial es el <b>(281) 602-7044</b>. Nunca pedimos número de Social ni depósitos por WhatsApp. Si alguien te pide eso en nuestro nombre, no somos nosotros.',
      ],
      contact: [
        'Escríbenos por WhatsApp al <b>(281) 602-7044</b> 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">' + WA_LINK + '</a>',
      ],
      location: [
        'Trabajamos con <b>dealers con licencia en Houston, TX</b>. Cuando eliges un vehículo, te conectamos con el dealer para que vayas a verlo.',
      ],
      hours: [
        'No tenemos un horario fijo publicado: escríbenos por WhatsApp cuando quieras 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">aquí</a> y te respondemos.',
      ],
      fallback: [
        'Mmm, de eso no tengo el dato exacto. Puedo mostrarte el inventario, detalles de cada vehículo, cómo funciona el puente o tomarte tus datos. ¿Qué te gustaría?',
      ],
    },
    en: {
      greeting: [
        'Hi! 👋 I\'m the City Cars Houston assistant, the bridge that connects you with dealers in Houston. Looking for a truck, SUV or sedan?',
      ],
      list: function (list) {
        var shown = list.slice(0, LIST_MAX);
        var lines = shown.map(function (v) { return vLine(v, 'en'); });
        var more = list.length > LIST_MAX
          ? '<br><br>…and ' + (list.length - LIST_MAX) + ' more. Tell me what you\'re looking for (truck, SUV, sedan, 4x4, 3 rows).'
          : '';
        return 'We have <b>' + list.length + ' vehicles</b>. Here are some:<br><br>' + lines.join('<br>') + more +
          '<br><br>Tap a name to see photos and details.';
      },
      typeList: function (list, typeEs) {
        var f = list.filter(function (v) { return v.type === typeEs; });
        if (!f.length) return 'I don\'t have ' + typeEs + ' in stock right now. Ask on WhatsApp and we\'ll confirm.';
        var shown = f.slice(0, LIST_MAX);
        var more = f.length > LIST_MAX ? '<br><br>…and ' + (f.length - LIST_MAX) + ' more. Name a model for details.' : '';
        return 'We have <b>' + f.length + '</b> ' + typeEs + ':<br><br>' +
          shown.map(function (v) { return vLine(v, 'en'); }).join('<br>') + more;
      },
      vehicle: function (v) {
        var link = vehLink(v);
        return '🚗 <b>' + esc(vName(v)) + '</b><br>' +
          '• Type: ' + esc(vType(v, 'en')) + '<br>' +
          '• Color: ' + esc(vColor(v, 'en')) + '<br>' +
          '• Miles: ' + esc(v.miles) + '<br>' +
          '• Seats: ' + esc(vSeats(v, 'en')) +
          (vMotor(v, 'en') ? '<br>• Engine: ' + esc(vMotor(v, 'en')) : '') +
          (v.drive === '4x4' ? '<br>• Drive: 4x4' : '') +
          (vSeen(v, 'en') ? '<br>• Visible: ' + esc(vSeen(v, 'en')) : '') +
          (link ? '<br><br>🔗 <a href="' + link + '" target="_blank" rel="noopener">See full listing with photos</a>' : '') +
          '<br><br>Interested? Say "I\'m interested" and I\'ll take your info so the dealer can contact you.';
      },
      fourbyfour: function (list) {
        var f = list.filter(function (v) { return v.drive === '4x4'; });
        if (!f.length) return 'I don\'t have confirmed 4x4s in stock right now, but ask us on WhatsApp and we\'ll confirm.';
        var shown = f.slice(0, LIST_MAX);
        return 'We have <b>' + f.length + '</b> 4x4s:<br><br>' +
          shown.map(function (v) { return vLine(v, 'en'); }).join('<br>') +
          '<br><br>Want details on any? Tap the name.';
      },
      rows3: function (list) {
        var f = list.filter(function (v) { return v.rows3; });
        return 'For families, these have 3 rows:<br><br>' +
          f.map(function (v) { return vLine(v, 'en'); }).join('<br>') +
          '<br><br>Interested in any?';
      },
      price: [
        'We don\'t publish prices on the site: each licensed dealer sets their own. What I can tell you about each vehicle is the year, miles, color and visible details. The dealer gives you the price, down payment and terms in writing before you sign. Which one do you want details on? Or leave your info with "📝 Leave my info" and they\'ll contact you.',
      ],
      financing: [
        'Good news: many of our dealers work with <b>ITIN, no credit or damaged credit</b>, and also with consular ID or passport. Approval is decided by the dealer or lender based on your case. Tell us your situation on WhatsApp 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">here</a> and we\'ll tell you honestly what to expect.',
      ],
      docs: [
        'They usually ask for: <b>an ID, proof of income and proof of address</b>. The dealer tells you exactly which ones. Note: we never ask for document numbers here.',
      ],
      how: [
        'Here\'s how the bridge works, in 4 steps:<br><b>1.</b> Tell us your case (1-minute plan or WhatsApp).<br><b>2.</b> We connect you with licensed dealers in Houston that work with your situation.<br><b>3.</b> You go see the vehicle at the dealer, with your family if you want.<br><b>4.</b> The dealer gives you the numbers in writing: approval, price, down payment and terms.',
      ],
      dealer: [
        'We\'re not a dealer: <b>we connect you with licensed dealers in Texas</b>. They sell the vehicles and, with their lenders, decide approval and terms.',
      ],
      scam: [
        'Our only official WhatsApp is <b>(281) 602-7044</b>. We never ask for a Social Security number or deposits over WhatsApp. If someone asks you for that in our name, it\'s not us.',
      ],
      contact: [
        'Message us on WhatsApp at <b>(281) 602-7044</b> 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">' + WA_LINK + '</a>',
      ],
      location: [
        'We work with <b>licensed dealers in Houston, TX</b>. When you pick a vehicle, we connect you with the dealer so you can go see it.',
      ],
      hours: [
        'We don\'t have fixed published hours: message us on WhatsApp anytime 👉 <a href="' + WA_LINK + '" target="_blank" rel="noopener">here</a> and we\'ll reply.',
      ],
      fallback: [
        'Hmm, I don\'t have the exact info on that. I can show you the inventory, details on each vehicle, how the bridge works, or take your info. What would you like?',
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
    if (intent === 'truck' || intent === 'suv' || intent === 'sedan') return T[l].typeList(list, intent);
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
    bridgeSVG: bridgeSVG, vehLink: vehLink, WA_NUMBER: WA_NUMBER,
  };
})();
