import samplePose1 from '../assets/images/sample_booth_pose_1_1793552126400.jpg';
import samplePose2 from '../assets/images/sample_booth_pose_2_1793552127823.jpg';
import samplePose3 from '../assets/images/sample_booth_pose_3_1793552129654.jpg';
import samplePose4 from '../assets/images/sample_booth_pose_4_1793552130721.jpg';
import {
  FilterSpec,
  FontStyleSpec,
  FrameRect,
  LayoutGeometry,
  LayoutId,
  LayoutSpec,
  PlacedSticker,
  ThemeId,
  ThemeSpec,
} from '../types/strip';

export const SAMPLE_IMAGE_URLS: string[] = [
  samplePose1,
  samplePose2,
  samplePose3,
  samplePose4,
];

export const SITE_URL = (
  import.meta.env.NEXT_PUBLIC_SITE_URL ||
  import.meta.env.VITE_SITE_URL ||
  'https://photo-strip-maker.vercel.app'
).replace(/\/+$/, '');

export const WATERMARK_TEXT = 'websitebykunalbuilds.vercel.app';

export const LAYOUTS: LayoutSpec[] = [
  {
    id: 'classic-4',
    name: 'Classic 4-Cut Strip',
    shortLabel: '4-Strip',
    description: '1200 × 3600 px vertical booth strip',
    frameCount: 4,
    exportWidth: 1200,
    exportHeight: 3600,
  },
  {
    id: 'strip-3',
    name: '3-Frame Strip',
    shortLabel: '3-Strip',
    description: '1200 × 2850 px compact vertical strip',
    frameCount: 3,
    exportWidth: 1200,
    exportHeight: 2850,
  },
  {
    id: 'grid-2x2',
    name: '2×2 Booth Grid',
    shortLabel: '2×2 Grid',
    description: '1800 × 2250 px aesthetic 4-card print',
    frameCount: 4,
    exportWidth: 1800,
    exportHeight: 2250,
  },
  {
    id: 'polaroid-1',
    name: 'Polaroid Frame',
    shortLabel: 'Polaroid',
    description: '1500 × 1860 px single instant photo',
    frameCount: 1,
    exportWidth: 1500,
    exportHeight: 1860,
  },
];

export function getLayoutSpec(id: LayoutId): LayoutSpec {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

export function getLayoutGeometry(
  layoutId: LayoutId,
  targetWidth: number,
  targetHeight: number
): LayoutGeometry {
  const spec = getLayoutSpec(layoutId);
  const scaleX = targetWidth / spec.exportWidth;
  const scaleY = targetHeight / spec.exportHeight;
  const s = Math.min(scaleX, scaleY);

  const frames: FrameRect[] = [];

  if (layoutId === 'classic-4') {
    const padX = 84 * s;
    const padTop = 88 * s;
    const footerH = 332 * s;
    const gap = 36 * s;
    const frameW = targetWidth - padX * 2;
    const availableH = targetHeight - padTop - footerH;
    const frameH = (availableH - gap * 3) / 4;
    const radius = 24 * s;

    for (let i = 0; i < 4; i++) {
      frames.push({
        index: i,
        x: padX,
        y: padTop + i * (frameH + gap),
        width: frameW,
        height: frameH,
        radius,
      });
    }

    const footerStart = targetHeight - footerH;
    return {
      width: targetWidth,
      height: targetHeight,
      outerRadius: 36 * s,
      frames,
      captionY: footerStart + 102 * s,
      captionFontSize: 54 * s,
      dateY: footerStart + 178 * s,
      dateFontSize: 30 * s,
      watermarkY: targetHeight - 54 * s,
      watermarkFontSize: 22 * s,
      baseStickerSize: 136 * s,
    };
  }

  if (layoutId === 'strip-3') {
    const padX = 84 * s;
    const padTop = 88 * s;
    const footerH = 332 * s;
    const gap = 39 * s;
    const frameW = targetWidth - padX * 2;
    const availableH = targetHeight - padTop - footerH;
    const frameH = (availableH - gap * 2) / 3;
    const radius = 24 * s;

    for (let i = 0; i < 3; i++) {
      frames.push({
        index: i,
        x: padX,
        y: padTop + i * (frameH + gap),
        width: frameW,
        height: frameH,
        radius,
      });
    }

    const footerStart = targetHeight - footerH;
    return {
      width: targetWidth,
      height: targetHeight,
      outerRadius: 36 * s,
      frames,
      captionY: footerStart + 102 * s,
      captionFontSize: 54 * s,
      dateY: footerStart + 178 * s,
      dateFontSize: 30 * s,
      watermarkY: targetHeight - 54 * s,
      watermarkFontSize: 22 * s,
      baseStickerSize: 136 * s,
    };
  }

  if (layoutId === 'grid-2x2') {
    const padX = 96 * s;
    const padTop = 96 * s;
    const footerH = 364 * s;
    const gap = 44 * s;
    const frameW = (targetWidth - padX * 2 - gap) / 2;
    const availableH = targetHeight - padTop - footerH;
    const frameH = (availableH - gap) / 2;
    const radius = 28 * s;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const index = row * 2 + col;
        frames.push({
          index,
          x: padX + col * (frameW + gap),
          y: padTop + row * (frameH + gap),
          width: frameW,
          height: frameH,
          radius,
        });
      }
    }

    const footerStart = targetHeight - footerH;
    return {
      width: targetWidth,
      height: targetHeight,
      outerRadius: 42 * s,
      frames,
      captionY: footerStart + 116 * s,
      captionFontSize: 64 * s,
      dateY: footerStart + 198 * s,
      dateFontSize: 34 * s,
      watermarkY: targetHeight - 62 * s,
      watermarkFontSize: 24 * s,
      baseStickerSize: 164 * s,
    };
  }

  // polaroid-1
  const padX = 96 * s;
  const padTop = 96 * s;
  const frameSize = targetWidth - padX * 2;
  frames.push({
    index: 0,
    x: padX,
    y: padTop,
    width: frameSize,
    height: frameSize,
    radius: 22 * s,
  });

  const footerStart = padTop + frameSize;
  return {
    width: targetWidth,
    height: targetHeight,
    outerRadius: 38 * s,
    frames,
    captionY: footerStart + 158 * s,
    captionFontSize: 68 * s,
    dateY: footerStart + 246 * s,
    dateFontSize: 34 * s,
    watermarkY: targetHeight - 64 * s,
    watermarkFontSize: 24 * s,
    baseStickerSize: 160 * s,
  };
}

