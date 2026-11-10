# 👓 Óptica Management Pro — Mi Proyecto de Gestión para Ópticas

¡Hola a todos! 👋  
Soy desarrollador junior y este es mi proyecto: **Óptica Management Pro**.  
La idea nació porque un familiar que trabaja en una óptica me contaba lo caótico que era llevar las fichas de los clientes en papel, las citas en una libreta y el stock de monturas en un Excel que siempre se desfasaba. Así que me propuse como reto personal crear una aplicación web moderna, rápida y súper fácil de usar para solucionar todo eso en un solo sitio.

¡Espero que os guste cómo ha quedado! Os cuento todo lo que tiene, cómo lo hice y qué aprendí por el camino. 🚀

---

## 🎯 ¿Qué hace esta aplicación? (Funcionalidades principales)

Quería que fuera una app completa y que de verdad se pudiera usar en el día a día de una tienda o clínica:

1. **📊 Panel de Control (Dashboard):**
   - Nada más entrar ves un resumen con las citas que hay hoy, las recetas hechas, los pacientes registrados y avisos si queda poco stock de algún producto.
   - Tiene gráficos chulos con las consultas de la semana y contadores animados con números que suben solos (¡gracias a GSAP!).
   - Desde aquí mismo el doctor o recepcionista puede marcar si el paciente ya ha entrado a consulta o si ha terminado con un solo clic.

2. **👁️ Módulo de Recetas Ópticas (¡Lo más difícil de hacer!):**
   - Un formulario clínico completo para Ojo Derecho (OD) y Ojo Izquierdo (OI).
   - Puedes poner la Esfera (SPH), Cilindro (CYL), Eje (AXIS), Adición (ADD) para los que tienen presbicia, y la Distancia Pupilar (DP).
   - **Botón mágico de Transposición:** Investigué cómo funciona la optometría y programé una función que convierte la fórmula si te la dan en cilindro positivo o negativo recalculando la esfera y girando el eje 90 grados.
   - **Botón de Imprimir / Guardar en PDF:** Genera una receta limpia y formal lista para imprimir en A4 o enviar al paciente con el membrete de la clínica y la firma del colegiado.

3. **📅 Agenda de Citas sin Solapamientos:**
   - Puedes agendar citas eligiendo el paciente, el optometrista (Dra. Elena o Dr. Carlos), el gabinete (1 o 2) y el tipo de servicio (graduación, lentillas, tensión ocular...).
   - **¡Cero choques de horario!** Programé una comprobación para que si intentas ponerle una cita a un doctor a la misma hora en la que ya está ocupado, la app te avise con un mensaje en rojo y no te deje meter la pata.

4. **📦 Inventario y Almacén en Tiempo Real:**
   - Catálogo con monturas de marca (Ray-Ban, Oakley, etc.), lentes graduadas, lentillas y líquidos.
   - Avisa con etiquetas amarillas o rojas si el stock baja del mínimo recomendado.
   - Botón para hacer ajustes (+ o -) justificando el motivo (por ejemplo: "Entrada por albarán" o "Rotura en el taller").
   - Botón para **exportar todo el inventario a un archivo CSV** de Excel.

5. **👥 Fichero de Pacientes / Clientes:**
   - Búsqueda instantánea escribiendo el nombre, teléfono o DNI.
   - Ficha detallada de cada paciente con sus datos de contacto, sus notas médicas (ojo seco, glaucoma, diabetes...) y todo su historial de recetas anteriores ordenadas por fecha.

6. **🧾 Ventas, Taller y Tickets:**
   - Puedes crear un pedido juntando montura + cristales + la receta del paciente.
   - Al guardar la venta, **descuenta automáticamente las unidades del inventario** para no tener descuadres.
   - Saca un ticket simplificado de caja con desglose de IVA (21%) y garantía de adaptación.

7. **🛡️ Seguridad y Pista de Auditoría (RGPD):**
   - Cada vez que alguien crea una receta, cambia una cita o ajusta stock, queda guardado en una tabla de auditoría con la fecha, hora exacta y el usuario que lo hizo. Así todo es transparente y seguro.

---

## 💻 Las Tecnologías que elegí (Stack)

Para este proyecto quise usar tecnologías modernas que piden en los trabajos para ganar soltura:

