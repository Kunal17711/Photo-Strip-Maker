import { StickerKind } from '../types/strip';

export interface StickerCatalogItem {
  kind: StickerKind;
  label: string;
}

export const STICKER_CATALOG: StickerCatalogItem[] = [
  { kind: 'heart', label: 'Puffy Heart' },
  { kind: 'double-hearts', label: 'Twin Hearts' },
  { kind: 'bow', label: 'Satin Bow' },
  { kind: 'sparkles', label: 'Twinkles' },
  { kind: 'star', label: 'Pastel Star' },
  { kind: 'shooting-star', label: 'Shooting Star' },
  { kind: 'cherries', label: 'Cherries' },
  { kind: 'daisy', label: 'Daisy' },
  { kind: 'tulip', label: 'Tulip' },
  { kind: 'cloud', label: 'Fluffy Cloud' },
  { kind: 'smiley-blush', label: 'Happy Face' },
  { kind: 'smiley-wink', label: 'Star Wink' },
  { kind: 'bunny', label: 'Bunny Charm' },
  { kind: 'butterfly', label: 'Butterfly' },
  { kind: 'crown', label: 'Mini Crown' },
  { kind: 'love-letter', label: 'Love Note' },
];

/**
 * Draws a cute kawaii die-cut vector sticker centered at (0, 0) within a [-50, 50] coordinate box,
 * scaled to `size` pixels. Includes a crisp white sticker backing outline and subtle drop shadow.
 */
