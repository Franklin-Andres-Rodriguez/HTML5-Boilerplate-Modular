const fs = require('fs-extra');
const path = require('path');

class AssetsCreator {
    constructor() {
        this.imgDir = path.join(__dirname, '..', 'img');
    }

    async createAllAssets() {
        console.log('🎨 Creando assets profesionales...');
        
        await fs.ensureDir(this.imgDir);
        
        await this.createFavicon();
        await this.createOGImage();
        await this.createAppleTouchIcon();
        await this.createManifestIcon();
        
        console.log('✅ Todos los assets creados exitosamente');
    }

    async createFavicon() {
        const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007bff"/>
      <stop offset="100%" style="stop-color:#0056b3"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#grad)"/>
  <text x="16" y="12" font-family="Arial" font-size="8" font-weight="bold" fill="white" text-anchor="middle">H5</text>
  <rect x="6" y="18" width="20" height="2" rx="1" fill="white" opacity="0.8"/>
  <circle cx="10" cy="25" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="16" cy="25" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="22" cy="25" r="1.5" fill="white" opacity="0.6"/>
</svg>`;
        
        await fs.writeFile(path.join(this.imgDir, 'favicon.svg'), faviconSvg);
        console.log('  ✓ favicon.svg creado');
    }

    async createOGImage() {
        const ogImageSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007bff"/>
      <stop offset="50%" style="stop-color:#0056b3"/>
      <stop offset="100%" style="stop-color:#004085"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="100" cy="100" r="60" fill="white" opacity="0.1"/>
  <circle cx="1100" cy="530" r="80" fill="white" opacity="0.05"/>
  <text x="600" y="275" font-family="Arial" font-size="72" font-weight="bold" fill="white" text-anchor="middle">HTML5 Boilerplate</text>
  <text x="600" y="335" font-family="Arial" font-size="36" fill="white" opacity="0.9" text-anchor="middle">Modular</text>
  <text x="600" y="385" font-family="Arial" font-size="24" fill="white" opacity="0.8" text-anchor="middle">Semantic • Responsive • Modern</text>
</svg>`;
        
        await fs.writeFile(path.join(this.imgDir, 'og-image.svg'), ogImageSvg);
        console.log('  ✓ og-image.svg creado');
    }

    async createAppleTouchIcon() {
        const appleTouchIconSvg = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007bff"/>
      <stop offset="100%" style="stop-color:#004085"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="20" fill="url(#iconGrad)"/>
  <text x="90" y="70" font-family="Arial" font-size="28" font-weight="bold" fill="white" text-anchor="middle">HTML5</text>
  <rect x="50" y="90" width="80" height="3" rx="1.5" fill="white" opacity="0.8"/>
  <rect x="60" y="98" width="60" height="2" rx="1" fill="white" opacity="0.6"/>
  <circle cx="65" cy="115" r="3" fill="white" opacity="0.7"/>
  <circle cx="90" cy="115" r="4" fill="white" opacity="0.9"/>
  <circle cx="115" cy="115" r="3" fill="white" opacity="0.7"/>
  <text x="90" y="135" font-family="Arial" font-size="12" fill="white" opacity="0.8" text-anchor="middle">MODULAR</text>
</svg>`;
        
        await fs.writeFile(path.join(this.imgDir, 'apple-touch-icon.svg'), appleTouchIconSvg);
        console.log('  ✓ apple-touch-icon.svg creado');
    }

    async createManifestIcon() {
        const manifestIconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="manifestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007bff"/>
      <stop offset="100%" style="stop-color:#004085"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="56" fill="url(#manifestGrad)"/>
  <text x="256" y="200" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">HTML5</text>
  <rect x="140" y="260" width="232" height="8" rx="4" fill="white" opacity="0.8"/>
  <rect x="170" y="285" width="172" height="6" rx="3" fill="white" opacity="0.6"/>
  <circle cx="190" cy="330" r="8" fill="white" opacity="0.7"/>
  <circle cx="256" cy="330" r="10" fill="white" opacity="0.9"/>
  <circle cx="322" cy="330" r="8" fill="white" opacity="0.7"/>
  <text x="256" y="385" font-family="Arial" font-size="32" fill="white" opacity="0.8" text-anchor="middle">MODULAR</text>
</svg>`;
        
        await fs.writeFile(path.join(this.imgDir, 'icon-512.svg'), manifestIconSvg);
        console.log('  ✓ icon-512.svg creado');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const creator = new AssetsCreator();
    creator.createAllAssets().catch(console.error);
}

module.exports = AssetsCreator;