- **Next.js 14 (App Router) + React 18:** Me encanta porque la navegación entre páginas es instantánea y el sistema de carpetas es súper ordenado.
- **TypeScript:** Al principio me daba dolores de cabeza con los tipos, pero gracias a esto evité un montón de errores tontos con los valores de las dioptrías y los objetos de cliente.
- **Tailwind CSS:** Para diseñar rápido con clases utilitarias. Configuré una paleta con tono *Teal* (verde azulado médico) que da sensación de limpieza y profesionalidad.
- **Radix UI:** Para hacer los modales y ventanas emergentes accesibles (se pueden cerrar con la tecla `Escape` y navegar con el tabulador).
- **Framer Motion & GSAP:** Usé Framer Motion para que las páginas cambien con una transición suave y GSAP para los contadores numéricos del panel.
- **Zod:** Para validar que nadie meta cosas raras en los formularios (por ejemplo, que el eje esté entre 0 y 180°, o que las dioptrías vayan de 0.25 en 0.25).
- **Recharts:** Para dibujar las barras de actividad semanal de forma responsiva.

---

## 💡 Cosas que aprendí haciendo este proyecto

1. **La matemática de la optometría:** Aprendí qué es la transposición esferocilíndrica. Si una receta dice `+1.00 -0.50 90°`, equivale a `+0.50 +0.50 180°`. ¡Tener una prueba unitaria que verifique esto me dio mucha satisfacción!
2. **Evitar solapamientos:** Tuve que pensar bien la condición lógica de tiempo: dos eventos se solapan si `(InicioA < FinB) && (FinA > InicioB)`.
3. **Persistencia reactiva:** Hice un store en memoria que se sincroniza automáticamente con el `localStorage` del navegador. Si recargas la página o creas una cita nueva, no se pierde nada y todo se actualiza en tiempo real en los demás componentes.

---

## 📁 ¿Cómo está organizada la estructura de carpetas?

Intenté que estuviera lo más ordenado y limpio posible:

```text
├── src/
│   ├── app/                      # Las páginas de la app (Next.js App Router)
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── recetas/              # Listado de recetas y nueva prescripción
│   │   ├── citas/                # Calendario y agenda del gabinete
│   │   ├── inventario/           # Almacén, productos y ajustes
│   │   ├── clientes/             # Fichero de pacientes y expedientes
│   │   ├── ventas/               # Pedidos de taller y tickets
│   │   └── auditoria/            # Logs de eventos y seguridad RGPD
│   ├── components/
│   │   ├── layout/               # Barra lateral (Sidebar), cabecera y estructura
│   │   ├── ui/                   # Botones, tarjetas, badges, modales y tickers
│   │   └── recetas/              # Modal con el documento imprimible oficial
│   └── lib/
│       ├── types.ts              # Todos los tipos e interfaces de TypeScript
│       ├── validators.ts         # Esquemas de validación Zod
│       ├── optical-math.ts       # Cálculos matemáticos y fórmulas de óptica
│       ├── store.ts              # Datos de ejemplo y lógica para guardar cambios
│       └── utils.ts              # Formateadores de moneda (€), fechas y dioptrías
├── test-optical-system.ts        # Suite de pruebas automáticas
└── README.md                     # ¡Este archivo que estás leyendo!
```

---

## 🚀 ¿Cómo probar la app en tu ordenador?

Solo necesitas tener instalado **Node.js** (versión 18 o superior). Sigue estos 4 pasos:

### 1. Clona el repositorio
```bash
git clone https://github.com/andradegali1503-droid/optica-beta.git
cd optica-beta
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Ejecuta las pruebas automáticas
Para comprobar que todos los cálculos matemáticos y validaciones pasan al 100%:
```bash
npm test
```
Deberías ver: `RESUMEN: 12 Pasados, 0 Fallidos ✅`.

### 4. Arranca el servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador y entra en: **`http://localhost:3000`** 🎉

---

## 📝 Cosas que me gustaría añadir en el futuro (Roadmap)
- [ ] Conectar directamente con la base de datos Supabase en la nube para sincronizar entre varios dispositivos.
- [ ] Lector de códigos de barras con la cámara del móvil o tablet.
- [ ] Envío automático de recordatorios de cita por WhatsApp o correo al paciente.

---

¡Muchas gracias por revisar mi proyecto! Si tienes cualquier sugerencia, consejo o feedback sobre el código, ¡será súper bienvenido para seguir aprendiendo y mejorando! 😊
