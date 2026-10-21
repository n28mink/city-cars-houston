/* Pruebas de background.js con un chrome/fetch simulados.
 *   node --test tools/asesor-marketplace/test/ */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = fs.readFileSync(process.env.AM_BG || path.join(__dirname, '..', 'background.js'), 'utf8');

function makeEnv(settings, fetchImpl) {
  const store = { mn_settings: settings };
  const listeners = {};
  const calls = { fetch: [], notif: [] };
  const chrome = {
    storage: { local: {
      async get(k) {
        const keys = Array.isArray(k) ? k : [k];
        const o = {};
        for (const key of keys) if (key in store) o[key] = JSON.parse(JSON.stringify(store[key]));
        return o;
      },
      async set(o) { for (const k of Object.keys(o)) store[k] = JSON.parse(JSON.stringify(o[k])); }
    } },
    alarms: { async get() { return null; }, create() {}, onAlarm: { addListener() {} } },
    runtime: {
      onInstalled: { addListener() {} }, onStartup: { addListener() {} },
      onMessage: { addListener(fn) { listeners.msg = fn; } }
    },
    notifications: { async create(o) { calls.notif.push(o); } },
    tabs: { async query() { return []; } },
    scripting: { async executeScript() { return []; } }
  };
  const fetchFn = async (url, opts) => {
    calls.fetch.push({ url: String(url), opts });
    return fetchImpl(String(url), opts);
  };
  const ctx = { chrome, fetch: fetchFn, console, setTimeout, clearTimeout, AbortController, URL, Date, JSON, Promise };
  vm.createContext(ctx);
  vm.runInContext(SRC + '\n;this.__x={processThreads,parseAsesorDecision,mergeClientState,extractVehicle,groqChat,sendWhatsApp,testAI,mnCollectThreads};', ctx);
  return { x: ctx.__x, store, calls, listeners };
}
const resp = (status, body) => ({ ok: status >= 200 && status < 300, status, text: async () => (typeof body === 'string' ? body : JSON.stringify(body)) });
const groqOk = (obj) => resp(200, { choices: [{ message: { content: JSON.stringify(obj) } }] });
const BASE = { enabled: true, marketplaceOnly: true, channel: 'telegram', tg_token: 'T', tg_chatid: '1', asesor_enabled: true, groq_key: 'K', dealer_address: '' };
const th = (o) => Object.assign({ tid: '100', name: 'Juan', snippet: 'hola', isMarketplace: true, unread: false }, o);

function router(onGroq) {
  return async (url, opts) => {
    if (url.includes('api.telegram.org')) return resp(200, { ok: true });
    if (url.includes('api.groq.com')) return onGroq(JSON.parse(opts.body));
    throw new Error('url inesperada ' + url);
  };
}

test('primera pasada solo memoriza; luego un mensaje sin leer avisa y prepara borrador', async () => {
  const env = makeEnv(BASE, router(() => groqOk({ accion: 'borrador', reply: 'Hola Juan, ¿para trabajo o familia?', etapa: 'calificando', estado: { uso: 'trabajo' } })));
  await env.x.processThreads([th()], false);
  assert.equal(env.calls.fetch.length, 0);
  await env.x.processThreads([th({ snippet: 'Hola, ¿sigue disponible?', unread: true })], false);
  const urls = env.calls.fetch.map((f) => f.url);
  assert.ok(urls.some((u) => u.includes('telegram')), 'aviso a Telegram');
  assert.ok(urls.some((u) => u.includes('groq')), 'llamada a Groq');
  assert.equal(env.store.asesor_drafts['100'].kind, 'borrador');
  assert.equal(env.store.asesor_clients['100'].uso, 'trabajo');
});

test('segundo mensaje dentro del enfriamiento: sin 2º aviso pero SÍ borrador nuevo', async () => {
  let n = 0;
  const env = makeEnv(BASE, router(() => groqOk({ accion: 'borrador', reply: 'r' + (++n), etapa: 'calificando' })));
  await env.x.processThreads([th()], false);
  await env.x.processThreads([th({ snippet: 'uno', unread: true })], false);
  await env.x.processThreads([th({ snippet: 'dos', unread: true })], false);
  const tg = env.calls.fetch.filter((f) => f.url.includes('telegram')).length;
  const gq = env.calls.fetch.filter((f) => f.url.includes('groq')).length;
  assert.equal(tg, 1);
  assert.equal(gq, 2);
  assert.equal(env.store.asesor_drafts['100'].reply, 'r2');
});

