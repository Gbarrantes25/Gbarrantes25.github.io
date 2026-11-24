/* ═══════════════════════════════════════════════════════════════════════
   GIANCARLO BARRANTES — BI OPERATIONS · scripts.js
   Partículas de datos · consola SQL · scrollspy · EmailJS · UI
   + Motor de movimiento rAF (aro del logo + ticker) y scroll suave por JS:
     a prueba de Android/iOS aunque el navegador congele las animaciones
     CSS o ignore scroll-behavior:smooth.
   + Reveal reversible: los elementos se revelan cada vez que entran al
     viewport (bajando o subiendo) y se ocultan al salir, escalonados por
     lote. EmailJS se carga bajo demanda con el primer foco del formulario.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    /* Android activa prefers-reduced-motion con el ahorro de batería, con
       "Quitar animaciones" de accesibilidad o con la escala de animación en
       OFF del sistema. Apagar TODO el movimiento dejaba la web "muerta" en
       esos teléfonos (sin consola, sin ticker, sin puntitos, sin scroll
       suave). Ahora esa preferencia activa un MODO LIGERO: las animaciones
       se conservan pero con menos nodos, velocidad menor y fundidos suaves
       en lugar de desplazamientos. */
    const liteMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasIO = 'IntersectionObserver' in window;

    /* ── 1 · Disponibilidad (hora de Lima) ─────────────────────────────── */
    const FERIADOS = ['01-01', '05-01', '06-29', '07-28', '07-29', '08-30', '11-01','12-08', '12-25'];

    function horaLima() {
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
    }

    function consultorDisponible() {
        const ahora = horaLima();
        const dia = ahora.getDay();            // 0=Dom, 6=Sáb
        const hora = ahora.getHours();
        const mmdd = String(ahora.getMonth() + 1).padStart(2, '0') + '-' + String(ahora.getDate()).padStart(2, '0');
        return dia !== 0 && dia !== 6 && !FERIADOS.includes(mmdd) && hora >= 9 && hora < 18;
    }

    function pintarDisponibilidad() {
        const pill = $('#statusPill');
        const txt = $('#statusText');
        if (!pill || !txt) return;
        if (consultorDisponible()) {
            pill.classList.remove('off');
            txt.textContent = 'Consultor disponible';
        } else {
            pill.classList.add('off');
            txt.textContent = 'Fuera de horario · respondo pronto';
        }
    }
    pintarDisponibilidad();
    setInterval(pintarDisponibilidad, 60000);

    /* ── 2 · Partículas de datos (canvas del hero) ─────────────────────── */
    function initParticles() {
        const canvas = $('#net');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const COLORS = ['#4c8dff', '#2ee6c8', '#a78bfa', '#ff5cad'];
        // Resolución del canvas contenida: en teléfonos gama baja un DPR de
        // 3 multiplica por 9 los píxeles a pintar por frame.
        const DPR = Math.min(window.devicePixelRatio || 1, liteMotion ? 1.5 : 2);
        const SPEED = liteMotion ? .5 : 1;
        let nodes = [];
        let raf = null;
        let lastW = 0, lastH = 0;
        const mouse = { x: -9999, y: -9999 };

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            const w = Math.round(rect.width), h = Math.round(rect.height);
            // La barra de URL de Android dispara resize al mostrar/ocultar:
            // si el tamaño no cambió de verdad, no se regenera nada.
            if (!w || !h || (w === lastW && h === lastH)) return;
            lastW = w; lastH = h;
            canvas.width = w * DPR;
            canvas.height = h * DPR;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

            const target = Math.max(16, Math.min(liteMotion ? 46 : 72, Math.floor(w / (liteMotion ? 22 : 16))));
            nodes = Array.from({ length: target }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - .5) * .35 * SPEED,
                vy: (Math.random() - .5) * .35 * SPEED,
                r: Math.random() * 1.8 + .8,
                c: COLORS[Math.floor(Math.random() * COLORS.length)]
            }));
        }

        function frame() {
            const w = canvas.width / DPR;
            const h = canvas.height / DPR;
            ctx.clearRect(0, 0, w, h);

            // Enlaces entre nodos cercanos
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 130 * 130) {
                        const alpha = (1 - Math.sqrt(d2) / 130) * .17;
                        ctx.strokeStyle = 'rgba(139, 160, 225,' + alpha.toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // Nodos
            for (const n of nodes) {
                // Repulsión suave del puntero
                const dx = n.x - mouse.x, dy = n.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 90 * 90 && d2 > 0.01) {
                    const d = Math.sqrt(d2);
                    n.x += (dx / d) * .55;
                    n.y += (dy / d) * .55;
                }

                n.x += n.vx;
                n.y += n.vy;

                if (n.x < -8) n.x = w + 8; else if (n.x > w + 8) n.x = -8;
                if (n.y < -8) n.y = h + 8; else if (n.y > h + 8) n.y = -8;

                ctx.fillStyle = n.c;
                ctx.globalAlpha = .72;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            raf = requestAnimationFrame(frame);
        }

        canvas.parentElement.addEventListener('pointermove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('pointerleave', () => {
            mouse.x = mouse.y = -9999;
        });

        // resize con rebote: evita regenerar las partículas varias veces
        // seguidas al girar el teléfono o al mostrar/ocultar la barra de URL.
        let resizeT = null;
        addEventListener('resize', () => {
            clearTimeout(resizeT);
            resizeT = setTimeout(resize, 150);
        }, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(raf);
                raf = null;
            } else if (!raf) {
                raf = requestAnimationFrame(frame);
            }
        });

        resize();

        // Dibujar solo mientras el hero está en pantalla: al hacer scroll
        // hacia abajo el canvas deja de consumir frames (fluidez).
        if (hasIO) {
            const heroIO = new IntersectionObserver((entries) => {
                if (entries.some(e => e.isIntersecting)) {
                    if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
                } else if (raf) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
            }, { threshold: 0 });
            heroIO.observe(canvas);
        } else if (!document.hidden) {
            raf = requestAnimationFrame(frame);
        }
    }
    try { initParticles(); } catch (err) { /* un canvas roto no debe tumbar el resto de la web */ }

    /* ── 2b · Motor de movimiento: aro del logo + ticker ──────────────
       En teléfonos Android con "Quitar animaciones" de accesibilidad o con
       el ahorro de batería activo, el navegador congela las animaciones CSS
       y el aro de .b-logo y el marquee de tecnologías quedaban parados
       (mientras el canvas de partículas, que corre sobre rAF, seguía vivo).
       Este motor mueve ambos efectos con requestAnimationFrame: funciona
       en cualquier teléfono, se detiene al salir de pantalla o al ocultar
       la pestaña y va más despacio en modo ligero. */
    (function initMotionEngine() {
        const ring = $('.b-logo .ring');
        const ringImg = ring ? $('img', ring) : null;
        const ticker = $('.ticker');
        const track = $('.ticker-track');
        if (!ring && !track) return;

        const RING_MS = liteMotion ? 28000 : 14000;   // ms por vuelta del aro
        const TICK_MS = liteMotion ? 76000 : 38000;   // ms por ciclo del marquee
        let raf = null;
        let last = 0;
        let p = 0;               // progreso del ticker [0..1)
        let paused = false;      // puntero sobre el ticker
        const vis = { ring: !hasIO, ticker: !hasIO };

        function frame(now) {
            raf = requestAnimationFrame(frame);
            const dt = last ? Math.min(now - last, 100) : 16.7;
            last = now;

            if (ring && vis.ring) {
                const deg = (now % RING_MS) / RING_MS * 360;
                ring.style.transform = 'rotate(' + deg + 'deg)';
                if (ringImg) ringImg.style.transform = 'rotate(' + (-deg) + 'deg)';
            }

            if (track && vis.ticker && !paused) {
                p = (p + dt / TICK_MS) % 1;
                track.style.transform = 'translateX(' + (-50 * p).toFixed(3) + '%)';
            }
        }

        function start() {
            if (!raf && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
        }
        function stop() {
            if (raf) { cancelAnimationFrame(raf); raf = null; }
        }

        if (ticker) {
            ticker.addEventListener('pointerenter', () => { paused = true; });
            ticker.addEventListener('pointerleave', () => { paused = false; });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop(); else start();
        });

        if (hasIO) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.target === ring) vis.ring = e.isIntersecting;
                    if (e.target === ticker) vis.ticker = e.isIntersecting;
                });
                if (vis.ring || vis.ticker) start(); else stop();
            }, { threshold: 0 });
            if (ring) io.observe(ring);
            if (ticker) io.observe(ticker);
        } else {
            start();
        }
    })();

    /* ── 3 · Contadores automáticos: totales leídos del propio HTML ───── */
    /* El HTML conserva valores estáticos como respaldo sin-JS; con JS se
       recalculan desde las tarjetas de #proyectos: total, top tecnologías
       del stack y distribución por dificultad. Bastará con añadir una
       project-card nueva para que todos los contadores se actualicen. */
    (function initAutoCounts() {
        const cards = $$('.project-card');
        if (!cards.length) return;

        const TECH_LABEL = {
            'POWER BI': 'Power BI', 'PYTHON': 'Python', 'EXCEL': 'Excel',
            'DATA STUDIO': 'Data Studio', 'SQL': 'SQL', 'BIGQUERY': 'BigQuery',
            'DAX': 'DAX', 'POWER QUERY': 'Power Query', 'STREAMLIT': 'Streamlit',
            'MARIMO': 'Marimo', 'PLOTLY': 'Plotly', 'PARÁMETROS': 'Parámetros'
        };

        // Total por tecnología: se toma la tecnología PRINCIPAL de cada
        // proyecto (primer span de su .project-stack), igual que haría
        // "GROUP BY herramienta" en la consulta SQL de la consola.
        const techCount = {};
        cards.forEach(card => {
            const primary = $('.project-stack span', card);
            if (!primary) return;
            const t = primary.textContent.trim().toUpperCase();
            techCount[t] = (techCount[t] || 0) + 1;
        });
        const ranking = Object.entries(techCount)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        const techLabel = t => TECH_LABEL[t] || t.charAt(0) + t.slice(1).toLowerCase();

        // KPI "Proyectos" del hero: total real de tarjetas
        const kpiTotal = $('.kpi b[data-auto="total"]');
        if (kpiTotal) {
            kpiTotal.dataset.count = String(cards.length);
            kpiTotal.textContent = String(cards.length);
        }

        // KPIs de tecnología: se llenan con el top 2 del ranking
        $$('b[data-auto-tech]').forEach((b, i) => {
            const entry = ranking[i];
            const kpiBox = b.closest('.kpi');
            if (!entry) {
                if (kpiBox) kpiBox.style.display = 'none';
                return;
            }
            b.dataset.count = String(entry[1]);
            b.textContent = String(entry[1]);
            const lbl = kpiBox && kpiBox.querySelector('span');
            if (lbl) lbl.textContent = techLabel(entry[0]);
        });

        // Gráfico de barras: se regenera con el top 6 de tecnologías
        const bars = $('#barsChart');
        if (bars && ranking.length) {
            const top = ranking.slice(0, 6);
            const max = top[0][1];
            bars.innerHTML = top.map(([t, n]) =>
                '<div class="bar-col"><span class="bar-val">' + n + '</span>' +
                '<span class="bar" style="--h:' + Math.max(6, Math.round(n / max * 100)) + '%"></span>' +
                '<span class="bar-label">' + t + '</span></div>'
            ).join('');
            bars.setAttribute('aria-label', 'Proyectos por herramienta: ' +
                top.map(([t, n]) => techLabel(t) + ' ' + n).join(', '));
        }

        // Contadores de los filtros de dificultad (Todos / Básico / …)
        $$('.filter-btn').forEach(btn => {
            const c = btn.querySelector('.count');
            if (!c) return;
            const f = btn.dataset.filter;
            c.textContent = String(f === 'todos'
                ? cards.length
                : cards.filter(card => card.dataset.difficulty === f).length);
        });
    })();

    /* ── 4 · Consola SQL: tipeo + barras + KPIs ────────────────────────── */
    function initConsole() {
        const code = $('#sqlCode');
        const bars = $('#barsChart');
        if (!code || !bars) return;
        const consoleBox = bars.closest('.console');
        if (!consoleBox) return;

        // El HTML estático muestra la consulta completa como respaldo sin-JS;
        // con JS activo se limpia al inicio para tipearla desde cero.
        code.textContent = '';

        const TOKENS = [
            ['SELECT ', 'kw'],
            ['herramienta,', ''],
            [' COUNT(*)', 'fn'],
            [' AS ', 'kw'],
            ['proyectos\n', ''],
            ['FROM ', 'kw'],
            ['portafolio.gb\n', 'str'],
            ['GROUP BY ', 'kw'],
            ['herramienta\n', ''],
            ['ORDER BY ', 'kw'],
            ['proyectos ', ''],
            ['DESC', 'kw'],
            [';', '']
        ];

        function renderFull() {
            code.innerHTML = '';
            for (const [t, c] of TOKENS) {
                const s = document.createElement('span');
                if (c) s.className = c;
                s.textContent = t;
                code.appendChild(s);
            }
            bars.classList.add('done');
            animarContadores(bars.closest('.console'));
        }

        // La consola solo se re-escribe mientras está en pantalla (un único
        // observer reutilizado en todos los ciclos: antes se creaba uno
        // nuevo por cada re-escritura y se acumulaban en memoria).
        let consoleVisible = true;
        if (hasIO) {
            new IntersectionObserver((entries) => {
                consoleVisible = entries.some(e => e.isIntersecting);
            }, { threshold: 0 }).observe(consoleBox);
        }

        function typeLoop() {
            let ti = 0, ci = 0;
            let span = null;
            bars.classList.remove('done');
            code.innerHTML = '';

            function step() {
                if (ti >= TOKENS.length) {
                    // Consulta ejecutada: mostrar resultados
                    setTimeout(() => {
                        bars.classList.add('done');
                        animarContadores(consoleBox);
                        // Reiniciar el ciclo cuando la consola siga visible
                        const restart = () => (consoleVisible ? typeLoop() : setTimeout(restart, 1500));
                        setTimeout(restart, 7000);
                    }, 500);
                    return;
                }
                const [text, cls] = TOKENS[ti];
                if (ci === 0) {
                    span = document.createElement('span');
                    if (cls) span.className = cls;
                    code.appendChild(span);
                }
                span.textContent += text[ci];
                ci++;
                if (ci >= text.length) { ti++; ci = 0; }
                // En modo ligero el tipeo es más rápido, pero sigue visible
                setTimeout(step, liteMotion ? 14 + Math.random() * 26 : 26 + Math.random() * 40);
            }
            step();
        }

        // Navegadores muy antiguos sin IntersectionObserver: mostrar todo
        // de una vez (sin quedar esperando un evento que nunca llegará).
        if (!hasIO) { renderFull(); return; }

        // Iniciar cuando la consola entre al viewport
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                io.disconnect();
                typeLoop();
            }
        }, { threshold: .3 });
        io.observe(consoleBox);
    }
    try { initConsole(); } catch (err) { /* la consola no debe tumbar el resto de la web */ }

    /* ── 5 · Contadores animados ───────────────────────────────────────── */
    function animarContadores(scope) {
        $$('[data-count]', scope || document).forEach(el => {
            if (el.dataset.done) return;
            el.dataset.done = '1';
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';

            const t0 = performance.now();
            const dur = liteMotion ? 700 : 1300;
            (function tick(now) {
                const p = Math.min((now - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        });
    }

    if (hasIO) {
        const countersIO = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animarContadores(e.target);
                    countersIO.unobserve(e.target);
                }
            });
        }, { threshold: .5 });
        $$('.b-kpi').forEach(el => countersIO.observe(el));
    } else {
        animarContadores(document);
    }

    /* ── 6 · Reveal al hacer scroll (reversible: al bajar y al subir) ────
       Antes cada elemento se revelaba UNA sola vez (unobserve tras el
       primer avistamiento): al volver hacia arriba ya no había animación.
       Ahora el observer se mantiene activo y conmuta .in cada vez que el
       elemento entra o sale del viewport AMPLIADO (rootMargin +12%):
       · al entrar (viniendo de abajo o de arriba) se revela;
       · al salir del todo desaparece, ya fuera de pantalla.
       El escalonado (--d) se calcula por lote: los elementos que entran
       juntos en un mismo scroll se reparten 60 ms entre sí, con un tope
       de 240 ms para que el último no espere de más. Los --d escritos a
       mano en el HTML (bento, pasos…) se respetan y no se sobreescriben. */
    if (hasIO) {
        const revealIO = new IntersectionObserver((entries) => {
            let idx = 0; // índice dentro del lote que entra en este frame
            entries.forEach(e => {
                const el = e.target;
                if (e.isIntersecting) {
                    if (!el.classList.contains('in')) {
                        if (!el.style.getPropertyValue('--d') && idx < 4) {
                            el.style.setProperty('--d', (idx * .06).toFixed(2) + 's');
                            el.dataset.stg = '1';      // marca: --d puesto por JS
                        }
                        el.classList.add('in');
                        idx++;
                    }
                } else if (el.classList.contains('in')) {
                    el.classList.remove('in');
                    if (el.dataset.stg) {            // el stagger se recalcula
                        el.style.removeProperty('--d');
                        delete el.dataset.stg;
                    }
                }
            });
        }, { threshold: 0, rootMargin: '12% 0px 12% 0px' });
        $$('.reveal').forEach(el => revealIO.observe(el));
    } else {
        // Sin IntersectionObserver el contenido no puede quedar oculto
        $$('.reveal').forEach(el => el.classList.add('in'));
        animarContadores(document);
    }

    /* ── 7 · Navbar: scrolled, menú móvil y scrollspy ──────────────────── */
    const nav = $('#navbar');
    // terminos.html trae el navbar ya "scrolled" (fondo sólido fijo): en esa
    // página no se alterna la clase. También se admite que no exista navbar.
    if (nav && !nav.classList.contains('scrolled')) {
        addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', scrollY > 30);
        }, { passive: true });
    }

    const burger = $('#navBurger');
    const navLinks = $('#navLinks');
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            burger.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        });
        $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        }));
    }

    /* ── 7b · Scroll suave garantizado (rAF) ─────────────────────────────
       Chrome/Edge ignoran scroll-behavior:smooth cuando el sistema pide
       movimiento reducido (ahorro de batería o "Quitar animaciones" en
       Android): al tocar un enlace del menú la página saltaba de golpe y la
       transición suave nunca se veía. Este módulo interpola la posición con
       requestAnimationFrame, así que funciona en cualquier navegador y con
       cualquier ajuste del sistema; compensa la altura del navbar y acorta
       el tiempo en modo ligero. Los enlaces a otra página no se tocan. */
    (function initSmoothScroll() {
        let scrollRaf = 0;

        function scrollToY(endY) {
            cancelAnimationFrame(scrollRaf);
            const startY = window.scrollY;
            const dist = endY - startY;
            if (Math.abs(dist) < 2) { window.scrollTo(0, endY); return; }
            const dur = Math.min(liteMotion ? 320 : 640,
                Math.max(220, Math.abs(dist) * .22));
            const t0 = performance.now();
            const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            // Cada frame fija la posición exacta. Se usa behavior:'instant'
            // a propósito: si el html tiene scroll-behavior:smooth, cada
            // scrollTo lanzaría su propia animación y se sumarían dos
            // transiciones (la página llegaría "tarde" al ancla). Con instant,
            // el único easing es el de este bucle.
            (function step(now) {
                const t = Math.min((now - t0) / dur, 1);
                window.scrollTo({ left: 0, top: Math.round(startY + dist * ease(t)), behavior: 'instant' });
                if (t < 1) scrollRaf = requestAnimationFrame(step);
            })(t0);
        }

        // Si el usuario toma el control (rueda o dedo), se corta la animación
        // para no pelear con su gesto: la navegación nunca se siente atada.
        addEventListener('wheel', () => cancelAnimationFrame(scrollRaf), { passive: true });
        addEventListener('touchstart', () => cancelAnimationFrame(scrollRaf), { passive: true });

        document.addEventListener('click', (e) => {
            if (e.defaultPrevented || e.button !== 0 ||
                e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (!(e.target instanceof Element)) return;
            const a = e.target.closest('a[href^="#"]');
            if (!a || !a.hash) return;
            const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
            if (!target) return;             // ancla inexistente: navegación por defecto
            e.preventDefault();
            const offset = (nav ? nav.offsetHeight : 0) + 8;
            const endY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
            scrollToY(endY);
            history.replaceState(null, '', a.hash);
        }, false);
    })();

    // Scrollspy
    if (hasIO) {
        const spyIO = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const id = e.target.id;
                $$('#navLinks a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-38% 0px -55% 0px' });
        $$('main section[id]').forEach(s => spyIO.observe(s));
    }

    /* ── 8 · Servicios: modalidad (segmented) + acordeones ─────────────── */
    const MOD_LABEL = { excel: 'Excel', powerbi: 'Power BI', hibrida: 'Híbrida (Excel + Power BI)',python:'Python' };
    const dashLabel = $('#dashModLabel');

    $$('.seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.seg-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', String(b === btn));
            });
            const mod = btn.dataset.mod;
            if (dashLabel) dashLabel.textContent = 'Herramienta: ' + MOD_LABEL[mod];
            $$('.plan-card ul[data-mod]').forEach(ul => {
                ul.hidden = ul.dataset.mod !== mod;
            });
        });
    });

    $$('.plan-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.plan-card');
            const open = card.classList.toggle('open');
            const label = toggle.firstChild;
            label.textContent = open ? 'Ocultar detalles ' : 'Ver detalles ';
        });
    });

    /* ── 9 · Filtro de proyectos ───────────────────────────────────────── */
    const filterBtns = $$('.filter-btn');
    const cards = $$('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.toggle('active', b === btn));
            const f = btn.dataset.filter;

            cards.forEach(card => {
                const match = f === 'todos' || card.dataset.difficulty === f;
                if (match) {
                    card.classList.remove('hide');
                    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('fading')));
                } else {
                    card.classList.add('fading');
                    setTimeout(() => card.classList.add('hide'), 400);
                }
            });
        });
    });

    /* ── 10 · Formulario de contacto (EmailJS) ──────────────────────────── */
    const form = $('#contactForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* EmailJS se carga BAJO DEMANDA: antes su script (con su coste de
       descarga + parseo) bloqueaba el render inicial en el <head> aunque
       el visitante nunca abriera el formulario. Ahora se descarga con el
       primer foco dentro del form: el primer render y el scroll quedan
       libres de terceros, y quien escriba un mensaje ya tiene el SDK
       listo antes de pulsar Enviar. */
    const EMAILJS_KEY = '0hVsecDal2VpJNCxz';
    let emailjsPromise = null;

    function cargarEmailJS() {
        if (window.emailjs) return Promise.resolve();
        if (!emailjsPromise) {
            emailjsPromise = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                s.async = true;
                s.onload = () => {
                    try { window.emailjs.init(EMAILJS_KEY); resolve(); }
                    catch (err) { reject(err); }
                };
                s.onerror = () => { emailjsPromise = null; reject(new Error('cdn')); };
                document.head.appendChild(s);
            });
        }
        return emailjsPromise;
    }

    if (form) {
        // Precarga silenciosa al primer foco en el formulario
        form.addEventListener('focusin', () => {
            cargarEmailJS().catch(() => { });
        }, { once: true, passive: true });
    }

    function toast(tipo, titulo, msg) {
        const zone = $('#toastZone');
        const t = document.createElement('div');
        t.className = 'toast ' + tipo;
        t.setAttribute('role', 'status');
        t.innerHTML =
            '<span class="t-ico"><svg width="16" height="16"><use href="#ico-' +
            (tipo === 'success' ? 'check' : 'x') + '"/></svg></span>' +
            '<span><b></b><p></p></span>';
        t.querySelector('b').textContent = titulo;
        t.querySelector('p').textContent = msg;
        zone.appendChild(t);
        const kill = () => {
            if (!t.isConnected) return;
            t.classList.add('out');
            setTimeout(() => t.remove(), 300);
        };
        t.addEventListener('click', kill);
        setTimeout(kill, 5200);
    }

    function marcarCampo(input, invalido) {
        input.closest('.field').classList.toggle('invalid', invalido);
    }

    ['nombre', 'email', 'asunto', 'mensaje'].forEach(id => {
        const el = $('#' + id);
        // En páginas sin formulario (terminos.html) no existen estos campos
        if (!el) return;
        el.addEventListener('input', () => marcarCampo(el, false));
        el.addEventListener('blur', () => {
            const v = el.value.trim();
            let bad = false;
            if (id === 'nombre') bad = v.length > 0 && v.length < 3;
            if (id === 'email') bad = v.length > 0 && !emailRegex.test(v);
            if (id === 'asunto') bad = v.length > 0 && v.length < 5;
            if (id === 'mensaje') bad = v.length > 0 && v.length < 10;
            marcarCampo(el, bad);
        });
    });

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = $('#nombre').value.trim();
        const email = $('#email').value.trim();
        const asunto = $('#asunto').value.trim();
        const mensaje = $('#mensaje').value.trim();

        const fallos = [
            [nombre.length < 3, $('#nombre'), 'Nombre válido (mínimo 3 caracteres)'],
            [!emailRegex.test(email), $('#email'), 'Correo electrónico válido'],
            [asunto.length < 5, $('#asunto'), 'Asunto válido (mínimo 5 caracteres)'],
            [mensaje.length < 10, $('#mensaje'), 'Mensaje válido (mínimo 10 caracteres)']
        ];

        const primerError = fallos.find(([bad]) => bad);
        if (primerError) {
            fallos.forEach(([bad, el]) => marcarCampo(el, bad));
            primerError[1].focus();
            toast('error', 'Revisa el formulario', 'Por favor, ingresa ' + primerError[2] + '.');
            return;
        }

        const btn = $('#submitBtn');
        const textoOriginal = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Enviando…';

        cargarEmailJS()
            .then(() => emailjs.send('service_f8d2f3f', 'template_g45tgz8', { nombre, email, asunto, mensaje }))
            .then(() => {
                toast('success', 'Mensaje enviado', 'Gracias por escribir. Te contactaré muy pronto.');
                form.reset();
            })
            .catch(() => {
                toast('error', 'No se pudo enviar', 'Ocurrió un error. Inténtalo de nuevo o escríbeme por email.');
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = textoOriginal;
            });
    });

    /* ── 11 · Varios: año del footer y protección del logo ─────────────── */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.brand-logo, .b-logo')) e.preventDefault();
    });
})();
