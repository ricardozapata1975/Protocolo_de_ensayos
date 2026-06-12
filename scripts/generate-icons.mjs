// Genera los íconos PWA a partir del logo SVG (svg/logo_px.svg)
import sharp from 'sharp';
import { mkdirSync } from 'fs';

const SRC = 'svg/logo_px.svg';
const OUT = 'public';
mkdirSync(OUT, { recursive: true });

// El logo es celeste con detalles blancos: fondo blanco para buen contraste.
// "scale" deja margen alrededor (zona segura para íconos maskable).
async function makeIcon(size, scale, file) {
  const logoSize = Math.round(size * scale);
  const logo = await sharp(SRC, { density: 300 })
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(`${OUT}/${file}`);

  console.log(`OK ${file}`);
}

await makeIcon(192, 0.85, 'pwa-192x192.png');
await makeIcon(512, 0.85, 'pwa-512x512.png');
await makeIcon(512, 0.65, 'pwa-maskable-512x512.png');
await makeIcon(180, 0.85, 'apple-touch-icon.png');
await makeIcon(64, 0.9, 'favicon-64x64.png');
