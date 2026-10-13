# City Cars Houston TX — contexto para Claude Code

## Qué es el negocio
City Cars Houston TX NO es un dealer ni un prestamista. Es un puente entre compradores de Houston
(hispanos y angloparlantes) y muchos dealers con licencia en Texas. El sitio muestra un catálogo
amplio sin cotizaciones ni montos: solo la descripción de cada vehículo (año, millas, tipo, equipamiento).
Toda la conversión va a WhatsApp (+1 281 602 7044, horario 9 am–8 pm todos los días).
No hay backend ni base de datos.

## Estado actual (octubre 2026)
Este repo (`n28mink/city-cars-houston`) es la continuación de un proyecto que empezó en otro repo
(`N28INK/N28`, mismo negocio, mismo modelo de datos) y que avanzó mucho más acá: es el repo
**oficial de ahora en adelante**. El otro quedó en pausa por un problema de permisos de GitHub
que no se pudo resolver; no se sigue tocando.

- **88 vehículos** en `js/vehicles.js` (único archivo para agregar/editar/quitar un carro).
  Esquema: `id` (CCH-01, CCH-02…), `slug`, `make`, `model`, `type` (suv/truck/sedan), `color`,
  `year`, `miles`, `condition`, `seats`, `rows3`, `drive` (solo "4x4" si la foto lo confirma),
  `dealer`, `photos`, `seen` (equipamiento visible), `ideal` (para quién es ideal). **Nunca poner
  precios, inicial, mensualidad, APR ni plazos en este archivo.**
- **178 páginas individuales** por vehículo: `/es/carro/<slug>/` y `/en/car/<slug>/` (2 por idioma × 88 + 2).
- **Asistente/chat** (`js/assistant.js`, `css/assistant.css`): widget flotante que guía al
  visitante y arma el mensaje de WhatsApp. El texto del usuario se pasa por `esc()` (escapa `<` y
  `>`) antes de `innerHTML`; es una mitigación razonable pero no es `textContent` puro — si se toca
  este archivo, preferir `textContent` donde se pueda sin romper el layout del chat.
- `js/app.js`: inventario → tarjetas, filtros, favoritos, planificador. `js/i18n.js`: todos los
  textos ES/EN. `js/specs.js`: specs mecánicas investigadas por modelo.
- **Seguridad:**
  - CSP ya puesta por `<meta http-equiv="Content-Security-Policy">` en cada página (no cubre
    `frame-ancestors`).
  - `vercel.json` (agregado ahora) pone lo que un `<meta>` no puede: HSTS, `X-Frame-Options`,
    `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, y `frame-ancestors` en
    el CSP por header. Sin paso de build: Vercel debe quedar con Root Directory vacío (el sitio
    vive en la raíz del repo) y Framework "Other".
  - `.well-known/security.txt` con el WhatsApp oficial como contacto.
- **Pendiente:** el JSON-LD de `es/index.html`/`en/index.html` todavía apunta a
  `https://n28mink.github.io/city-cars-houston/...` (dominio de una idea anterior de GitHub Pages).
  Hay que reemplazarlo por la URL real de Vercel (o el dominio propio) apenas se confirme el deploy.
- **Despliegue:** falta confirmar/crear el proyecto de Vercel para este repo y conectar el dominio
  propio (mismo proceso que se hizo para el repo anterior: conectar a GitHub, Root Directory vacío,
  sin build command).

## Reglas (igual que siempre)
- Nunca precios, inicial, mensualidad, APR ni plazos en ningún texto ni mensaje de WhatsApp.
- Frases prohibidas (43 TAC §215.247): "financiamos a todos", "aprobación garantizada", "sin
  importar tu crédito", "everyone approved". Usar: "Muchos de nuestros dealers trabajan con ITIN,
  sin crédito o crédito dañado."
- No agregar dependencias ni frameworks sin preguntar.
- No inventar datos de vehículos, reseñas ni número de dealers asociados.
- No usar logos de marcas como elementos de marca.
- Cualquier texto legal lleva marca `[REVISAR CON ABOGADO]` hasta que el dueño lo confirme.
- Enlaces WhatsApp con `new URL()` + `searchParams`, `rel="noopener noreferrer"`.
