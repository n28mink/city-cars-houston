# Qué aplicar de Asesor Marketplace v1.0.2 a City Cars Houston

Fuente: `asesor-marketplace-v1.0.2.zip` (extensión de Chrome, hecha para "Oswaldo", octubre 2026). Se leyeron `GUIA.txt`, `manifest.json` y `background.js` completos, donde está el guion de ventas. De `content.js`, `popup.js` y `options.js` solo se revisó con búsquedas si hacían llamadas de red o ejecución dinámica, y no se encontró nada. Todo lo de abajo se contrasta con las reglas de `CLAUDE.md` y con el informe `Metodologías de ventas y captación.md`.

## 1. Qué hace la extensión

- Vigila Messenger/Facebook Marketplace en el navegador y avisa al teléfono (CallMeBot o Telegram) cuando entra un mensaje nuevo.
- Con la clave de Groq, una IA lee el mensaje y la "ficha" del cliente y prepara un **borrador**. Nunca lo envía: el dueño lo pega y lo manda él.
- Si el caso se sale del guion, no hay borrador y avisa "esto te toca a ti".
- Guarda una ficha por cliente con etapa: nuevo → calificando → datos listos → cita propuesta → cita confirmada → escalado → cerrado.

## 2. Ya aplicado en el sitio (`js/assistant.js`)

La ficha que el asistente arma para WhatsApp ahora hace dos preguntas cortas y opcionales, en español e inglés, después del teléfono y el vehículo:

1. **¿Trabajo o familia?** (de su paso 1 del embudo). Se guarda como `Uso`.
2. **¿Mañana, tarde o noche?** Es su "cierre por elección": en vez de preguntar abierto, ofrece opciones. Se guarda como `Mejor horario para responder`.

Cada una se puede saltar escribiendo "omitir" / "skip". La ficha lista para WhatsApp incluye esas líneas solo si el cliente las contestó. No se añadió ninguna pregunta de dinero ni de crédito. Se probó el flujo completo con un script de Node (con y sin respuestas, ES y EN); el resultado fue el esperado y ninguna frase prohibida apareció en la salida.

## 3. Para aplicar a mano en WhatsApp Business (sin código)

- **Un paso por mensaje**, preguntas cortas, el cliente habla la mayor parte. Coincide con SPIN/Voss del informe.
- **Etiquetas con sus etapas:** Nuevo, Calificando, Datos listos, Visita propuesta, Visita confirmada, Escalado, Cerrado. Con eso salen los KPIs sin CRM que propone el informe (porcentaje que pasa de etapa en etapa).
- **Lista de "esto me toca a mí":** enojo o insultos, canje de vehículo, entrega a domicilio, apartados o depósitos, temas legales y regateo insistente. Para City Cars, apartados y depósitos deberían ir siempre a una persona.
- **Cierre por elección:** proponer un día y dos horarios en vez de "¿cuándo puedes?".
- **Dirección solo con visita confirmada** (con día, hora y teléfono). La extensión lo refuerza además en código, no solo en el texto del prompt, y esa es una buena práctica si algún día se automatiza algo.
- **Aviso inmediato al teléfono** cuando entra un mensaje: es speed-to-lead aplicado (el informe marca la evidencia como parcial).
- **Modo seguro:** un humano siempre envía. Es lo que la política de WhatsApp Business exige para automatizar (escalamiento claro a una persona).
- **La respuesta honesta sobre precios** que usa la extensión ("dar una cifra por chat sería inventarla; el desglose llega por escrito antes de firmar") es la misma lógica del asistente actual del sitio. Se mantiene.

## 4. Lo que NO se aplica, y por qué

