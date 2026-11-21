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
- Contadores animados, revelado al hacer scroll y scrollspy en la navegación.
- Servicios con selector de modalidad (Excel / Power BI / Híbrida) que
  intercambia los alcances de los planes dashboard.
- Filtros de proyectos por dificultad (Básico / Intermedio / Avanzado).
- Formulario de contacto con **EmailJS** (validación y notificaciones toast).
- Previsualizaciones de proyectos **solo en dispositivos > 600px**.
- Accesibilidad: skip-link, `aria-*`, foco visible, `prefers-reduced-motion`
  y respaldo sin JavaScript (contenido siempre visible).

## Estructura

```
Gbarrantes25.github.io/
├── index.html                # Página principal
├── terminos.html             # Términos y Condiciones (24 cláusulas + índice)
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