export function drawStickerGraphic(
  ctx: CanvasRenderingContext2D,
  kind: StickerKind,
  size: number
): void {
  const s = size / 100;
  ctx.save();
  ctx.scale(s, s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Soft die-cut sticker shadow
  ctx.shadowColor = 'rgba(65, 30, 55, 0.22)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  switch (kind) {
    case 'heart': {
      const heartPath = () => {
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.bezierCurveTo(-44, 6, -46, -32, -20, -34);
        ctx.bezierCurveTo(-7, -35, 0, -22, 0, -16);
        ctx.bezierCurveTo(0, -22, 7, -35, 20, -34);
        ctx.bezierCurveTo(46, -32, 44, 6, 0, 32);
        ctx.closePath();
      };
      heartPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 13;
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      heartPath();
      ctx.fillStyle = '#FF6FA5';
      ctx.fill();
      ctx.strokeStyle = '#D9437E';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Cute glossy highlight
      ctx.beginPath();
      ctx.ellipse(-17, -19, 7, 4, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fill();
      break;
    }

    case 'double-hearts': {
      const miniHeart = (cx: number, cy: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.9);
        ctx.bezierCurveTo(cx - r * 1.3, cy + r * 0.15, cx - r * 1.35, cy - r * 0.95, cx - r * 0.58, cy - r);
        ctx.bezierCurveTo(cx - r * 0.2, cy - r, cx, cy - r * 0.62, cx, cy - r * 0.45);
        ctx.bezierCurveTo(cx, cy - r * 0.62, cx + r * 0.2, cy - r, cx + r * 0.58, cy - r);
        ctx.bezierCurveTo(cx + r * 1.35, cy - r * 0.95, cx + r * 1.3, cy + r * 0.15, cx, cy + r * 0.9);
        ctx.closePath();
      };
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      miniHeart(-12, 8, 22);
      ctx.stroke();
      miniHeart(17, -14, 16);
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      miniHeart(-12, 8, 22);
      ctx.fillStyle = '#FF7EB3';
      ctx.fill();
      ctx.strokeStyle = '#D94882';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      miniHeart(17, -14, 16);
      ctx.fillStyle = '#FFB3D1';
      ctx.fill();
      ctx.strokeStyle = '#D94882';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      break;
    }

    case 'star': {
      const starPath = (outerR: number, innerR: number) => {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      };
      starPath(38, 19);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 13;
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      starPath(38, 19);
      ctx.fillStyle = '#FFE066';
      ctx.fill();
      ctx.strokeStyle = '#D99B26';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Cute kawaii eyes
      ctx.fillStyle = '#6B4812';
      ctx.beginPath();
      ctx.arc(-8, -2, 2.8, 0, Math.PI * 2);
      ctx.arc(8, -2, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 2, 4.5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#6B4812';
      ctx.lineWidth = 2.4;
      ctx.stroke();
      break;
    }

    case 'shooting-star': {
      // Rainbow pastel tail + star
      ctx.beginPath();
      ctx.moveTo(-38, 24);
      ctx.quadraticCurveTo(-12, 2, 14, -8);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 24;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      const colors = ['#FF9CEE', '#B5DEFF', '#FFF1A8'];
      colors.forEach((c, idx) => {
        const offset = (idx - 1) * 6;
        ctx.beginPath();
        ctx.moveTo(-36, 22 + offset);
        ctx.quadraticCurveTo(-12, 2 + offset, 14, -8 + offset * 0.6);
        ctx.strokeStyle = c;
        ctx.lineWidth = 6.5;
        ctx.stroke();
      });

      ctx.save();
      ctx.translate(16, -10);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 24 : 12;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.fillStyle = '#FFE46B';
      ctx.fill();
      ctx.strokeStyle = '#D99B26';
      ctx.lineWidth = 2.6;
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'sparkles': {
      const fourStar = (cx: number, cy: number, rx: number, ry: number) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy - ry);
        ctx.quadraticCurveTo(cx, cy, cx + rx, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + ry);
        ctx.quadraticCurveTo(cx, cy, cx - rx, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - ry);
        ctx.closePath();
      };
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 10;
      fourStar(-8, -4, 24, 30);
      ctx.stroke();
      fourStar(22, -20, 12, 15);
      ctx.stroke();
      fourStar(18, 22, 10, 13);
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      fourStar(-8, -4, 24, 30);
      ctx.fillStyle = '#FFE373';
      ctx.fill();
      ctx.strokeStyle = '#DF9A28';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      fourStar(22, -20, 12, 15);
      ctx.fillStyle = '#FF99C8';
      ctx.fill();
      ctx.strokeStyle = '#D95B96';
      ctx.lineWidth = 2;
      ctx.stroke();

      fourStar(18, 22, 10, 13);
      ctx.fillStyle = '#C9B6FF';
      ctx.fill();
      ctx.strokeStyle = '#8A6FD6';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    case 'bow': {
      const bowShape = () => {
        // Left loop
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.bezierCurveTo(-22, -32, -44, -22, -40, 2);
        ctx.bezierCurveTo(-36, 22, -16, 16, 0, 4);
        // Right loop
        ctx.bezierCurveTo(16, 16, 36, 22, 40, 2);
        ctx.bezierCurveTo(44, -22, 22, -32, 0, -4);
        ctx.closePath();
      };
      const ribbons = () => {
        ctx.beginPath();
        ctx.moveTo(-4, 4);
        ctx.quadraticCurveTo(-18, 24, -24, 38);
        ctx.lineTo(-10, 34);
        ctx.quadraticCurveTo(-5, 20, 0, 8);
        ctx.quadraticCurveTo(5, 20, 10, 34);
        ctx.lineTo(24, 38);
        ctx.quadraticCurveTo(18, 24, 4, 4);
        ctx.closePath();
      };

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ribbons();
      ctx.stroke();
      bowShape();
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      ribbons();
      ctx.fillStyle = '#FF85B3';
      ctx.fill();
      ctx.strokeStyle = '#D4467E';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      bowShape();
      ctx.fillStyle = '#FFA6C9';
      ctx.fill();
      ctx.strokeStyle = '#D4467E';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Center knot
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6FA5';
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'daisy': {
      const petals = 6;
      const drawFlower = () => {
        for (let i = 0; i < petals; i++) {
          const a = (Math.PI * 2 * i) / petals;
          const px = Math.cos(a) * 20;
          const py = Math.sin(a) * 20;
          ctx.beginPath();
          ctx.arc(px, py, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      };
      // White backing
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 11;
      for (let i = 0; i < petals; i++) {
        const a = (Math.PI * 2 * i) / petals;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 20, Math.sin(a) * 20, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      }
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = '#FFF7FB';
      ctx.strokeStyle = '#E08AB1';
      ctx.lineWidth = 2.6;
      drawFlower();

      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE066';
      ctx.fill();
      ctx.strokeStyle = '#D99B26';
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // Tiny smile
      ctx.fillStyle = '#6B4812';
      ctx.beginPath();
      ctx.arc(-5, -2, 2, 0, Math.PI * 2);
      ctx.arc(5, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 1, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#6B4812';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    case 'tulip': {
      const stem = () => {
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.lineTo(0, 36);
        ctx.moveTo(0, 28);
        ctx.quadraticCurveTo(-18, 22, -16, 10);
        ctx.quadraticCurveTo(-4, 14, 0, 28);
        ctx.moveTo(0, 28);
        ctx.quadraticCurveTo(18, 22, 16, 10);
        ctx.quadraticCurveTo(4, 14, 0, 28);
      };
      const head = () => {
        ctx.beginPath();
        ctx.moveTo(-20, -8);
        ctx.quadraticCurveTo(-22, -34, -8, -24);
        ctx.quadraticCurveTo(0, -38, 8, -24);
        ctx.quadraticCurveTo(22, -34, 20, -8);
        ctx.quadraticCurveTo(20, 10, 0, 10);
        ctx.quadraticCurveTo(-20, 10, -20, -8);
        ctx.closePath();
      };
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      stem();
      ctx.stroke();
      head();
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = '#5CB87A';
      ctx.fillStyle = '#8CE0A6';
      ctx.lineWidth = 4;
      stem();
      ctx.fill();
      ctx.stroke();

      head();
      ctx.fillStyle = '#FF8AB5';
      ctx.fill();
      ctx.strokeStyle = '#D4487E';
      ctx.lineWidth = 2.8;
      ctx.stroke();
      break;
    }

    case 'cloud': {
      const cloudPath = () => {
        ctx.beginPath();
        ctx.arc(-20, 6, 16, Math.PI * 0.5, Math.PI * 1.55);
        ctx.arc(-8, -10, 18, Math.PI * 1.05, Math.PI * 1.95);
        ctx.arc(14, -6, 16, Math.PI * 1.2, Math.PI * 2.1);
        ctx.arc(22, 8, 14, Math.PI * 1.6, Math.PI * 0.5);
        ctx.closePath();
      };
      cloudPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      cloudPath();
      ctx.fillStyle = '#EBF6FF';
      ctx.fill();
      ctx.strokeStyle = '#7DB8E8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Rosy cheeks + smile
      ctx.fillStyle = '#FFB3CC';
      ctx.beginPath();
      ctx.ellipse(-14, 6, 4.5, 2.8, 0, 0, Math.PI * 2);
      ctx.ellipse(14, 6, 4.5, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#365875';
      ctx.beginPath();
      ctx.arc(-8, 1, 2.4, 0, Math.PI * 2);
      ctx.arc(8, 1, 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 3, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#365875';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      break;
    }

    case 'cherries': {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(-16, 14);
      ctx.quadraticCurveTo(-10, -18, 4, -30);
      ctx.quadraticCurveTo(12, -14, 18, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-18, 20, 15, 0, Math.PI * 2);
      ctx.arc(18, 22, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      // Stems
      ctx.beginPath();
      ctx.moveTo(-16, 14);
      ctx.quadraticCurveTo(-10, -18, 4, -30);
      ctx.quadraticCurveTo(12, -14, 18, 16);
      ctx.strokeStyle = '#55A868';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.moveTo(4, -30);
      ctx.quadraticCurveTo(22, -34, 24, -20);
      ctx.quadraticCurveTo(10, -16, 4, -30);
      ctx.fillStyle = '#88D996';
      ctx.fill();
      ctx.strokeStyle = '#4B965C';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Berries
      for (const [cx, cy] of [
        [-18, 20],
        [18, 22],
      ]) {
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4D79';
        ctx.fill();
        ctx.strokeStyle = '#C42B52';
        ctx.lineWidth = 2.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx - 5, cy - 5, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fill();
      }
      break;
    }

    case 'smiley-blush': {
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF099';
      ctx.fill();
      ctx.strokeStyle = '#D49E2A';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cheeks
      ctx.fillStyle = '#FF9EBB';
      ctx.beginPath();
      ctx.ellipse(-18, 6, 6, 3.8, 0, 0, Math.PI * 2);
      ctx.ellipse(18, 6, 6, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & happy smile
      ctx.fillStyle = '#593E16';
      ctx.beginPath();
      ctx.arc(-11, -5, 3.2, 0, Math.PI * 2);
      ctx.arc(11, -5, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 2, 10, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#593E16';
      ctx.lineWidth = 3;
      ctx.stroke();
      break;
    }

    case 'smiley-wink': {
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD6EC';
      ctx.fill();
      ctx.strokeStyle = '#D6659B';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Left star eye
      ctx.save();
      ctx.translate(-12, -5);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 8 : 4;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = '#FFE066';
      ctx.fill();
      ctx.strokeStyle = '#B84A7E';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      // Right winking eye
      ctx.strokeStyle = '#6E2548';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(7, -8);
      ctx.lineTo(15, -4);
      ctx.lineTo(7, 0);
      ctx.stroke();

      // Smile
      ctx.beginPath();
      ctx.arc(0, 5, 9, 0.12 * Math.PI, 0.88 * Math.PI);
      ctx.stroke();
      break;
    }

    case 'bunny': {
      const bunnyPath = () => {
        // Ears + round head
        ctx.beginPath();
        ctx.ellipse(-13, -18, 8.5, 21, -0.12, 0, Math.PI * 2);
        ctx.ellipse(13, -18, 8.5, 21, 0.12, 0, Math.PI * 2);
        ctx.moveTo(28, 12);
        ctx.arc(0, 12, 28, 0, Math.PI * 2);
      };
      bunnyPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      // Ears
      for (const [ex, rot] of [
        [-13, -0.12],
        [13, 0.12],
      ]) {
        ctx.beginPath();
        ctx.ellipse(ex, -18, 8.5, 21, rot, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF9FC';
        ctx.fill();
        ctx.strokeStyle = '#C98AA8';
        ctx.lineWidth = 2.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(ex, -17, 4.2, 13, rot, 0, Math.PI * 2);
        ctx.fillStyle = '#FFC2DB';
        ctx.fill();
      }

      // Head
      ctx.beginPath();
      ctx.arc(0, 12, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF9FC';
      ctx.fill();
      ctx.strokeStyle = '#C98AA8';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Cheeks + face
      ctx.fillStyle = '#FFB5D2';
      ctx.beginPath();
      ctx.ellipse(-14, 15, 5, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(14, 15, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#523442';
      ctx.beginPath();
      ctx.arc(-9, 9, 2.6, 0, Math.PI * 2);
      ctx.arc(9, 9, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Tiny pink nose + w mouth
      ctx.fillStyle = '#FF7AA8';
      ctx.beginPath();
      ctx.arc(0, 13, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#523442';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-3, 16, 3, 0, Math.PI);
      ctx.arc(3, 16, 3, 0, Math.PI);
      ctx.stroke();
      break;
    }

    case 'butterfly': {
      const wings = () => {
        ctx.beginPath();
        ctx.ellipse(-18, -10, 19, 15, -0.35, 0, Math.PI * 2);
        ctx.ellipse(18, -10, 19, 15, 0.35, 0, Math.PI * 2);
        ctx.ellipse(-14, 14, 14, 12, 0.35, 0, Math.PI * 2);
        ctx.ellipse(14, 14, 14, 12, -0.35, 0, Math.PI * 2);
      };
      wings();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      for (const [wx, wy, rx, ry, rot, fill] of [
        [-14, 14, 14, 12, 0.35, '#E2C9FF'],
        [14, 14, 14, 12, -0.35, '#E2C9FF'],
        [-18, -10, 19, 15, -0.35, '#C4DCFF'],
        [18, -10, 19, 15, 0.35, '#C4DCFF'],
      ] as const) {
        ctx.beginPath();
        ctx.ellipse(wx, wy, rx, ry, rot, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = '#7C68B8';
        ctx.lineWidth = 2.6;
        ctx.stroke();
      }

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 2, 4.5, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#6E56A8';
      ctx.fill();
      break;
    }

    case 'crown': {
      const crownPath = () => {
        ctx.beginPath();
        ctx.moveTo(-30, 22);
        ctx.lineTo(-34, -14);
        ctx.lineTo(-14, 4);
        ctx.lineTo(0, -24);
        ctx.lineTo(14, 4);
        ctx.lineTo(34, -14);
        ctx.lineTo(30, 22);
        ctx.closePath();
      };
      crownPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      crownPath();
      ctx.fillStyle = '#FFE47A';
      ctx.fill();
      ctx.strokeStyle = '#D4952A';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pastel gems
      for (const [gx, gy, col] of [
        [-34, -16, '#FF80B5'],
        [0, -26, '#FF6FA5'],
        [34, -16, '#FF80B5'],
      ] as const) {
        ctx.beginPath();
        ctx.arc(gx, gy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      break;
    }

    case 'love-letter': {
      const env = () => {
        ctx.beginPath();
        ctx.roundRect(-34, -22, 68, 46, 8);
      };
      env();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      env();
      ctx.fillStyle = '#FFF5F9';
      ctx.fill();
      ctx.strokeStyle = '#D97BA6';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Flap
      ctx.beginPath();
      ctx.moveTo(-32, -20);
      ctx.lineTo(0, 6);
      ctx.lineTo(32, -20);
      ctx.strokeStyle = '#D97BA6';
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // Heart seal
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.bezierCurveTo(-13, 3, -14, -9, -6, -9);
      ctx.bezierCurveTo(-2, -9, 0, -5, 0, -3);
      ctx.bezierCurveTo(0, -5, 2, -9, 6, -9);
      ctx.bezierCurveTo(14, -9, 13, 3, 0, 12);
      ctx.closePath();
      ctx.fillStyle = '#FF699E';
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}
