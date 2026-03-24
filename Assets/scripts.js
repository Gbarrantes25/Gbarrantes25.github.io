// ── Disponibilidad del Consultor BI ──────────────────────────────────────────
(function actualizarDisponibilidad() {
    // Feriados de Perú (mes es 1-12 para mayor claridad)
    const feriados = [
        '01-01', // Año Nuevo
        '05-01', // Día del Trabajo
        '06-29', // San Pedro y San Pablo
        '07-28', // Fiestas Patrias
        '07-29', // Fiestas Patrias
        '08-30', // Santa Rosa de Lima
        '11-01', // Día de Todos los Santos
        '12-08', // Inmaculada Concepción
        '12-25', // Navidad
    ];

    function esFeriado(fecha) {
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return feriados.includes(mes + '-' + dia);
    }

    function consultorDisponible() {
        // Hora de Lima (UTC-5)
        const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
        const diaSemana = ahora.getDay(); // 0=Dom, 1=Lun ... 6=Sáb
        const hora = ahora.getHours();

        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
        const enHorario = hora >= 9 && hora < 18; // 9am-6pm

        return !esFinDeSemana && !esFeriado(ahora) && enHorario;
    }

    function renderizarEstado() {
        const eyebrow = document.querySelector('.hero-eyebrow');
        if (!eyebrow) return;

        if (consultorDisponible()) {
            eyebrow.classList.remove('no-disponible');
            eyebrow.textContent = 'Consultor BI disponible';
        } else {
            eyebrow.classList.add('no-disponible');
            eyebrow.textContent = 'Consultor BI no disponible';
        }
    }

    // Ejecutar al cargar y cada minuto
    document.addEventListener('DOMContentLoaded', renderizarEstado);
    setInterval(renderizarEstado, 60000);
})();

        // ── Íconos del navbar (hover / clic) ─────────────────────────────────────
        const navIcons = {
            'inicio':    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>`,
            'sobre':     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
            'clientes':  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
            'skills':    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>`,
            'servicios': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
            'proyectos': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`,
            'contacto':  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        };

        document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
            const sectionId = link.getAttribute('href').replace('#', '');
            const icon = navIcons[sectionId];
            if (!icon) return;

            // Envolver el texto en .nav-label
            const label = document.createElement('span');
            label.className = 'nav-label';
            label.textContent = link.textContent;
            link.textContent = '';
            link.appendChild(label);

            // Agregar el ícono
            const iconEl = document.createElement('span');
            iconEl.className = 'nav-icon';
            iconEl.innerHTML = icon;
            link.appendChild(iconEl);

            // Estado de clic: activo mientras dura el scroll
            link.addEventListener('click', () => {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-clicked'));
                link.classList.add('nav-clicked');
                setTimeout(() => link.classList.remove('nav-clicked'), 1200);
            });
        });

        // Navegación responsive
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Navegación suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Tabs de servicios
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

       // Filtrado de proyectos
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Actualizar botones activos
                const filterValue = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                
                
                // Filtrar proyectos
                projectCards.forEach(card => {
                    const cardDifficulty = card.getAttribute('data-difficulty');
                    
                    if (filterValue === 'todos' || filterValue === cardDifficulty) {
                        card.classList.remove('hidden');
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 400);
                    }
                });
            });
        });


        // Formulario de contacto con EmailJS
        const contactForm = document.getElementById('contactForm');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener valores
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const asunto = document.getElementById('asunto').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            // Validaciones
            if (nombre === '' || nombre.length < 3) {
                mostrarMensaje('Por favor, ingresa un nombre válido (mínimo 3 caracteres)', 'error');
                document.getElementById('nombre').focus();
                return;
            }
            
            if (!validarEmail(email)) {
                mostrarMensaje('Por favor, ingresa un correo electrónico válido', 'error');
                document.getElementById('email').focus();
                return;
            }
            
            if (asunto === '' || asunto.length < 5) {
                mostrarMensaje('Por favor, ingresa un asunto válido (mínimo 5 caracteres)', 'error');
                document.getElementById('asunto').focus();
                return;
            }
            
            if (mensaje === '' || mensaje.length < 10) {
                mostrarMensaje('Por favor, ingresa un mensaje válido (mínimo 10 caracteres)', 'error');
                document.getElementById('mensaje').focus();
                return;
            }
            
            // Deshabilitar botón y mostrar estado de carga
            submitBtn.disabled = true;
            const textoOriginal = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            
            // Parámetros para EmailJS
            const templateParams = {
                nombre: nombre,
                email: email,
                asunto: asunto,
                mensaje: mensaje
            };
            
            // Enviar email con EmailJS
            emailjs.send('service_f8d2f3f', 'template_g45tgz8', templateParams).then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    mostrarMensaje('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                    contactForm.reset();
                    
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = textoOriginal;
                }, function(error) {
                    console.log('FAILED...', error);
                    mostrarMensaje('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
                    
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = textoOriginal;
                });
        });

        // Función para validar email
        function validarEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        // Función para mostrar mensajes
        function mostrarMensaje(texto, tipo) {
            // Eliminar mensaje anterior si existe
            const mensajeAnterior = document.querySelector('.mensaje-alerta');
            if (mensajeAnterior) {
                mensajeAnterior.remove();
            }
            
            // Crear nuevo mensaje
            const mensaje = document.createElement('div');
            mensaje.className = `mensaje-alerta ${tipo}`;
            mensaje.textContent = texto;
            
            // Insertar antes del formulario
            contactForm.parentNode.insertBefore(mensaje, contactForm);
            
            // Eliminar después de 5 segundos
            setTimeout(() => {
                mensaje.style.opacity = '0';
                setTimeout(() => mensaje.remove(), 300);
            }, 5000);
        }

        // Validación en tiempo real
        document.getElementById('email').addEventListener('blur', function() {
            if (this.value && !validarEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        });

        document.getElementById('nombre').addEventListener('blur', function() {
            if (this.value && this.value.length < 3) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        });

        // Animación al hacer scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skill-card, .pricing-card, .project-card, .stat-card').forEach(el => {
            observer.observe(el);
        });

        // Reveal suave sincronizado con scroll (rAF)
        const sections = Array.from(document.querySelectorAll('section:not(#inicio)'));
        const DIST_ENTRADA = 60;   // px de desplazamiento máximo al entrar
        const DIST_SALIDA  = 30;   // px de desplazamiento máximo al salir por arriba

        function lerp(a, b, t) { return a + (b - a) * t; }

        // Valores actuales suavizados por sección
        const state = sections.map(() => ({ y: DIST_ENTRADA, o: 0 }));

        function updateSections() {
            const wh = window.innerHeight;

            sections.forEach((section, i) => {
                const rect   = section.getBoundingClientRect();
                const top    = rect.top;
                const bottom = rect.bottom;

                // --- calcular targets según posición relativa al viewport ---
                let targetY, targetO;

                if (top >= wh) {
                    // Aún por debajo del viewport → oculta abajo
                    targetY = DIST_ENTRADA;
                    targetO = 0;
                } else if (bottom <= 0) {
                    // Ya pasó por encima del viewport → oculta arriba
                    targetY = -DIST_SALIDA;
                    targetO = 0;
                } else {
                    // Dentro o parcialmente visible
                    // Progreso de entrada: 0 cuando el borde superior está en el fondo,
                    // 1 cuando el borde superior llega a 30% de la pantalla
                    const entryStart = wh;
                    const entryEnd   = wh * 0.30;
                    const progress   = Math.min(1, Math.max(0, (entryStart - top) / (entryStart - entryEnd)));

                    targetO = progress;
                    targetY = lerp(DIST_ENTRADA, 0, progress);
                }

                // Suavizar con lerp frame a frame (factor 0.08 = muy fluido)
                state[i].y = lerp(state[i].y, targetY, 0.08);
                state[i].o = lerp(state[i].o, targetO, 0.08);

                // Aplicar al DOM via custom properties
                section.style.setProperty('--s-y',       state[i].y + 'px');
                section.style.setProperty('--s-opacity', state[i].o);
            });

            requestAnimationFrame(updateSections);
        }

        requestAnimationFrame(updateSections);

        // Contador animado en .stat-card h3
        const statCards = document.querySelectorAll('.stat-card h3');

        // Parsear cada h3: extraer número y sufijo (+ o %)
        const statData = Array.from(statCards).map(h3 => {
            const text   = h3.textContent.trim();
            const num    = parseInt(text.replace(/[^0-9]/g, ''), 10);
            const suffix = text.replace(/[0-9]/g, '');   // "+" o "%"
            h3.textContent = '0' + suffix;               // reset visual
            return { el: num, suffix, target: num, started: false };
        });

        function animateCounter(h3, target, suffix, duration) {
            const start = performance.now();
            function step(now) {
                const elapsed  = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easing: ease-out cúbica
                const eased    = 1 - Math.pow(1 - progress, 3);
                const current  = Math.round(eased * target);
                h3.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        // Observer exclusivo para las stat-cards
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const h3   = entry.target.querySelector('h3');
                const idx  = Array.from(statCards).indexOf(h3);
                if (idx === -1 || statData[idx].started) return;
                statData[idx].started = true;
                animateCounter(h3, statData[idx].target, statData[idx].suffix, 1200);
                statObserver.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-card').forEach(card => {
            statObserver.observe(card);
        });

        // ── Toggle de tema oscuro / claro ────────────────────────────────────────
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        /**
         * Devuelve el tema que corresponde según la hora de Lima (UTC-5).
         * Oscuro : 18:30 – 04:29
         * Claro  : 04:30 – 18:29
         */
        function temaSegunHora() {
            const ahora = new Date(
                new Date().toLocaleString('en-US', { timeZone: 'America/Lima' })
            );
            const mins = ahora.getHours() * 60 + ahora.getMinutes();
            // Oscuro entre 18:30 (1110 min) y fin del día, o desde 00:00 hasta 04:29 (269 min)
            return (mins >= 18 * 60 + 30 || mins < 4 * 60 + 30) ? 'dark' : 'light';
        }

        /**
         * Aplica el tema indicado y actualiza localStorage.
         * Si `porUsuario` es true se marca la preferencia manual;
         * si es false se borra la preferencia (modo automático).
         */
        function aplicarTema(tema, porUsuario = false) {
            html.setAttribute('data-theme', tema);
            if (porUsuario) {
                localStorage.setItem('theme', tema);
                localStorage.setItem('themeManual', '1');
            } else {
                localStorage.removeItem('theme');
                localStorage.removeItem('themeManual');
            }
        }

        // Al cargar: respetar preferencia manual si existe, si no usar hora
        (function iniciarTema() {
            const manual = localStorage.getItem('themeManual');
            const guardado = localStorage.getItem('theme');
            if (manual && guardado) {
                html.setAttribute('data-theme', guardado);
            } else {
                html.setAttribute('data-theme', temaSegunHora());
            }
        })();

        // Revisar cada minuto si el tema automático debe cambiar
        setInterval(() => {
            if (!localStorage.getItem('themeManual')) {
                html.setAttribute('data-theme', temaSegunHora());
            }
        }, 60000);

        // Click del usuario: alterna y marca preferencia manual
        themeToggle.addEventListener('click', () => {
            const actual = html.getAttribute('data-theme');
            const nuevo  = actual === 'light' ? 'dark' : 'light';
            aplicarTema(nuevo, true);

            // Animación del botón
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });


        // Protección del logo
        document.addEventListener('contextmenu', function(e) {
            if (e.target.closest('.logo, .footer-logo, .profile-container')) {
                e.preventDefault();
            }
        });



        // Función para mostrar mensajes
        function mostrarMensaje(texto, tipo) {
            // Eliminar mensaje anterior si existe
            const mensajeAnterior = document.querySelector('.mensaje-alerta');
            if (mensajeAnterior) {
                mensajeAnterior.remove();
            }
            
            // Ocultar formulario temporalmente
            contactForm.style.opacity = '0';
            contactForm.style.pointerEvents = 'none';
            
            // Crear nuevo mensaje
            const mensaje = document.createElement('div');
            mensaje.className = `mensaje-alerta ${tipo}`;
            mensaje.textContent = texto;
            mensaje.style.opacity = '0';
            
            // Insertar antes del formulario
            contactForm.parentNode.insertBefore(mensaje, contactForm);
            
            // Animar entrada del mensaje
            setTimeout(() => {
                mensaje.style.opacity = '1';
            }, 10);
            
            // Eliminar mensaje y mostrar formulario después de 4 segundos
            setTimeout(() => {
                mensaje.style.opacity = '0';
                setTimeout(() => {
                    mensaje.remove();
                    // Volver a mostrar el formulario
                    contactForm.style.opacity = '1';
                    contactForm.style.pointerEvents = 'auto';
                }, 300);
            }, 4000);
        }

        // Acordeón de Features en Pricing Cards
        document.addEventListener('DOMContentLoaded', () => {
            const featureToggles = document.querySelectorAll('.features-toggle');
            
            featureToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const wrapper = toggle.nextElementSibling;
                    const isActive = toggle.classList.contains('active');
                    
                    // Cerrar todos los demás acordeones
                    featureToggles.forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            otherToggle.classList.remove('active');
                            otherToggle.nextElementSibling.classList.remove('active');
                            
                            const otherButtonText = otherToggle.querySelector('span');
                            otherButtonText.textContent = 'Ver detalles';
                        }
                    });
                    
                    // Toggle del acordeón actual
                    toggle.classList.toggle('active');
                    wrapper.classList.toggle('active');
                    
                    // Cambiar texto del botón
                    const buttonText = toggle.querySelector('span');
                    if (isActive) {
                        buttonText.textContent = 'Ver detalles';
                    } else {
                        buttonText.textContent = 'Ocultar detalles';
                    }
                });
            });
        });

        // Texto de footer
        let añoActual = new Date().getFullYear();
        document.querySelector('.footer-text').textContent = `© ${añoActual} Giancarlo Barrantes. Todos los derechos reservados.`;