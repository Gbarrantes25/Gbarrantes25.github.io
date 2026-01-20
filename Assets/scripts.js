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


