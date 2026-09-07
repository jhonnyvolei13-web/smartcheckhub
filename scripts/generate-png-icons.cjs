const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function createPwaIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = size * 0.44; // rounded corner / circle bounds
  const safeScale = isMaskable ? 0.72 : 0.88;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Distance from center
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background color: deep industrial Microsoft Blue gradient (#0078D4 to #004578)
      const gradRatio = (x + y) / (size * 2);
      let r = Math.round(0 + (0 - 0) * gradRatio);
      let g = Math.round(120 - 51 * gradRatio);
      let b = Math.round(212 - 92 * gradRatio);
      let a = 255;

      if (!isMaskable) {
        // Squircle corner mask
        const cornerRadius = size * 0.22;
        const clampedX = Math.max(cornerRadius, Math.min(size - cornerRadius, x));
        const clampedY = Math.max(cornerRadius, Math.min(size - cornerRadius, y));
        const cdx = x - clampedX;
        const cdy = y - clampedY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist > cornerRadius) {
          a = 0;
        }
      }

      // If inside visible area
      if (a > 0) {
        // Draw industrial clipboard silhouette
        const clipW = size * 0.52 * safeScale;
        const clipH = size * 0.60 * safeScale;
        const clipTop = center - clipH * 0.45;
        const clipLeft = center - clipW / 2;

        if (
          x >= clipLeft &&
          x <= clipLeft + clipW &&
          y >= clipTop &&
          y <= clipTop + clipH
        ) {
          // Inner slate color
          r = 0;
          g = 45;
          b = 84;

          // Header tab on clipboard
          const tabW = clipW * 0.45;
          const tabH = size * 0.08 * safeScale;
          if (
            x >= center - tabW / 2 &&
            x <= center + tabW / 2 &&
            y >= clipTop - tabH * 0.4 &&
            y <= clipTop + tabH * 0.6
          ) {
            r = 75;
            g = 160;
            b = 234;
          }

          // Inner screen / checklist container
          const pad = size * 0.04 * safeScale;
          if (
            x >= clipLeft + pad &&
            x <= clipLeft + clipW - pad &&
            y >= clipTop + pad * 1.8 &&
            y <= clipTop + clipH - pad
          ) {
            r = 0;
            g = 59;
            b = 111;

            // Check badge circle in the lower portion
            const badgeY = clipTop + clipH * 0.62;
            const badgeR = size * 0.16 * safeScale;
            const bdx = x - center;
            const bdy = y - badgeY;
            const bdist = Math.sqrt(bdx * bdx + bdy * bdy);

            if (bdist <= badgeR) {
              // Emerald check green (#107C41)
              r = 16;
              g = 124;
              b = 65;

              // Outer green ring border
              if (bdist >= badgeR - (size * 0.015)) {
                r = 52;
                g = 211;
                b = 153;
              }

              // Checkmark geometry
              // Point 1: (-0.05, 0)
              // Point 2: (-0.01, 0.05)
              // Point 3: (0.06, -0.04)
              const nx = bdx / badgeR;
              const ny = bdy / badgeR;

              // Check line segment 1: from (-0.5, 0.0) to (-0.1, 0.4)
              // Check line segment 2: from (-0.1, 0.4) to (0.55, -0.35)
              const distToSeg1 = distToSegment(nx, ny, -0.5, -0.05, -0.1, 0.38);
              const distToSeg2 = distToSegment(nx, ny, -0.1, 0.38, 0.55, -0.38);
              const checkThick = 0.14;

              if (Math.min(distToSeg1, distToSeg2) < checkThick) {
                r = 255;
                g = 255;
                b = 255;
              }
            } else {
              // Checklist horizontal bars
              const line1Y = clipTop + clipH * 0.22;
              const line2Y = clipTop + clipH * 0.34;
              const lineThickness = size * 0.016 * safeScale;

              if (Math.abs(y - line1Y) < lineThickness && x >= clipLeft + pad * 1.6 && x <= clipLeft + clipW - pad * 1.6) {
                r = 153;
                g = 200;
                b = 245;
              }
              if (Math.abs(y - line2Y) < lineThickness && x >= clipLeft + pad * 1.6 && x <= clipLeft + clipW - pad * 2.8) {
                r = 153;
                g = 200;
                b = 245;
              }
            }
          }
        }
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return PNG.sync.write(png);
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);
  return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons in /public...');

// 1. 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPwaIcon(192, false));
console.log('Created pwa-192x192.png');

// 2. 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPwaIcon(512, false));
console.log('Created pwa-512x512.png');

// 3. 512x512 maskable
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPwaIcon(512, true));
console.log('Created pwa-maskable-512x512.png');

// 4. 180x180 apple-touch-icon
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPwaIcon(180, false));
console.log('Created apple-touch-icon.png');

// 5. favicon (use 192 as source buffer for favicon.ico / png fallback)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPwaIcon(64, false));
console.log('Created favicon.ico');

console.log('All icons generated successfully!');
