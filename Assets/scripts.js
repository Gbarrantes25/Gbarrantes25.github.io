/* ═══════════════════════════════════════════════════════════════════════
   GIANCARLO BARRANTES — BI OPERATIONS · scripts.js
   Partículas de datos · consola SQL · scrollspy · EmailJS · UI
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── 1 · Disponibilidad (hora de Lima) ─────────────────────────────── */
    const FERIADOS = ['01-01', '05-01', '06-29', '07-28', '07-29', '08-30', '11-01', '12-08', '12-25'];

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
            txt.textContent = 'Consultor disponible · Lima UTC-5';
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
        if (!canvas || reduceMotion) return;

        const ctx = canvas.getContext('2d');
        const COLORS = ['#4c8dff', '#2ee6c8', '#a78bfa', '#ff5cad'];
        let nodes = [];
        let raf = null;
        const mouse = { x: -9999, y: -9999 };

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

            const target = Math.min(72, Math.floor(rect.width / 16));
            nodes = Array.from({ length: target }, () => ({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - .5) * .35,
                vy: (Math.random() - .5) * .35,
                r: Math.random() * 1.8 + .8,
                c: COLORS[Math.floor(Math.random() * COLORS.length)]
            }));
        }

        function frame() {
            const w = canvas.width / devicePixelRatio;
            const h = canvas.height / devicePixelRatio;
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

        addEventListener('resize', resize);
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
        const heroIO = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
            } else if (raf) {
                cancelAnimationFrame(raf);
                raf = null;
            }
        }, { threshold: 0 });
        heroIO.observe(canvas);
    }
    initParticles();

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

        // El HTML estático muestra la consulta completa como respaldo sin-JS;
        // con JS activo se limpia al inicio para tipearla desde cero.
        if (!reduceMotion) code.textContent = '';

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

        function typeLoop() {
            if (reduceMotion) { renderFull(); return; }

            let ti = 0, ci = 0;
            let span = null;
            bars.classList.remove('done');
            code.innerHTML = '';

            // La consola solo se re-escribe mientras está en pantalla
            let consoleVisible = true;
            new IntersectionObserver((entries) => {
                consoleVisible = entries.some(e => e.isIntersecting);
            }, { threshold: 0 }).observe(bars.closest('.console'));

            function step() {
                if (ti >= TOKENS.length) {
                    // Consulta ejecutada: mostrar resultados
                    setTimeout(() => {
                        bars.classList.add('done');
                        animarContadores(bars.closest('.console'));
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
                setTimeout(step, 26 + Math.random() * 40);
            }
            step();
        }
        // Iniciar cuando la consola entre al viewport
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                io.disconnect();
                typeLoop();
            }
        }, { threshold: .3 });
        io.observe(bars.closest('.console'));
    }
    initConsole();

    /* ── 5 · Contadores animados ───────────────────────────────────────── */
    function animarContadores(scope) {
        $$('[data-count]', scope || document).forEach(el => {
            if (el.dataset.done) return;
            el.dataset.done = '1';
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            if (reduceMotion) { el.textContent = target + suffix; return; }

            const t0 = performance.now();
            const dur = 1300;
            (function tick(now) {
                const p = Math.min((now - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        });
    }

    const countersIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animarContadores(e.target);
                countersIO.unobserve(e.target);
            }
        });
    }, { threshold: .5 });
    $$('.b-kpi').forEach(el => countersIO.observe(el));

    /* ── 6 · Reveal al hacer scroll ────────────────────────────────────── */
    const revealIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                revealIO.unobserve(e.target);
            }
        });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => revealIO.observe(el));

    /* ── 7 · Navbar: scrolled, menú móvil y scrollspy ──────────────────── */
    const nav = $('#navbar');
    addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', scrollY > 30);
    }, { passive: true });

    const burger = $('#navBurger');
    const navLinks = $('#navLinks');
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

    // Scrollspy
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
                    setTimeout(() => card.classList.add('hide'), 280);
                }
            });
        });
    });

    /* ── 10 · Formulario de contacto (EmailJS) ──────────────────────────── */
    const form = $('#contactForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    form.addEventListener('submit', (e) => {
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

        emailjs.send('service_f8d2f3f', 'template_g45tgz8', { nombre, email, asunto, mensaje })
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

    /* ── 10 · Varios: año del footer y protección del logo ─────────────── */
    $('#year').textContent = new Date().getFullYear();

    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.brand-logo, .b-logo')) e.preventDefault();
    });
})();
