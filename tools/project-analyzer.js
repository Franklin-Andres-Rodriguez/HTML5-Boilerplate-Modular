// tools/project-analyzer.js
const fs = require('fs');

async function analyzeProject() {
    const analysis = {
        hasCSS: fs.existsSync('css'),
        hasJS: fs.existsSync('js'),
        hasHTML: fs.existsSync('index.html'),
        hasPackageJson: fs.existsSync('package.json'),
        hasGit: fs.existsSync('.git'),
        framework: detectFramework()
    };
    
    console.log('🔍 Análisis de tu proyecto:');
    console.log('CSS existente:', analysis.hasCSS ? '✅' : '❌');
    console.log('JS existente:', analysis.hasJS ? '✅' : '❌');
    console.log('Framework detectado:', analysis.framework);
    
    // Recomendar instalación específica
    if (analysis.framework === 'react') {
        console.log('💡 Recomendación: Solo CSS + utilidades JS');
    } else if (analysis.hasCSS && analysis.hasJS) {
        console.log('💡 Recomendación: Solo componentes HTML');
    }
    
    return analysis;
}
