/**
 * CALL STACK DEMO - ARQUITECTURA MODULAR EMPRESARIAL
 * ================================================
 * 
 * Principios arquitecturales aplicados:
 * - Separation of Concerns
 * - Single Responsibility Principle  
 * - Dependency Injection Pattern
 * - Module Pattern con IIFE
 * - XSS Prevention
 * - Error Boundary Pattern
 */

// ========================================
// MÓDULO PRINCIPAL: CALL STACK DEMO
// ========================================

(function CallStackDemo() {
    'use strict';
    
    // ========================================
    // CONFIGURACIÓN Y ESTADO PRIVADO
    // ========================================
    
    let outputDiv;
    let stackDiv;
    let stepDelay = 800;
    
    // Configuración de pasos de la simulación
    const SIMULATION_STEPS = [
        { action: 'call', function: 'cook()', message: '🍳 1. Starting to cook...' },
        { action: 'call', function: 'washDishes()', message: '🧽 2. Starting to wash dishes...' },
        { action: 'call', function: 'dryDishes()', message: '🏠 3. Starting to dry dishes...' },
        { action: 'call', function: 'putAwayDishes()', message: '📦 Putting dishes in the cupboard' },
        { action: 'return', function: 'putAwayDishes()', message: '✅ putAwayDishes() completes' },
        { action: 'continue', function: 'dryDishes()', message: '🏠 4. Finished drying dishes!' },
        { action: 'return', function: 'dryDishes()', message: '✅ dryDishes() completes' },
        { action: 'continue', function: 'washDishes()', message: '🧽 5. Finished washing dishes!' },
        { action: 'return', function: 'washDishes()', message: '✅ washDishes() completes' },
        { action: 'continue', function: 'cook()', message: '🍳 6. Finished cooking!' },
        { action: 'return', function: 'cook()', message: '✅ cook() completes' }
    ];
    
    // ========================================
    // UTILIDADES INTERNAS
    // ========================================
    
    /**
     * Sanitiza texto para prevenir XSS
     * @param {string} text - Texto a sanitizar
     * @returns {string} - Texto sanitizado
     */
    function sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Utilidad para crear delays no bloqueantes
     * @param {number} ms - Milisegundos a esperar
     * @returns {Promise} - Promise que se resuelve después del delay
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ========================================
    // INICIALIZACIÓN DEL MÓDULO
    // ========================================
    
    /**
     * Inicializa el módulo cuando el DOM está listo
     * Implementa el patrón de inicialización diferida
     */
    function init() {
        try {
            // Obtener referencias DOM
            outputDiv = document.getElementById('output');
            stackDiv = document.getElementById('stackVisualization');
            
            // Validación de dependencias críticas
            if (!outputDiv || !stackDiv) {
                const errorMsg = '❌ CallStackDemo: Elementos DOM requeridos no encontrados';
                console.error(errorMsg);
                console.error('Required: #output, #stackVisualization');
                
                // Mostrar error en la página si es posible
                if (outputDiv) {
                    outputDiv.textContent = errorMsg;
                }
                return false;
            }
            
            // Estado inicial
            mostrarMensajeInicial();
            
            console.log('✅ CallStackDemo: Módulo inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error durante inicialización:', error);
            return false;
        }
    }
    
    /**
     * Muestra mensaje inicial en la visualización
     */
    function mostrarMensajeInicial() {
        if (!stackDiv) return;
        
        stackDiv.innerHTML = '<div style="color: #666; padding: 10px;">Click "Run Demo" to begin the simulation</div>';
    }
    
    // ========================================
    // API PÚBLICA DEL MÓDULO
    // ========================================
    
    /**
     * Limpia tanto el output como la visualización del stack
     * Implementa el patrón Command para operaciones de limpieza
     */
    function limpiarOutput() {
        try {
            if (!outputDiv || !stackDiv) {
                console.warn('⚠️ limpiarOutput: Referencias DOM no disponibles');
                return;
            }
            
            outputDiv.textContent = '';
            stackDiv.innerHTML = '';
            mostrarMensajeInicial();
            
            console.log('🧹 Output limpiado correctamente');
        } catch (error) {
            console.error('❌ Error limpiando output:', error);
        }
    }
    
    /**
     * Función principal que orquesta la demostración
     * Implementa el patrón Template Method con manejo robusto de errores
     */
    async function ejecutarDemo() {
        try {
            if (!outputDiv) {
                console.error('❌ ejecutarDemo: outputDiv no disponible');
                return;
            }
            
            limpiarOutput();
            outputDiv.textContent = "🚀 Starting execution...\n\n";
            
            await simularCallStack();
            
            console.log('✅ Demo ejecutado correctamente');
        } catch (error) {
            console.error('❌ Error durante ejecución del demo:', error);
            if (outputDiv) {
                outputDiv.textContent += `\n❌ Error: ${error.message}`;
            }
        }
    }
    
    /**
     * Simula el comportamiento del call stack paso a paso
     * Implementa el patrón State Machine con validación robusta
     */
    async function simularCallStack() {
        const stack = [];
        
        for (let i = 0; i < SIMULATION_STEPS.length; i++) {
            const step = SIMULATION_STEPS[i];
            
            try {
                // Procesar acción del paso
                switch (step.action) {
                    case 'call':
                        stack.push(step.function);
                        break;
                    case 'return':
                        if (stack.length > 0) {
                            stack.pop();
                        }
                        break;
                    case 'continue':
                        // No modifica el stack, solo muestra mensaje
                        break;
                    default:
                        console.warn(`⚠️ Acción desconocida: ${step.action}`);
                }
                
                // Actualizar interfaz de forma segura
                if (outputDiv) {
                    outputDiv.textContent += step.message + '\n';
                }
                
                updateStackVisualization(stack);
                
                // Permitir que el navegador actualice la UI
                await sleep(stepDelay);
                
            } catch (error) {
                console.error(`❌ Error en paso ${i}:`, error);
                continue; // Continuar con el siguiente paso
            }
        }
        
        // Mensaje final
        if (outputDiv) {
            outputDiv.textContent += '\n🎉 Execution complete!';
        }
        
        if (stackDiv) {
            const finalMessage = document.createElement('div');
            finalMessage.style.cssText = 'color: #ff6b6b; font-weight: bold; margin-top: 10px; padding: 8px;';
            finalMessage.textContent = 'Stack empty - Program terminated';
            stackDiv.appendChild(finalMessage);
        }
    }
    
    /**
     * Actualiza la representación visual del call stack
     * Implementa el patrón Observer con protección XSS
     */
    function updateStackVisualization(stack) {
        if (!stackDiv) {
            console.warn('⚠️ updateStackVisualization: stackDiv no disponible');
            return;
        }
        
        try {
            // Limpiar contenido existente
            stackDiv.innerHTML = '';
            
            if (stack.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.style.cssText = 'color: #666; padding: 10px;';
                emptyDiv.textContent = 'Stack empty';
                stackDiv.appendChild(emptyDiv);
                return;
            }
            
            // Encabezado explicativo
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = 'color: #888; margin-bottom: 10px; font-size: 0.9em;';
            headerDiv.textContent = '⬇️ Last In (Top of Stack)';
            stackDiv.appendChild(headerDiv);
            
            // Renderizar stack frames (LIFO - Last In, First Out)
            for (let i = stack.length - 1; i >= 0; i--) {
                const isActive = i === stack.length - 1;
                const frameElement = createStackFrameElement(stack[i], isActive);
                stackDiv.appendChild(frameElement);
            }
            
            // Pie explicativo
            const footerDiv = document.createElement('div');
            footerDiv.style.cssText = 'color: #888; margin-top: 10px; font-size: 0.9em;';
            footerDiv.textContent = '⬆️ First In (Bottom of Stack)';
            stackDiv.appendChild(footerDiv);
            
        } catch (error) {
            console.error('❌ Error actualizando visualización del stack:', error);
        }
    }
    
    /**
     * Crea elemento DOM para un frame del stack
     * Implementa el patrón Factory Method con protección XSS
     */
    function createStackFrameElement(functionName, isActive) {
        const frameDiv = document.createElement('div');
        
        // Configurar clases CSS
        frameDiv.className = isActive ? 'stack-frame active' : 'stack-frame';
        
        // Crear contenido de forma segura
        const status = isActive ? '← Currently Executing' : '← Waiting';
        const safeContent = sanitizeText(`${functionName} ${status}`);
        frameDiv.innerHTML = safeContent;
        
        return frameDiv;
    }
    
    // ========================================
    // EXPOSICIÓN DE API PÚBLICA
    // ========================================
    
    // ✅ CORRECCIÓN CRÍTICA: Exponer funciones con nombres correctos para HTML
    window.runDemo = ejecutarDemo;      // HTML llama runDemo()
    window.clearOutput = limpiarOutput; // HTML llama clearOutput()
    
    // Exponer funciones en español para compatibilidad interna
    window.ejecutarDemo = ejecutarDemo;
    window.limpiarOutput = limpiarOutput;
    
    // Exponer funciones para testing
    if (typeof window !== 'undefined') {
        window.CallStackDemo = {
            simularCallStack,
            updateStackVisualization,
            sleep,
            version: '2.0.0'
        };
    }
    
    // ========================================
    // AUTO-INICIALIZACIÓN CON ERROR HANDLING
    // ========================================
    
    // Inicializar cuando el DOM esté listo
    function safeInit() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                // DOM ya está listo
                init();
            }
        } catch (error) {
            console.error('❌ Error en auto-inicialización:', error);
        }
    }
    
    // Ejecutar inicialización segura
    safeInit();
    
})(); // IIFE - Immediately Invoked Function Expression