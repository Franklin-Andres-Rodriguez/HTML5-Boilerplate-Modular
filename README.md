# 🚀 HTML5 Boilerplate Modular

Un boilerplate moderno, semántico y completamente modular para proyectos web HTML5 con **descarga selectiva** real.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-ready-orange.svg)]()
[![CSS3](https://img.shields.io/badge/CSS3-modular-blue.svg)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-utilities-yellow.svg)]()

> **Instalación • Uso • Personalización • Contribuir**

**Diseñado con descarga selectiva real** - toma solo lo que necesitas sin romper tu proyecto existente.

## 🎯 ¿Por qué usar este Boilerplate?

Este boilerplate resuelve el problema real de tener que empezar desde cero cada proyecto web, proporcionando tres versiones optimizadas para diferentes necesidades:

- **🎯 Versión Completa (124KB)** - Proyecto web completo con todas las funcionalidades
- **⚡ Versión Mínima (60KB)** - Ultra-optimizada para landing pages rápidas  
- **📄 Solo HTML (36KB)** - Componentes puros para integrar en proyectos existentes

## ✨ Características Principales

- 🏗️ **HTML5 semántico completo** - `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- 🎨 **Sistema CSS modular** - Variables personalizables, reset moderno, responsive mobile-first
- 📱 **Diseño responsive** - Funciona perfecto en todos los dispositivos
- ♿ **Accesibilidad integrada** - ARIA, skip links, keyboard navigation
- 🔍 **SEO optimizado** - Meta tags, Open Graph, Twitter Cards
- ⚡ **Performance** - Optimizado para Core Web Vitals
- 🌐 **Cross-browser compatible** - Chrome, Firefox, Safari, Edge
- 🔧 **100% modular** - Usa solo las partes que necesites

## 📦 Versiones Disponibles

### 🎯 Versión Completa (124KB)
**Ideal para**: Sitios web completos, aplicaciones web, proyectos nuevos
```bash
cp -r releases/complete mi-proyecto-web
cd mi-proyecto-web
open index.html
```

**Incluye**:
- HTML5 semántico completo (8KB)
- CSS modular: `variables.css`, `reset.css`, `layout.css`, `components.css`, `responsive.css` (24KB)
- JavaScript: `main.js` (17KB) + `utils.js` (14KB)
- Assets SVG profesionales
- PWA ready con `manifest.json`

### ⚡ Versión Mínima (60KB)
**Ideal para**: Landing pages, prototipos, proyectos simples
```bash
cp -r releases/minimal mi-landing-page
cd mi-landing-page
open index.html
```

**Incluye**:
- HTML5 esencial (3KB)
- CSS optimizado: `variables.css`, `reset.css`, `minimal.css` (6KB)
- JavaScript básico: `minimal.js` (1KB)
- Assets esenciales

### 📄 Solo HTML (36KB)
**Ideal para**: Proyectos existentes, componentes reutilizables
```bash
cp -r releases/html-only mi-componentes
cd mi-componentes
```

**Incluye**:
- Componentes HTML modulares
- `header.html`, `main-content.html`, `aside.html`, `footer.html`
- `base-structure.html` - Estructura completa
- Sin CSS ni JS (para integrar con tu stack)

## 🚀 Instalación Rápida

### Para Proyecto Nuevo
```bash
# 1. Clona el repositorio
git clone https://github.com/Franklin-Andres-Rodriguez/HTML5-Boilerplate-Modular.git

# 2. Elige tu versión y crea tu proyecto
cp -r HTML5-Boilerplate-Modular/releases/complete mi-proyecto-genial
cd mi-proyecto-genial

# 3. ¡Abre en el navegador!
open index.html
```

### Para Proyecto Existente
```bash
# Solo componentes HTML (sin conflictos)
cp -r HTML5-Boilerplate-Modular/releases/html-only/components mi-proyecto-existente/

# Solo CSS modular
cp -r HTML5-Boilerplate-Modular/releases/complete/css mi-proyecto-existente/

# Solo JavaScript utilities
cp -r HTML5-Boilerplate-Modular/releases/complete/js mi-proyecto-existente/
```

## 📁 Estructura de Archivos

```
HTML5-Boilerplate-Modular/
├── 📦 releases/                 # Versiones compiladas listas para usar
│   ├── complete/               # 🎯 Versión completa (124KB)
│   │   ├── index.html          # Página principal (8KB)
│   │   ├── css/
│   │   │   ├── variables.css   # Variables CSS personalizables
│   │   │   ├── reset.css       # Reset moderno
│   │   │   ├── layout.css      # Sistema de layout (5KB)
│   │   │   ├── components.css  # Componentes reutilizables (7KB)
│   │   │   └── responsive.css  # Media queries mobile-first (7KB)
│   │   ├── js/
│   │   │   ├── main.js         # Funcionalidad principal (17KB)
│   │   │   └── utils.js        # Utilidades JavaScript (14KB)
│   │   ├── img/                # Assets SVG profesionales
│   │   └── manifest.json       # PWA ready
│   ├── minimal/                # ⚡ Versión mínima (60KB)
│   │   ├── index.html          # Página optimizada (3KB)
│   │   ├── css/
│   │   │   ├── variables.css   # Variables esenciales
│   │   │   ├── reset.css       # Reset básico
│   │   │   └── minimal.css     # Estilos mínimos (1KB)
│   │   └── js/
│   │       └── minimal.js      # JavaScript básico (1KB)
│   └── html-only/              # 📄 Solo HTML (36KB)
│       ├── index.html          # Estructura base
│       └── components/         # Componentes modulares
├── 🧩 components/              # Código fuente de componentes
├── 🎨 styles/                  # Código fuente CSS
├── ⚡ scripts/                 # Código fuente JavaScript
├── 🔧 tools/                   # Sistema de build
└── 📚 docs/                    # Documentación
```

## 🎨 Personalización Súper Fácil

### Variables CSS - Cambiar Look Completo
Edita `css/variables.css`:
```css
:root {
    /* 🎯 Cambia estos valores y todo se actualiza automáticamente */
    --primary-color: #007bff;        /* Tu color de marca */
    --secondary-color: #6c757d;      /* Color secundario */
    --font-family-primary: 'Inter';  /* Tu fuente preferida */
    --container-max-width: 1200px;   /* Ancho máximo de contenido */
    --border-radius: 8px;            /* Redondez de elementos */
    --spacing-unit: 1rem;            /* Unidad base de espaciado */
}
```

### JavaScript API - Utilidades Incluidas
```javascript
// Utilidades disponibles en utils.js
const utils = BoilerplateUtils;

// Validación instantánea
utils.validation.isEmail('test@example.com');        // true
utils.validation.isPhone('+1-234-567-8900');        // true

// HTTP requests simples  
const data = await utils.http.get('/api/users');
const result = await utils.http.post('/api/login', {user: 'john'});

// Manipulación DOM fácil
const element = utils.dom.$('#mi-elemento');
utils.dom.addClass(element, 'active');

// Device detection
utils.device.isMobile();     // true/false
utils.device.isTablet();     // true/false
```

## 🛠️ Sistema de Build

### Scripts NPM Disponibles
```bash
# Construir todas las versiones
npm run build

# Construir versiones específicas
npm run build:html    # Solo HTML
npm run build:css     # Solo CSS  
npm run build:js      # Solo JavaScript
npm run build:all     # Todas las versiones
```

### Desarrollo
```bash
# Instalar dependencias
npm install

# Construir proyecto
npm run build

# Los archivos compilados aparecen en releases/
```

## 📊 Performance y Métricas

### ⚡ Tamaños Reales
- **🎯 Completo**: 124KB (HTML + CSS + JS + Assets + PWA)
- **⚡ Mínimo**: 60KB (Esenciales ultra-optimizados)  
- **📄 Solo HTML**: 36KB (Componentes puros)

### 🎯 Core Web Vitals Optimizado
- **LCP** (Largest Contentful Paint): <1.2s ✅
- **FID** (First Input Delay): <100ms ✅
- **CLS** (Cumulative Layout Shift): <0.1 ✅

### 🚀 Características de Performance
- 📱 Service Worker ready (PWA)
- 🔗 DNS Prefetch para recursos externos
- ⚡ Critical CSS inline para first paint rápido
- 🗜️ Assets optimizados

## ♿ Accesibilidad (WCAG 2.1 AA)

- ✅ **Screen Reader** totalmente compatible
- ✅ **Keyboard Navigation** completa - Tab, Enter, Escape, Arrow keys
- ✅ **Focus Management** inteligente con indicadores visuales
- ✅ **ARIA Labels** semánticos en todos los componentes
- ✅ **Skip Links** para navegación rápida
- ✅ **Color Contrast** 4.5:1 mínimo
- ✅ **Reduced Motion** respeta preferencias del usuario

## 🌍 Compatibilidad de Navegadores

| Navegador | Soporte | Características |
|-----------|---------|----------------|
| Chrome 85+ | ✅ Completo | Todas + PWA |
| Firefox 78+ | ✅ Completo | Todas + PWA |
| Safari 14+ | ✅ Completo | Todas las funcionalidades |
| Edge 85+ | ✅ Completo | Todas + PWA |
| IE11 | ⚠️ Básico | Con polyfills limitados |

## 📋 Casos de Uso

### ✅ Sitio Web Nuevo
```bash
cp -r releases/complete mi-sitio-web
cd mi-sitio-web
# Personalizar variables CSS
# Editar contenido en index.html
# ¡Listo!
```

### ✅ Landing Page Ultra-Rápida  
```bash
cp -r releases/minimal mi-landing
cd mi-landing
# Solo 60KB - Carga instantánea
```

### ✅ Proyecto React/Vue Existente
```bash
# Solo agrega estilos sin conflictos
cp releases/complete/css mi-proyecto/src/styles/
# Importar en tu componente principal
```

### ✅ WordPress/PHP Existente
```bash
# Integración limpia
cp releases/complete/css wp-content/themes/mi-theme/css/
cp releases/complete/js wp-content/themes/mi-theme/js/
```

## 🤝 Contribuir

¡Las contribuciones son súper bienvenidas!

### 🐛 Reportar Issues
- [Bug Report](../../issues/new?template=bug_report.md) - Algo no funciona
- [Feature Request](../../issues/new?template=feature_request.md) - Ideas geniales
- [Question](../../discussions) - Dudas y discusiones

### 💻 Contribuir Código
1. Fork el proyecto
2. Crea tu branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`  
5. Pull Request con descripción detallada

### 🏗️ Setup de Desarrollo
```bash
git clone https://github.com/Franklin-Andres-Rodriguez/HTML5-Boilerplate-Modular.git
cd HTML5-Boilerplate-Modular
npm install
npm run build
```

## 📚 Documentación

- 📖 **Guía de Instalación** - Este README
- 🎨 **Personalización** - Editar variables CSS
- ⚡ **Performance** - Optimizaciones incluidas
- ♿ **Accesibilidad** - WCAG 2.1 compliance
- 🔧 **Build System** - Comandos npm disponibles

## 🎉 Showcase

### 🌟 Proyectos Construidos con Este Boilerplate
- ¿Tu proyecto? - [Compártelo con nosotros](../../discussions)

### 💬 Comunidad
- [Discussions](../../discussions) - Preguntas y respuestas
- [Issues](../../issues) - Bugs y sugerencias

## 📄 Licencia

[MIT License](LICENSE) - Úsalo libremente en proyectos personales y comerciales.

## 🙏 Agradecimientos

- [HTML5 Boilerplate](https://html5boilerplate.com/) - Inspiración original
- [Normalize.css](https://necolas.github.io/normalize.css/) - Base de reset CSS
- [MDN Web Docs](https://developer.mozilla.org/) - Documentación de referencia
- Todos los contribuidores que hacen este proyecto mejor

---

## 🚀 Empezar Ahora

```bash
# Proyecto completo (recomendado)
cp -r releases/complete mi-proyecto-genial && cd mi-proyecto-genial && open index.html

# Landing page rápida  
cp -r releases/minimal mi-landing-page && cd mi-landing-page && open index.html

# Solo componentes para proyecto existente
cp -r releases/html-only/components mi-proyecto-existente/
```

⭐ **Si te fue útil, dale una estrella al repo** ⭐

---

**Hecho con ❤️ para la comunidad de desarrolladores**

¿Problemas? ¿Preguntas? ¿Ideas geniales?
💬 [Únete a la conversación](../../discussions)