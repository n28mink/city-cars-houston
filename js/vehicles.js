// City Cars Houston TX — inventario de vehículos.
// Único archivo a editar para agregar, quitar o corregir un carro.
// Variable global VEHICLES; se carga antes de i18n.js y app.js.
"use strict";

  // =====================================================================
  //  INVENTARIO — el único lugar que hay que editar para cambiar carros.
  //  drive: "4x4" solo cuando las fotos lo confirman (Z71, Rubicon);
  //         null = "por confirmar".
  //  seats: rango según configuración de fábrica; confirmar con el dealer.
  //  dealer: nombre del dealer con licencia que lo ofrece ("" = no se muestra).
  //  No poner precios, inicial, mensualidad, APR ni plazos aquí.
  // =====================================================================
  var VEHICLES = [
    {
      id: "CCH-01", slug: "chevrolet-tahoe-rst-rojo", make: "Chevrolet", model: "Tahoe RST", type: "suv",
      color: { es: "Rojo", en: "Red" }, year: "2025", miles: "25,000", condition: "used",
      seats: { es: "7 u 8 pasajeros", en: "7 or 8 seats" }, rows3: true, drive: null, dealer: "",
      photos: ["tahoe-rst-rojo-1", "tahoe-rst-rojo-2"],
      seen: { es: ["3 filas", "Estribos", "Rines negros", "Escape doble", "Vidrios polarizados"],
              en: ["3 rows", "Running boards", "Black wheels", "Dual exhaust", "Tinted windows"] },
      ideal: { es: "Familias que quieren espacio para todos y un look deportivo, en la ciudad y en la carretera.",
               en: "Families who want room for everyone and a sporty look, around town or on the highway." }
    },
    {
      id: "CCH-02", slug: "gmc-yukon-denali-azul", make: "GMC", model: "Yukon Denali", type: "suv",
      color: { es: "Azul oscuro", en: "Dark blue" }, year: "2022", miles: "45,000", condition: "used",
      seats: { es: "7 u 8 pasajeros", en: "7 or 8 seats" }, rows3: true, drive: null, dealer: "",
      photos: ["yukon-denali-azul-1", "yukon-denali-azul-2"],
      seen: { es: ["3 filas", "Parrilla cromada", "Rines cromados", "Escape doble"],
              en: ["3 rows", "Chrome grille", "Chrome wheels", "Dual exhaust"] },
      ideal: { es: "Familias grandes que buscan comodidad y un toque de lujo en viajes largos.",
               en: "Big families who want comfort and a touch of luxury on long drives." }
    },
    {
      id: "CCH-03", slug: "chevrolet-suburban-lt-gris", make: "Chevrolet", model: "Suburban LT", type: "suv",
      color: { es: "Gris", en: "Gray" }, year: "2022", miles: "50,000", condition: "used",
      seats: { es: "7 u 8 pasajeros", en: "7 or 8 seats" }, rows3: true, drive: null, dealer: "",
      photos: ["suburban-lt-gris-1", "suburban-lt-gris-2"],
      seen: { es: ["3 filas", "Estribos", "Rines plateados", "Parrilla cromada"],
              en: ["3 rows", "Running boards", "Silver wheels", "Chrome grille"] },
      ideal: { es: "Familias grandes que necesitan espacio de sobra para personas y maletas.",
               en: "Big families who need plenty of room for people and luggage." }
    },
    {
      id: "CCH-04", slug: "jeep-wrangler-rubicon-verde", make: "Jeep", model: "Wrangler Rubicon", type: "suv",
      color: { es: "Verde arena", en: "Sand green" }, year: "2024", miles: "15,000", condition: "used",
      seats: { es: "5 pasajeros", en: "5 seats" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["wrangler-rubicon-verde-1", "wrangler-rubicon-verde-2"],
      seen: { es: ["4 puertas", "Llantas todo terreno", "Llanta de refacción", "Ganchos de arrastre", "Techo duro"],
              en: ["4 doors", "All-terrain tires", "Spare tire", "Tow hooks", "Hard top"] },
      ideal: { es: "Aventuras de fin de semana: playa, lodo y caminos fuera del asfalto.",
               en: "Weekend adventures: the beach, mud and roads off the pavement." }
    },
    {
      id: "CCH-05", slug: "chevrolet-suburban-rst-negro", make: "Chevrolet", model: "Suburban RST", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "20,000", condition: "used",
      seats: { es: "7 u 8 pasajeros", en: "7 or 8 seats" }, rows3: true, drive: null, dealer: "",
      photos: ["suburban-rst-negro-1", "suburban-rst-negro-2"],
      seen: { es: ["3 filas", "Estribos", "Rines bicolor", "Escape doble"],
              en: ["3 rows", "Running boards", "Two-tone wheels", "Dual exhaust"] },
      ideal: { es: "Familias grandes que viajan seguido y quieren espacio con estilo deportivo.",
               en: "Big families who travel a lot and want space with a sporty style." }
    },
    {
      id: "CCH-06", slug: "kia-telluride-plata", make: "Kia", model: "Telluride", type: "suv",
      color: { es: "Plata", en: "Silver" }, year: "2022", miles: "40,000", condition: "used",
      seats: { es: "7 u 8 pasajeros", en: "7 or 8 seats" }, rows3: true, drive: null, dealer: "",
      photos: ["telluride-plata-1", "telluride-plata-2"],
      seen: { es: ["3 filas", "Rines negros", "Detalles en negro"],
              en: ["3 rows", "Black wheels", "Blacked-out trim"] },
      ideal: { es: "Familias que quieren 3 filas en una SUV más fácil de manejar y estacionar en la ciudad.",
               en: "Families who want 3 rows in an SUV that's easier to drive and park in the city." }
    },
    {
      id: "CCH-07", slug: "chevrolet-silverado-z71-negro", make: "Chevrolet", model: "Silverado Z71", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2020", miles: "70,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["silverado-z71-negro-1", "silverado-z71-negro-2"],
      seen: { es: ["Cabina doble", "Estribos", "Viseras en ventanas", "Enganche de remolque", "Ganchos de arrastre"],
              en: ["Crew cab", "Running boards", "Window visors", "Tow hitch", "Tow hooks"] },
      ideal: { es: "Trabajo pesado, obra y caminos de terracería.",
               en: "Hard work, job sites and dirt roads." }
    },
    {
      id: "CCH-08", slug: "gmc-sierra-slt-blanca", make: "GMC", model: "Sierra SLT", type: "truck",
      color: { es: "Blanca", en: "White" }, year: "2023", miles: "35,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["sierra-slt-blanca-1", "sierra-slt-blanca-2"],
      seen: { es: ["Cabina doble", "Estribos", "Parrilla cromada", "Enganche de remolque"],
              en: ["Crew cab", "Running boards", "Chrome grille", "Tow hitch"] },
      ideal: { es: "Trabajo entre semana y familia el fin de semana, con un toque más elegante.",
               en: "Work during the week and family on the weekend, with a more polished look." }
    },
    {
      id: "CCH-09", slug: "chevrolet-tahoe-z71-negro", make: "Chevrolet", model: "Tahoe Z71", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2018", miles: "90,000", condition: "used",
      seats: { es: "7 u 8 pasajeros", en: "7 or 8 seats" }, rows3: true, drive: "4x4", dealer: "",
      photos: ["tahoe-z71-negro-1", "tahoe-z71-negro-2"],
      seen: { es: ["3 filas", "Estribos", "Llantas todo terreno"],
              en: ["3 rows", "Running boards", "All-terrain tires"] },
      ideal: { es: "Familias que salen de la carretera: rancho, lago o caminos de tierra.",
               en: "Families who head off the highway: the ranch, the lake or dirt roads." }
    },
    {
      id: "CCH-10", slug: "chevrolet-silverado-lt-negro", make: "Chevrolet", model: "Silverado LT", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2023", miles: "30,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["silverado-lt-negro-1", "silverado-lt-negro-2"],
      seen: { es: ["Cabina doble", "Estribos", "Rines negros grandes", "Enganche de remolque"],
              en: ["Crew cab", "Running boards", "Large black wheels", "Tow hitch"] },
      ideal: { es: "El día a día y el trabajo, con un look moderno.",
               en: "Everyday driving and work, with a modern look." }
    },
    {
      id: "CCH-11", slug: "gmc-sierra-denali-plata", make: "GMC", model: "Sierra 1500 Denali", type: "truck",
      color: { es: "Plata", en: "Silver" }, year: "2018", miles: "130,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["sierra-denali-plata-1", "sierra-denali-plata-2"],
      seen: { es: ["Cabina doble", "Estribos", "Parrilla cromada", "Rines cromados", "Enganche de remolque"],
              en: ["Crew cab", "Running boards", "Chrome grille", "Chrome wheels", "Tow hitch"] },
      ideal: { es: "Trabajo entre semana y familia el fin de semana, con acabados de lujo.",
               en: "Work during the week and family on the weekend, with upscale trim." }
    },
    {
      id: "CCH-12", slug: "honda-crv-vino", make: "Honda", model: "CR-V", type: "suv",
      color: { es: "Rojo vino", en: "Wine red" }, year: "2018", miles: "100,000", condition: "used",
      seats: { es: "5 pasajeros", en: "5 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["crv-vino-1", "crv-vino-2"],
      seen: { es: ["Quemacocos", "Rines de aluminio", "Parrilla cromada", "Asientos de piel"],
              en: ["Sunroof", "Alloy wheels", "Chrome grille", "Leather seats"] },
      ideal: { es: "Primer carro o manejo diario en la ciudad, fácil de estacionar.",
               en: "A first car or daily city driving, easy to park." }
    },
    {
      id: "CCH-13", slug: "ram-1500-laramie-gris", make: "Ram", model: "1500 Laramie", type: "truck",
      color: { es: "Gris", en: "Gray" }, year: "2019", miles: "147,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["ram-laramie-gris-1", "ram-laramie-gris-2"],
      seen: { es: ["Cabina doble", "Rines de aluminio", "Parrilla cromada", "Espejos cromados"],
              en: ["Crew cab", "Alloy wheels", "Chrome grille", "Chrome mirrors"] },
      ideal: { es: "Viajes largos y trabajo, con espacio y comodidad de sobra.",
               en: "Long drives and work, with plenty of room and comfort." }
    },
    {
      id: "CCH-14", slug: "chevrolet-silverado-rst-negro", make: "Chevrolet", model: "Silverado 1500 RST", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2021", miles: "105,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["silverado-rst-negro-1", "silverado-rst-negro-2"],
      seen: { es: ["Cabina doble", "Rines negros", "Parrilla en negro", "Enganche de remolque"],
              en: ["Crew cab", "Black wheels", "Blacked-out grille", "Tow hitch"] },
      ideal: { es: "Look deportivo todo en negro, para el trabajo y la ciudad.",
               en: "An all-black sporty look, for work and the city." }
    },
    {
      id: "CCH-15", slug: "ram-1500-bighorn-gris", make: "Ram", model: "1500 Big Horn", type: "truck",
      color: { es: "Gris", en: "Gray" }, year: "2022", miles: "84,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: null, dealer: "",
      photos: ["ram-bighorn-gris-1", "ram-bighorn-gris-2"],
      seen: { es: ["Cabina doble", "Rines de aluminio", "Escape doble", "Enganche de remolque"],
              en: ["Crew cab", "Alloy wheels", "Dual exhaust", "Tow hitch"] },
      ideal: { es: "Trabajo con remolque y viajes en carretera.",
               en: "Towing for work and highway trips." }
    },
    {
      id: "CCH-16", slug: "ford-f150-fx4-blanco", make: "Ford", model: "F-150 FX4", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2025", miles: "41,000", condition: "used",
      seats: { es: "5 o 6 pasajeros", en: "5 or 6 seats" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["f150-fx4-blanco-1", "f150-fx4-blanco-2"],
      seen: { es: ["Cabina doble", "Estribos", "Rines negros", "Llantas todo terreno", "Paquete FX4"],
              en: ["Crew cab", "Running boards", "Black wheels", "All-terrain tires", "FX4 package"] },
      ideal: { es: "Trabajo pesado y caminos de terracería, prácticamente nueva.",
               en: "Heavy-duty work and dirt roads, practically new." }
    }
  ,
    {
      id: "CCH-17", slug: "2022-chevrolet-silverado-custom", make: "Chevrolet", model: "Silverado Custom", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2022", miles: "76,943", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Khp91ALrbEsqi1NdgQ14pQvfbSUTq3aB&sz=w1200", "https://drive.google.com/thumbnail?id=1hECxanMhe0d1vIWI_ZAFXMzjAUit2JuQ&sz=w1200", "https://drive.google.com/thumbnail?id=1HzWb0Pftb2dxu7CJXbxy299HVGduoPtI&sz=w1200", "https://drive.google.com/thumbnail?id=1XF5JbEnuQr8DwrgZOWuXXPulrgsSsrOu&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado Custom 2022 en Blanco, interior gris y 76,943 millas.",
               en: "2022 Chevrolet Silverado Custom Truck in White, gray interior, 76,943 miles." }
    },
    {
      id: "CCH-18", slug: "2024-jeep-wagoneer", make: "Jeep", model: "Wagoneer", type: "suv",
      color: { es: "Blanco", en: "White" }, year: "2024", miles: "70,563", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1STGx_6CXVevOd6nURVpes-csv0Cm7x4Q&sz=w1200", "https://drive.google.com/thumbnail?id=1soewf40omC9Mx7etWYTcd2iPbg0uhA4n&sz=w1200", "https://drive.google.com/thumbnail?id=1sRcpjhrVMOBWbhF-hP-cHnEVd06J6RZ4&sz=w1200", "https://drive.google.com/thumbnail?id=1whUN0OlCmxyjwcNBbvCDWWPnCsxF98MW&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Jeep Wagoneer 2024 en Blanco, interior gris y 70,563 millas.",
               en: "2024 Jeep Wagoneer SUV in White, gray interior, 70,563 miles." }
    },
    {
      id: "CCH-19", slug: "2026-ford-f-150-4x4", make: "Ford", model: "F-150 4x4", type: "truck",
      color: { es: "Plateado", en: "Silver" }, year: "2026", miles: "5,481", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=13a7TLXGOyp6pJP8Wz7mYUomX-Y8__6ma&sz=w1200", "https://drive.google.com/thumbnail?id=1bY99Rym9pHmARMFciZjum3n7rbEK0wF2&sz=w1200", "https://drive.google.com/thumbnail?id=1YBis_c-nCO50F7fkrkKTrEEyKmZFAz6c&sz=w1200", "https://drive.google.com/thumbnail?id=1KmrMD1zMKWRwoyVfw98hWBJ_sGuGvUNb&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ford F-150 4x4 2026 en Plateado, interior negro y 5,481 millas.",
               en: "2026 Ford F-150 4x4 Truck in Silver, black interior, 5,481 miles." }
    },
    {
      id: "CCH-20", slug: "2026-ram-2500-big-horn-diesel", make: "Ram", model: "2500 Big Horn Diesel", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2026", miles: "18,820", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1OVGjUktqbTq0EpJM2ggDXtmp0P172_yF&sz=w1200", "https://drive.google.com/thumbnail?id=1foIA1vwluHGe5iufoCLxjhHlbO4Wy-IR&sz=w1200", "https://drive.google.com/thumbnail?id=1n5kK_TviTlvNXYz22lp9ocb8iC9nn48M&sz=w1200", "https://drive.google.com/thumbnail?id=1r1vhsTalbyg1JIy8dQ_Ily9l9aoBryJn&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ram 2500 Big Horn Diesel 2026 en Blanco, interior gris y 18,820 millas.",
               en: "2026 Ram 2500 Big Horn Diesel Truck in White, gray interior, 18,820 miles." }
    },
    {
      id: "CCH-21", slug: "2022-jeep-compass", make: "Jeep", model: "Compass", type: "suv",
      color: { es: "Plateado", en: "Silver" }, year: "2022", miles: "70,533", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=18XlUOWMIZ2yRIukFeN4P9PhHYPAT-NJJ&sz=w1200", "https://drive.google.com/thumbnail?id=13HgBWbzLS6jztePHZCoNBypGLzoPkSqX&sz=w1200", "https://drive.google.com/thumbnail?id=1RG8_SuE-Bs2obN0dsSmOo5m0fh-24JLS&sz=w1200", "https://drive.google.com/thumbnail?id=1qXOaF86X0Hfj4SnVZLCtyK3L-HzwzRm9&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Jeep Compass 2022 en Plateado, interior negro y 70,533 millas.",
               en: "2022 Jeep Compass SUV in Silver, black interior, 70,533 miles." }
    },
    {
      id: "CCH-22", slug: "2022-chevrolet-silverado-high-country", make: "Chevrolet", model: "Silverado High Country", type: "truck",
      color: { es: "Azul", en: "Blue" }, year: "2022", miles: "114,027", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1UEsv3Icu4x2XS7bvwRPg_wRZTjE70wqR&sz=w1200", "https://drive.google.com/thumbnail?id=1nBgF9Y3WOjjMkobTULC3MBSA8akNeM33&sz=w1200", "https://drive.google.com/thumbnail?id=1MJRJWprkh3X9Bal7pBAyfExHT4eTy2T9&sz=w1200", "https://drive.google.com/thumbnail?id=1dL-cnwG0fW3khp9i5thvyU9AKrzmpEzz&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado High Country 2022 en Azul, interior negro y 114,027 millas.",
               en: "2022 Chevrolet Silverado High Country Truck in Blue, black interior, 114,027 miles." }
    },
    {
      id: "CCH-23", slug: "2021-gmc-sierra-sle", make: "GMC", model: "Sierra SLE", type: "truck",
      color: { es: "Plateado", en: "Silver" }, year: "2021", miles: "71,151", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1IoSFxj7QcjQDImrsz8rajI4nZpS3XOJv&sz=w1200", "https://drive.google.com/thumbnail?id=1M34pN2brqVRc2t55jx9QZIPKToW7EOBB&sz=w1200", "https://drive.google.com/thumbnail?id=1Fz0DO4XlJ3vjOnXf8q6NCxc6YJkuuDkd&sz=w1200", "https://drive.google.com/thumbnail?id=1pPE6BTMwpouW_3A8CgOSriDC0xPGjGI3&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra SLE 2021 en Plateado, interior negro y 71,151 millas.",
               en: "2021 GMC Sierra SLE Truck in Silver, black interior, 71,151 miles." }
    },
    {
      id: "CCH-24", slug: "2021-hyundai-elantra-limited", make: "Hyundai", model: "Elantra Limited", type: "sedan",
      color: { es: "Rojo", en: "Red" }, year: "2021", miles: "58,962", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1H73BciLBW1_VFA3ar2yPWP0bwOV7okvN&sz=w1200", "https://drive.google.com/thumbnail?id=1-A5JoAX4nIqnOgmzYanfh8OQLTkQYwHP&sz=w1200", "https://drive.google.com/thumbnail?id=1UxBydV5ZqGfkbe_5bWWU_Z6tYtrARC-D&sz=w1200", "https://drive.google.com/thumbnail?id=1aI6VDIUWbx8PchsZDE1oJsUrqYKDDeOU&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Sedán Hyundai Elantra Limited 2021 en Rojo, interior negro y 58,962 millas.",
               en: "2021 Hyundai Elantra Limited Sedan in Red, black interior, 58,962 miles." }
    },
    {
      id: "CCH-25", slug: "2021-ford-escape-se", make: "Ford", model: "Escape SE", type: "suv",
      color: { es: "Azul", en: "Blue" }, year: "2021", miles: "63,402", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=166OtSYMpcquIstg54dp4oNO-kNKglG-w&sz=w1200", "https://drive.google.com/thumbnail?id=1X8_NqMTqIWjdS2LvF1VZf9E1N-J1rxfl&sz=w1200", "https://drive.google.com/thumbnail?id=14HaQfC444bgILGqNqFJoNL71bXBFcuQq&sz=w1200", "https://drive.google.com/thumbnail?id=123mXQeQwGO7OaxhW2XWdWghwX7P6qDPU&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Ford Escape SE 2021 en Azul, interior gris y 63,402 millas.",
               en: "2021 Ford Escape SE SUV in Blue, gray interior, 63,402 miles." }
    },
    {
      id: "CCH-26", slug: "2023-toyota-camry-xse", make: "Toyota", model: "Camry XSE", type: "sedan",
      color: { es: "Blanco", en: "White" }, year: "2023", miles: "55,072", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Rw5I0uTjE8M1PoHkWTcMRmjCAYz8U52P&sz=w1200", "https://drive.google.com/thumbnail?id=1OqttDIBqsPT3wrXnEIuyJGrvqMNgL08U&sz=w1200", "https://drive.google.com/thumbnail?id=1faoFLCNA5uwUOqAs6MDBDX-YC-MbThOO&sz=w1200", "https://drive.google.com/thumbnail?id=1Tn8afoIU9ZGJxot7kTHGaXhLFREcnjOn&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Sedán Toyota Camry XSE 2023 en Blanco, interior rojo y 55,072 millas.",
               en: "2023 Toyota Camry XSE Sedan in White, red interior, 55,072 miles." }
    },
    {
      id: "CCH-27", slug: "2025-chevrolet-suburban-premier", make: "Chevrolet", model: "Suburban Premier", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "54,294", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=11jW5yRYKc43ZfRNWoi_K2dSzhcOD55x2&sz=w1200", "https://drive.google.com/thumbnail?id=13jWd3vaKMWXrEIqva-UYiK6RsseNWS8-&sz=w1200", "https://drive.google.com/thumbnail?id=13gpoDKTEFFGAE87XgR4nm_wQSWAB3uXd&sz=w1200", "https://drive.google.com/thumbnail?id=1M3adJI_mKT0Pny2sAuU-j9sdEwsa0OrO&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Suburban Premier 2025 en Negro, interior negro y 54,294 millas.",
               en: "2025 Chevrolet Suburban Premier SUV in Black, black interior, 54,294 miles." }
    },
    {
      id: "CCH-28", slug: "2021-toyota-corolla", make: "Toyota", model: "Corolla", type: "sedan",
      color: { es: "Blanco", en: "White" }, year: "2021", miles: "77,504", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1KgQsz8A1BEGDxhCCQIsTq04yABKUplxf&sz=w1200", "https://drive.google.com/thumbnail?id=1fSYM9_gJrl1PxkEZUz7kAo0R6UQ6aXBQ&sz=w1200", "https://drive.google.com/thumbnail?id=11I4NWwKQ7ua7DoksK2S0tADXtEqbmMuS&sz=w1200", "https://drive.google.com/thumbnail?id=1IZHHbILMs9ID-KlPBlK6KeLxpfqY9Y6W&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Sedán Toyota Corolla 2021 en Blanco, interior gris y 77,504 millas.",
               en: "2021 Toyota Corolla Sedan in White, gray interior, 77,504 miles." }
    },
    {
      id: "CCH-29", slug: "2018-honda-accord-lx", make: "Honda", model: "Accord LX", type: "sedan",
      color: { es: "Plateado", en: "Silver" }, year: "2018", miles: "91,418", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1gooqsscysat7I_bGRIqL8b-f35KhK-Ud&sz=w1200", "https://drive.google.com/thumbnail?id=1N7ZfrFJzqr98cQZLO9aHc_CQPeszfcKW&sz=w1200", "https://drive.google.com/thumbnail?id=1_RiNTFMEwNrSr-a3G0vW2TNDHDnbkZF2&sz=w1200", "https://drive.google.com/thumbnail?id=1O7RWwzoL9E48fTkJ_kmRgBv4JtpdZfA1&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Sedán Honda Accord LX 2018 en Plateado, interior negro y 91,418 millas.",
               en: "2018 Honda Accord LX Sedan in Silver, black interior, 91,418 miles." }
    },
    {
      id: "CCH-30", slug: "2025-ford-f-150-king-ranch", make: "Ford", model: "F-150 King Ranch", type: "truck",
      color: { es: "Rojo", en: "Red" }, year: "2025", miles: "24,328", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1rPh75O5ZgJOle3RdsSMOXr8SU3fWHWrh&sz=w1200", "https://drive.google.com/thumbnail?id=1g5X71PmgDZisLd6GDjPIiYgpTaUXKu1P&sz=w1200", "https://drive.google.com/thumbnail?id=1W6m49MQyTItl9tTSQcr_kDOPFmn7OPc-&sz=w1200", "https://drive.google.com/thumbnail?id=1f45CR2f5mFcRy6N0pxClHxpIN7f1aKUX&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ford F-150 King Ranch 2025 en Rojo, interior café y 24,328 millas.",
               en: "2025 Ford F-150 King Ranch Truck in Red, brown interior, 24,328 miles." }
    },
    {
      id: "CCH-31", slug: "2023-gmc-sierra-slt", make: "GMC", model: "Sierra SLT", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2023", miles: "48,984", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1PESX3LexS0ALiJUtRE9NRVkcCC9tuupn&sz=w1200", "https://drive.google.com/thumbnail?id=1vgCstkuwQ1BUmT4Lv6Q2VVbGPjd4Fmmy&sz=w1200", "https://drive.google.com/thumbnail?id=1PCOKzzwPZ3eFhnbVkS46JD9yVkPD6ncR&sz=w1200", "https://drive.google.com/thumbnail?id=1kM1TTcXnYuP3cXJVsJE4hzOUU5CmqJRZ&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra SLT 2023 en Negro, interior negro y 48,984 millas.",
               en: "2023 GMC Sierra SLT Truck in Black, black interior, 48,984 miles." }
    },
    {
      id: "CCH-32", slug: "2025-gmc-sierra-denali", make: "GMC", model: "Sierra Denali", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "23,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1NwR74AFKPUxMZtK8ePR_7T1UpY26jw5p&sz=w1200", "https://drive.google.com/thumbnail?id=1rd0-D79Ekzpf1t3by_5d7bEW45Zt4NHS&sz=w1200", "https://drive.google.com/thumbnail?id=10xlhxYR7iHMpq_l60a0V1y8wO6YK1JLe&sz=w1200", "https://drive.google.com/thumbnail?id=1uLx9oI5VPOs4m0_0GnPMeXgaFzkwQEfT&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra Denali 2025 en Negro, interior negro y 23,000 millas.",
               en: "2025 GMC Sierra Denali Truck in Black, black interior, 23,000 miles." }
    },
    {
      id: "CCH-33", slug: "2020-chevrolet-silverado", make: "Chevrolet", model: "Silverado", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2020", miles: "106,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=11PetRtSedoFLkVNrGJxkBzTIEhjD_5fD&sz=w1200", "https://drive.google.com/thumbnail?id=1_wwDnObhQZrkbJHeSnv9QuY_deZCFT6O&sz=w1200", "https://drive.google.com/thumbnail?id=1G-KIZ6iz3_7cTRov2xfQcjYMUCDpQCxh&sz=w1200", "https://drive.google.com/thumbnail?id=19dlCyaf2DVC_Vh5zY1jvlAlhDf8Exb40&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado 2020 en Negro, interior negro y 106,000 millas.",
               en: "2020 Chevrolet Silverado Truck in Black, black interior, 106,000 miles." }
    },
    {
      id: "CCH-34", slug: "2021-chevrolet-suburban-lt", make: "Chevrolet", model: "Suburban lt", type: "suv",
      color: { es: "Gris", en: "Gray" }, year: "2021", miles: "134,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1tMiT3us1rHs-VE7hEhx_qp1OYlCwJWzJ&sz=w1200", "https://drive.google.com/thumbnail?id=1ysN6uftCOH1ilRMKu1XwGVVKTD7vxvER&sz=w1200", "https://drive.google.com/thumbnail?id=1GpKwyAOlFpd8ssxpBO5sA1BkZxfRwbEZ&sz=w1200", "https://drive.google.com/thumbnail?id=1IJ8NOEicwhaCzjfakMa3fEhnXhS3lNJU&sz=w1200", "https://drive.google.com/thumbnail?id=16oE242weMRBWqTLRCdOmDarHPfSrCgua&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Suburban lt 2021 en Gris, interior negro y 134,000 millas.",
               en: "2021 Chevrolet Suburban lt SUV in Gray, black interior, 134,000 miles." }
    },
    {
      id: "CCH-35", slug: "2022-gmc-yukon-denali-techo-panor-mico", make: "GMC", model: "Yukon Denali Techo panorámico", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2022", miles: "42,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1eWoq8O8V4KMKaCgfluBswW_Rr2xtR4rD&sz=w1200", "https://drive.google.com/thumbnail?id=1GA-waDEl6rbTily-o5lvAEibwm4PAjW3&sz=w1200", "https://drive.google.com/thumbnail?id=1U2NltsQEBFAEVBSfX6agVp3N9YuhGV3v&sz=w1200", "https://drive.google.com/thumbnail?id=10KuIlGPYZCC85vMhCF7Hu2kGa-qc_CFO&sz=w1200", "https://drive.google.com/thumbnail?id=1m7KYEwja9fIzIGMKkJllSuayNBvUUbRl&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV GMC Yukon Denali Techo panorámico 2022 en Negro, interior beige y 42,000 millas.",
               en: "2022 GMC Yukon Denali Techo panorámico SUV in Black, beige interior, 42,000 miles." }
    },
    {
      id: "CCH-36", slug: "2024-dodge-durango-gt", make: "Dodge", model: "Durango gt", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2024", miles: "61,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1wPAt94SPwEMejJFQCVPkVDuI2pGsWG0G&sz=w1200", "https://drive.google.com/thumbnail?id=1tl7nnLOwaOnQsDidDgUmRvBDYmkhQZ6_&sz=w1200", "https://drive.google.com/thumbnail?id=17l2144qJODxsWbvuVlwjYj_G9SqEum2k&sz=w1200", "https://drive.google.com/thumbnail?id=10t69jq-R2YNYh6xT6IZ8ft-lI9LvPl5Q&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Dodge Durango gt 2024 en Negro, interior negro y 61,000 millas.",
               en: "2024 Dodge Durango gt SUV in Black, black interior, 61,000 miles." }
    },
    {
      id: "CCH-37", slug: "2025-chevrolet-suburban-rst-techo-panor-mico", make: "Chevrolet", model: "Suburban RST Techo panorámico", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "8,528", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1PvTspQuqGEq4MnriCZD0ZrZRzSILmPeq&sz=w1200", "https://drive.google.com/thumbnail?id=1_4GW1qofJuMtHlNIkN79twI_Ba6ATbxl&sz=w1200", "https://drive.google.com/thumbnail?id=11qtjSOvZAzQTqCZK0Rfo3MaA93WQ9BdP&sz=w1200", "https://drive.google.com/thumbnail?id=1w1yMMTV7H743C9Cha0dcozKMZ_QPkjZ7&sz=w1200", "https://drive.google.com/thumbnail?id=1vcD-WXx70ylgpPnSMo-l_axDDaGZ3mDC&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Suburban RST Techo panorámico 2025 en Negro, interior negro y 8,528 millas.",
               en: "2025 Chevrolet Suburban RST Techo panorámico SUV in Black, black interior, 8,528 miles." }
    },
    {
      id: "CCH-38", slug: "2025-chevrolet-tahoe-rst", make: "Chevrolet", model: "Tahoe RST", type: "suv",
      color: { es: "Rojo", en: "Red" }, year: "2025", miles: "15,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1UP-7PkNimgECO-vys-aWTglZFw-V7yT0&sz=w1200", "https://drive.google.com/thumbnail?id=1FANIWMNPcifMkAnkkCSYJuqpwiNHrLM-&sz=w1200", "https://drive.google.com/thumbnail?id=1ORBa2khgzGeLM9y1Hk70y2MPNeMlcZkt&sz=w1200", "https://drive.google.com/thumbnail?id=1tmLQm4kL863qPqsQMNaUp_bGkxl6epIu&sz=w1200", "https://drive.google.com/thumbnail?id=12qVBPzN3SdAXDLrbYs2qjmMTijfNEq7q&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Tahoe RST 2025 en Rojo, interior negro y 15,000 millas.",
               en: "2025 Chevrolet Tahoe RST SUV in Red, black interior, 15,000 miles." }
    },
    {
      id: "CCH-39", slug: "2025-jeep-wrangler-rubicon", make: "Jeep", model: "Wrangler Rubicon", type: "suv",
      color: { es: "Verde", en: "Green" }, year: "2025", miles: "20,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1xQHSzUkpqn1H4ba_52xffa9X7jHXFMzx&sz=w1200", "https://drive.google.com/thumbnail?id=14EVGfdRYm0DrjLDIofm_cd8G2aa6PgOR&sz=w1200", "https://drive.google.com/thumbnail?id=1lXo_feJcTkSoftHhJWE2pJLoe0lM-2A2&sz=w1200", "https://drive.google.com/thumbnail?id=14ZK0w0INfBLuLJqrkbJGbTKxRfgcKXJH&sz=w1200", "https://drive.google.com/thumbnail?id=19Rji5p8-85wi9vRXIz2tDnNDrISvHKxF&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Jeep Wrangler Rubicon 2025 en Verde, interior negro y 20,000 millas.",
               en: "2025 Jeep Wrangler Rubicon SUV in Green, black interior, 20,000 miles." }
    },
    {
      id: "CCH-40", slug: "2021-chevrolet-tahoe-z71", make: "Chevrolet", model: "Tahoe z71", type: "suv",
      color: { es: "Blanco", en: "White" }, year: "2021", miles: "136,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1qZ5aVRdsqTkMgKz7kdDiWO5dHCZto0u1&sz=w1200", "https://drive.google.com/thumbnail?id=12G27u9JwXoGua_1t5R_Ci8q1Il1SCpy2&sz=w1200", "https://drive.google.com/thumbnail?id=1tASmDy3p2lkjZBrVCe-VByA5yzHe-qQ3&sz=w1200", "https://drive.google.com/thumbnail?id=1yVfQlCaPqq3ywwolD81az442zPGBUjzh&sz=w1200", "https://drive.google.com/thumbnail?id=1O5buGp2iUsc0-jc7-RLH2Pe_60Iisc2u&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Tahoe z71 2021 en Blanco, interior gris y 136,000 millas.",
               en: "2021 Chevrolet Tahoe z71 SUV in White, gray interior, 136,000 miles." }
    },
    {
      id: "CCH-41", slug: "2021-chevrolet-tahoe-lt", make: "Chevrolet", model: "Tahoe Lt", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2021", miles: "103,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=10TdI64cvwtOaxI5np8UnwJC_ARuipuzA&sz=w1200", "https://drive.google.com/thumbnail?id=1_WZ7wiYPQwBd4qLNWW72xyb_LKzuLbau&sz=w1200", "https://drive.google.com/thumbnail?id=1ODek3ZCQgqADnEVlck9HLfxMLT6J24GK&sz=w1200", "https://drive.google.com/thumbnail?id=1ljB9xWPVjCcyPKXNdo3Tm00Mg-MqgHHO&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Tahoe Lt 2021 en Negro, interior negro y 103,000 millas.",
               en: "2021 Chevrolet Tahoe Lt SUV in Black, black interior, 103,000 miles." }
    },
    {
      id: "CCH-42", slug: "2018-lincoln-navigator", make: "Lincoln", model: "Navigator", type: "suv",
      color: { es: "Azul", en: "Blue" }, year: "2018", miles: "70,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1iME3LLMT-H0I3zVzIco4sYxXioDe5KBW&sz=w1200", "https://drive.google.com/thumbnail?id=1NsbNwnWXIJJJ0bFt11E5V3QWQ4-zxeRZ&sz=w1200", "https://drive.google.com/thumbnail?id=10qdoxP9pvyJagxYMNzwvKNq4AwmTHwwf&sz=w1200", "https://drive.google.com/thumbnail?id=11IuF1TCUdgt7K_oUncb9YF02Ao-gHMmO&sz=w1200", "https://drive.google.com/thumbnail?id=1FDXtSgcf0UEYT9jru0_pxzdJdulhhzvX&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Lincoln Navigator 2018 en Azul, interior blanco y 70,000 millas.",
               en: "2018 Lincoln Navigator SUV in Blue, white interior, 70,000 miles." }
    },
    {
      id: "CCH-43", slug: "2016-chevrolet-tahoe-z71", make: "Chevrolet", model: "tahoe Z71", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2016", miles: "102,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1vpg-Fdb8Zq_aUdAvd9fz_hOtl7i7gXEW&sz=w1200", "https://drive.google.com/thumbnail?id=1b2IYwqJque5yas-KqDbv8HOqCAyymsxi&sz=w1200", "https://drive.google.com/thumbnail?id=1enE2neYjq69Zu-cXWpySai0pRscvaPus&sz=w1200", "https://drive.google.com/thumbnail?id=1jtQ9Tb-nz57MQqDuV4yQbYHnK3lCWwrS&sz=w1200", "https://drive.google.com/thumbnail?id=1M_uoOTL_CG7EU9XEeSLeYjO5AEFXo5Qm&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet tahoe Z71 2016 en Negro, interior negro y 102,000 millas.",
               en: "2016 Chevrolet tahoe Z71 SUV in Black, black interior, 102,000 miles." }
    },
    {
      id: "CCH-44", slug: "2023-chevrolet-silverado-lt", make: "Chevrolet", model: "Silverado Lt", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2023", miles: "23,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1o8_WDXXOBHjIpzaX8G_7FMU-pHhQjnYe&sz=w1200", "https://drive.google.com/thumbnail?id=1b26VuDaqsNpHbmUwS0ZjszJoGDQlkQV3&sz=w1200", "https://drive.google.com/thumbnail?id=1VTlhtenJ4HHEOY6FWCFrCHCBpdPuy9sU&sz=w1200", "https://drive.google.com/thumbnail?id=1I4MTMYRGf2KIggYYOK3iZfSnxc_6r_ah&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado Lt 2023 en Negro, interior negro y 23,000 millas.",
               en: "2023 Chevrolet Silverado Lt Truck in Black, black interior, 23,000 miles." }
    },
    {
      id: "CCH-45", slug: "2025-gmc-sierra-slt", make: "GMC", model: "Sierra Slt", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2025", miles: "11,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1S6JS5KtjO8GJRvXWidV6rbwTYCkWPMoq&sz=w1200", "https://drive.google.com/thumbnail?id=1AwRTzcvdtX_sbHMxmenLi4kM4MnUBCg3&sz=w1200", "https://drive.google.com/thumbnail?id=18iZhBCQmzdSYon9-nENW9-CewOGYCLPq&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra Slt 2025 en Blanco, interior negro y 11,000 millas.",
               en: "2025 GMC Sierra Slt Truck in White, black interior, 11,000 miles." }
    },
    {
      id: "CCH-46", slug: "2025-hyundai-santa-fe", make: "Hyundai", model: "Santa Fe", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "46,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1pFLWOT3NP92VgcjIpEgQ5c1lVOKSUaxz&sz=w1200", "https://drive.google.com/thumbnail?id=1ZO6NRZ0RReppylnE9W9KuELI8tOOehi1&sz=w1200", "https://drive.google.com/thumbnail?id=1vhXzxl9eu_U6ekU34Ir072dpHIMfhkHQ&sz=w1200", "https://drive.google.com/thumbnail?id=11KLASZnlrDDlCTBgVh386FPCVWmKYSuB&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Hyundai Santa Fe 2025 en Negro, interior gris y 46,000 millas.",
               en: "2025 Hyundai Santa Fe SUV in Black, gray interior, 46,000 miles." }
    },
    {
      id: "CCH-47", slug: "2020-ford-f150", make: "Ford", model: "F150", type: "truck",
      color: { es: "Plateado", en: "Silver" }, year: "2020", miles: "104,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1qJ-7Bm4rK0iuegrmhALEsyFKnvI_twiy&sz=w1200", "https://drive.google.com/thumbnail?id=1owCwXrgApydzsssVjqdH7zib6CXmZQNW&sz=w1200", "https://drive.google.com/thumbnail?id=1gkkK_CC2JLPiGEjNMEOV8QmggA4lvrC7&sz=w1200", "https://drive.google.com/thumbnail?id=1w5rq4Wqg_wdDcIw-I5u2HaGUL0SmR7Ev&sz=w1200", "https://drive.google.com/thumbnail?id=1uTtTD8mSRSQo-8kpK77ffnWlEWFUHkY6&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ford F150 2020 en Plateado, interior negro y 104,000 millas.",
               en: "2020 Ford F150 Truck in Silver, black interior, 104,000 miles." }
    },
    {
      id: "CCH-48", slug: "2022-chevrolet-trailblazer", make: "Chevrolet", model: "Trailblazer", type: "suv",
      color: { es: "Blanco", en: "White" }, year: "2022", miles: "43,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1u3tEoZ7nk-K4cJkoRU9uLuIAv7rdmfYe&sz=w1200", "https://drive.google.com/thumbnail?id=1cZ1tBFX1oOt3Vn6op0Mg7DFtcdPNHk1Q&sz=w1200", "https://drive.google.com/thumbnail?id=1TDoxha6z7MJzGxZ7VAokh_b6-goP8dQ1&sz=w1200", "https://drive.google.com/thumbnail?id=1kique5PY2haN949Ne87iJlYV93Z59vMP&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Trailblazer 2022 en Blanco, interior negro y 43,000 millas.",
               en: "2022 Chevrolet Trailblazer SUV in White, black interior, 43,000 miles." }
    },
    {
      id: "CCH-49", slug: "2023-gmc-sierra-elevaton-4x4", make: "GMC", model: "Sierra Elevaton 4x4", type: "truck",
      color: { es: "Café", en: "Brown" }, year: "2023", miles: "69,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1OJ7YMjH0L7j8ryJlfp_xgz-0c65otxZ4&sz=w1200", "https://drive.google.com/thumbnail?id=1V02yYIP8Y_zMOWVM6icrmwpVthKTUPgw&sz=w1200", "https://drive.google.com/thumbnail?id=1lo6YFbeE1DqmIR7LC6FZnyhZEtdTxbFp&sz=w1200", "https://drive.google.com/thumbnail?id=10FJsp3ufPhthAyj6NqVo_sEliFLaUKI7&sz=w1200", "https://drive.google.com/thumbnail?id=1qcr634L9SDk2PdlLEgHBCjC_O__Lsb3j&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra Elevaton 4x4 2023 en Café, interior gris y 69,000 millas.",
               en: "2023 GMC Sierra Elevaton 4x4 Truck in Brown, gray interior, 69,000 miles." }
    },
    {
      id: "CCH-50", slug: "2023-chevrolet-silverado-trail-boss-lt", make: "Chevrolet", model: "Silverado trail boss Lt", type: "truck",
      color: { es: "Azul", en: "Blue" }, year: "2023", miles: "115,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1bbys65fSpcgvaCG1oIbdJsoHfsj12INP&sz=w1200", "https://drive.google.com/thumbnail?id=12yqvNlnW6K41_8aDFIbHsmNcfe2QIlQw&sz=w1200", "https://drive.google.com/thumbnail?id=1MX5NhbhQ6269BU583SNB-7WsvKw81qDT&sz=w1200", "https://drive.google.com/thumbnail?id=1jcKhzeLfeY5QaT-hU9zX56diPN1ArhB4&sz=w1200", "https://drive.google.com/thumbnail?id=1Eq3sw4NHhgD-GQGWohUYz_1_jqbrEmGd&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado trail boss Lt 2023 en Azul, interior gris y 115,000 millas.",
               en: "2023 Chevrolet Silverado trail boss Lt Truck in Blue, gray interior, 115,000 miles." }
    },
    {
      id: "CCH-51", slug: "2018-gmc-yukon-denali", make: "GMC", model: "Yukon Denali", type: "suv",
      color: { es: "Blanco", en: "White" }, year: "2018", miles: "134,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1SC_yZMtTn3CEkEj3rID8BUy31EcXqUuz&sz=w1200", "https://drive.google.com/thumbnail?id=1ZmXwYuK6RgFhIIl6TqAjPHsRC3_sumao&sz=w1200", "https://drive.google.com/thumbnail?id=1gIoDmWvTPqrcCdEJiQN13CylxEgdJIwu&sz=w1200", "https://drive.google.com/thumbnail?id=1Nd86frc675zhlh6_fQ2yWXvYCqTHut_A&sz=w1200", "https://drive.google.com/thumbnail?id=1nvE6LuLeZ5v6Qd8y0dbOV6sa06rzf9Rr&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV GMC Yukon Denali 2018 en Blanco, interior café y 134,000 millas.",
               en: "2018 GMC Yukon Denali SUV in White, brown interior, 134,000 miles." }
    },
    {
      id: "CCH-52", slug: "2019-hyundai-tucson", make: "Hyundai", model: "Tucson", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2019", miles: "82,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1v_PUZF-3yNo7vXmG3YpdoRaJaVy9E_Cd&sz=w1200", "https://drive.google.com/thumbnail?id=1vtc7FbQOCqERGB0vz2tne0nWhuoESzK4&sz=w1200", "https://drive.google.com/thumbnail?id=1mIwsbpuiqpCefPK0p_6Y3E0VivUwLWrG&sz=w1200", "https://drive.google.com/thumbnail?id=1uOdrSqOEUkFEk0j8No2Ecw3OWxVrI_CP&sz=w1200", "https://drive.google.com/thumbnail?id=18U7jQ7q4XxhUWxhUQXnTBsPD-kWog41A&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Hyundai Tucson 2019 en Negro, interior beige y 82,000 millas.",
               en: "2019 Hyundai Tucson SUV in Black, beige interior, 82,000 miles." }
    },
    {
      id: "CCH-54", slug: "2023-chevrolet-silverado", make: "Chevrolet", model: "Silverado", type: "truck",
      color: { es: "Azul", en: "Blue" }, year: "2023", miles: "34,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1-zxiipiKdYsJn1Hz0vlb8EPNQEmaGqhF&sz=w1200", "https://drive.google.com/thumbnail?id=1G9cLU6KIGuDgeObShaAhKZNCW52AG4ek&sz=w1200", "https://drive.google.com/thumbnail?id=13t8bhxGr1W9yL9CP4iyT0L_1V3GUbH37&sz=w1200", "https://drive.google.com/thumbnail?id=1B4btCmzN-HhcYt53t5R9EBQCLEaL9YBV&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado 2023 en Azul, interior negro y 34,000 millas.",
               en: "2023 Chevrolet Silverado Truck in Blue, black interior, 34,000 miles." }
    },
    {
      id: "CCH-55", slug: "2025-ford-expedition-max-platinum", make: "Ford", model: "expedition MAX Platinum", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "25,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=15DBxN2c6IjtWRrlGt_R_tStqi-K0h-Wk&sz=w1200", "https://drive.google.com/thumbnail?id=1MxMHvldC0tvU4txUhfoSBESK4OcJIm8C&sz=w1200", "https://drive.google.com/thumbnail?id=1hCCT7hwCVbQCTzsnC1etGNiICOANUaXj&sz=w1200", "https://drive.google.com/thumbnail?id=1gZP5mYhSLhownpCRheXgQYy7O1sS1YE8&sz=w1200", "https://drive.google.com/thumbnail?id=1Vop2BnWL5v0f5F_zwJN60QryVOGiPLRy&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Ford expedition MAX Platinum 2025 en Negro, interior negro y 25,000 millas.",
               en: "2025 Ford expedition MAX Platinum SUV in Black, black interior, 25,000 miles." }
    },
    {
      id: "CCH-56", slug: "2021-gmc-sierra-slt", make: "GMC", model: "Sierra SLT", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2021", miles: "56,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Nio58fauvf-7MfaFbOtNGKOGk8mNPn-8&sz=w1200", "https://drive.google.com/thumbnail?id=1cwIPo4xbHHvoXra4OrwtOvrLz7_tOsSJ&sz=w1200", "https://drive.google.com/thumbnail?id=1D0sas4PGBHbVcMuCADNuJgDS7lD8NYkQ&sz=w1200", "https://drive.google.com/thumbnail?id=1OCB8zRV6J5Upocgv0IxbExfZ4ycpo3fb&sz=w1200", "https://drive.google.com/thumbnail?id=1VlH_4k89WimNYAZnDaM4cYUIiyXSuocR&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra SLT 2021 en Blanco, interior gris y 56,000 millas.",
               en: "2021 GMC Sierra SLT Truck in White, gray interior, 56,000 miles." }
    },
    {
      id: "CCH-57", slug: "2021-chevrolet-tahoe-techo-panor-mico", make: "Chevrolet", model: "Tahoe Techo panorámico", type: "suv",
      color: { es: "Blanco", en: "White" }, year: "2021", miles: "84,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=16RsmCFzqPflwjFkLE7Em543CS6LE7hYP&sz=w1200", "https://drive.google.com/thumbnail?id=1a0HzhlOHHS1GZM024CPO4hH0-v30Q3ql&sz=w1200", "https://drive.google.com/thumbnail?id=1F3ZSwYID9gOUppn9iABd77tioRbfC6oT&sz=w1200", "https://drive.google.com/thumbnail?id=1AY8HAK8PZaArFJFCb2tMzXpwtiiCPgqn&sz=w1200", "https://drive.google.com/thumbnail?id=1R_bOPW1o8_VuMyTcNMCY-_st8n3YQ3Q9&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Tahoe Techo panorámico 2021 en Blanco, interior negro y 84,000 millas.",
               en: "2021 Chevrolet Tahoe Techo panorámico SUV in White, black interior, 84,000 miles." }
    },
    {
      id: "CCH-58", slug: "2020-chevrolet-silverado-2", make: "Chevrolet", model: "Silverado", type: "truck",
      color: { es: "Rojo", en: "Red" }, year: "2020", miles: "78,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1aXflj5qKHpkZhS3q0KD0RLJkIqB1Utw8&sz=w1200", "https://drive.google.com/thumbnail?id=14pOzkoumMSRmSrqzUgf5sZaRz8_5CSb8&sz=w1200", "https://drive.google.com/thumbnail?id=1RCNMRdDznOvm35F4IFKc5gU9XtE0UiJC&sz=w1200", "https://drive.google.com/thumbnail?id=1SFl0AxKcIqmNnWZxFkZ--hWEBLPfVHlO&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado 2020 en Rojo, interior negro y 78,000 millas.",
               en: "2020 Chevrolet Silverado Truck in Red, black interior, 78,000 miles." }
    },
    {
      id: "CCH-60", slug: "2023-chevrolet-silverado-lt-2", make: "Chevrolet", model: "Silverado Lt", type: "truck",
      color: { es: "Rojo", en: "Red" }, year: "2023", miles: "59,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1IhkjEaP5SiUld8dXFwaCdPlTK6_qyG2_&sz=w1200", "https://drive.google.com/thumbnail?id=1mqHSKduwNjzjXgk4PSKAjshGZCzUroXW&sz=w1200", "https://drive.google.com/thumbnail?id=1X9ez_tIrlbqavjD5CkRjg93wn_9EPm1d&sz=w1200", "https://drive.google.com/thumbnail?id=1-x5CrXzSvM8I647aJo8erlXE03r5V12D&sz=w1200", "https://drive.google.com/thumbnail?id=1jVidsNqJwhHGhtAFDQcJXJ0pfmOu0PQA&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado Lt 2023 en Rojo, interior negro y 59,000 millas.",
               en: "2023 Chevrolet Silverado Lt Truck in Red, black interior, 59,000 miles." }
    },
    {
      id: "CCH-61", slug: "2020-ford-f150-2", make: "Ford", model: "F150", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2020", miles: "134,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1MOqMrgwAEOT6pcGhheug9rIkBqFiYqvs&sz=w1200", "https://drive.google.com/thumbnail?id=1S5hpnnfUQcK3xo8nPcgd7i-4Zu3ruAw8&sz=w1200", "https://drive.google.com/thumbnail?id=1OX0B3CbVnQTuwO89AZx9BMM1CaS6XGXL&sz=w1200", "https://drive.google.com/thumbnail?id=1MSoQQRM0ZaO7Jf4P38t-lRVluXHb6jdB&sz=w1200", "https://drive.google.com/thumbnail?id=1mvNZ2PhMLhw1Oq12tssWJB7oOmZOWJCV&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ford F150 2020 en Blanco, interior negro y 134,000 millas.",
               en: "2020 Ford F150 Truck in White, black interior, 134,000 miles." }
    },
    {
      id: "CCH-62", slug: "2022-toyota-tundra-tss-5000", make: "Toyota", model: "Tundra TSS 5000", type: "truck",
      color: { es: "Rojo", en: "Red" }, year: "2022", miles: "81,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Y0w6jMrAm3-WbXnb-flL872YBfR1N6sL&sz=w1200", "https://drive.google.com/thumbnail?id=1xXM3FDUz_NqxfKMnDTWP5j4iWyX5s8jv&sz=w1200", "https://drive.google.com/thumbnail?id=1aLxbxKUkSl8FFTApx0YXLBru3KFB5k6c&sz=w1200", "https://drive.google.com/thumbnail?id=1Mqf6Z9c52PUjSgti9PL465frMxv4cfya&sz=w1200", "https://drive.google.com/thumbnail?id=1_dgS-NyfWew1SySyVYlsJHODYlfbjNsr&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Toyota Tundra TSS 5000 2022 en Rojo, interior gris y 81,000 millas.",
               en: "2022 Toyota Tundra TSS 5000 Truck in Red, gray interior, 81,000 miles." }
    },
    {
      id: "CCH-63", slug: "2025-toyota-tundra", make: "Toyota", model: "Tundra", type: "truck",
      color: { es: "Gris", en: "Gray" }, year: "2025", miles: "30,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1yr2ZB8ji5EYW5OIGBhdSCMcGSMezJDI6&sz=w1200", "https://drive.google.com/thumbnail?id=1BQ-h2G-xYv1L8u-O_pVAbKo1n779lm2P&sz=w1200", "https://drive.google.com/thumbnail?id=1Q4oIYwy2VkW54NU0WkG4iJdNOh7p-t9H&sz=w1200", "https://drive.google.com/thumbnail?id=1yK14URQlG5sC04FMiu_cKJ9VwxVqaOm5&sz=w1200", "https://drive.google.com/thumbnail?id=1wbHG2UWgYZMwILMUnz59N26UGJMfV7Qo&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Toyota Tundra 2025 en Gris, interior negro y 30,000 millas.",
               en: "2025 Toyota Tundra Truck in Gray, black interior, 30,000 miles." }
    },
    {
      id: "CCH-64", slug: "2023-gmc-sierra-denali", make: "GMC", model: "Sierra Denali", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2023", miles: "45,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Lrc88j1BMW1Ky2SnGzPoPXJAVkC_pnf3&sz=w1200", "https://drive.google.com/thumbnail?id=1Flzg0s1tf6Gf4089fvm2JnkQVHnXqiem&sz=w1200", "https://drive.google.com/thumbnail?id=1B3RD43As_hUO42uCTzszchYA7jDXUb-B&sz=w1200", "https://drive.google.com/thumbnail?id=1VA_cWEHoDA_YTxI-7IgGeZXyhVCFz3oL&sz=w1200", "https://drive.google.com/thumbnail?id=1YAU4_WIeHMuaA-aFLGuXDFffxPTOtpJK&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra Denali 2023 en Blanco, interior negro y 45,000 millas.",
               en: "2023 GMC Sierra Denali Truck in White, black interior, 45,000 miles." }
    },
    {
      id: "CCH-66", slug: "2024-gmc-sierra-slt", make: "GMC", model: "Sierra Slt", type: "truck",
      color: { es: "Plateado", en: "Silver" }, year: "2024", miles: "27,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1kWQSHxT5YrebktebwxQ8GQcTbat5_QVq&sz=w1200", "https://drive.google.com/thumbnail?id=1WcnE8iof_5nPKlXNtndHmL-NJ9j7ZAk-&sz=w1200", "https://drive.google.com/thumbnail?id=1Xhwm-rXIAYlvz-HH64RizWbtr0eOJELo&sz=w1200", "https://drive.google.com/thumbnail?id=1i6Crk5jXlgV5HyVad3xGXcb06-3m66dS&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra Slt 2024 en Plateado, interior negro y 27,000 millas.",
               en: "2024 GMC Sierra Slt Truck in Silver, black interior, 27,000 miles." }
    },
    {
      id: "CCH-68", slug: "2025-ford-f150-xlt", make: "Ford", model: "f150 XLT", type: "truck",
      color: { es: "Azul", en: "Blue" }, year: "2025", miles: "36,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1TL8FkspfVVyyz8s360f8EPFzovyB0uCB&sz=w1200", "https://drive.google.com/thumbnail?id=1xlGDmA5S-cgpNMCKQh40FSRSIiffaMen&sz=w1200", "https://drive.google.com/thumbnail?id=1SNRAsZ8d-YTgUnbV6Q7vmWFgFxz1G1h9&sz=w1200", "https://drive.google.com/thumbnail?id=172uBnShwSFM-9Gou750i6zuPpMxTlbba&sz=w1200", "https://drive.google.com/thumbnail?id=1LwxmCyj1RtegU2Gs13xxpfmbE09aNQuI&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ford f150 XLT 2025 en Azul, interior gris y 36,000 millas.",
               en: "2025 Ford f150 XLT Truck in Blue, gray interior, 36,000 miles." }
    },
    {
      id: "CCH-69", slug: "2025-ram-3500-motor-diesel", make: "Ram", model: "3500 Motor Diesel", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2025", miles: "48,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1CgBN9FyTowwhhyJwtcXxW2v7434vTaCH&sz=w1200", "https://drive.google.com/thumbnail?id=14_DRZ18MA1gdlwoieatOgCP3lMxiDXWZ&sz=w1200", "https://drive.google.com/thumbnail?id=1mwnuwT5x0NpR6WnXsxJ1liClKLW7gWKQ&sz=w1200", "https://drive.google.com/thumbnail?id=1kXo8_B3t702EqtYa2rQjs-Z6wdWA9aJ4&sz=w1200", "https://drive.google.com/thumbnail?id=1Op3_yfZRtMVnqm8QlR3K1XTA493mGAJJ&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ram 3500 Motor Diesel 2025 en Blanco, interior negro y 48,000 millas.",
               en: "2025 Ram 3500 Motor Diesel Truck in White, black interior, 48,000 miles." }
    },
    {
      id: "CCH-70", slug: "2025-gmc-sierra-at4x-2500-motor-diesel", make: "GMC", model: "SIERRA AT4X 2500 Motor diesel", type: "truck",
      color: { es: "Gris", en: "Gray" }, year: "2025", miles: "9,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1B9_7T2F1RNhDaLOOEG0kJhXl_I1rPo6Q&sz=w1200", "https://drive.google.com/thumbnail?id=1zGIRjlTyIYzmLImDdXq1qQpRVGBgMy7g&sz=w1200", "https://drive.google.com/thumbnail?id=1EycqRDDNbVbqoIfkunInjAO3Ld6GKRqv&sz=w1200", "https://drive.google.com/thumbnail?id=1JKnvbPTmW2h2bMOGR7u7xWUtMqsmTdik&sz=w1200", "https://drive.google.com/thumbnail?id=11m0LlrmiWKCaZsc5_tkG75tY9jHaZDid&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC SIERRA AT4X 2500 Motor diesel 2025 en Gris, interior negro y 9,000 millas.",
               en: "2025 GMC SIERRA AT4X 2500 Motor diesel Truck in Gray, black interior, 9,000 miles." }
    },
    {
      id: "CCH-71", slug: "2026-gmc-sierra-2500-at4x-motor-diesel", make: "GMC", model: "sierra 2500 AT4X Motor diesel", type: "truck",
      color: { es: "Plateado", en: "Silver" }, year: "2026", miles: "27,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Z_NLpuBeCYGPdtBKwRuKPy8lDUMHXrLZ&sz=w1200", "https://drive.google.com/thumbnail?id=1RLe7fmlMDLeK_QnUCG6aTuO94kKQ8tUE&sz=w1200", "https://drive.google.com/thumbnail?id=1_8FcebWObtVfP0W7SM20kiPco8eELSyO&sz=w1200", "https://drive.google.com/thumbnail?id=1AySx996ueAZZkQJTu1WVOsEQflxTiE22&sz=w1200", "https://drive.google.com/thumbnail?id=1gEcZyV96QYUBWQEIQ8vn1BwBx6nXPwEO&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC sierra 2500 AT4X Motor diesel 2026 en Plateado, interior negro y 27,000 millas.",
               en: "2026 GMC sierra 2500 AT4X Motor diesel Truck in Silver, black interior, 27,000 miles." }
    },
    {
      id: "CCH-72", slug: "2023-ram-1500-big-horn", make: "Ram", model: "1500 Big Horn", type: "truck",
      color: { es: "Rojo", en: "Red" }, year: "2023", miles: "77,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=19VfeNiKb-MpE9USMCbyI7j1vCC-o_T4U&sz=w1200", "https://drive.google.com/thumbnail?id=13nFS4qv4_iuIdIcXzasBPdtykAdhrOHm&sz=w1200", "https://drive.google.com/thumbnail?id=191dDQ3LffMnGLZ2GwNlUucukyZFo0F5Z&sz=w1200", "https://drive.google.com/thumbnail?id=1wk5KA4znxcs1Ck4wut7DMbeZ1D1f7mn7&sz=w1200", "https://drive.google.com/thumbnail?id=1basVVELABZymlKpVwJGTRUsIzYuZTzb0&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ram 1500 Big Horn 2023 en Rojo, interior gris y 77,000 millas.",
               en: "2023 Ram 1500 Big Horn Truck in Red, gray interior, 77,000 miles." }
    },
    {
      id: "CCH-73", slug: "2024-gmc-1500-sierra-denali", make: "GMC", model: "1500 sierra Denali", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2024", miles: "9,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1TC77XjWECURM8Ofq_Gi7OSXHAcmFIm55&sz=w1200", "https://drive.google.com/thumbnail?id=1xz3VfQPuMaaVs7_Pl9RLdiI14zld4UHe&sz=w1200", "https://drive.google.com/thumbnail?id=1UXyvXQwBPpJPbpRDQOsStsRBCdPYsLEL&sz=w1200", "https://drive.google.com/thumbnail?id=1OPOnSm-R-6Wkx5n3VJD5hJJwQPNlrSZE&sz=w1200", "https://drive.google.com/thumbnail?id=1a32vn3PPxJJ3X-fVNPn2lqFsEshKCj7r&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC 1500 sierra Denali 2024 en Negro, interior negro y 9,000 millas.",
               en: "2024 GMC 1500 sierra Denali Truck in Black, black interior, 9,000 miles." }
    },
    {
      id: "CCH-74", slug: "2025-chevrolet-silverado-3500-motor-diesel", make: "Chevrolet", model: "Silverado 3500 Motor Diesel", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2025", miles: "16,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1t5c1EgXMEUjmFtZjVk4X4S_ccqUhdBIt&sz=w1200", "https://drive.google.com/thumbnail?id=1Jl1zKzdwt5u7LfpMxjOpDp4ljXkBLIOz&sz=w1200", "https://drive.google.com/thumbnail?id=1ZN3py982NXCPJOFpRMoH0OAqobMn8xfA&sz=w1200", "https://drive.google.com/thumbnail?id=106lbnESGA--yLi3TJNpCX8AF-t-0Gv8c&sz=w1200", "https://drive.google.com/thumbnail?id=1R7Pt9HNzzLeB1HLpFmwo7I0kG36UCf-v&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado 3500 Motor Diesel 2025 en Blanco, interior negro y 16,000 millas.",
               en: "2025 Chevrolet Silverado 3500 Motor Diesel Truck in White, black interior, 16,000 miles." }
    },
    {
      id: "CCH-75", slug: "2025-chevrolet-tahoe-lt", make: "Chevrolet", model: "Tahoe Lt", type: "suv",
      color: { es: "Negro", en: "Black" }, year: "2025", miles: "29,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1x44Y5i2drAGbG9uQ743uMGsNDvdcP0lK&sz=w1200", "https://drive.google.com/thumbnail?id=1pGhG7OsS1BiKkc9XtRD1jtoLnodpLwC8&sz=w1200", "https://drive.google.com/thumbnail?id=144K0SHBKB6vfbabW5vQKKkfTknChFD-X&sz=w1200", "https://drive.google.com/thumbnail?id=15FouGZ8XgKvhA9yNhUixY5vq0HMVFuun&sz=w1200", "https://drive.google.com/thumbnail?id=1WA112nxAe6vWsXH2IvjdSpBLuz3flEc7&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Chevrolet Tahoe Lt 2025 en Negro, interior negro y 29,000 millas.",
               en: "2025 Chevrolet Tahoe Lt SUV in Black, black interior, 29,000 miles." }
    },
    {
      id: "CCH-76", slug: "2024-gmc-sierra-denali-duramax-diesel", make: "GMC", model: "sierra Denali Duramax diesel", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2024", miles: "28,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1A3vA6Qbed2_d2Du6tu2Atj9G2auj1NaQ&sz=w1200", "https://drive.google.com/thumbnail?id=1hJiMZOuuyybxBm51BFKMwy0WRjLrU3IS&sz=w1200", "https://drive.google.com/thumbnail?id=1dtyAlP7yszeTC1udM8vXKrSI_D_F_uFl&sz=w1200", "https://drive.google.com/thumbnail?id=1VhDDkCNcH8W_bYRthM0gs9Pxqm3vg0Gj&sz=w1200", "https://drive.google.com/thumbnail?id=1SuGp5dvuo2tFfthEGYrGYqntdbwGCCCx&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC sierra Denali Duramax diesel 2024 en Negro, interior negro y 28,000 millas.",
               en: "2024 GMC sierra Denali Duramax diesel Truck in Black, black interior, 28,000 miles." }
    },
    {
      id: "CCH-78", slug: "2020-gmc-sierra-slt", make: "GMC", model: "Sierra Slt", type: "truck",
      color: { es: "Gris", en: "Gray" }, year: "2020", miles: "83,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1u2P1CP7LnZuf_VUHg5_dIFVo6i7_tLOo&sz=w1200", "https://drive.google.com/thumbnail?id=1wSEc2wPWFUCf7p7ahrnlHuk_tYvr6h6U&sz=w1200", "https://drive.google.com/thumbnail?id=1-42t899Y9aySwOMnxWWiBzGMZkyY7ywH&sz=w1200", "https://drive.google.com/thumbnail?id=1K7jC6mVBwEc3AGDw9Qnl4LypvRpgiVMm&sz=w1200", "https://drive.google.com/thumbnail?id=1G7UQXRS4FKCfx5tBNbAN3y_FVVFCHDxA&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra Slt 2020 en Gris, interior negro y 83,000 millas.",
               en: "2020 GMC Sierra Slt Truck in Gray, black interior, 83,000 miles." }
    },
    {
      id: "CCH-79", slug: "2021-dodge-durango", make: "Dodge", model: "Durango", type: "suv",
      color: { es: "Gris", en: "Gray" }, year: "2021", miles: "52,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1rDUmpmm4usu_bmghrsAVLV74L9sMvouN&sz=w1200", "https://drive.google.com/thumbnail?id=1956qTX3Ve5PxhE1ZPhk5tNwVjikO6Q4M&sz=w1200", "https://drive.google.com/thumbnail?id=1GiJKGukHvByfudxa0z4cIoyOPJ4U2TuQ&sz=w1200", "https://drive.google.com/thumbnail?id=16-nryrvSqS5eT33OH5ViJgmz_SG13lvB&sz=w1200", "https://drive.google.com/thumbnail?id=161vKLATSXOsCdT23CSQ_qEACTdd3fHOd&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Dodge Durango 2021 en Gris, interior negro y 52,000 millas.",
               en: "2021 Dodge Durango SUV in Gray, black interior, 52,000 miles." }
    },
    {
      id: "CCH-80", slug: "2018-ford-f150-4x4", make: "Ford", model: "F150 4x4", type: "truck",
      color: { es: "Plateado", en: "Silver" }, year: "2018", miles: "119,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1YeGwxPyOYsi3-tVrQaqM4p-_ST3azsHh&sz=w1200", "https://drive.google.com/thumbnail?id=13kzeF_TUG29rTaWy-FAyPK3npRXRw9JT&sz=w1200", "https://drive.google.com/thumbnail?id=1EPN3zsq563ZAVu-izWZJ8dCf_OiYE-ST&sz=w1200", "https://drive.google.com/thumbnail?id=1k-UfcfOmgRSSvunhSsCyc0LUfxinyzVK&sz=w1200", "https://drive.google.com/thumbnail?id=1RF2fdCjig494XVXkb28moVk6c_NvHeJn&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ford F150 4x4 2018 en Plateado, interior gris y 119,000 millas.",
               en: "2018 Ford F150 4x4 Truck in Silver, gray interior, 119,000 miles." }
    },
    {
      id: "CCH-81", slug: "2023-chevrolet-silverado-2", make: "Chevrolet", model: "Silverado", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2023", miles: "112,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1FJLvs3i6dQ87Z_Hte-Ot9VEO371FY3d-&sz=w1200", "https://drive.google.com/thumbnail?id=1LJiSXIAOzOpC3uEEbcjKP3UdQXxnt4MB&sz=w1200", "https://drive.google.com/thumbnail?id=1vyeghIvCwWYdesNhCQ16UAAHlfPHAksb&sz=w1200", "https://drive.google.com/thumbnail?id=1Fz-cAO-yRnh4CEMCQOwd2IXw3Q9dKW4y&sz=w1200", "https://drive.google.com/thumbnail?id=1LtI9AFTLQflyBrBwCTO8Am11amlZ88es&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado 2023 en Negro, interior negro y 112,000 millas.",
               en: "2023 Chevrolet Silverado Truck in Black, black interior, 112,000 miles." }
    },
    {
      id: "CCH-82", slug: "2023-chrysler-300", make: "Chrysler", model: "300", type: "sedan",
      color: { es: "Gris", en: "Gray" }, year: "2023", miles: "60,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1lJVF7n5Q204wcUJAWtCmM3eV92cibe2I&sz=w1200", "https://drive.google.com/thumbnail?id=1_tOs_j8j3iqtBbnhs8ypmeVgsAjE3i4A&sz=w1200", "https://drive.google.com/thumbnail?id=1eH0R36r2k6BspiTKOR9pIJ7EzKYBXFRa&sz=w1200", "https://drive.google.com/thumbnail?id=1qCuFvLoeI8u_G5BHoYsy2d-XUKMSH37V&sz=w1200", "https://drive.google.com/thumbnail?id=1cP03sbj3ybq6EHlQAY7WcKFsnktgTYwu&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Sedán Chrysler 300 2023 en Gris, interior negro y 60,000 millas.",
               en: "2023 Chrysler 300 Sedan in Gray, black interior, 60,000 miles." }
    },
    {
      id: "CCH-83", slug: "2023-ford-bronco-black-diamond", make: "Ford", model: "bronco Black Diamond", type: "suv",
      color: { es: "Rojo", en: "Red" }, year: "2023", miles: "34,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1teSzWIAqdrMnZ9L-uvgsKGnXNWApKSLM&sz=w1200", "https://drive.google.com/thumbnail?id=1ep-kK3TFa5iF_KyudxTa7fJKZJRKYMga&sz=w1200", "https://drive.google.com/thumbnail?id=1hW-mqbPaiG24pqXfC0C88KRoG8mdsCqz&sz=w1200", "https://drive.google.com/thumbnail?id=1jQE6FHWTZoQksGQii6Jij8Ni5n0YXN-n&sz=w1200", "https://drive.google.com/thumbnail?id=1fMqVRQy117t6RCigheeTuKUnj151tEKZ&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "SUV Ford bronco Black Diamond 2023 en Rojo, interior café y 34,000 millas.",
               en: "2023 Ford bronco Black Diamond SUV in Red, brown interior, 34,000 miles." }
    },
    {
      id: "CCH-84", slug: "2020-chevrolet-silverado-ltz", make: "Chevrolet", model: "Silverado ltz", type: "truck",
      color: { es: "Gris", en: "Gray" }, year: "2020", miles: "92,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=13e-U9hVPoAWksDL1AhYljkOcnItTPCWM&sz=w1200", "https://drive.google.com/thumbnail?id=1mnM7CNIpx5N8joLY8Q6m_7EJSy6HdHHC&sz=w1200", "https://drive.google.com/thumbnail?id=1xfJYVzwT9trXeZ0Z9bO9pBZXdzYOIeb8&sz=w1200", "https://drive.google.com/thumbnail?id=13PeHognik3OlRRXYWGBbl7wg8Vyysfjj&sz=w1200", "https://drive.google.com/thumbnail?id=1nwqcyuBF9_4u9UP8nyalohOYa7Xx_79h&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado ltz 2020 en Gris, interior negro y 92,000 millas.",
               en: "2020 Chevrolet Silverado ltz Truck in Gray, black interior, 92,000 miles." }
    },
    {
      id: "CCH-85", slug: "2021-jeep-gladiator-mojave", make: "Jeep", model: "Gladiator Mojave", type: "truck",
      color: { es: "Rojo", en: "Red" }, year: "2021", miles: "91,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=12YBVG8rtijOrT2OnsV2J2I47-mUpua7M&sz=w1200", "https://drive.google.com/thumbnail?id=1A4fBhXqWW3uFHR0q8kk1zRQ_4eFMbKWe&sz=w1200", "https://drive.google.com/thumbnail?id=1bG8LS3DhBuVECrXL3n7xX2UPq35gX6Jg&sz=w1200", "https://drive.google.com/thumbnail?id=10mESxfAnOk7NR85oUhPgyKE_zxOQbq69&sz=w1200", "https://drive.google.com/thumbnail?id=1ReyVVQA5-Z3gAQzGMcISXL5MPeteRZ1Z&sz=w1200", "https://drive.google.com/thumbnail?id=1qvJJGLwkbKBpbSevYyIvgmqywadvHXU_&sz=w1200", "https://drive.google.com/thumbnail?id=1u4Sfn5u7UuPylpIJeNoHPefBR0Rv2hCp&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Jeep Gladiator Mojave 2021 en Rojo, interior negro y 91,000 millas.",
               en: "2021 Jeep Gladiator Mojave Truck in Red, black interior, 91,000 miles." }
    },
    {
      id: "CCH-86", slug: "2019-toyota-tundra-4x4", make: "Toyota", model: "Tundra 4x4", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2019", miles: "112,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1xhmrHSD7HRVT7xdXsxdb9pS_GqXdS5-_&sz=w1200", "https://drive.google.com/thumbnail?id=1uWoGe8-RL7S4bVd3h8EhbPUSjgGl2DdU&sz=w1200", "https://drive.google.com/thumbnail?id=12rxQ7_KpdtPZGvjx6PVdJYPRR9JhSN4f&sz=w1200", "https://drive.google.com/thumbnail?id=1BO5lqv4jzj5riQ1P4vH0Te9Mw7HiLAkD&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Toyota Tundra 4x4 2019 en Negro, interior negro y 112,000 millas.",
               en: "2019 Toyota Tundra 4x4 Truck in Black, black interior, 112,000 miles." }
    },
    {
      id: "CCH-87", slug: "2024-gmc-sierra-elevation", make: "GMC", model: "Sierra elevation", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2024", miles: "32,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1Ssn5Z_c1INoDypKnYSEuPmqyB1VTSpo7&sz=w1200", "https://drive.google.com/thumbnail?id=1NQO8UQzU3s_X1WAWZn4DyPxi6b1fOqA1&sz=w1200", "https://drive.google.com/thumbnail?id=13E6CGyOsmBEi920frWEJ8G5kSwwR_QxL&sz=w1200", "https://drive.google.com/thumbnail?id=1WBMUHcWraqcnGbY1VQhaGxw48jltgDeW&sz=w1200", "https://drive.google.com/thumbnail?id=1aJRBCzGAeSG4yoGcEVE08WhOXYzdsM8h&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca GMC Sierra elevation 2024 en Blanco, interior negro y 32,000 millas.",
               en: "2024 GMC Sierra elevation Truck in White, black interior, 32,000 miles." }
    },
    {
      id: "CCH-88", slug: "2021-chevrolet-silverado", make: "Chevrolet", model: "Silverado", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2021", miles: "90,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1cawD-4SYD1eUlKECB_IOZSv_eNioVZGE&sz=w1200", "https://drive.google.com/thumbnail?id=1yYpPzJCR4cWGtuje5Ov3d6ZqhHIAAliv&sz=w1200", "https://drive.google.com/thumbnail?id=1jjgGDunc9nCg-OESTg91IxB1T1ChLdfo&sz=w1200", "https://drive.google.com/thumbnail?id=12gzzLFcmvIQaq6axWUfB302wVJdC-ClH&sz=w1200", "https://drive.google.com/thumbnail?id=1mfDI8Xf4eCI473D3sF7X3zjCNDy6p5R_&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Chevrolet Silverado 2021 en Negro, interior negro y 90,000 millas.",
               en: "2021 Chevrolet Silverado Truck in Black, black interior, 90,000 miles." }
    },
    {
      id: "CCH-89", slug: "2023-nissan-altima-sr-awd", make: "Nissan", model: "Altima SR AWD", type: "sedan",
      color: { es: "Gris", en: "Gray" }, year: "2023", miles: "26,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=19ovakfxLTJChItRJoUxmBBC6L_vhQU_B&sz=w1200", "https://drive.google.com/thumbnail?id=117-qtRRnkvLhl7oUWCBgDg650GB95J2b&sz=w1200", "https://drive.google.com/thumbnail?id=1SltjHBVYvbPktHxVxDYe-230ehUIfh1f&sz=w1200", "https://drive.google.com/thumbnail?id=1nBZMczlNW_l3e5A8xtEiPL-b_EyPdl7R&sz=w1200", "https://drive.google.com/thumbnail?id=1Hsck487_1RAzVUTk0KzRyalRCK0uIYON&sz=w1200"],
      seen: { es: ["Quemacocos", "AWD"], en: ["Sunroof", "AWD"] },
      ideal: { es: "Sedán Nissan Altima SR AWD 2023 en Gris, interior negro y 26,000 millas.",
               en: "2023 Nissan Altima SR AWD Sedan in Gray, black interior, 26,000 miles." }
    },
    {
      id: "CCH-90", slug: "2022-ram-1500", make: "Ram", model: "1500", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2022", miles: "43,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1xWoqUbyxQuCf10WiWTzHkxbNJY3hL6il&sz=w1200", "https://drive.google.com/thumbnail?id=1ufaKxVYgoGfei8ax3kWpHoIvjDQqU2mk&sz=w1200", "https://drive.google.com/thumbnail?id=1bcDvmdJKeebxvWyc-cJ5Cdd68BCdoc3I&sz=w1200", "https://drive.google.com/thumbnail?id=1rzDJ4rGiI2-bnEI47bJntwu3s5RTlxMU&sz=w1200", "https://drive.google.com/thumbnail?id=1Y7L4n26NCGMB6RrpEzFMZgFAX6cAqyxz&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ram 1500 2022 en Blanco, interior gris y 43,000 millas.",
               en: "2022 Ram 1500 Truck in White, gray interior, 43,000 miles." }
    },
    {
      id: "CCH-91", slug: "2024-ram-2500-laramie", make: "Ram", model: "2500 Laramie", type: "truck",
      color: { es: "Negro", en: "Black" }, year: "2024", miles: "40,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: null, dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1x7wbNFupjDLTgHngtab2FwTyu6n-siLR&sz=w1200", "https://drive.google.com/thumbnail?id=1mHytkiaxMfH9BURsY_WXJr0Pf5o69218&sz=w1200", "https://drive.google.com/thumbnail?id=1WlO0WH_8SGSL2u-J-JAwjeRt4P8ooVB6&sz=w1200", "https://drive.google.com/thumbnail?id=1DWrauQa9jO9-r7VQw4YzSjObj1jjVlEW&sz=w1200"],
      seen: { es: ["Diésel"], en: ["Diesel"] },
      ideal: { es: "Troca Ram 2500 Laramie 2024 en Negro, interior negro y 40,000 millas.",
               en: "2024 Ram 2500 Laramie Truck in Black, black interior, 40,000 miles." }
    },
    {
      id: "CCH-92", slug: "2026-ram-2500-laramie-mega-cab", make: "Ram", model: "2500 Laramie Mega Cab", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2026", miles: "4,785", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1hfEi3uHqPhAh6LhEldBhieXBButctdfw&sz=w1200", "https://drive.google.com/thumbnail?id=12C9igDI-MI5MtSz4sd9XZAmlryEjm2Hb&sz=w1200", "https://drive.google.com/thumbnail?id=1g_YrfnUKnOV-uGxt3sLuRSxvouGO5R5H&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ram 2500 Laramie Mega Cab 2026 en Blanco, interior negro y 4,785 millas.",
               en: "2026 Ram 2500 Laramie Mega Cab Truck in White, black interior, 4,785 miles." }
    },
    {
      id: "CCH-93", slug: "2021-ram-1500-sport", make: "Ram", model: "1500 Sport", type: "truck",
      color: { es: "Blanco", en: "White" }, year: "2021", miles: "49,000", condition: "used",
      seats: { es: "Por confirmar", en: "To be confirmed" }, rows3: false, drive: "4x4", dealer: "",
      photos: ["https://drive.google.com/thumbnail?id=1sK5nq8gGXh8Aad0BWxbvkHKwUiD2oN2v&sz=w1200", "https://drive.google.com/thumbnail?id=1rBenEJ7p0LgUuylti9uDHzAGjYnsGen_&sz=w1200", "https://drive.google.com/thumbnail?id=1Y4zumvIXdw81OPQLA2Q42tH1m55jE5ew&sz=w1200", "https://drive.google.com/thumbnail?id=1kGIStFmVOEJ3Xz41E9pyO8pU0Oltebfj&sz=w1200", "https://drive.google.com/thumbnail?id=1kwpqi0bcSUome_tvgphW3sQ6rPJuUAPY&sz=w1200"],
      seen: { es: [], en: [] },
      ideal: { es: "Troca Ram 1500 Sport 2021 en Blanco, interior gris y 49,000 millas.",
               en: "2021 Ram 1500 Sport Truck in White, gray interior, 49,000 miles." }
    },
];
