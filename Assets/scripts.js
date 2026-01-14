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

        // Formulario de contacto
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;
    
            // 3. Configurar el destino y el cuerpo del mensaje
            const destinatario = "gbarrantes250689@gmail.com";
            const cuerpoCorreo = `Nombre: ${nombre}%0D%0AEmail: ${email}%0D%0AMensaje: ${mensaje}`;
    
            // 4. Abrir el gestor de correo (Gmail, Outlook, etc.)
            // Usamos window.location.href en lugar del action del form para tener más control
            window.location.href = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${cuerpoCorreo}`;
    
            // 5. Mostrar alerta de confirmación (Opcional)
            alert("Se está abriendo tu aplicación de correo para enviar el mensaje.");
            contactForm.reset();
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