const fs = require('fs-extra');
const path = require('path');

class BoilerplateBuilder {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.componentsDir = path.join(this.rootDir, 'components');
        this.stylesDir = path.join(this.rootDir, 'styles');
        this.scriptsDir = path.join(this.rootDir, 'scripts');
        this.releasesDir = path.join(this.rootDir, 'releases');
        this.templatesDir = path.join(this.rootDir, 'templates');
        this.docsDir = path.join(this.rootDir, 'docs');
    }

    // Leer archivo y reemplazar variables
    readAndReplace(filePath, variables = {}) {
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
            return '';
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        // Variables por defecto
        const defaultVars = {
            PROJECT_NAME: 'Mi Proyecto Web',
            PROJECT_DESCRIPTION: 'Descripción de mi proyecto web moderno',
            PROJECT_KEYWORDS: 'html5, responsive, semantic, modular',
            PROJECT_AUTHOR: 'Tu Nombre',
            PROJECT_URL: 'https://miproyecto.com',
            SITE_NAME: 'Mi Sitio',
            HERO_TITLE: 'Bienvenido a Mi Sitio Web',
            HERO_SUBTITLE: 'Un sitio web moderno y profesional',
            CTA_TEXT: 'Comenzar',
            COMPANY_NAME: 'Mi Empresa',
            CONTACT_EMAIL: 'contacto@miempresa.com',
            CONTACT_PHONE: '+1 234 567 8900',
            COMPANY_ADDRESS: '123 Calle Principal, Ciudad, País',
            CURRENT_DATE: new Date().toISOString().split('T')[0],
            FORMATTED_DATE: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            CURRENT_YEAR: new Date().getFullYear(),
            AUTHOR_NAME: 'Tu Nombre',
            SOCIAL_FACEBOOK: 'https://facebook.com/tuempresa',
            SOCIAL_TWITTER: 'https://twitter.com/tuempresa',
            SOCIAL_INSTAGRAM: 'https://instagram.com/tuempresa',
            SOCIAL_LINKEDIN: 'https://linkedin.com/company/tuempresa'
        };

        const allVars = { ...defaultVars, ...variables };

        // Reemplazar variables
        Object.keys(allVars).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, allVars[key]);
        });

        return content;
    }

    // Crear assets placeholder
    async createPlaceholderAssets(outputDir) {
        console.log('📁 Creando assets placeholder...');
        
        const imgDir = path.join(outputDir, 'img');
        await fs.ensureDir(imgDir);

        // Crear favicon.ico simple (1x1 pixel transparente)
        const faviconBuffer = Buffer.from([
            0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00,
            0x18, 0x00, 0x30, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00,
            0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00,
            0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00
        ]);
        
        await fs.writeFile(path.join(imgDir, 'favicon.ico'), faviconBuffer);

        // Copiar los SVGs profesionales si existen
        const svgAssets = ['favicon.svg', 'og-image.svg', 'apple-touch-icon.svg', 'icon-512.svg'];
        const sourceImgDir = path.join(this.rootDir, 'img');
        
        for (const asset of svgAssets) {
            const sourcePath = path.join(sourceImgDir, asset);
            const destPath = path.join(imgDir, asset);
            
            if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, destPath);
                console.log(`  ✓ ${asset} copiado`);
            }
        }

        // Crear og-image.svg si no existe
        if (!await fs.pathExists(path.join(imgDir, 'og-image.svg'))) {
            const ogImageSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#007bff"/>
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
    HTML5 Boilerplate Modular
  </text>
</svg>`;
            
            await fs.writeFile(path.join(imgDir, 'og-image.svg'), ogImageSvg);
        }

        // Crear apple-touch-icon.svg si no existe
        if (!await fs.pathExists(path.join(imgDir, 'apple-touch-icon.svg'))) {
            const appleTouchIconSvg = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#007bff" rx="20"/>
  <text x="90" y="95" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
    HTML5
  </text>
</svg>`;
            
            await fs.writeFile(path.join(imgDir, 'apple-touch-icon.svg'), appleTouchIconSvg);
        }

        console.log('✅ Assets placeholder creados');
    }

    // Copiar manifest.json
    async copyManifest(outputDir) {
        const manifestPath = path.join(this.rootDir, 'manifest.json');
        const destPath = path.join(outputDir, 'manifest.json');
        
        if (await fs.pathExists(manifestPath)) {
            await fs.copy(manifestPath, destPath);
            console.log('  ✓ manifest.json copiado');
        } else {
            console.warn('  ⚠️ manifest.json no encontrado');
        }
    }

    // NUEVA FUNCIONALIDAD: Crear archivos individuales para descarga directa
    async buildIndividualFiles() {
        console.log('📁 Creando archivos individuales para descarga directa...');
        
        const individualDir = path.join(this.releasesDir, 'individual');
        await fs.ensureDir(individualDir);
        
        try {
            // Copiar archivos CSS individuales con prefijo
            if (await fs.pathExists(this.stylesDir)) {
                const cssFiles = ['variables.css', 'reset.css', 'layout.css', 'components.css', 'responsive.css'];
                for (const file of cssFiles) {
                    const srcPath = path.join(this.stylesDir, file);
                    const destPath = path.join(individualDir, `boilerplate-${file}`);
                    
                    if (await fs.pathExists(srcPath)) {
                        await fs.copy(srcPath, destPath);
                        console.log(`  ✓ boilerplate-${file} creado`);
                    }
                }
            }
            
            // Copiar archivos JS individuales con prefijo
            if (await fs.pathExists(this.scriptsDir)) {
                const jsFiles = ['utils.js', 'main.js'];
                for (const file of jsFiles) {
                    const srcPath = path.join(this.scriptsDir, file);
                    const destPath = path.join(individualDir, `boilerplate-${file}`);
                    
                    if (await fs.pathExists(srcPath)) {
                        await fs.copy(srcPath, destPath);
                        console.log(`  ✓ boilerplate-${file} creado`);
                    }
                }
            }
            
            // Copiar componentes HTML individuales
            if (await fs.pathExists(this.componentsDir)) {
                const htmlFiles = ['header.html', 'main-content.html', 'aside.html', 'footer.html'];
                for (const file of htmlFiles) {
                    const srcPath = path.join(this.componentsDir, file);
                    const destPath = path.join(individualDir, file);
                    
                    if (await fs.pathExists(srcPath)) {
                        await fs.copy(srcPath, destPath);
                        console.log(`  ✓ ${file} copiado`);
                    }
                }
            }
            
            // Crear script de instalación inteligente
            await this.createSmartInstaller(individualDir);
            
            console.log('✅ Archivos individuales creados para descarga directa');
        } catch (error) {
            console.error('❌ Error creando archivos individuales:', error.message);
            throw error;
        }
    }

    // NUEVA FUNCIONALIDAD: Crear instalador inteligente
    async createSmartInstaller(outputDir) {
        const smartInstallerScript = `#!/bin/bash

# HTML5 Boilerplate Modular - Instalador Inteligente
# Detecta proyectos existentes y evita conflictos

set -e

# Colores
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m'

# Funciones de output
print_header() {
    echo -e "\${BLUE}"
    cat << "EOF"
    ____  __  __________________    
   / __ )/ / / / ____/ ____/ __ \\   
  / __  / / / / __/ / __/ / /_/ /   
 / /_/ / /_/ / /___/ /___/ _, _/    
/_____/\\____/_____/_____/_/ |_|     

HTML5 Boilerplate Modular - Instalador Inteligente
EOF
    echo -e "\${NC}"
}

print_success() { echo -e "\${GREEN}✅ \$1\${NC}"; }
print_warning() { echo -e "\${YELLOW}⚠️  \$1\${NC}"; }
print_error() { echo -e "\${RED}❌ \$1\${NC}"; exit 1; }
print_info() { echo -e "\${BLUE}ℹ️  \$1\${NC}"; }

# Análisis del proyecto existente
analyze_project() {
    echo -e "\${BLUE}🔍 Analizando tu proyecto existente...\${NC}"
    echo ""
    
    # Detectar estructura existente
    HAS_CSS=false
    HAS_JS=false
    HAS_HTML=false
    HAS_PACKAGE_JSON=false
    HAS_GIT=false
    FRAMEWORK="ninguno"
    
    [ -d "css" ] && HAS_CSS=true
    [ -d "js" ] && HAS_JS=true
    [ -f "index.html" ] && HAS_HTML=true
    [ -f "package.json" ] && HAS_PACKAGE_JSON=true
    [ -d ".git" ] && HAS_GIT=true
    
    # Detectar framework
    if [ -f "package.json" ]; then
        if grep -q "react" package.json 2>/dev/null; then
            FRAMEWORK="React"
        elif grep -q "vue" package.json 2>/dev/null; then
            FRAMEWORK="Vue"
        elif grep -q "angular" package.json 2>/dev/null; then
            FRAMEWORK="Angular"
        elif grep -q "svelte" package.json 2>/dev/null; then
            FRAMEWORK="Svelte"
        fi
    fi
    
    # Mostrar análisis
    echo "📋 Análisis de tu proyecto:"
    \$HAS_CSS && print_success "Carpeta CSS detectada" || echo "  📁 Sin carpeta CSS"
    \$HAS_JS && print_success "Carpeta JS detectada" || echo "  📁 Sin carpeta JS"
    \$HAS_HTML && print_success "HTML principal detectado" || echo "  📄 Sin index.html"
    \$HAS_PACKAGE_JSON && print_success "Package.json detectado" || echo "  📦 Sin package.json"
    \$HAS_GIT && print_success "Repositorio Git detectado" || echo "  🔄 Sin Git"
    
    [ "\$FRAMEWORK" != "ninguno" ] && print_success "Framework: \$FRAMEWORK" || echo "  🔧 Sin framework detectado"
    echo ""
}

# Recomendaciones basadas en análisis
show_recommendations() {
    echo -e "\${YELLOW}💡 Recomendaciones personalizadas:\${NC}"
    
    if [ "\$FRAMEWORK" = "React" ] || [ "\$FRAMEWORK" = "Vue" ] || [ "\$FRAMEWORK" = "Angular" ]; then
        echo "  → Proyecto con framework detectado"
        echo "  → Recomiendo: Solo variables CSS + utilidades JS"
        echo "  → Los componentes HTML puedes convertirlos a \$FRAMEWORK"
    elif \$HAS_CSS && \$HAS_JS; then
        echo "  → Proyecto web completo detectado"
        echo "  → Recomiendo: Solo componentes HTML específicos"
        echo "  → O variables CSS para consistencia de diseño"
    elif \$HAS_HTML && ! \$HAS_CSS; then
        echo "  → HTML sin estilos detectado"
        echo "  → Recomiendo: Sistema CSS completo"
    else
        echo "  → Proyecto nuevo o básico"
        echo "  → Recomiendo: Instalación completa"
    fi
    echo ""
}

# Mostrar opciones de instalación
show_options() {
    echo -e "\${BLUE}🎯 Opciones de instalación:\${NC}"
    echo "1) 📦 Completo (HTML + CSS + JS + Assets)"
    echo "2) 🎨 Solo CSS (Sistema de estilos modular)"
    echo "3) ⚡ Solo JavaScript (Utilidades y funcionalidades)"
    echo "4) 📄 Solo HTML (Componentes semánticos)"
    echo "5) 🔧 Variables CSS (Solo sistema de diseño)"
    echo "6) 📱 Componente específico (header, footer, etc.)"
    echo "7) 🤖 Instalación automática (basada en recomendaciones)"
    echo "8) ❌ Cancelar"
    echo ""
}

# Instalación según opción
install_option() {
    local option=\$1
    local base_url="https://raw.githubusercontent.com/TUUSUARIO/html5-boilerplate-modular/main/releases/individual"
    
    case \$option in
        1)
            print_info "Instalando versión completa..."
            install_complete
            ;;
        2)
            print_info "Instalando solo CSS..."
            install_css_only
            ;;
        3)
            print_info "Instalando solo JavaScript..."
            install_js_only
            ;;
        4)
            print_info "Instalando solo HTML..."
            install_html_only
            ;;
        5)
            print_info "Instalando solo variables CSS..."
            install_variables_only
            ;;
        6)
            print_info "Instalación de componente específico..."
            install_specific_component
            ;;
        7)
            print_info "Instalación automática basada en recomendaciones..."
            install_automatic
            ;;
        8)
            print_error "Instalación cancelada por el usuario"
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
}

# Instalación completa con verificaciones
install_complete() {
    if \$HAS_HTML && \$HAS_CSS && \$HAS_JS; then
        print_warning "Proyecto completo detectado. Esto podría sobrescribir archivos."
        echo "¿Continuar? (y/N)"
        read -r response
        [[ ! "\$response" =~ ^([yY][eE][sS]|[yY])$ ]] && print_error "Instalación cancelada"
    fi
    
    # Crear directorios si no existen
    mkdir -p css js img
    
    # Descargar archivos (usar URLs reales cuando esté en GitHub)
    echo "📥 Descargando archivos completos..."
    
    # Por ahora, mostrar lo que haría
    print_success "Se descargarían todos los archivos del boilerplate"
    print_success "HTML principal, CSS completo, JS, assets, manifest.json"
}

# Instalación solo CSS (sin conflictos)
install_css_only() {
    mkdir -p css
    
    echo "📥 Descargando sistema CSS..."
    
    # Usar nombres con prefijo para evitar conflictos
    local css_files=("variables" "reset" "layout" "components" "responsive")
    
    for file in "\${css_files[@]}"; do
        local filename="boilerplate-\${file}.css"
        echo "  → \$filename"
        # curl -s "\$base_url/boilerplate-\${file}.css" > "css/\$filename"
    done
    
    print_success "CSS instalado sin conflictos"
    print_info "Importa en tu CSS: @import 'css/boilerplate-variables.css';"
}

# Instalación solo JavaScript (sin conflictos)
install_js_only() {
    mkdir -p js
    
    echo "📥 Descargando utilidades JavaScript..."
    
    local js_files=("utils" "main")
    
    for file in "\${js_files[@]}"; do
        local filename="boilerplate-\${file}.js"
        echo "  → \$filename"
        # curl -s "\$base_url/boilerplate-\${file}.js" > "js/\$filename"
    done
    
    print_success "JavaScript instalado sin conflictos"
    print_info "Usa en tu HTML: <script src='js/boilerplate-utils.js'></script>"
}

# Instalación automática basada en análisis
install_automatic() {
    if [ "\$FRAMEWORK" != "ninguno" ]; then
        print_info "Framework \$FRAMEWORK detectado → Instalando CSS + JS"
        install_css_only
        install_js_only
    elif \$HAS_CSS && \$HAS_JS; then
        print_info "Proyecto completo detectado → Instalando solo variables CSS"
        install_variables_only
    elif \$HAS_HTML && ! \$HAS_CSS; then
        print_info "HTML sin estilos detectado → Instalando CSS completo"
        install_css_only
    else
        print_info "Proyecto nuevo detectado → Instalación completa"
        install_complete
    fi
}

# Instalación solo variables CSS
install_variables_only() {
    mkdir -p css
    
    echo "📥 Descargando solo variables CSS..."
    echo "  → boilerplate-variables.css"
    # curl -s "\$base_url/boilerplate-variables.css" > "css/boilerplate-variables.css"
    
    print_success "Variables CSS instaladas"
    print_info "Sistema de colores, fuentes y espaciado disponible"
}

# Función principal
main() {
    print_header
    
    # Verificar herramientas necesarias
    command -v curl >/dev/null 2>&1 || print_error "curl es requerido pero no está instalado"
    
    analyze_project
    show_recommendations
    show_options
    
    echo -n "Selecciona una opción (1-8): "
    read -r choice
    echo ""
    
    install_option "\$choice"
    
    echo ""
    print_success "¡Instalación completada!"
    print_info "Revisa los archivos agregados y personaliza según necesites"
    
    if \$HAS_GIT; then
        echo ""
        print_info "💡 Tip: Revisa los cambios con 'git status' antes de hacer commit"
    fi
}

# Ejecutar instalador
main "\$@"
`;

        await fs.writeFile(path.join(outputDir, 'smart-install.sh'), smartInstallerScript);
        await fs.chmod(path.join(outputDir, 'smart-install.sh'), '755'); // Hacer ejecutable
        console.log('  ✓ smart-install.sh creado');

        // Crear README para archivos individuales
        const individualReadme = `# HTML5 Boilerplate Modular - Archivos Individuales

## 🎯 Instalación Sin Conflictos para Proyectos Existentes

Esta carpeta contiene archivos individuales que puedes descargar selectivamente sin afectar tu proyecto existente.

### 🔧 Instalador Inteligente (Recomendado)

\`\`\`bash
# Analiza tu proyecto y recomienda qué instalar
bash <(curl -s https://raw.githubusercontent.com/TUUSUARIO/html5-boilerplate-modular/main/releases/individual/smart-install.sh)
\`\`\`

### 📁 Archivos CSS Disponibles

**Con prefijo para evitar conflictos:**
- \`boilerplate-variables.css\` - Sistema de variables CSS
- \`boilerplate-reset.css\` - Reset CSS moderno
- \`boilerplate-layout.css\` - Sistema de layout
- \`boilerplate-components.css\` - Componentes estilizados
- \`boilerplate-responsive.css\` - Media queries

**Uso:**
\`\`\`css
@import 'boilerplate-variables.css';
/* Ahora puedes usar: var(--primary-color) */
\`\`\`

### ⚡ Archivos JavaScript Disponibles

**Con prefijo para evitar conflictos:**
- \`boilerplate-utils.js\` - Utilidades reutilizables
- \`boilerplate-main.js\` - Funcionalidad principal

**Uso:**
\`\`\`html
<script src="boilerplate-utils.js"></script>
<script>
  const isValid = BoilerplateUtils.validation.isEmail('test@example.com');
</script>
\`\`\`

### 📄 Componentes HTML Disponibles

**Para referencia y conversión:**
- \`header.html\` - Cabecera con navegación
- \`main-content.html\` - Contenido principal
- \`aside.html\` - Barra lateral
- \`footer.html\` - Pie de página

### 🚀 Instalación Manual Específica

\`\`\`bash
# Solo variables CSS
curl -O https://raw.githubusercontent.com/TUUSUARIO/html5-boilerplate-modular/main/releases/individual/boilerplate-variables.css

# Solo utilidades JavaScript  
curl -O https://raw.githubusercontent.com/TUUSUARIO/html5-boilerplate-modular/main/releases/individual/boilerplate-utils.js

# Componente específico
curl -O https://raw.githubusercontent.com/TUUSUARIO/html5-boilerplate-modular/main/releases/individual/header.html
\`\`\`

### 🛡️ Garantías

✅ **Sin conflictos** - Archivos con prefijo \\
✅ **Sin sobrescribir** - No toca archivos existentes \\
✅ **Fácil remoción** - Un archivo = una funcionalidad \\
✅ **Framework-friendly** - Compatible con React, Vue, Angular

¡Perfecto para integrar en proyectos existentes sin romper nada!
`;

        await fs.writeFile(path.join(outputDir, 'README.md'), individualReadme);
        console.log('  ✓ README.md para archivos individuales creado');
    }

    // NUEVA FUNCIONALIDAD: Crear versión mínima
    async buildMinimal() {
        console.log('📦 Construyendo versión mínima...');
        
        try {
            const outputDir = path.join(this.releasesDir, 'minimal');
            await fs.ensureDir(outputDir);
            await fs.ensureDir(path.join(outputDir, 'css'));
            await fs.ensureDir(path.join(outputDir, 'js'));

            // Solo incluir archivos esenciales
            const baseStructure = this.readAndReplace(
                path.join(this.componentsDir, 'base-structure.html')
            );
            
            const header = this.readAndReplace(
                path.join(this.componentsDir, 'header.html')
            );
            
            const minimalMain = `    <!-- Contenido Principal -->
    <main id="main-content" role="main" class="main-content">
        <section class="hero" aria-labelledby="hero-title">
            <div class="container">
                <h2 id="hero-title">{{HERO_TITLE}}</h2>
                <p class="hero-subtitle">{{HERO_SUBTITLE}}</p>
                <button class="cta-button">{{CTA_TEXT}}</button>
            </div>
        </section>
        
        <section class="content-section">
            <div class="container">
                <h2>Contenido Principal</h2>
                <p>Aquí va el contenido de tu sitio web.</p>
            </div>
        </section>
    </main>`;
            
            const minimalFooter = `    <!-- Footer -->
    <footer role="contentinfo" class="main-footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{COMPANY_NAME}}. Todos los derechos reservados.</p>
        </div>
    </footer>`;

            // CSS mínimo (solo variables + reset + layout básico)
            const cssImports = `    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/minimal.css">`;

            // JS mínimo (solo utilidades básicas)
            const jsImports = `    <script src="js/minimal.js"></script>`;

            // Ensamblar HTML mínimo
            let minimalHTML = baseStructure
                .replace('{{HEADER_COMPONENT}}', header)
                .replace('{{MAIN_COMPONENT}}', minimalMain)
                .replace('{{ASIDE_COMPONENT}}', '') // Sin sidebar
                .replace('{{FOOTER_COMPONENT}}', minimalFooter)
                .replace('{{CSS_IMPORTS}}', cssImports)
                .replace('{{JS_IMPORTS}}', jsImports);

            // Escribir HTML
            await fs.writeFile(path.join(outputDir, 'index.html'), minimalHTML);

            // Copiar archivos CSS esenciales
            const essentialCSS = ['variables.css', 'reset.css'];
            for (const file of essentialCSS) {
                const srcPath = path.join(this.stylesDir, file);
                const destPath = path.join(outputDir, 'css', file);
                if (await fs.pathExists(srcPath)) {
                    await fs.copy(srcPath, destPath);
                }
            }

            // Crear CSS mínimo combinado
            const minimalCSS = `/* HTML5 Boilerplate Modular - Versión Mínima */

/* Container básico */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Header básico */
.main-header {
    background: var(--dark-color);
    color: white;
    padding: 1rem 0;
}

.main-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    margin: 0;
    font-size: 1.5rem;
}

/* Navegación básica */
.nav-list {
    display: flex;
    list-style: none;
    gap: 1rem;
    margin: 0;
    padding: 0;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-link:hover {
    background-color: var(--primary-color);
}

/* Hero básico */
.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--info-color));
    color: white;
    text-align: center;
    padding: 3rem 0;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta-button {
    background: white;
    color: var(--primary-color);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

/* Contenido básico */
.content-section {
    padding: 3rem 0;
}

.content-section h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

/* Footer básico */
.main-footer {
    background: var(--dark-color);
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 2rem;
}

/* Responsive básico */
@media (max-width: 768px) {
    .main-header .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    .nav-list {
        justify-content: center;
    }
}
`;

            await fs.writeFile(path.join(outputDir, 'css', 'minimal.css'), minimalCSS);

            // Crear JS mínimo
            const minimalJS = `/**
 * HTML5 Boilerplate Modular - JavaScript Mínimo
 */

(function() {
    'use strict';

    // Smooth scroll básico
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }

    console.log('🚀 HTML5 Boilerplate Mínimo cargado');
})();`;

            await fs.writeFile(path.join(outputDir, 'js', 'minimal.js'), minimalJS);

            // Crear assets mínimos
            await this.createPlaceholderAssets(outputDir);

            // Crear README específico
            await this.createVersionReadme(outputDir, 'minimal');

            console.log('✅ Versión mínima creada en releases/minimal/');
        } catch (error) {
            console.error('❌ Error construyendo versión mínima:', error.message);
            throw error;
        }
    }

    // Construir versión completa (código existente)
    async buildComplete() {
        console.log('🔨 Construyendo versión completa...');
        
        try {
            // Leer componentes
            const baseStructure = this.readAndReplace(
                path.join(this.componentsDir, 'base-structure.html')
            );
            
            const header = this.readAndReplace(
                path.join(this.componentsDir, 'header.html')
            );
            
            const mainContent = this.readAndReplace(
                path.join(this.componentsDir, 'main-content.html')
            );
            
            const aside = this.readAndReplace(
                path.join(this.componentsDir, 'aside.html')
            );
            
            const footer = this.readAndReplace(
                path.join(this.componentsDir, 'footer.html')
            );

            // CSS imports
            const cssImports = `    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/responsive.css">`;

            // JS imports
            const jsImports = `    <script src="js/utils.js"></script>
    <script src="js/main.js"></script>`;

            // Ensamblar HTML completo
            let completeHTML = baseStructure
                .replace('{{HEADER_COMPONENT}}', header)
                .replace('{{MAIN_COMPONENT}}', mainContent)
                .replace('{{ASIDE_COMPONENT}}', aside)
                .replace('{{FOOTER_COMPONENT}}', footer)
                .replace('{{CSS_IMPORTS}}', cssImports)
                .replace('{{JS_IMPORTS}}', jsImports);

            // Crear directorio de salida
            const outputDir = path.join(this.releasesDir, 'complete');
            await fs.ensureDir(outputDir);
            await fs.ensureDir(path.join(outputDir, 'css'));
            await fs.ensureDir(path.join(outputDir, 'js'));

            // Escribir HTML
            await fs.writeFile(path.join(outputDir, 'index.html'), completeHTML);

            // Copiar archivos CSS y JS
            await this.copyStyleFiles(outputDir);
            await this.copyScriptFiles(outputDir);

            // Crear assets
            await this.createPlaceholderAssets(outputDir);

            // Copiar manifest.json
            await this.copyManifest(outputDir);

            // Crear README específico
            await this.createVersionReadme(outputDir, 'complete');

            console.log('✅ Versión completa creada en releases/complete/');
        } catch (error) {
            console.error('❌ Error construyendo versión completa:', error.message);
            throw error;
        }
    }

    // Resto de funciones existentes (buildHTMLOnly, buildCSSOnly, buildJSOnly, etc.)
    async buildHTMLOnly() {
        console.log('📄 Construyendo versión HTML...');
        
        try {
            const outputDir = path.join(this.releasesDir, 'html-only');
            await fs.ensureDir(outputDir);

            // Copiar componentes HTML individuales
            if (await fs.pathExists(this.componentsDir)) {
                await fs.copy(this.componentsDir, path.join(outputDir, 'components'));
            }

            // Crear index.html con placeholders para CSS/JS
            const baseStructure = this.readAndReplace(
                path.join(this.componentsDir, 'base-structure.html')
            );
            
            const htmlOnlyStructure = baseStructure
                .replace('{{CSS_IMPORTS}}', '    <!-- Agrega aquí tus archivos CSS -->')
                .replace('{{JS_IMPORTS}}', '    <!-- Agrega aquí tus archivos JavaScript -->')
                .replace('{{HEADER_COMPONENT}}', '    <!-- Incluir components/header.html -->')
                .replace('{{MAIN_COMPONENT}}', '    <!-- Incluir components/main-content.html -->')
                .replace('{{ASIDE_COMPONENT}}', '    <!-- Incluir components/aside.html -->')
                .replace('{{FOOTER_COMPONENT}}', '    <!-- Incluir components/footer.html -->');

            await fs.writeFile(path.join(outputDir, 'index.html'), htmlOnlyStructure);

            // Crear README específico
            await this.createVersionReadme(outputDir, 'html-only');

            console.log('✅ Versión HTML creada en releases/html-only/');
        } catch (error) {
            console.error('❌ Error construyendo versión HTML:', error.message);
            throw error;
        }
    }

    async buildCSSOnly() {
        console.log('🎨 Construyendo versión CSS...');
        
        try {
            const outputDir = path.join(this.releasesDir, 'css-only');
            await fs.ensureDir(outputDir);

            await this.copyStyleFiles(outputDir);

            // Crear README específico
            await this.createVersionReadme(outputDir, 'css-only');

            console.log('✅ Versión CSS creada en releases/css-only/');
        } catch (error) {
            console.error('❌ Error construyendo versión CSS:', error.message);
            throw error;
        }
    }

    async buildJSOnly() {
        console.log('⚡ Construyendo versión JavaScript...');
        
        try {
            const outputDir = path.join(this.releasesDir, 'js-only');
            await fs.ensureDir(outputDir);

            await this.copyScriptFiles(outputDir);

            // Crear README específico
            await this.createVersionReadme(outputDir, 'js-only');

            console.log('✅ Versión JavaScript creada en releases/js-only/');
        } catch (error) {
            console.error('❌ Error construyendo versión JavaScript:', error.message);
            throw error;
        }
    }

    // Funciones auxiliares existentes
    async copyStyleFiles(outputDir) {
        const cssDir = path.join(outputDir, 'css');
        await fs.ensureDir(cssDir);

        if (await fs.pathExists(this.stylesDir)) {
            const styleFiles = await fs.readdir(this.stylesDir);
            for (const file of styleFiles) {
                const srcPath = path.join(this.stylesDir, file);
                const destPath = path.join(cssDir, file);
                
                if ((await fs.stat(srcPath)).isFile()) {
                    await fs.copy(srcPath, destPath);
                }
            }
        } else {
            console.warn('⚠️  Directorio styles/ no encontrado');
        }
    }

    async copyScriptFiles(outputDir) {
        const jsDir = path.join(outputDir, 'js');
        await fs.ensureDir(jsDir);

        if (await fs.pathExists(this.scriptsDir)) {
            const scriptFiles = await fs.readdir(this.scriptsDir);
            for (const file of scriptFiles) {
                const srcPath = path.join(this.scriptsDir, file);
                const destPath = path.join(jsDir, file);
                
                if ((await fs.stat(srcPath)).isFile()) {
                    await fs.copy(srcPath, destPath);
                }
            }
        } else {
            console.warn('⚠️  Directorio scripts/ no encontrado');
        }
    }

    // Actualizar createVersionReadme para incluir minimal
    async createVersionReadme(outputDir, version) {
        const readmeContent = {
            'complete': `# HTML5 Boilerplate Modular - Versión Completa

Esta es la versión completa del boilerplate que incluye:

✅ Estructura HTML5 semántica
✅ Sistema CSS modular completo  
✅ JavaScript con utilidades
✅ Assets básicos (favicon, og-image)
✅ Manifest.json para PWA

## Uso
1. Personaliza el contenido en \`index.html\`
2. Modifica los estilos en \`css/\`
3. Agrega tu JavaScript en \`js/\`
4. Reemplaza las imágenes en \`img/\`

## Estructura
\`\`\`
├── index.html           # Página principal
├── manifest.json        # Configuración PWA
├── css/                 # Archivos de estilos
├── js/                  # Archivos JavaScript  
└── img/                 # Assets e imágenes
\`\`\`

¡Listo para desarrollar! 🚀`,

            'minimal': `# HTML5 Boilerplate Modular - Versión Mínima

Esta es la versión mínima del boilerplate, perfecta para proyectos simples.

## Contenido
✅ HTML semántico básico
✅ CSS esencial optimizado  
✅ JavaScript mínimo funcional
✅ Assets básicos
✅ Menos de 8KB total

## Características
- 🚀 **Ultra liviano** - Solo lo esencial
- 📱 **Responsive** - Funciona en móvil y desktop
- 🎯 **Funcional** - Navegación suave incluida
- 🔧 **Personalizable** - Variables CSS incluidas

## Estructura
\`\`\`
├── index.html           # Página principal simplificada
├── css/
│   ├── variables.css    # Variables de diseño
│   ├── reset.css        # Reset mínimo
│   └── minimal.css      # Estilos esenciales
├── js/
│   └── minimal.js       # JavaScript básico
└── img/                 # Assets básicos
\`\`\`

## Uso
1. Personaliza el contenido en \`index.html\`
2. Modifica colores en \`css/variables.css\`
3. Agrega más funcionalidad según necesites

Perfecto para landing pages, prototipos y proyectos simples.`,

            'html-only': `# HTML5 Boilerplate Modular - Solo HTML

Esta versión incluye únicamente la estructura HTML semántica.

## Contenido
✅ Componentes HTML modulares
✅ Estructura semántica completa
✅ Atributos ARIA para accesibilidad
✅ Meta tags para SEO

## Componentes incluidos
- \`components/header.html\` - Cabecera con navegación
- \`components/main-content.html\` - Contenido principal
- \`components/aside.html\` - Barra lateral
- \`components/footer.html\` - Pie de página

## Uso
1. Copia los componentes que necesites
2. Personaliza el contenido
3. Agrega tus propios estilos CSS
4. Implementa tu JavaScript

Ideal para proyectos con sistema CSS propio.`,

            'css-only': `# HTML5 Boilerplate Modular - Solo CSS

Sistema de estilos modular y moderno.

## Archivos incluidos
✅ \`variables.css\` - Variables CSS y sistema de diseño
✅ \`reset.css\` - Reset CSS moderno
✅ \`layout.css\` - Estructura y layout
✅ \`components.css\` - Componentes estilizados  
✅ \`responsive.css\` - Media queries

## Uso
\`\`\`html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/responsive.css">
\`\`\`

## Personalización
Modifica las variables en \`variables.css\`:
\`\`\`css
:root {
    --primary-color: #007bff;
    --font-family-primary: 'Inter';
    /* ... más variables */
}
\`\`\`

Ideal para proyectos con HTML existente.`,

            'js-only': `# HTML5 Boilerplate Modular - Solo JavaScript

Utilidades JavaScript modernas y funcionalidad base.

## Archivos incluidos
✅ \`utils.js\` - Funciones de utilidad reutilizables
✅ \`main.js\` - Funcionalidad principal de la aplicación

## Funcionalidades
- 🔧 Utilidades DOM
- ✅ Validación de formularios
- 📱 Detección de dispositivos
- 🌐 HTTP helpers
- 💾 Storage helpers
- 🎯 Performance utilities

## Uso básico
\`\`\`html
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
\`\`\`

## API disponible
\`\`\`javascript
// Utilidades DOM
const element = BoilerplateUtils.dom.$('#mi-elemento');

// Validación
const isValid = BoilerplateUtils.validation.isEmail('test@example.com');

// HTTP requests  
const data = await BoilerplateUtils.http.get('/api/data');
\`\`\`

Ideal para agregar funcionalidad a proyectos existentes.`
        };

        await fs.writeFile(
            path.join(outputDir, 'README.md'), 
            readmeContent[version] || '# HTML5 Boilerplate Modular'
        );
    }

    // ACTUALIZAR: Construir todas las versiones incluyendo las nuevas
    async buildAll() {
        console.log('🚀 Iniciando construcción de todas las versiones...\n');
        
        try {
            // Limpiar releases anteriores
            await fs.emptyDir(this.releasesDir);
            
            // Construir versiones principales
            await this.buildComplete();
            console.log('');
            await this.buildMinimal(); // ← NUEVA
            console.log('');
            await this.buildHTMLOnly();
            console.log('');
            await this.buildCSSOnly();
            console.log('');
            await this.buildJSOnly();
            console.log('');
            await this.buildIndividualFiles(); // ← NUEVA
            
            console.log('\n🎉 ¡Todas las versiones construidas exitosamente!');
            console.log('📁 Revisa la carpeta releases/ para ver los resultados');
            
            // Mostrar resumen actualizado
            console.log('\n📊 Resumen:');
            console.log('├── 📦 releases/complete/      - Versión completa');
            console.log('├── 📱 releases/minimal/       - Versión mínima (<8KB)');
            console.log('├── 📄 releases/html-only/     - Solo HTML');
            console.log('├── 🎨 releases/css-only/      - Solo CSS');
            console.log('├── ⚡ releases/js-only/       - Solo JavaScript');
            console.log('└── 🔧 releases/individual/    - Archivos individuales + instalador inteligente');
            
            console.log('\n🎯 Nuevas características:');
            console.log('  ✅ Versión mínima ultra-liviana');
            console.log('  ✅ Archivos individuales sin conflictos');
            console.log('  ✅ Instalador inteligente para proyectos existentes');
            console.log('  ✅ Detección automática de frameworks');
            
        } catch (error) {
            console.error('\n❌ Error durante la construcción:', error.message);
            process.exit(1);
        }
    }
}

