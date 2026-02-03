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

        // NUEVO: Toggle de tema oscuro
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Cargar tema guardado
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);

        // Toggle theme
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
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