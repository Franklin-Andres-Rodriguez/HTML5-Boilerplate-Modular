/**
 * Utilities - Funciones de utilidad reutilizables
 */

(function(window) {
    'use strict';

    // Namespace para las utilidades
    const Utils = {
        
        // Debounce function - Limita la frecuencia de ejecución
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        },

        // Throttle function - Controla la frecuencia de ejecución
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Detección de dispositivos
        device: {
            isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isTablet: () => /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent),
            isDesktop: () => !Utils.device.isMobile() && !Utils.device.isTablet(),
            hasTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0
        },

        // Manipulación del DOM
        dom: {
            // Seleccionar elementos
            $: (selector) => document.querySelector(selector),
            $: (selector) => document.querySelectorAll(selector),
            
            // Crear elementos
            createElement: (tag, attributes = {}, content = '') => {
                const element = document.createElement(tag);
                
                Object.keys(attributes).forEach(key => {
                    if (key === 'className') {
                        element.className = attributes[key];
                    } else if (key === 'dataset') {
                        Object.keys(attributes[key]).forEach(dataKey => {
                            element.dataset[dataKey] = attributes[key][dataKey];
                        });
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
                });
                
                if (content) {
                    element.innerHTML = content;
                }
                
                return element;
            },
            
            // Manejo de clases
            addClass: (element, className) => element.classList.add(className),
            removeClass: (element, className) => element.classList.remove(className),
            toggleClass: (element, className) => element.classList.toggle(className),
            hasClass: (element, className) => element.classList.contains(className),
            
            // Mostrar/Ocultar elementos
            show: (element) => element.style.display = '',
            hide: (element) => element.style.display = 'none',
            toggle: (element) => {
                element.style.display = element.style.display === 'none' ? '' : 'none';
            },
            
            // Obtener posición del elemento
            getPosition: (element) => {
                const rect = element.getBoundingClientRect();
                return {
                    top: rect.top + window.pageYOffset,
                    left: rect.left + window.pageXOffset,
                    width: rect.width,
                    height: rect.height
                };
            },
            
            // Scroll suave a elemento
            scrollTo: (element, offset = 0) => {
                const elementPosition = Utils.dom.getPosition(element).top;
                const offsetPosition = elementPosition - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        },

        // Validación de formularios
        validation: {
            isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            isPhone: (phone) => /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, '')),
            isURL: (url) => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            },
            isEmpty: (value) => !value || value.trim() === '',
            minLength: (value, min) => value && value.length >= min,
            maxLength: (value, max) => value && value.length <= max,
            isNumeric: (value) => !isNaN(parseFloat(value)) && isFinite(value),
            
            // Validador genérico
            validate: (value, rules) => {
                const errors = [];
                
                rules.forEach(rule => {
                    switch (rule.type) {
                        case 'required':
                            if (Utils.validation.isEmpty(value)) {
                                errors.push(rule.message || 'Este campo es requerido');
                            }
                            break;
                        case 'email':
                            if (value && !Utils.validation.isEmail(value)) {
                                errors.push(rule.message || 'Email inválido');
                            }
                            break;
                        case 'minLength':
                            if (value && !Utils.validation.minLength(value, rule.value)) {
                                errors.push(rule.message || `Mínimo ${rule.value} caracteres`);
                            }
                            break;
                        case 'maxLength':
                            if (value && !Utils.validation.maxLength(value, rule.value)) {
                                errors.push(rule.message || `Máximo ${rule.value} caracteres`);
                            }
                            break;
                    }
                });
                
                return {
                    isValid: errors.length === 0,
                    errors: errors
                };
            }
        },

        // HTTP Requests
        http: {
            get: async (url, options = {}) => {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            ...options.headers
                        },
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return await response.json();
                } catch (error) {
                    console.error('GET request failed:', error);
                    throw error;
                }
            },
            
            post: async (url, data, options = {}) => {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...options.headers
                        },
                        body: JSON.stringify(data),
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return await response.json();
                } catch (error) {
                    console.error('POST request failed:', error);
                    throw error;
                }
            }
        },

        // Utilidades de almacenamiento
        storage: {
            // localStorage helpers
            setLocal: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                    return false;
                }
            },
            
            getLocal: (key, defaultValue = null) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    console.error('Error reading from localStorage:', error);
                    return defaultValue;
                }
            },
            
            removeLocal: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error('Error removing from localStorage:', error);
                    return false;
                }
            },
            
            // sessionStorage helpers
            setSession: (key, value) => {
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('Error saving to sessionStorage:', error);
                    return false;
                }
            },
            
            getSession: (key, defaultValue = null) => {
                try {
                    const item = sessionStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    console.error('Error reading from sessionStorage:', error);
                    return defaultValue;
                }
            }
        },

        // Utilidades de formato
        format: {
            currency: (amount, currency = 'USD', locale = 'en-US') => {
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency
                }).format(amount);
            },
            
            date: (date, options = {}) => {
                const defaultOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                
                return new Date(date).toLocaleDateString('es-ES', {
                    ...defaultOptions,
                    ...options
                });
            },
            
            number: (number, decimals = 0) => {
                return new Intl.NumberFormat('es-ES', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                }).format(number);
            },
            
            truncate: (text, length = 100, ending = '...') => {
                if (text.length <= length) return text;
                return text.substring(0, length - ending.length) + ending;
            },
            
            capitalize: (text) => {
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            },
            
            kebabCase: (text) => {
                return text
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .replace(/\s+/g, '-')
                    .toLowerCase();
            }
        },

        // Utilidades de rendimiento
        performance: {
            // Lazy loading de imágenes
            lazyLoadImages: () => {
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                imageObserver.unobserve(img);
                            }
                        });
                    });

                    const lazyImages = Utils.dom.$('img[data-src]');
                    lazyImages.forEach(img => imageObserver.observe(img));
                }
            },
            
            // Precargar recursos
            preloadResource: (href, as = 'script') => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                link.as = as;
                document.head.appendChild(link);
            }
        },

        // Utilidades de eventos
        events: {
            // Event emitter simple
            EventEmitter: class {
                constructor() {
                    this.events = {};
                }
                
                on(event, callback) {
                    if (!this.events[event]) {
                        this.events[event] = [];
                    }
                    this.events[event].push(callback);
                }
                
                off(event, callback) {
                    if (!this.events[event]) return;
                    
                    this.events[event] = this.events[event].filter(cb => cb !== callback);
                }
                
                emit(event, data) {
                    if (!this.events[event]) return;
                    
                    this.events[event].forEach(callback => callback(data));
                }
            },
            
            // Delegación de eventos
            delegate: (parent, selector, event, handler) => {
                parent.addEventListener(event, function(e) {
                    if (e.target.matches(selector)) {
                        handler.call(e.target, e);
                    }
                });
            }
        }
    };

    // Exportar al namespace global
    window.BoilerplateUtils = Utils;

})(window);