test('chat abierto (leído al instante) también genera borrador; mi propio mensaje no', async () => {
  const env = makeEnv(BASE, router(() => groqOk({ accion: 'borrador', reply: 'x' })));
  const cur = { tid: '100', vehicle: null };
  await env.x.processThreads([th()], true, cur);
  await env.x.processThreads([th({ snippet: 'Tú: te mando la info' })], true, cur);
  assert.equal(env.calls.fetch.filter((f) => f.url.includes('groq')).length, 0);
  await env.x.processThreads([th({ snippet: 'Tengo 3 mil de enganche' })], true, cur);
  assert.equal(env.calls.fetch.filter((f) => f.url.includes('groq')).length, 1);
  assert.equal(env.calls.fetch.filter((f) => f.url.includes('telegram')).length, 0, 'mirando el chat: sin aviso al teléfono');
});

test('chat no abierto y ya leído: no se hace nada', async () => {
  const env = makeEnv(BASE, router(() => groqOk({ accion: 'borrador', reply: 'x' })));
  await env.x.processThreads([th()], false);
  await env.x.processThreads([th({ snippet: 'otra cosa' })], false);
  assert.equal(env.calls.fetch.length, 0);
});

test('pasadas simultáneas no duplican avisos ni borradores', async () => {
  const env = makeEnv(BASE, router(async () => { await new Promise((r) => setTimeout(r, 30)); return groqOk({ accion: 'borrador', reply: 'x' }); }));
  await env.x.processThreads([th()], false);
  const msg = [th({ snippet: 'nuevo', unread: true })];
  await Promise.all([env.x.processThreads(msg, false), env.x.processThreads(msg, false), env.x.processThreads(msg, false)]);
  assert.equal(env.calls.fetch.filter((f) => f.url.includes('telegram')).length, 1);
  assert.equal(env.calls.fetch.filter((f) => f.url.includes('groq')).length, 1);
});

test('escalar: sin borrador, panel "escalar" y aviso por Telegram', async () => {
  const env = makeEnv(BASE, router(() => groqOk({ accion: 'escalar', motivo: 'Pide trade-in', etapa: 'escalado' })));
  await env.x.processThreads([th()], false);
  await env.x.processThreads([th({ snippet: 'Aceptan mi troca?', unread: true })], false);
  assert.equal(env.store.asesor_drafts['100'].kind, 'escalar');
  assert.equal(env.store.asesor_clients['100'].etapa, 'escalado');
  assert.equal(env.calls.fetch.filter((f) => f.url.includes('telegram')).length, 2); // aviso + escalación
});

test('Groq falla: panel de error y escalación, nunca un borrador inventado', async () => {
  const env = makeEnv(BASE, router(() => resp(401, { error: { message: 'bad key' } })));
  await env.x.processThreads([th()], false);
  await env.x.processThreads([th({ snippet: 'quiero info', unread: true })], false);
  assert.equal(env.store.asesor_drafts['100'].kind, 'error');
});

test('candado: borrador con la dirección y sin cita confirmada se descarta', async () => {
  const s = Object.assign({}, BASE, { dealer_address: '1234 N Shepherd Dr, Houston' });
  const env = makeEnv(s, router(() => groqOk({ accion: 'borrador', reply: 'Estamos en 1234 N Shepherd Dr, Houston', etapa: 'calificando' })));
  await env.x.processThreads([th()], false);
  await env.x.processThreads([th({ snippet: 'dónde están?', unread: true })], false);
  assert.equal(env.store.asesor_drafts['100'].kind, 'escalar');
  // con cita confirmada sí pasa
  const env2 = makeEnv(s, router(() => groqOk({ accion: 'borrador', reply: 'Cita ok. 1234 N Shepherd Dr, Houston', etapa: 'cita_confirmada' })));
  await env2.x.processThreads([th()], false);
  await env2.x.processThreads([th({ snippet: 'confirmo', unread: true })], false);
  assert.equal(env2.store.asesor_drafts['100'].kind, 'borrador');
});

