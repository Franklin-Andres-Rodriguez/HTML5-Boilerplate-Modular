# 🚀 HTML5 Boilerplate Modular

A modern, semantic, and completely modular boilerplate for HTML5 web projects with **real selective download**.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-ready-orange.svg)](https://html5.org)
[![CSS3](https://img.shields.io/badge/CSS3-modular-blue.svg)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-utilities-yellow.svg)](https://developer.mozilla.org/docs/Web/JavaScript)

> **Installation • Usage • Customization • Contributing**

**Designed with real selective download** - take only what you need without breaking your existing project.

## 🎯 Why Use This Boilerplate?

This boilerplate solves the real problem of having to start from scratch on every web project, providing three optimized versions for different needs:

- **🎯 Complete Version (124KB)** - Full web project with all functionalities
- **⚡ Minimal Version (60KB)** - Ultra-optimized for fast landing pages
- **📄 HTML Only (36KB)** - Pure components to integrate into existing projects

## ✨ Key Features

- 🏗️ **Complete semantic HTML5** - `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- 🎨 **Modular CSS system** - Customizable variables, modern reset, mobile-first responsive
- 📱 **Responsive design** - Works perfectly on all devices
- ♿ **Built-in accessibility** - ARIA, skip links, keyboard navigation
- 🔍 **SEO optimized** - Meta tags, Open Graph, Twitter Cards
- ⚡ **Performance** - Optimized for Core Web Vitals
- 🌐 **Cross-browser compatible** - Chrome, Firefox, Safari, Edge
- 🔧 **100% modular** - Use only the parts you need

## 📦 Available Versions

### 🎯 Complete Version (124KB)

**Ideal for**: Complete websites, web applications, new projects

```bash
cp -r releases/complete my-web-project
cd my-web-project
open index.html
```

**Includes**:

- Complete semantic HTML5 (8KB)
- Modular CSS: `variables.css`, `reset.css`, `layout.css`, `components.css`, `responsive.css` (24KB)
- JavaScript: `main.js` (17KB) + `utils.js` (14KB)
- Professional SVG assets
- PWA ready with `manifest.json`

### ⚡ Minimal Version (60KB)

**Ideal for**: Landing pages, prototypes, simple projects

```bash
cp -r releases/minimal my-landing-page
cd my-landing-page
open index.html
```

**Includes**:

- Essential HTML5 (3KB)
- Optimized CSS: `variables.css`, `reset.css`, `minimal.css` (6KB)
- Basic JavaScript: `minimal.js` (1KB)
- Essential assets

### 📄 HTML Only (36KB)

**Ideal for**: Existing projects, reusable components

```bash
cp -r releases/html-only my-components
cd my-components
```

**Includes**:

- Modular HTML components
- `header.html`, `main-content.html`, `aside.html`, `footer.html`
- `base-structure.html` - Complete structure
- No CSS or JS (to integrate with your stack)

## 🚀 Quick Installation

### For New Project

```bash
# 1. Clone the repository
git clone https://github.com/Franklin-Andres-Rodriguez/HTML5-Boilerplate-Modular.git

# 2. Choose your version and create your project
cp -r HTML5-Boilerplate-Modular/releases/complete my-awesome-project
cd my-awesome-project

# 3. Open in browser!
open index.html
```

### For Existing Project

```bash
# HTML components only (no conflicts)
cp -r HTML5-Boilerplate-Modular/releases/html-only/components my-existing-project/

# Modular CSS only
cp -r HTML5-Boilerplate-Modular/releases/complete/css my-existing-project/

# JavaScript utilities only
cp -r HTML5-Boilerplate-Modular/releases/complete/js my-existing-project/
```

## 📁 File Structure

```text
HTML5-Boilerplate-Modular/
├── 📦 releases/                 # Compiled versions ready to use
│   ├── complete/               # 🎯 Complete version (124KB)
│   │   ├── index.html          # Main page (8KB)
│   │   ├── css/
│   │   │   ├── variables.css   # Customizable CSS variables
│   │   │   ├── reset.css       # Modern reset
│   │   │   ├── layout.css      # Layout system (5KB)
│   │   │   ├── components.css  # Reusable components (7KB)
│   │   │   └── responsive.css  # Mobile-first media queries (7KB)
│   │   ├── js/
│   │   │   ├── main.js         # Main functionality (17KB)
│   │   │   └── utils.js        # JavaScript utilities (14KB)
│   │   ├── img/                # Professional SVG assets
│   │   └── manifest.json       # PWA ready
│   ├── minimal/                # ⚡ Minimal version (60KB)
│   │   ├── index.html          # Optimized page (3KB)
│   │   ├── css/
│   │   │   ├── variables.css   # Essential variables
│   │   │   ├── reset.css       # Basic reset
│   │   │   └── minimal.css     # Minimal styles (1KB)
│   │   └── js/
│   │       └── minimal.js      # Basic JavaScript (1KB)
│   └── html-only/              # 📄 HTML only (36KB)
│       ├── index.html          # Base structure
│       └── components/         # Modular components
├── 🧩 components/              # Component source code
├── 🎨 styles/                  # CSS source code
├── ⚡ scripts/                 # JavaScript source code
├── 🔧 tools/                   # Build system
└── 📚 docs/                    # Documentation
```

## 🎨 Super Easy Customization

### CSS Variables - Change Complete Look

Edit `css/variables.css`:

```css
:root {
    /* 🎯 Change these values and everything updates automatically */
    --primary-color: #007bff;        /* Your brand color */
    --secondary-color: #6c757d;      /* Secondary color */
    --font-family-primary: 'Inter';  /* Your preferred font */
    --container-max-width: 1200px;   /* Maximum content width */
    --border-radius: 8px;            /* Element roundness */
    --spacing-unit: 1rem;            /* Base spacing unit */
}
```

### JavaScript API - Included Utilities

```javascript
// Available utilities in utils.js
const utils = BoilerplateUtils;

// Instant validation
utils.validation.isEmail('test@example.com');        // true
utils.validation.isPhone('+1-234-567-8900');        // true

// Simple HTTP requests
const data = await utils.http.get('/api/users');
const result = await utils.http.post('/api/login', {user: 'john'});

// Easy DOM manipulation
const element = utils.dom.$('#my-element');
utils.dom.addClass(element, 'active');

// Device detection
utils.device.isMobile();     // true/false
utils.device.isTablet();     // true/false
```

## 🛠️ Build System

### Available NPM Scripts

```bash
# Build all versions
npm run build

# Build specific versions
npm run build:html    # HTML only
npm run build:css     # CSS only
npm run build:js      # JavaScript only
npm run build:all     # All versions
```

### Development

```bash
# Install dependencies
npm install

# Build project
npm run build

# Compiled files appear in releases/
```

## 📊 Performance and Metrics

### ⚡ Real Sizes

- **🎯 Complete**: 124KB (HTML + CSS + JS + Assets + PWA)
- **⚡ Minimal**: 60KB (Ultra-optimized essentials)
- **📄 HTML Only**: 36KB (Pure components)

### 🎯 Core Web Vitals Optimized

- **LCP** (Largest Contentful Paint): <1.2s ✅
- **FID** (First Input Delay): <100ms ✅
- **CLS** (Cumulative Layout Shift): <0.1 ✅

### 🚀 Performance Features

- 📱 Service Worker ready (PWA)
- 🔗 DNS Prefetch for external resources
- ⚡ Inline critical CSS for fast first paint
- 🗜️ Optimized assets

## ♿ Accessibility (WCAG 2.1 AA)

- ✅ **Screen Reader** fully compatible
- ✅ **Keyboard Navigation** complete - Tab, Enter, Escape, Arrow keys
- ✅ **Focus Management** intelligent with visual indicators
- ✅ **ARIA Labels** semantic in all components
- ✅ **Skip Links** for quick navigation
- ✅ **Color Contrast** 4.5:1 minimum
- ✅ **Reduced Motion** respects user preferences

## 🌍 Browser Compatibility

| Browser | Support | Features |
|---------|---------|----------|
| Chrome 85+ | ✅ Complete | All + PWA |
| Firefox 78+ | ✅ Complete | All + PWA |
| Safari 14+ | ✅ Complete | All features |
| Edge 85+ | ✅ Complete | All + PWA |
| IE11 | ⚠️ Basic | With limited polyfills |

## 📋 Use Cases

### ✅ New Website

```bash
cp -r releases/complete my-website
cd my-website
# Customize CSS variables
# Edit content in index.html
# Ready!
```

### ✅ Ultra-Fast Landing Page

```bash
cp -r releases/minimal my-landing
cd my-landing
# Only 60KB - Instant loading
```

### ✅ Existing React/Vue Project

```bash
# Add styles only without conflicts
cp releases/complete/css my-project/src/styles/
# Import in your main component
```

### ✅ Existing WordPress/PHP

```bash
# Clean integration
cp releases/complete/css wp-content/themes/my-theme/css/
cp releases/complete/js wp-content/themes/my-theme/js/
```

## 🤝 Contributing

Contributions are super welcome!

### 🐛 Report Issues

- [Bug Report](../../issues/new?template=bug_report.md) - Something isn't working
- [Feature Request](../../issues/new?template=feature_request.md) - Great ideas
- [Question](../../discussions) - Questions and discussions

### 💻 Contributing Code

1. Fork the project
2. Create your branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m 'feat: add new feature'`
4. Push: `git push origin feature/new-feature`
5. Pull Request with detailed description

### 🏗️ Development Setup

```bash
git clone https://github.com/Franklin-Andres-Rodriguez/HTML5-Boilerplate-Modular.git
cd HTML5-Boilerplate-Modular
npm install
npm run build
```

## 📚 Documentation

- 📖 **Installation Guide** - This README
- 🎨 **Customization** - Edit CSS variables
- ⚡ **Performance** - Included optimizations
- ♿ **Accessibility** - WCAG 2.1 compliance
- 🔧 **Build System** - Available npm commands

## 🎉 Showcase

### 🌟 Projects Built with This Boilerplate

- Your project? - [Share it with us](../../discussions)

### 💬 Community

- [Discussions](../../discussions) - Questions and answers
- [Issues](../../issues) - Bugs and suggestions

## 📄 License

[MIT License](LICENSE) - Use freely in personal and commercial projects.

## 🙏 Acknowledgments

- [HTML5 Boilerplate](https://html5boilerplate.com/) - Original inspiration
- [Normalize.css](https://necolas.github.io/normalize.css/) - CSS reset base
- [MDN Web Docs](https://developer.mozilla.org/) - Reference documentation
- All contributors who make this project better

---

## 🚀 Get Started Now

```bash
# Complete project (recommended)
cp -r releases/complete my-awesome-project && cd my-awesome-project && open index.html

# Fast landing page
cp -r releases/minimal my-landing-page && cd my-landing-page && open index.html

# Components only for existing project
cp -r releases/html-only/components my-existing-project/
```

⭐ **If this was helpful, give the repo a star** ⭐

---

## Made with ❤️ for the developer community

Problems? Questions? Great ideas?
💬 [Join the conversation](../../discussions)