export const THEMES: ThemeSpec[] = [
  {
    id: 'pink',
    name: 'Blush Pink',
    fillType: 'solid',
    bgPrimary: '#FFD8E8',
    frameInnerBg: '#FFF5F9',
    frameBorderColor: 'rgba(181, 72, 120, 0.14)',
    textColor: '#692746',
    mutedTextColor: 'rgba(105, 39, 70, 0.62)',
    swatchPreview: '#FFD8E8',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    fillType: 'solid',
    bgPrimary: '#E6DAFC',
    frameInnerBg: '#F8F5FF',
    frameBorderColor: 'rgba(98, 68, 158, 0.14)',
    textColor: '#3E2B63',
    mutedTextColor: 'rgba(62, 43, 99, 0.62)',
    swatchPreview: '#E6DAFC',
  },
  {
    id: 'butter',
    name: 'Butter Yellow',
    fillType: 'solid',
    bgPrimary: '#FFF1B8',
    frameInnerBg: '#FFFDF2',
    frameBorderColor: 'rgba(156, 118, 28, 0.15)',
    textColor: '#5E4614',
    mutedTextColor: 'rgba(94, 70, 20, 0.62)',
    swatchPreview: '#FFF1B8',
  },
  {
    id: 'mint',
    name: 'Mint Matcha',
    fillType: 'solid',
    bgPrimary: '#D2F4E3',
    frameInnerBg: '#F4FCF8',
    frameBorderColor: 'rgba(42, 128, 90, 0.14)',
    textColor: '#1E4F3A',
    mutedTextColor: 'rgba(30, 79, 58, 0.62)',
    swatchPreview: '#D2F4E3',
  },
  {
    id: 'peach',
    name: 'Sweet Peach',
    fillType: 'solid',
    bgPrimary: '#FFE0CC',
    frameInnerBg: '#FFF8F3',
    frameBorderColor: 'rgba(168, 86, 42, 0.14)',
    textColor: '#663419',
    mutedTextColor: 'rgba(102, 52, 25, 0.62)',
    swatchPreview: '#FFE0CC',
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    fillType: 'solid',
    bgPrimary: '#D4EEFF',
    frameInnerBg: '#F4FAFF',
    frameBorderColor: 'rgba(42, 108, 158, 0.14)',
    textColor: '#1C4463',
    mutedTextColor: 'rgba(28, 68, 99, 0.62)',
    swatchPreview: '#D4EEFF',
  },
  {
    id: 'cream',
    name: 'Warm Cream',
    fillType: 'solid',
    bgPrimary: '#FAF3E8',
    frameInnerBg: '#FFFFFF',
    frameBorderColor: 'rgba(120, 98, 74, 0.15)',
    textColor: '#4A3D31',
    mutedTextColor: 'rgba(74, 61, 49, 0.6)',
    swatchPreview: '#FAF3E8',
  },
  {
    id: 'white',
    name: 'Studio White',
    fillType: 'solid',
    bgPrimary: '#FFFFFF',
    frameInnerBg: '#F8F4F7',
    frameBorderColor: 'rgba(60, 40, 55, 0.12)',
    textColor: '#2B2029',
    mutedTextColor: 'rgba(43, 32, 41, 0.56)',
    swatchPreview: '#FFFFFF',
  },
  {
    id: 'black',
    name: 'Midnight Booth',
    fillType: 'solid',
    bgPrimary: '#19171C',
    frameInnerBg: '#27242C',
    frameBorderColor: 'rgba(255, 255, 255, 0.12)',
    textColor: '#FBF7FA',
    mutedTextColor: 'rgba(251, 247, 250, 0.58)',
    swatchPreview: '#19171C',
  },
  {
    id: 'gradient-candy',
    name: 'Cotton Candy',
    fillType: 'gradient',
    bgPrimary: '#FFD6E8',
    bgSecondary: '#E7D8FF',
    bgTertiary: '#D4F0FF',
    frameInnerBg: '#FFF9FC',
    frameBorderColor: 'rgba(130, 80, 150, 0.14)',
    textColor: '#4A2B5E',
    mutedTextColor: 'rgba(74, 43, 94, 0.62)',
    swatchPreview: 'linear-gradient(135deg, #FFD6E8 0%, #E7D8FF 50%, #D4F0FF 100%)',
  },
  {
    id: 'gradient-sorbet',
    name: 'Peach Sorbet',
    fillType: 'gradient',
    bgPrimary: '#FFF0BD',
    bgSecondary: '#FFD6DF',
    bgTertiary: '#EAD8FF',
    frameInnerBg: '#FFFAF7',
    frameBorderColor: 'rgba(155, 85, 110, 0.14)',
    textColor: '#5C2C45',
    mutedTextColor: 'rgba(92, 44, 69, 0.62)',
    swatchPreview: 'linear-gradient(135deg, #FFF0BD 0%, #FFD6DF 52%, #EAD8FF 100%)',
  },
  {
    id: 'checkered',
    name: 'Pink Gingham',
    fillType: 'checkered',
    bgPrimary: '#FFF2F7',
    bgSecondary: '#FFC9DF',
    frameInnerBg: '#FFFFFF',
    frameBorderColor: 'rgba(180, 68, 115, 0.18)',
    textColor: '#612240',
    mutedTextColor: 'rgba(97, 34, 64, 0.68)',
    swatchPreview:
      'repeating-conic-gradient(#FFC9DF 0% 25%, #FFF2F7 0% 50%) 50% / 14px 14px',
  },
];

