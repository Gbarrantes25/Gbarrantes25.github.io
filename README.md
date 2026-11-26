# Gbarrantes25.github.io — Portafolio "BI Operations"

Portafolio profesional de **Giancarlo Barrantes**, consultor de Business
Intelligence y Data Analytics (Lima, Perú). Sitio estático publicado en
GitHub Pages, construido **100% con HTML, CSS y JavaScript puro** (sin
frameworks ni librerías de UI).

## Identidad visual

- **Concepto**: "centro de mando de datos" — tema oscuro premium con acentos
  neón en azul, turquesa, púrpura y magenta.
- **Tipografías**: Space Grotesk (títulos) · Inter (texto) · JetBrains Mono
  (datos, etiquetas y consola).
- **Firma visual**: consola SQL interactiva en el hero que consulta el propio
  portafolio, fondo de partículas de datos en canvas, ticker infinito de
  tecnologías y grid bento en "Sobre mí".

## Funcionalidades

- Consola SQL con efecto de tipeo, resaltado de sintaxis y gráfico de barras
  animado (datos reales del portafolio: 6 Power BI · 4 Python · 2 Excel · 1 Looker).
- Estado de disponibilidad en vivo según hora de Lima (UTC-5) y feriados del Perú.
- Contadores animados, **reveal reversible al hacer scroll** (los elementos se
  revelan cada vez que entran en pantalla, bajando o subiendo, y se ocultan
  al salir) y scrollspy en la navegación.
- Servicios con selector de modalidad (Excel / Power BI / Híbrida) que
  intercambia los alcances de los planes dashboard.
- Filtros de proyectos por dificultad (Básico / Intermedio / Avanzado).
- Formulario de contacto con **EmailJS cargado bajo demanda** (validación y
  notificaciones toast): el SDK se descarga con el primer foco en el
  formulario, no en la carga inicial de la página.
- Previsualizaciones de proyectos **solo en dispositivos > 600px**.
- Accesibilidad: skip-link, `aria-*`, foco visible, `prefers-reduced-motion`
  y respaldo sin JavaScript (contenido siempre visible).

## Compatibilidad móvil (Android / iOS)

- **Aro del logo (`ring`) y ticker animados por JavaScript** (`requestAnimationFrame`),
  no por animaciones CSS: en Android, el ahorro de batería o el ajuste
  "Quitar animaciones" de accesibilidad hacen que el navegador congele las
  animaciones CSS y estos efectos quedaban muertos. El motor JS sigue
  funcionando en esos teléfonos, se pausa fuera de pantalla y respeta el
  modo ligero.
- **Scroll suave garantizado por JS**: Chrome ignora `scroll-behavior:smooth`
  cuando el sistema pide movimiento reducido, así que los enlaces ancla saltaban
  de golpe en Android. Ahora un bucle rAF interpola la posición (con easing),
  compensa la altura del navbar y funciona en cualquier navegador. También
  navega suave el índice de cláusulas de `terminos.html`.
- **Sin `content-visibility: auto`**: con alturas estimadas, el navegador llevaba
  el ancla a una posición equivocada y el scroll "saltaba" al renderizar las
  secciones. La fluidez se consigue limitando el trabajo fuera de pantalla en
  `scripts.js` (canvas y consola se detienen al salir del viewport).
- `will-change: transform` eliminado de los botones (menos capas compuestas
  en gama baja) y respaldo `@supports` para navegadores sin `aspect-ratio`.
- **Reveal reversible por CSS animation (no transition)**: al entrar en el
  viewport (ampliado +12%) cada elemento ejecuta `reveal-rise`, una animación
  de solo `opacity`+`transform` que corre íntegra en el compositor y no pisa
  la propiedad `transition` de tarjetas/tiles (sus hovers conservan su
  velocidad propia). Al salir de pantalla el corte es instantáneo e
  invisible, así que no se paga ninguna animación de salida. El escalonado
  por lote (60 ms entre elementos que entran juntos) lo calcula `scripts.js`
  respetando los `--d` escritos a mano en el HTML.
- **EmailJS fuera del render inicial**: su script ya no vive en el `<head>`
  bloqueando el primer pintado; se inyecta con el primer foco del formulario
  y el envío lo espera si todavía no llegó. El scroll y la carga quedan
  libres de terceros.
- **Imágenes con `decoding="async"`**: la decodificación sale del hilo
  principal y el scroll no se engancha cuando una captura de proyecto
  termina de descargar.

## Nada desborda el ancho del contenedor (360px y menores)

Varios elementos tenían un *min-content* mayor que el contenedor general
(`min(1160px, 100% - 3rem)`) y empujaban el documento ~38px hacia la derecha,
con la página descentrada y el contenido cortado en móviles de 360px:

- **Selector de modalidad**: la fila de 4 botones (374px) no cabía en el
  contenedor de 312px. Ahora es una cuadrícula 2×2 en ≤600px y nunca supera
  el ancho disponible (`max-width: 100%` + `flex-wrap` como respaldo).
- **Barra de la consola del hero** (puntos + título + etiqueta): ahora
  admite `flex-wrap`, y la pista `dataset: github.com/...` parte si no cabe.
- **Email de contacto** (`gbarrantes250689@gmail.com`): token sin espacios
  de ~250px. Con `min-width: 0` en su columna, `<wbr>` antes de la `@` y
  `overflow-wrap`, parte limpio ("gbarrantes250689 / @gmail.com") sin
  arrastrar el ancho de la tarjeta.
- **Sección Proceso**: una sola columna en ≤600px (dos columnas de ~130px
  dejaban pasos que desbordaban el track y 1px al documento).
- **Navbar compacto en ≤400px**: logo + nombre + CTA + hamburguesa sumaban
  ~299px de contenido mínimo; se ensancha el ancho útil (`100% - 1.5rem`) y
  se aprietan huecos y tamaños para que quepa centrado.
- La **tabla de modalidades** de `terminos.html` mantiene su scroll
  horizontal propio (`.table-wrap`) y no deforma el layout.
- Verificado sin desbordes en 320 / 360 / 375 / 390px (las 4 modalidades
  de servicio) y en escritorio 768 / 1280 / 1440px.

## Estructura

```
Gbarrantes25.github.io/
├── index.html                # Página principal
├── terminos.html             # Términos y Condiciones (24 cláusulas + índice)
├── privacidad.html           # Políticas de Privacidad
├── sitemap.xml               # Mapa del sitio
├── README.md
└── Assets/
    ├── style.css             # Hoja de estilos (identidad + responsive)
    ├── scripts.js            # Interactividad (canvas, consola, EmailJS, UI)
    └── Img/                  # Logo, iconos de stack, capturas y og-image
```

## Stack

- HTML5 → estructura semántica
- CSS3 → diseño responsive (mobile-first), degradados y glassmorphism
- JavaScript (vanilla) → canvas, animaciones, EmailJS e interacciones
- EmailJS → envío del formulario sin backend
- GitHub Pages → hosting y despliegue continuo
