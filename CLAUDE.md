# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

## Proceso: dividir `inventory.js` en carpetas + Excel de descripción

Cuando el usuario suba un archivo `inventory.js` (formato `window.BUNDLED_INVENTORY = [...]`, un array de vehículos con campos `id`, `slug`, `year`, `make`, `model`, `title`, `mileage`, `downPayment`, `bodyType`, `exteriorColor`, `interiorColor`, `photos`, `folderName`, `fuel`) y pida separarlo en carpetas y generar un Excel, seguir exactamente este procedimiento (ya validado con el usuario):

### 1. Parsear el archivo
- Quitar la línea `"use strict";` y el prefijo `window.BUNDLED_INVENTORY = ` (y el `;` final) para obtener JSON puro.
- Cargar como lista de objetos vehículo.

### 2. Carpetas de 5 vehículos en JSON
- Crear una carpeta general `Inventario`.
- Agrupar los vehículos de 5 en 5 (el último grupo puede tener menos de 5, según el resto).
- **Nombrar cada subcarpeta usando el rango de IDs original del vehículo** (campo `id`, ej. `V-001`, `V-002`...), no inventar nombres tipo "Grupo_001". El patrón es `{primer_id}_{ultimo_id}` (ej. `V-001_V-005`, `V-006_V-010`, ..., último grupo `V-831_V-833`). Si el grupo tiene un solo elemento, usar solo ese id.
- Dentro de cada subcarpeta, **un único archivo JSON** (no uno por vehículo) llamado igual que la carpeta (ej. `V-001_V-005.json`), conteniendo un array con los 5 objetos de vehículo completos (todos los campos originales, sin modificar).

### 3. Excel de descripción
- Archivo `Descripcion_Vehiculos.xlsx`, una fila por vehículo (todas las 833+ filas, sin agrupar).
- Columnas en este orden exacto: `Año`, `Marca`, `Modelo`, `Millaje`, `Color Interno`, `Color Externo`, `Down Payment` (mapean a `year`, `make`, `model`, `mileage`, `interiorColor`, `exteriorColor`, `downPayment`).
- Limpiar cada valor: quitar guiones `-`, comas `,`, paréntesis `(` `)`, y colapsar espacios dobles resultantes (ej. modelo `F-150` → `F150`).
- Encabezado en negrita, columnas con ancho automático.
- Usar `openpyxl` (instalar con `pip install openpyxl` si no está disponible).

### 4. Entrega
- Comprimir la carpeta `Inventario` en `Inventario.zip`.
- Enviar `Inventario.zip` y `Descripcion_Vehiculos.xlsx` al usuario con `SendUserFile`.
- Este es un procesamiento de datos puntual, no un cambio de código del sitio: generar todo en el directorio scratchpad de la sesión, **no** commitear ni pushear nada al repo salvo que el usuario lo pida explícitamente.