export function getThemeSpec(id: ThemeId): ThemeSpec {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export const FILTERS: FilterSpec[] = [
  {
    id: 'original',
    name: 'Original',
    tagline: 'True natural colors',
    previewGradient: 'linear-gradient(135deg, #FFE4EE 0%, #E2EEFF 100%)',
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    tagline: 'Rosy Korean booth blush',
    previewGradient: 'linear-gradient(135deg, #FFC8DD 0%, #FFE5EC 100%)',
  },
  {
    id: 'warm-film',
    name: 'Warm Film',
    tagline: 'Golden analog sunshine',
    previewGradient: 'linear-gradient(135deg, #FFE0B2 0%, #FFCCBC 100%)',
  },
  {
    id: 'bw',
    name: 'Black & White',
    tagline: 'Classic silver monochrome',
    previewGradient: 'linear-gradient(135deg, #4A4A4F 0%, #D8D8DE 100%)',
  },
  {
    id: 'vintage-grain',
    name: 'Vintage Grain',
    tagline: 'Nostalgic 90s film texture',
    previewGradient: 'linear-gradient(135deg, #E6CCB2 0%, #D5BDAF 100%)',
  },
  {
    id: 'cool-blue',
    name: 'Cool Blue',
    tagline: 'Crisp Haru studio tone',
    previewGradient: 'linear-gradient(135deg, #BDE0FE 0%, #E2F1FF 100%)',
  },
  {
    id: 'dreamy',
    name: 'Dreamy Glow',
    tagline: 'Soft pastel angel bloom',
    previewGradient: 'linear-gradient(135deg, #F8D8FF 0%, #FFE6F2 50%, #FFF7D6 100%)',
  },
];

export const FONT_STYLES: FontStyleSpec[] = [
  {
    id: 'bubble',
    name: 'Bubble Cute',
    sampleText: 'us <3',
    canvasFontFamily: '"Fredoka", ui-rounded, sans-serif',
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacingRatio: 0.01,
  },
  {
    id: 'diary',
    name: 'Soft Diary',
    sampleText: 'my day',
    canvasFontFamily: '"Nunito", ui-sans-serif, sans-serif',
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacingRatio: 0.02,
  },
  {
    id: 'retro',
    name: 'Retro Booth',
    sampleText: '2026.11',
    canvasFontFamily: '"Space Mono", ui-monospace, monospace',
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacingRatio: 0.04,
  },
];

export const CAPTION_SUGGESTIONS = [
  'besties <3',
  'us <3',
  'my day',
  'sweet memories',
  'core memory',
  'xoxo',
];

export const TEXT_COLOR_OVERRIDES = [
  { id: 'auto', label: 'Theme Match', value: '' },
  { id: 'berry', label: 'Rose Berry', value: '#8F2456' },
  { id: 'plum', label: 'Deep Plum', value: '#2D1F2D' },
  { id: 'cocoa', label: 'Warm Cocoa', value: '#523A28' },
  { id: 'cream', label: 'Soft Cream', value: '#FFF9FC' },
];

export function formatDefaultDateStamp(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

export interface SamplePreset {
  themeId: ThemeId;
  caption: string;
  stickers: PlacedSticker[];
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    themeId: 'pink',
    caption: 'besties <3',
    stickers: [
      { id: 'sample-st-1', kind: 'bow', x: 0.11, y: 0.035, scale: 1.05, rotation: -12 },
      { id: 'sample-st-2', kind: 'sparkles', x: 0.89, y: 0.24, scale: 0.95, rotation: 8 },
      { id: 'sample-st-3', kind: 'cherries', x: 0.11, y: 0.67, scale: 1.0, rotation: -8 },
      { id: 'sample-st-4', kind: 'double-hearts', x: 0.88, y: 0.88, scale: 1.0, rotation: 10 },
    ],
  },
  {
    themeId: 'checkered',
    caption: 'us <3',
    stickers: [
      { id: 'sample-st-5', kind: 'daisy', x: 0.88, y: 0.04, scale: 1.05, rotation: 14 },
      { id: 'sample-st-6', kind: 'heart', x: 0.12, y: 0.46, scale: 0.95, rotation: -14 },
      { id: 'sample-st-7', kind: 'star', x: 0.89, y: 0.68, scale: 1.0, rotation: 12 },
      { id: 'sample-st-8', kind: 'bunny', x: 0.14, y: 0.9, scale: 1.05, rotation: -6 },
    ],
  },
  {
    themeId: 'lavender',
    caption: 'core memory',
    stickers: [
      { id: 'sample-st-9', kind: 'cloud', x: 0.13, y: 0.04, scale: 1.05, rotation: -6 },
      { id: 'sample-st-10', kind: 'shooting-star', x: 0.87, y: 0.25, scale: 1.05, rotation: 8 },
      { id: 'sample-st-11', kind: 'butterfly', x: 0.12, y: 0.68, scale: 1.0, rotation: -12 },
      { id: 'sample-st-12', kind: 'smiley-blush', x: 0.87, y: 0.89, scale: 0.98, rotation: 10 },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How do I make a photo strip online?',
    answer:
      'Pick 1 to 4 photos from your phone or computer gallery, or tap Photo Booth Mode to snap 4 automatic shots with a 3-2-1 countdown. Choose your layout, pastel frame color, filter, cute stickers, and optional caption, then tap Download PNG.',
  },
  {
    question: 'Is Photo Strip Maker completely free?',
    answer:
      'Yes! Every layout, pastel theme, filter, font, and sticker is 100% free to use with no account, no sign-up, and unlimited high-resolution downloads.',
  },
  {
    question: 'Are my photos uploaded anywhere?',
    answer:
      'No, never. Photo Strip Maker runs entirely inside your web browser using the HTML5 Canvas API. Your camera feed and gallery photos stay strictly on your own device and are never transmitted to any server.',
  },
  {
    question: 'Can I use my phone or laptop camera like a real Korean photo booth?',
    answer:
      'Yes! Tap Photo Booth Mode to open a mirrored front-camera preview. Hit Start Booth and strike 4 poses with an automatic 3-2-1 countdown and soft flash between shots.',
  },
  {
    question: 'What size and quality is the downloaded image?',
    answer:
      'Downloads are saved as crisp, print-ready PNG files. Classic 4-frame vertical strips export at 1200 × 3600 px, 3-frame strips at 1200 × 2850 px, 2×2 grids at 1800 × 2250 px, and Polaroid frames at 1500 × 1860 px.',
  },
  {
    question: 'Can I crop, zoom, or swap photos after adding them?',
    answer:
      'Absolutely. Drag any photo directly inside its frame to reposition it, use the zoom slider (or pinch on touchscreens) to zoom in, and tap Swap Frames to trade any two photos in two taps.',
  },
];