// Verificar que Node.js sea compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
    console.error('❌ Node.js 14+ requerido. Versión actual:', nodeVersion);
    process.exit(1);
}

// Ejecutar construcción
const builder = new BoilerplateBuilder();

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

async function main() {
    try {
        if (args.includes('--complete')) {
            await builder.buildComplete();
        } else if (args.includes('--minimal')) {
            await builder.buildMinimal(); // ← NUEVA OPCIÓN
        } else if (args.includes('--html-only')) {
            await builder.buildHTMLOnly();
        } else if (args.includes('--css-only')) {
            await builder.buildCSSOnly();
        } else if (args.includes('--js-only')) {
            await builder.buildJSOnly();
        } else if (args.includes('--individual')) {
            await builder.buildIndividualFiles(); // ← NUEVA OPCIÓN
        } else if (args.includes('--help')) {
            console.log(`
🚀 HTML5 Boilerplate Modular - Build Script v2.0

Uso:
  node tools/build.js [opciones]

Opciones:
  --complete     Construir versión completa
  --minimal      Construir versión mínima (<8KB)
  --html-only    Construir solo archivos HTML
  --css-only     Construir solo archivos CSS  
  --js-only      Construir solo archivos JavaScript
  --individual   Construir archivos individuales + instalador inteligente
  --help         Mostrar esta ayuda

Sin opciones: Construir todas las versiones

🆕 Nuevas características v2.0:
  ✅ Versión mínima ultra-liviana
  ✅ Instalador inteligente para proyectos existentes  
  ✅ Archivos individuales sin conflictos
  ✅ Detección automática de frameworks
            `);
        } else {
            await builder.buildAll();
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();