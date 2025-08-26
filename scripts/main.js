/**
 * Main JavaScript - Funcionalidad principal del boilerplate
 */

(function() {
    'use strict';

    // Referencias a utilidades
    const Utils = window.BoilerplateUtils;
    const { $, $, addClass, removeClass, toggleClass } = Utils.dom;

    // Configuración global
    const CONFIG = {
        animationDuration: 300,
        debounceDelay: 250,
        breakpoints: {
            mobile: 768,
            tablet: 992,
            desktop: 1200
        }
    };

    // Componente de navegación
    const Navigation = {
        init() {
            this.setupMobileNav();
            this.setupSmoothScroll();
            this.setupActiveNavLinks();
        },

        setupMobileNav() {
            const navToggle = $('.nav-toggle');
            const navList = $('.nav-list');
            
            if (!navToggle || !navList) return;

            navToggle.addEventListener('click', () => {
                toggleClass(navList, 'active');
                const isActive = navList.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isActive);
                navToggle.textContent = isActive ? '✕' : '☰';
            });

            // Cerrar menú al hacer clic en un enlace
            const navLinks = $('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    removeClass(navList, 'active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.textContent = '☰';
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.main-nav') && navList.classList.contains('active')) {
                    removeClass(navList, 'active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.textContent = '☰';
                }
            });
        },

        setupSmoothScroll() {
            const internalLinks = $('a[href^="#"]');
            
            internalLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = $(`#${targetId}`);
                    
                    if (targetElement) {
                        e.preventDefault();
                        const headerHeight = $('.main-header')?.offsetHeight || 0;
                        Utils.dom.scrollTo(targetElement, headerHeight + 20);
                    }
                });
            });
        },

        setupActiveNavLinks() {
            const sections = $('section[id]');
            const navLinks = $('.nav-link');
            
            if (!sections.length || !navLinks.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeLink = $(`.nav-link[href="#${entry.target.id}"]`);
                        
                        // Remover clase active de todos los enlaces
                        navLinks.forEach(link => removeClass(link, 'active'));
                        
                        // Agregar clase active al enlace correspondiente
                        if (activeLink) {
                            addClass(activeLink, 'active');
                        }
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));
        }
    };

    // Componente de formularios
    const Forms = {
        init() {
            this.setupFormValidation();
            this.setupNewsletterForm();
        },

        setupFormValidation() {
            const forms = $('form[novalidate]');
            
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.validateForm(form);
                });

                // Validación en tiempo real
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });

                    input.addEventListener('input', Utils.debounce(() => {
                        if (input.classList.contains('error')) {
                            this.validateField(input);
                        }
                    }, CONFIG.debounceDelay));
                });
            });
        },

        validateForm(form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                this.submitForm(form);
            }
        },

        validateField(field) {
            const value = field.value.trim();
            const fieldType = field.type;
            const isRequired = field.hasAttribute('required');
            const rules = this.getValidationRules(field);

            const validation = Utils.validation.validate(value, rules);
            
            this.displayFieldValidation(field, validation);
            
            return validation.isValid;
        },

        getValidationRules(field) {
            const rules = [];
            
            if (field.hasAttribute('required')) {
                rules.push({ type: 'required', message: 'Este campo es requerido' });
            }
            
            if (field.type === 'email') {
                rules.push({ type: 'email', message: 'Por favor ingrese un email válido' });
            }
            
            if (field.hasAttribute('minlength')) {
                rules.push({ 
                    type: 'minLength', 
                    value: parseInt(field.getAttribute('minlength')),
                    message: `Mínimo ${field.getAttribute('minlength')} caracteres`
                });
            }
            
            if (field.hasAttribute('maxlength')) {
                rules.push({ 
                    type: 'maxLength', 
                    value: parseInt(field.getAttribute('maxlength')),
                    message: `Máximo ${field.getAttribute('maxlength')} caracteres`
                });
            }
            
            return rules;
        },

        displayFieldValidation(field, validation) {
            const errorElement = field.parentNode.querySelector('.error-message');
            
            if (validation.isValid) {
                removeClass(field, 'error');
                addClass(field, 'success');
                if (errorElement) {
                    errorElement.remove();
                }
            } else {
                addClass(field, 'error');
                removeClass(field, 'success');
                
                if (!errorElement) {
                    const errorDiv = Utils.dom.createElement('span', {
                        className: 'error-message',
                        role: 'alert'
                    }, validation.errors[0]);
                    field.parentNode.appendChild(errorDiv);
                } else {
                    errorElement.textContent = validation.errors[0];
                }
            }
        },

        async submitForm(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Mostrar estado de carga
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            addClass(form, 'loading');

            try {
                // Simular envío (reemplazar con tu lógica de envío)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Éxito
                this.showFormSuccess(form);
                form.reset();
                
                // Limpiar estados de validación
                const fields = form.querySelectorAll('input, textarea, select');
                fields.forEach(field => {
                    removeClass(field, 'success');
                    removeClass(field, 'error');
                });
                
            } catch (error) {
                console.error('Error enviando formulario:', error);
                this.showFormError(form, 'Hubo un error al enviar el formulario. Por favor intente nuevamente.');
            } finally {
                // Restaurar estado del botón
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                removeClass(form, 'loading');
            }
        },

        setupNewsletterForm() {
            const newsletterForm = $('.newsletter-form');
            if (!newsletterForm) return;

            // Agregar funcionalidad específica del newsletter
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                try {
                    // Aquí iría la lógica de suscripción al newsletter
                    console.log('Suscribiendo email:', email);
                    
                    this.showFormSuccess(newsletterForm, '¡Gracias por suscribirte a nuestro newsletter!');
                    newsletterForm.reset();
                    
                } catch (error) {
                    this.showFormError(newsletterForm, 'Error al suscribirse. Por favor intente nuevamente.');
                }
            });
        },

        showFormSuccess(form, message = '¡Formulario enviado exitosamente!') {
            this.showFormMessage(form, message, 'success');
        },

        showFormError(form, message = 'Hubo un error al procesar el formulario.') {
            this.showFormMessage(form, message, 'error');
        },

        showFormMessage(form, message, type) {
            // Remover mensajes anteriores
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageElement = Utils.dom.createElement('div', {
                className: `form-message ${type}`,
                role: 'alert'
            }, message);

            form.appendChild(messageElement);

            // Remover mensaje después de 5 segundos
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    };

    // Componente de rendimiento y optimización
    const Performance = {
        init() {
            this.setupLazyLoading();
            this.setupImageOptimization();
            this.setupCriticalResourceHints();
        },

        setupLazyLoading() {
            Utils.performance.lazyLoadImages();
        },

        setupImageOptimization() {
            // Cargar imágenes WebP si es compatible
            const images = $('img[data-src]');
            
            images.forEach(img => {
                if (this.supportsWebP()) {
                    const webpSrc = img.dataset.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    img.dataset.src = webpSrc;
                }
            });
        },

        supportsWebP() {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        },

        setupCriticalResourceHints() {
            // Preconectar a dominios externos importantes
            const preconnectDomains = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com'
            ];

            preconnectDomains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                document.head.appendChild(link);
            });
        }
    };

    // Componente de accesibilidad
    const Accessibility = {
        init() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupARIAUpdates();
        },

        setupKeyboardNavigation() {
            // Navegación con teclado para elementos interactivos
            document.addEventListener('keydown', (e) => {
                // Cerrar menú móvil con Escape
                if (e.key === 'Escape') {
                    const navList = $('.nav-list');
                    const navToggle = $('.nav-toggle');
                    
                    if (navList && navList.classList.contains('active')) {
                        removeClass(navList, 'active');
                        if (navToggle) {
                            navToggle.setAttribute('aria-expanded', 'false');
                            navToggle.textContent = '☰';
                            navToggle.focus();
                        }
                    }
                }
            });
        },

        setupFocusManagement() {
            // Mejorar visibilidad del foco para usuarios de teclado
            let isUsingKeyboard = false;

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    isUsingKeyboard = true;
                }
            });

            document.addEventListener('mousedown', () => {
                isUsingKeyboard = false;
            });

            document.addEventListener('focusin', (e) => {
                if (isUsingKeyboard) {
                    addClass(document.body, 'keyboard-navigation');
                } else {
                    removeClass(document.body, 'keyboard-navigation');
                }
            });
        },

        setupARIAUpdates() {
            // Actualizar atributos ARIA dinámicamente
            const navToggle = $('.nav-toggle');
            const navList = $('.nav-list');
            
            if (navToggle && navList) {
                // Observer para cambios en la clase active
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const isActive = navList.classList.contains('active');
                            navToggle.setAttribute('aria-expanded', isActive);
                        }
                    });
                });
                
                observer.observe(navList, { 
                    attributes: true, 
                    attributeFilter: ['class'] 
                });
            }
        }
    };

    // Inicialización de la aplicación
    const App = {
        init() {
            console.log('🚀 Boilerplate HTML5 inicializado');
            console.log('📱 Dispositivo:', Utils.device.isMobile() ? 'Móvil' : 'Escritorio');
            
            // Inicializar componentes
            Navigation.init();
            Forms.init();
            Performance.init();
            Accessibility.init();
            
            // Configuración inicial
            this.setupGlobalEvents();
            this.setupThemeDetection();
            
            console.log('✅ Todos los componentes inicializados correctamente');
        },

        setupGlobalEvents() {
            // Manejo de resize con throttle
            window.addEventListener('resize', Utils.throttle(() => {
                this.handleResize();
            }, 250));

            // Manejo de scroll con throttle
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 16)); // ~60fps
        },

        handleResize() {
            const width = window.innerWidth;
            
            // Cerrar menú móvil si se cambia a desktop
            if (width > CONFIG.breakpoints.mobile) {
                const navList = $('.nav-list');
                const navToggle = $('.nav-toggle');
                
                if (navList && navList.classList.contains('active')) {
                    removeClass(navList, 'active');
                    if (navToggle) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navToggle.textContent = '☰';
                    }
                }
            }
        },

        handleScroll() {
            const scrollY = window.pageYOffset;
            const header = $('.main-header');
            
            // Agregar clase cuando se hace scroll
            if (scrollY > 100) {
                addClass(header, 'scrolled');
            } else {
                removeClass(header, 'scrolled');
            }
        },

        setupThemeDetection() {
            // Detectar preferencia de tema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            
            console.log('🎨 Tema preferido:', prefersDark.matches ? 'Oscuro' : 'Claro');
            
            prefersDark.addListener((e) => {
                console.log('🎨 Tema cambiado a:', e.matches ? 'Oscuro' : 'Claro');
                // Aquí podrías implementar lógica adicional para el cambio de tema
            });
        }
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    // Exportar App para uso global si es necesario
    window.BoilerplateApp = App;

})();