test('modelo retirado: pasa al siguiente (404 y 400 model_decommissioned); 401 se detiene', async () => {
  const seen = [];
  const env = makeEnv(BASE, async (url, opts) => {
    const m = JSON.parse(opts.body).model; seen.push(m);
    if (m === 'openai/gpt-oss-120b') return resp(400, { error: { code: 'model_decommissioned' } });
    return groqOk({ accion: 'borrador', reply: 'ok' });
  });
  const r = await env.x.groqChat('K', { messages: [] });
  assert.equal(r.res.ok, true);
  assert.deepEqual(seen, ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);
  const bodies = [];
  const env2 = makeEnv(BASE, async (url, opts) => { bodies.push(JSON.parse(opts.body)); return resp(401, 'no'); });
  const r2 = await env2.x.groqChat('K', { messages: [] });
  assert.equal(r2.res.status, 401);
  assert.equal(bodies.length, 1);
  assert.equal(bodies[0].reasoning_effort, 'low');
});

test('testAI: respuesta vacía no se reporta como OK', async () => {
  const env = makeEnv(BASE, async () => resp(200, { choices: [{ message: { content: '' } }] }));
  const r = await env.x.testAI();
  assert.equal(r.ok, false);
  const env2 = makeEnv(BASE, async () => resp(200, { choices: [{ message: { content: 'OK' } }] }));
  assert.equal((await env2.x.testAI()).ok, true);
});

test('CallMeBot "Message queued" cuenta como enviado', async () => {
  const env = makeEnv({ channel: 'whatsapp', phone: '+1 281 555 1234', apikey: '99' }, async () => resp(200, '<b>Message queued. You will receive it in a few seconds.</b>'));
  const r = await env.x.sendWhatsApp('hola');
  assert.equal(r.ok, true);
  assert.ok(env.calls.fetch[0].url.includes('phone=12815551234'));
});

test('MN_TEST responde con el resultado', async () => {
  const env = makeEnv(BASE, router(() => null));
  const out = await new Promise((res) => { env.listeners.msg({ type: 'MN_TEST' }, {}, res); });
  assert.equal(out.ok, true);
});

test('ficha: merge no borra datos; extractVehicle corta el mensaje del cliente', () => {
  const { mergeClientState, extractVehicle, parseAsesorDecision } = makeEnv(BASE, async () => null).x;
  const a = mergeClientState(null, { uso: 'trabajo', down: '3,000' }, 'calificando', 5);
  const b = mergeClientState(a, { credito: 'malo', uso: '' }, 'basura', 6);
  assert.equal(b.uso, 'trabajo'); assert.equal(b.down, 3000); assert.equal(b.credito, 'malo'); assert.equal(b.etapa, 'calificando');
  assert.equal(extractVehicle('$5,000 - 2021 Ford F150 Lariat la necesito para mi trabajo'), '2021 Ford F150 Lariat');
  assert.equal(extractVehicle('2019 Hyundai Elantra ¿cuánto cuesta?'), '2019 Hyundai Elantra');
  assert.equal(parseAsesorDecision('```json\n{"accion":"borrador","reply":"hi"}\n```').reply, 'hi');
  assert.equal(parseAsesorDecision('{"accion":"borrador","reply":""}'), null);
  assert.equal(parseAsesorDecision('basura'), null);
});

test('mnCollectThreads: la hora "· 5m" no entra en la vista previa', () => {
  // simulación mínima de DOM
  const link = (href, text) => ({
    getAttribute: (k) => (k === 'href' ? href : ''), innerText: text,
    querySelectorAll: () => [], querySelector: () => null
  });
  const doc = { querySelectorAll: () => [link('/t/55/', 'Ana\nMe interesa la troca · 5m'), link('/t/56/', 'Luis\nHola\n·\n2 h')] };
  const ctx = { document: doc, getComputedStyle: () => ({ fontWeight: '400' }) };
  vm.createContext(ctx);
  const { x } = (() => { const e = makeEnv(BASE, async () => null); return e; })();
  const out = vm.runInContext('(' + x.mnCollectThreads.toString() + ')()', ctx);
  assert.equal(out[0].snippet, 'Me interesa la troca');
  assert.equal(out[1].snippet, 'Hola');
});
