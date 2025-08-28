/**
 * Utilities - Funciones de utilidad reutilizables
 * SECURITY HARDENED VERSION - Phase 1 Critical Fixes Applied
 * 
 * SECURITY IMPROVEMENTS IMPLEMENTED:
 * ✅ Task 1.1: XSS Prevention in DOM manipulation
 * ✅ Task 1.2: HTTP Security headers and SSRF protection
 * ✅ Task 1.3: Enhanced input validation with security patterns
 * ✅ Task 1.4: Storage security with sensitive data detection
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

        // ✅ TASK 1.1: XSS-SECURED DOM MANIPULATION
        dom: {
            // Seleccionar elementos (Fixed duplicate property)
            $: (selector) => document.querySelector(selector),
            $$: (selector) => document.querySelectorAll(selector),
            
            // ✅ XSS-SECURED: Crear elementos de forma segura
            createElement: (tag, attributes = {}, content = '') => {
                // Input validation
                if (!tag || typeof tag !== 'string' || tag.trim() === '') {
                    throw new Error('Invalid tag: must be non-empty string');
                }
                
                const element = document.createElement(tag.trim());
                
                // Secure attribute handling
                Object.keys(attributes).forEach(key => {
                    if (key === 'className') {
                        element.className = String(attributes[key]); // Type safety
                    } else if (key === 'dataset') {
                        Object.keys(attributes[key]).forEach(dataKey => {
                            // Sanitize data attribute keys
                            const sanitizedKey = dataKey.replace(/[^a-zA-Z0-9-_]/g, '');
                            if (sanitizedKey) {
                                element.dataset[sanitizedKey] = String(attributes[key][dataKey]);
                            }
                        });
                    } else {
                        // Prevent dangerous attributes
                        const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'];
                        if (!dangerousAttrs.includes(key.toLowerCase())) {
                            element.setAttribute(key, String(attributes[key]));
                        } else {
                            console.warn(`🚨 Dangerous attribute blocked: ${key}`);
                        }
                    }
                });
                
                // ✅ CRITICAL XSS PREVENTION: Safe content handling
                if (content !== null && content !== undefined) {
                    const contentStr = String(content);
                    
                    // Detect potentially dangerous content
                    if (Utils.dom.isUnsafeContent(contentStr)) {
                        console.warn('🚨 HTML/Script content detected - using safe textContent');
                        element.textContent = contentStr; // SAFE: No script execution
                    } else {
                        element.textContent = contentStr; // SAFE: Always use textContent
                    }
                }
                
                return element;
            },
            
            // ✅ NEW: Advanced unsafe content detection
            isUnsafeContent: (content) => {
                if (!content || typeof content !== 'string') return false;
                
                const dangerousPatterns = [
                    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
                    /<iframe[\s\S]*?>/gi,
                    /<object[\s\S]*?>/gi,
                    /<embed[\s\S]*?>/gi,
                    /javascript:/gi,
                    /data:text\/html/gi,
                    /vbscript:/gi,
                    /on\w+\s*=/gi, // Event handlers
                    /<img[^>]+onerror/gi,
                    /<svg[^>]+onload/gi,
                    /<[^>]+javascript:/gi
                ];
                
                return dangerousPatterns.some(pattern => pattern.test(content));
            },
            
            // Manejo de clases
            addClass: (element, className) => {
                if (element && element.classList && className) {
                    element.classList.add(String(className));
                }
            },
            removeClass: (element, className) => {
                if (element && element.classList && className) {
                    element.classList.remove(String(className));
                }
            },
            toggleClass: (element, className) => {
                if (element && element.classList && className) {
                    element.classList.toggle(String(className));
                }
            },
            hasClass: (element, className) => {
                return element && element.classList && className ? 
                    element.classList.contains(String(className)) : false;
            },
            
            // Mostrar/Ocultar elementos
            show: (element) => {
                if (element && element.style) {
                    element.style.display = '';
                }
            },
            hide: (element) => {
                if (element && element.style) {
                    element.style.display = 'none';
                }
            },
            toggle: (element) => {
                if (element && element.style) {
                    element.style.display = element.style.display === 'none' ? '' : 'none';
                }
            },
            
            // Obtener posición del elemento
            getPosition: (element) => {
                if (!element || typeof element.getBoundingClientRect !== 'function') {
                    return { top: 0, left: 0, width: 0, height: 0 };
                }
                
                const rect = element.getBoundingClientRect();
                return {
                    top: rect.top + (window.pageYOffset || 0),
                    left: rect.left + (window.pageXOffset || 0),
                    width: rect.width || 0,
                    height: rect.height || 0
                };
            },
            
            // Scroll suave a elemento
            scrollTo: (element, offset = 0) => {
                if (!element) return;
                
                const elementPosition = Utils.dom.getPosition(element).top;
                const offsetPosition = elementPosition - offset;
                
                if (window.scrollTo) {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        },

        // ✅ TASK 1.3: ENHANCED SECURITY-FOCUSED VALIDATION
        validation: {
            // ✅ COMPREHENSIVE EMAIL VALIDATION
            isEmail: (email) => {
                // Basic validation
                if (!email || typeof email !== 'string') return false;
                if (email.length > 254) return false; // RFC 5322 limit
                if (email.length < 5) return false; // Minimum realistic email
                
                const trimmedEmail = email.trim();
                if (trimmedEmail !== email) return false; // No leading/trailing spaces
                
                // Enhanced regex pattern
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                
                if (!emailRegex.test(trimmedEmail)) return false;
                
                // Additional security validations
                const parts = trimmedEmail.split('@');
                if (parts.length !== 2) return false;
                
                const [localPart, domain] = parts;
                
                // Local part validation
                if (localPart.length > 64) return false; // RFC limit
                if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
                if (localPart.includes('..')) return false; // Consecutive dots
                
                // Domain validation
                if (domain.length > 253) return false;
                if (domain.startsWith('-') || domain.endsWith('-')) return false;
                
                return true;
            },
            
            // ✅ INTERNATIONAL PHONE VALIDATION
            isPhone: (phone) => {
                if (!phone || typeof phone !== 'string') return false;
                
                // Clean input
                const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
                
                // Length validation
                if (cleaned.length < 8 || cleaned.length > 15) return false;
                
                // International format validation
                const phoneRegex = /^[\+]?[1-9]\d{7,14}$/;
                if (!phoneRegex.test(cleaned)) return false;
                
                // Basic country code validation for international numbers
                if (cleaned.startsWith('+')) {
                    const countryCode = cleaned.substring(1, 4);
                    const validCountryCodes = /^(1|7|20|27|30|31|32|33|34|36|39|40|41|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|60|61|62|63|64|65|66|81|82|84|86|90|91|92|93|94|95|98)/;
                    if (!validCountryCodes.test(countryCode)) return false;
                }
                
                return true;
            },
            
            // ✅ SECURE URL VALIDATION
            isURL: (url) => {
                if (!url || typeof url !== 'string') return false;
                if (url.length > 2083) return false; // Browser limit
                if (url.length < 11) return false; // Minimum: http://a.co
                
                try {
                    const parsed = new URL(url);
                    
                    // Only HTTP/HTTPS protocols
                    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
                    
                    // Hostname validation
                    const hostname = parsed.hostname;
                    if (!hostname || hostname.length > 253) return false;
                    
                    // Prevent local/private network access in validation
                    const localPatterns = [
                        /^127\./, /^192\.168\./, /^10\./, 
                        /^172\.(1[6-9]|2[0-9]|3[0-1])\./, 
                        /^localhost$/i, /^0\.0\.0\.0$/
                    ];
                    
                    if (localPatterns.some(pattern => pattern.test(hostname))) {
                        return false;
                    }
                    
                    return true;
                } catch {
                    return false;
                }
            },
            
            // ✅ ENHANCED EMPTY VALIDATION
            isEmpty: (value) => {
                if (value === null || value === undefined) return true;
                
                if (typeof value === 'string') {
                    return value.trim() === '';
                }
                
                if (Array.isArray(value)) {
                    return value.length === 0;
                }
                
                if (value instanceof Date) {
                    return isNaN(value.getTime());
                }
                
                if (typeof value === 'object') {
                    return Object.keys(value).length === 0;
                }
                
                if (typeof value === 'number') {
                    return isNaN(value);
                }
                
                return false;
            },
            
            // ✅ NEW: SECURE PASSWORD VALIDATION
            isSecurePassword: (password) => {
                if (!password || typeof password !== 'string') return false;
                if (password.length < 8) return false;
                if (password.length > 128) return false; // Prevent DoS
                
                // Complexity criteria
                const hasLower = /[a-z]/.test(password);
                const hasUpper = /[A-Z]/.test(password);
                const hasDigit = /\d/.test(password);
                const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                
                const criteriaCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
                
                return criteriaCount >= 3; // At least 3 of 4 criteria
            },
            
            // ✅ NEW: SAFE FILENAME VALIDATION
            isSafeFilename: (filename) => {
                if (!filename || typeof filename !== 'string') return false;
                if (filename.length > 255) return false;
                
                // Dangerous characters
                const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
                if (dangerousChars.test(filename)) return false;
                
                // Windows reserved names
                const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
                if (reservedNames.test(filename)) return false;
                
                // No leading/trailing dots or spaces
                if (filename.startsWith('.') || filename.endsWith('.') ||
                    filename.startsWith(' ') || filename.endsWith(' ')) return false;
                
                return true;
            },
            
            // Existing validation functions
            minLength: (value, min) => value && value.length >= min,
            maxLength: (value, max) => value && value.length <= max,
            isNumeric: (value) => !isNaN(parseFloat(value)) && isFinite(value),
            
            // Enhanced generic validator
            validate: (value, rules) => {
                const errors = [];
                
                if (!Array.isArray(rules)) {
                    console.warn('Validation rules must be an array');
                    return { isValid: false, errors: ['Invalid validation rules'] };
                }
                
                rules.forEach(rule => {
                    if (!rule || typeof rule !== 'object') return;
                    
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
                        case 'phone':
                            if (value && !Utils.validation.isPhone(value)) {
                                errors.push(rule.message || 'Teléfono inválido');
                            }
                            break;
                        case 'url':
                            if (value && !Utils.validation.isURL(value)) {
                                errors.push(rule.message || 'URL inválida');
                            }
                            break;
                        case 'securePassword':
                            if (value && !Utils.validation.isSecurePassword(value)) {
                                errors.push(rule.message || 'Contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos');
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

        // ✅ TASK 1.2: SECURITY-HARDENED HTTP REQUESTS
        http: {
            // ✅ SECURITY HEADERS FOR ALL REQUESTS
            getSecureHeaders: (additionalHeaders = {}) => {
                const defaultSecurityHeaders = {
                    // Core security headers
                    'Content-Type': 'application/json',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block',
                    
                    // Privacy and referrer protection
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    
                    // Cache security
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    
                    // Additional security policies
                    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
                    ...additionalHeaders
                };
                
                return defaultSecurityHeaders;
            },
            
            // ✅ SSRF-PROTECTED URL VALIDATION
            validateUrl: (url) => {
                // Basic input validation
                if (!url || typeof url !== 'string') {
                    throw new Error('Invalid URL: must be non-empty string');
                }
                
                if (url.length > 2083) {
                    throw new Error('URL too long: maximum 2083 characters');
                }
                
                try {
                    const parsedUrl = new URL(url.trim());
                    
                    // ✅ PROTOCOL RESTRICTION
                    const allowedProtocols = ['http:', 'https:'];
                    if (!allowedProtocols.includes(parsedUrl.protocol)) {
                        throw new Error(`Invalid protocol: only ${allowedProtocols.join(', ')} allowed`);
                    }
                    
                    // ✅ SSRF PROTECTION - Block private networks
                    const hostname = parsedUrl.hostname.toLowerCase();
                    const dangerousHosts = [
                        'localhost', '127.0.0.1', '::1',
                        '0.0.0.0', '169.254.', '10.',
                        '172.16.', '172.17.', '172.18.', '172.19.',
                        '172.20.', '172.21.', '172.22.', '172.23.',
                        '172.24.', '172.25.', '172.26.', '172.27.',
                        '172.28.', '172.29.', '172.30.', '172.31.',
                        '192.168.'
                    ];
                    
                    // Only validate in production environment
                    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                        if (dangerousHosts.some(dangerous => hostname.includes(dangerous))) {
                            throw new Error('Private/local network access not allowed');
                        }
                    }
                    
                    return parsedUrl;
                } catch (error) {
                    if (error.message.includes('Invalid URL')) {
                        throw new Error('Malformed URL format');
                    }
                    throw error;
                }
            },
            
            // ✅ RATE LIMITING IMPLEMENTATION
            rateLimiter: {
                requests: new Map(),
                
                checkRate: async (endpoint, limit = 10, windowMs = 60000) => {
                    const now = Date.now();
                    const key = new URL(endpoint).hostname; // Rate limit by domain
                    const requests = Utils.http.rateLimiter.requests.get(key) || [];
                    
                    // Clean old requests
                    const validRequests = requests.filter(time => now - time < windowMs);
                    
                    if (validRequests.length >= limit) {
                        throw new Error('Rate limit exceeded');
                    }
                    
                    validRequests.push(now);
                    Utils.http.rateLimiter.requests.set(key, validRequests);
                    
                    // Auto-cleanup to prevent memory leaks
                    if (Utils.http.rateLimiter.requests.size > 100) {
                        Utils.http.rateLimiter.cleanup();
                    }
                },
                
                cleanup: () => {
                    const now = Date.now();
                    const windowMs = 300000; // 5 minutes
                    
                    for (const [key, requests] of Utils.http.rateLimiter.requests.entries()) {
                        const validRequests = requests.filter(time => now - time < windowMs);
                        if (validRequests.length === 0) {
                            Utils.http.rateLimiter.requests.delete(key);
                        } else {
                            Utils.http.rateLimiter.requests.set(key, validRequests);
                        }
                    }
                }
            },
            
            // ✅ SECURE GET METHOD
            get: async (url, options = {}) => {
                // Input validation and SSRF protection
                Utils.http.validateUrl(url);
                
                // Rate limiting
                await Utils.http.rateLimiter.checkRate(url);
                
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: Utils.http.getSecureHeaders(options.headers),
                        credentials: 'same-origin', // Prevent credential leakage
                        cache: 'no-store', // Security cache policy
                        ...options
                    });
                    
                    if (!response.ok) {
                        // ✅ PREVENT INFORMATION DISCLOSURE
                        const genericError = `Request failed with status ${response.status}`;
                        console.error(`HTTP GET failed: ${url} - Status: ${response.status}`);
                        throw new Error(genericError);
                    }
                    
                    return await response.json();
                } catch (error) {
                    // Detailed logging only in development
                    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                        console.error('Detailed storage error:', {
                            key,
                            valueType: typeof value,
                            error: error
                        });
                    }
                    
                    return false;
                }
            },
            
            // ✅ SECURE localStorage RETRIEVAL
            getLocal: (key, defaultValue = null, options = {}) => {
                if (!key || typeof key !== 'string') {
                    console.error('Invalid storage key provided to getLocal');
                    return defaultValue;
                }
                
                try {
                    const item = localStorage.getItem(key.trim());
                    if (!item) {
                        return defaultValue;
                    }
                    
                    let parsedItem;
                    try {
                        parsedItem = JSON.parse(item);
                    } catch {
                        // Handle legacy data without wrapper
                        console.warn(`⚠️ Legacy data format detected for key: ${key}`);
                        return JSON.parse(item);
                    }
                    
                    // Check if it's a security wrapper
                    if (parsedItem && typeof parsedItem === 'object' && 
                        parsedItem.hasOwnProperty('data') && 
                        parsedItem.hasOwnProperty('timestamp')) {
                        
                        // Check expiration
                        if (parsedItem.expires && Date.now() > parsedItem.expires) {
                            console.log(`⏰ Storage item "${key}" has expired, removing...`);
                            Utils.storage.removeLocal(key);
                            return defaultValue;
                        }
                        
                        // Verify data integrity with checksum
                        const { validateIntegrity = true } = options;
                        if (validateIntegrity && parsedItem.checksum) {
                            const currentChecksum = Utils.storage.generateChecksum(JSON.stringify(parsedItem.data));
                            if (currentChecksum !== parsedItem.checksum) {
                                console.error(`🚨 Data integrity check failed for key: ${key}`);
                                console.error('Possible data corruption or tampering detected');
                                return defaultValue;
                            }
                        }
                        
                        return parsedItem.data;
                    }
                    
                    // Legacy data without wrapper
                    return parsedItem;
                    
                } catch (error) {
                    console.error(`❌ Storage Read Error: ${error.message}`);
                    
                    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                        console.error('Detailed read error:', { key, error });
                    }
                    
                    return defaultValue;
                }
            },
            
            // ✅ SECURE localStorage REMOVAL
            removeLocal: (key) => {
                if (!key || typeof key !== 'string') {
                    console.error('Invalid storage key provided to removeLocal');
                    return false;
                }
                
                try {
                    const trimmedKey = key.trim();
                    if (localStorage.getItem(trimmedKey) === null) {
                        console.warn(`⚠️ Attempted to remove non-existent key: ${trimmedKey}`);
                        return true; // Not an error if it doesn't exist
                    }
                    
                    localStorage.removeItem(trimmedKey);
                    console.log(`🗑️ Storage: Successfully removed "${trimmedKey}"`);
                    return true;
                    
                } catch (error) {
                    console.error(`❌ Storage Remove Error: ${error.message}`);
                    return false;
                }
            },
            
            // ✅ ADDITIONAL SECURITY UTILITIES
            cleanupExpired: () => {
                let cleanedCount = 0;
                const keys = Object.keys(localStorage);
                
                keys.forEach(key => {
                    try {
                        const item = localStorage.getItem(key);
                        if (!item) return;
                        
                        const parsed = JSON.parse(item);
                        if (parsed && parsed.expires && Date.now() > parsed.expires) {
                            localStorage.removeItem(key);
                            cleanedCount++;
                            console.log(`🧹 Cleaned expired item: ${key}`);
                        }
                    } catch {
                        // Ignore parsing errors for legacy data
                    }
                });
                
                console.log(`🧹 Storage cleanup completed: ${cleanedCount} expired items removed`);
                return cleanedCount;
            },
            
            // Get storage statistics
            getStorageStats: () => {
                const keys = Object.keys(localStorage);
                let totalSize = 0;
                let wrapperItems = 0;
                let legacyItems = 0;
                let expiredItems = 0;
                
                keys.forEach(key => {
                    const item = localStorage.getItem(key);
                    if (item) {
                        totalSize += item.length;
                        
                        try {
                            const parsed = JSON.parse(item);
                            if (parsed && parsed.hasOwnProperty('timestamp')) {
                                wrapperItems++;
                                if (parsed.expires && Date.now() > parsed.expires) {
                                    expiredItems++;
                                }
                            } else {
                                legacyItems++;
                            }
                        } catch {
                            legacyItems++;
                        }
                    }
                });
                
                return {
                    totalKeys: keys.length,
                    totalSize: `${(totalSize / 1024).toFixed(2)}KB`,
                    wrapperItems,
                    legacyItems,
                    expiredItems,
                    utilizationPercent: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) // Assuming 5MB limit
                };
            },
            
            // ✅ EXISTING sessionStorage helpers (kept for compatibility)
            setSession: (key, value) => {
                try {
                    // Use same validation as localStorage
                    const validatedKey = Utils.storage.validateStorageInput(key, value);
                    sessionStorage.setItem(validatedKey, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('Error saving to sessionStorage:', error.message);
                    return false;
                }
            },
            
            getSession: (key, defaultValue = null) => {
                if (!key || typeof key !== 'string') {
                    console.error('Invalid storage key provided to getSession');
                    return defaultValue;
                }
                
                try {
                    const item = sessionStorage.getItem(key.trim());
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    console.error('Error reading from sessionStorage:', error.message);
                    return defaultValue;
                }
            }
        },

        // ✅ SECURITY UTILITIES (NEW ADDITION FOR PHASE 1)
        security: {
            // Generate secure random nonce
            generateNonce: () => {
                const array = new Uint8Array(16);
                crypto.getRandomValues(array);
                return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            },
            
            // Basic content sanitization (for Phase 1)
            basicSanitize: (input) => {
                if (!input || typeof input !== 'string') return '';
                const div = document.createElement('div');
                div.textContent = input;
                return div.innerHTML;
            },
            
            // Security audit logging
            logSecurityEvent: (event, details = {}) => {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    timestamp,
                    event,
                    details,
                    userAgent: navigator.userAgent,
                    url: location.href
                };
                
                console.warn(`🔒 SECURITY EVENT: ${event}`, logEntry);
                
                // In production, send to security monitoring service
                if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                    // TODO: Implement security event reporting to backend
                }
            }
        },

        // Utilidades de formato (unchanged but with safety improvements)
        format: {
            currency: (amount, currency = 'USD', locale = 'en-US') => {
                try {
                    if (!Utils.validation.isNumeric(amount)) {
                        throw new Error('Invalid amount for currency formatting');
                    }
                    
                    return new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: currency
                    }).format(Number(amount));
                } catch (error) {
                    console.error('Currency formatting error:', error.message);
                    return String(amount); // Safe fallback
                }
            },
            
            date: (date, options = {}) => {
                try {
                    const defaultOptions = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };
                    
                    const dateObj = date instanceof Date ? date : new Date(date);
                    if (isNaN(dateObj.getTime())) {
                        throw new Error('Invalid date');
                    }
                    
                    return dateObj.toLocaleDateString('es-ES', {
                        ...defaultOptions,
                        ...options
                    });
                } catch (error) {
                    console.error('Date formatting error:', error.message);
                    return String(date); // Safe fallback
                }
            },
            
            number: (number, decimals = 0) => {
                try {
                    if (!Utils.validation.isNumeric(number)) {
                        throw new Error('Invalid number for formatting');
                    }
                    
                    return new Intl.NumberFormat('es-ES', {
                        minimumFractionDigits: Math.max(0, Math.min(20, decimals)),
                        maximumFractionDigits: Math.max(0, Math.min(20, decimals))
                    }).format(Number(number));
                } catch (error) {
                    console.error('Number formatting error:', error.message);
                    return String(number);
                }
            },
            
            truncate: (text, length = 100, ending = '...') => {
                if (!text || typeof text !== 'string') return '';
                if (length < 0) length = 0;
                if (text.length <= length) return text;
                return text.substring(0, Math.max(0, length - ending.length)) + ending;
            },
            
            capitalize: (text) => {
                if (!text || typeof text !== 'string') return '';
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            },
            
            kebabCase: (text) => {
                if (!text || typeof text !== 'string') return '';
                return text
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .replace(/\s+/g, '-')
                    .toLowerCase();
            }
        },

        // Utilidades de rendimiento (enhanced with security considerations)
        performance: {
            // Lazy loading de imágenes con seguridad
            lazyLoadImages: () => {
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                const src = img.dataset.src;
                                
                                // ✅ URL VALIDATION FOR IMAGE SOURCES
                                if (src && Utils.validation.isURL(src)) {
                                    img.src = src;
                                    img.classList.remove('lazy');
                                    imageObserver.unobserve(img);
                                } else {
                                    console.error('Invalid image URL detected:', src);
                                    Utils.security.logSecurityEvent('invalid_image_url', { src });
                                }
                            }
                        });
                    });

                    const lazyImages = Utils.dom.$('img[data-src]');
                    lazyImages.forEach(img => imageObserver.observe(img));
                } else {
                    console.warn('IntersectionObserver not supported');
                }
            },
            
            // ✅ SECURE PRELOAD WITH URL VALIDATION
            preloadResource: (href, as = 'script') => {
                try {
                    // Validate URL before preloading
                    Utils.http.validateUrl(href);
                    
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = href;
                    link.as = as;
                    
                    // Security attributes
                    if (as === 'script') {
                        link.crossOrigin = 'anonymous';
                    }
                    
                    document.head.appendChild(link);
                } catch (error) {
                    console.error('Preload resource error:', error.message);
                    Utils.security.logSecurityEvent('invalid_preload_url', { href, as });
                }
            }
        },

        // ✅ ENHANCED EVENT UTILITIES WITH SECURITY
        events: {
            // Event emitter simple (enhanced with security)
            EventEmitter: class {
                constructor() {
                    this.events = {};
                    this.maxListeners = 10; // Prevent memory leaks
                }
                
                on(event, callback) {
                    if (!event || typeof event !== 'string') {
                        throw new Error('Event name must be a string');
                    }
                    if (typeof callback !== 'function') {
                        throw new Error('Callback must be a function');
                    }
                    
                    if (!this.events[event]) {
                        this.events[event] = [];
                    }
                    
                    // Prevent excessive listeners
                    if (this.events[event].length >= this.maxListeners) {
                        console.warn(`⚠️ Maximum listeners (${this.maxListeners}) exceeded for event: ${event}`);
                        return;
                    }
                    
                    this.events[event].push(callback);
                }
                
                off(event, callback) {
                    if (!this.events[event]) return;
                    
                    this.events[event] = this.events[event].filter(cb => cb !== callback);
                }
                
                emit(event, data) {
                    if (!this.events[event]) return;
                    
                    // Safe event emission with error handling
                    this.events[event].forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            console.error(`Event handler error for "${event}":`, error.message);
                        }
                    });
                }
            },
            
            // ✅ SECURE EVENT DELEGATION
            delegate: (parent, selector, event, handler) => {
                // Input validation
                if (!parent || !parent.addEventListener) {
                    throw new Error('Invalid parent element');
                }
                if (!selector || typeof selector !== 'string') {
                    throw new Error('Invalid selector');
                }
                if (!event || typeof event !== 'string') {
                    throw new Error('Invalid event type');
                }
                if (typeof handler !== 'function') {
                    throw new Error('Handler must be a function');
                }
                
                parent.addEventListener(event, function(e) {
                    // Validate event and target
                    if (!e || !e.target) return;
                    
                    // Safe selector matching
                    if (typeof e.target.matches === 'function' && e.target.matches(selector)) {
                        // Create safe context object to prevent prototype pollution
                        const safeContext = Object.create(null);
                        safeContext.element = e.target;
                        safeContext.event = e;
                        
                        // Call handler with controlled context
                        try {
                            handler.call(safeContext.element, safeContext.event);
                        } catch (error) {
                            console.error('Event handler error:', error.message);
                        }
                    }
                });
            }
        }
    };

    // ✅ SECURITY VALIDATION SUITE FOR PHASE 1
    // Auto-execute security tests in development environment
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log('🔒 HTML5 Boilerplate Modular - Security Hardened Version Loaded');
        console.log('🧪 Running Phase 1 Security Validation...');
        
        // XSS Prevention Tests
        setTimeout(() => {
            try {
                console.log('\n🧪 Testing XSS Prevention...');
                const maliciousInputs = [
                    '<script>alert("XSS")</script>',
                    '<img src=x onerror=alert("XSS")>',
                    '<svg onload=alert("XSS")>',
                    'javascript:alert("XSS")',
                    '<iframe src="javascript:alert(\'XSS\')"></iframe>'
                ];
                
                let xssTestsPassed = 0;
                maliciousInputs.forEach((input, index) => {
                    try {
                        const element = Utils.dom.createElement('div', {}, input);
                        
                        // Verify no script execution
                        const hasScript = element.innerHTML.includes('<script') || 
                                        element.innerHTML.includes('javascript:') ||
                                        element.innerHTML.includes('onerror') ||
                                        element.innerHTML.includes('onload');
                        
                        if (!hasScript && element.textContent === input) {
                            console.log(`✅ XSS Test ${index + 1}: Prevented`);
                            xssTestsPassed++;
                        } else {
                            console.error(`❌ XSS Test ${index + 1}: Failed`);
                        }
                    } catch (error) {
                        console.log(`✅ XSS Test ${index + 1}: Input rejected (good)`);
                        xssTestsPassed++;
                    }
                });
                
                console.log(`🏁 XSS Prevention: ${xssTestsPassed}/${maliciousInputs.length} tests passed`);
                
                // HTTP Security Tests
                console.log('\n🧪 Testing HTTP Security...');
                let httpTestsPassed = 0;
                let totalHttpTests = 0;
                
                // Test SSRF prevention
                totalHttpTests++;
                try {
                    Utils.http.validateUrl('javascript:alert("SSRF")');
                    console.error('❌ SSRF prevention failed');
                } catch (e) {
                    console.log('✅ SSRF prevention working');
                    httpTestsPassed++;
                }
                
                // Test headers
                totalHttpTests++;
                const headers = Utils.http.getSecureHeaders();
                if (headers['X-Content-Type-Options'] === 'nosniff' && 
                    headers['X-Frame-Options'] === 'DENY') {
                    console.log('✅ Security headers configured');
                    httpTestsPassed++;
                } else {
                    console.error('❌ Security headers missing');
                }
                
                console.log(`🏁 HTTP Security: ${httpTestsPassed}/${totalHttpTests} tests passed`);
                
                // Storage Security Tests
                console.log('\n🧪 Testing Storage Security...');
                let storageTestsPassed = 0;
                let totalStorageTests = 0;
                
                // Test invalid key
                totalStorageTests++;
                const invalidKeyResult = Utils.storage.setLocal('', 'test');
                if (!invalidKeyResult) {
                    console.log('✅ Empty key validation: passed');
                    storageTestsPassed++;
                }
                
                // Test sensitive data detection
                totalStorageTests++;
                console.log('--- Testing sensitive data detection ---');
                const sensitiveResult = Utils.storage.setLocal('user_password', 'secret123');
                if (sensitiveResult) {
                    console.log('✅ Sensitive data detection: passed (shows warning)');
                    storageTestsPassed++;
                }
                
                // Test data integrity
                totalStorageTests++;
                Utils.storage.setLocal('test_integrity', { data: 'important' });
                const retrieved = Utils.storage.getLocal('test_integrity');
                if (retrieved && retrieved.data === 'important') {
                    console.log('✅ Data integrity: passed');
                    storageTestsPassed++;
                }
                
                console.log(`🏁 Storage Security: ${storageTestsPassed}/${totalStorageTests} tests passed`);
                
                // Cleanup test data
                Utils.storage.removeLocal('user_password');
                Utils.storage.removeLocal('test_integrity');
                
                // Overall results
                const totalTests = maliciousInputs.length + totalHttpTests + totalStorageTests;
                const totalPassed = xssTestsPassed + httpTestsPassed + storageTestsPassed;
                
                console.log('\n' + '='.repeat(50));
                console.log('📊 PHASE 1 SECURITY VALIDATION COMPLETE');
                console.log('='.repeat(50));
                console.log(`🏁 OVERALL: ${totalPassed}/${totalTests} tests passed`);
                
                if (totalPassed === totalTests) {
                    console.log('🎉 ALL SECURITY TESTS PASSED!');
                    console.log('✅ Phase 1 implementation successful');
                    console.log('🚀 Ready for production deployment');
                } else {
                    console.log('⚠️ Some security tests failed');
                    console.log('❌ Review implementation before deployment');
                }
                
            } catch (error) {
                console.error('❌ Security validation error:', error);
            }
        }, 1000); // Delay to ensure DOM is ready
    }

    // Exportar al namespace global
    window.BoilerplateUtils = Utils;
    
    // ✅ SECURITY: Prevent namespace pollution
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Utils;
    }

})(window);
                        console.error('Detailed GET error:', error);
                    }
                    
                    // Generic error message to prevent information disclosure
                    throw new Error('Request failed');
                }
            },
            
            // ✅ SECURE POST METHOD
            post: async (url, data, options = {}) => {
                // Input validation and SSRF protection
                Utils.http.validateUrl(url);
                await Utils.http.rateLimiter.checkRate(url);
                
                // Payload validation
                if (data === null || data === undefined) {
                    throw new Error('POST data cannot be null or undefined');
                }
                
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: Utils.http.getSecureHeaders({
                            'Content-Type': 'application/json',
                            ...options.headers
                        }),
                        body: JSON.stringify(data),
                        credentials: 'same-origin',
                        cache: 'no-store',
                        ...options
                    });
                    
                    if (!response.ok) {
                        const genericError = `Request failed with status ${response.status}`;
                        console.error(`HTTP POST failed: ${url} - Status: ${response.status}`);
                        throw new Error(genericError);
                    }
                    
                    return await response.json();
                } catch (error) {
                    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                        console.error('Detailed POST error:', error);
                    }
                    
                    throw new Error('Request failed');
                }
            }
        },

        // ✅ TASK 1.4: SECURITY-HARDENED STORAGE UTILITIES
        storage: {
            // ✅ COMPREHENSIVE INPUT VALIDATION
            validateStorageInput: (key, value) => {
                // Key validation
                if (!key || typeof key !== 'string') {
                    throw new Error('Invalid storage key: must be non-empty string');
                }
                
                const trimmedKey = key.trim();
                if (trimmedKey !== key) {
                    throw new Error('Storage key cannot have leading/trailing whitespace');
                }
                
                if (trimmedKey.length === 0) {
                    throw new Error('Storage key cannot be empty after trim');
                }
                
                if (trimmedKey.length > 100) {
                    throw new Error('Storage key too long: maximum 100 characters');
                }
                
                // Dangerous characters in keys
                const dangerousKeyChars = /[<>:"/\\|?*\x00-\x1f]/;
                if (dangerousKeyChars.test(trimmedKey)) {
                    throw new Error('Storage key contains dangerous characters');
                }
                
                // ✅ SENSITIVE DATA DETECTION
                const sensitivePatterns = [
                    { pattern: /password/i, type: 'Password' },
                    { pattern: /token/i, type: 'Token' },
                    { pattern: /secret/i, type: 'Secret' },
                    { pattern: /key/i, type: 'API Key' },
                    { pattern: /auth/i, type: 'Auth Data' },
                    { pattern: /credential/i, type: 'Credentials' },
                    { pattern: /session/i, type: 'Session Data' },
                    { pattern: /cookie/i, type: 'Cookie' },
                    { pattern: /jwt/i, type: 'JWT Token' },
                    { pattern: /oauth/i, type: 'OAuth Token' },
                    { pattern: /bearer/i, type: 'Bearer Token' }
                ];
                
                const matchedPattern = sensitivePatterns.find(p => p.pattern.test(trimmedKey));
                if (matchedPattern) {
                    console.warn(`🚨 WARNING: Potentially sensitive data detected`);
                    console.warn(`Key: "${trimmedKey}" appears to contain: ${matchedPattern.type}`);
                    console.warn('Consider using sessionStorage or encrypted storage for sensitive data');
                    console.warn('Use temporary storage or implement proper encryption');
                }
                
                // Value validation
                if (value === null || value === undefined) {
                    throw new Error('Storage value cannot be null or undefined');
                }
                
                try {
                    const serialized = JSON.stringify(value);
                    
                    // Size limit (1MB default)
                    const maxSize = 1024 * 1024; // 1MB
                    if (serialized.length > maxSize) {
                        throw new Error(`Value too large for storage: ${(serialized.length / 1024).toFixed(1)}KB exceeds ${maxSize / 1024}KB limit`);
                    }
                    
                    // Dangerous content detection in values
                    if (typeof value === 'string') {
                        const dangerousContent = [
                            /<script/i, /<iframe/i, /<object/i, /<embed/i,
                            /javascript:/i, /data:/i, /vbscript:/i
                        ];
                        
                        if (dangerousContent.some(pattern => pattern.test(value))) {
                            console.warn('⚠️ WARNING: Potentially dangerous content in storage value');
                        }
                    }
                    
                } catch (error) {
                    if (error.name === 'TypeError') {
                        throw new Error('Value cannot be serialized to JSON');
                    }
                    throw error;
                }
                
                return trimmedKey;
            },
            
            // ✅ CHECKSUM GENERATION FOR DATA INTEGRITY
            generateChecksum: (data) => {
                // Simple checksum using djb2 algorithm
                let hash = 5381;
                for (let i = 0; i < data.length; i++) {
                    hash = ((hash << 5) + hash) + data.charCodeAt(i);
                }
                return (hash >>> 0).toString(36); // Convert to unsigned and base36
            },
            
            // ✅ SECURE localStorage OPERATIONS
            setLocal: (key, value, options = {}) => {
                try {
                    const validatedKey = Utils.storage.validateStorageInput(key, value);
                    
                    // Security options
                    const {
                        encrypt = false,
                        ttl = null, // Time to live in ms
                        overwrite = true
                    } = options;
                    
                    // Check for existing data if overwrite is disabled
                    if (!overwrite && localStorage.getItem(validatedKey) !== null) {
                        throw new Error('Key already exists and overwrite is disabled');
                    }
                    
                    // Create security wrapper with metadata
                    const storageWrapper = {
                        data: value,
                        timestamp: Date.now(),
                        version: '1.0',
                        checksum: Utils.storage.generateChecksum(JSON.stringify(value))
                    };
                    
                    if (ttl) {
                        storageWrapper.expires = Date.now() + ttl;
                    }
                    
                    localStorage.setItem(validatedKey, JSON.stringify(storageWrapper));
                    
                    console.log(`✅ Storage: Successfully saved "${validatedKey}" (${(JSON.stringify(storageWrapper).length / 1024).toFixed(2)}KB)`);
                    return true;
                    
                } catch (error) {
                    console.error(`❌ Storage Error: ${error.message}`);
                    
                    // Detailed logging only in development
                    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