| Elemento de la extensión | Por qué no |
|---|---|
| Preguntar el **enganche** (down payment) y guardarlo | `CLAUDE.md`: nunca inicial ni montos en mensajes. |
| Preguntar el **pago mensual** que puede pagar | Mismo motivo (mensualidad). |
| Preguntar **crédito** y si trabaja por su cuenta, y pedir estados de cuenta | City Cars no evalúa crédito; es tema del dealer. Solo la frase aprobada: "Muchos de nuestros dealers trabajan con ITIN, sin crédito o crédito dañado." |
| Pedir **3 a 5 referencias personales** con nombre y teléfono | Datos de terceros sin su consentimiento; fuera del rol de puente. [REVISAR CON ABOGADO] |
| Afirmar **"título limpio" con total seguridad** aunque el cliente dude | `CLAUDE.md`: no inventar datos de vehículos. Una afirmación que no se pueda comprobar es riesgo bajo la DTPA de Texas. [REVISAR CON ABOGADO] |
| Presentar los **dólares del anuncio como "enganche estimado"** | Es una cifra de dinero; el sitio no publica montos. |
| Guardar etapa y datos de crédito/ingresos en la ficha | Datos sensibles que City Cars no necesita para ser puente. |

## 5. Cosas a saber de la extensión misma

- **Es para Facebook Marketplace/Messenger, no para WhatsApp.** City Cars convierte por WhatsApp, así que no se puede usar tal cual. Sí sirve si publicas también en Marketplace.
- **Describe otro modelo de negocio:** su prompt dice "vende vehículos financiados". City Cars, según `CLAUDE.md`, no es dealer ni prestamista. Si el texto de la extensión llegara a clientes sin ajustar, contradiría eso.
- **Privacidad:** envía a servicios externos (Groq para redactar; CallMeBot o Telegram para avisar) el nombre del cliente y su mensaje. Sus claves quedan en el navegador. La política de WhatsApp Business y las leyes de privacidad exigen saber con qué terceros se comparten datos de clientes. [REVISAR CON ABOGADO]
- **Lectura de la pantalla de Facebook:** funciona leyendo la página de Messenger, que Facebook cambia sin aviso. Si esto choca con los términos de Meta no se verificó. [REVISAR CON ABOGADO]
- **No se ejecutó la extensión.** Solo se leyó su código.

## 6. Sobre la habilidad `sales:competitive-intelligence`

La habilidad compara contra competidores usando datos de un CRM, transcripciones o correos. Aquí no hubo nada de eso: no se dio lista de competidores, historial de ventas ganadas/perdidas ni reseñas. No se inventó ninguno. La extensión se trató como un material completo de entrada y se extrajo su método. Si quieres una ficha de competidores reales (otros intermediarios de autos en Houston, vendedores de Marketplace), hay que darme los nombres o enlaces para poder buscar.

## 7. Actualización: versión adaptada al modelo puente (v1.1.0)

El dueño confirmó que en Marketplace City Cars también actúa como **puente**, no como vendedor. Por eso la extensión se adaptó en `reports/asesor-marketplace-puente/` (instalable: `reports/asesor-marketplace-puente-v1.1.0.zip`). Cambios respecto a la v1.0.2:

- **Embudo:** trabajo o familia → cuántas personas → nombre y teléfono → cita por elección (un día y dos horarios) → confirmación. Se quitaron enganche, crédito, empleo y presupuesto mensual, tanto del guion como de la ficha.
- **Prompt:** City Cars se presenta como puente, no como dealer ni prestamista. Ante precio o inicial responde que cada dealer maneja los suyos y los da por escrito antes de firmar. Sobre crédito solo usa la frase aprobada de ITIN. Nunca pide ITIN, SSN, identificación ni datos bancarios.
- **Título, historial, condición y disponibilidad:** ya no los afirma; esos mensajes se escalan al dueño.
- **Candado en código:** un borrador con una frase prohibida o una cifra de dinero se descarta y se escala. Lo probado: detecta "$3,000", "Aprobación garantizada" y "We finance everyone", y deja pasar la explicación de que el dealer da los números por escrito.
- **Pruebas:** se revisó la sintaxis de los cuatro scripts y se probaron con Node las funciones puras (ficha, candado, lectura de la respuesta). **No se probó dentro de Chrome ni contra Facebook ni Groq.**
- **Sigue igual:** modo seguro (nunca envía solo), avisos al teléfono, panel del chat, dirección solo con cita confirmada.
- **Pendiente para el dueño:** los avisos y la IA siguen enviando nombre y mensaje del cliente a Groq y a CallMeBot/Telegram, y la lectura de pantalla de Facebook no se ha revisado contra los términos de Meta. [REVISAR CON ABOGADO]
