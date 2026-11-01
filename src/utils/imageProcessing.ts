import { FilterId } from '../types/strip';

const MAX_SOURCE_DIMENSION = 1800;
const PREVIEW_FILTER_MAX_DIMENSION = 960;

export class UnsupportedImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedImageError';
  }
}

export interface DecodedPhotoResult {
  canvas: HTMLCanvasElement;
  previewDataUrl: string;
}

function createDownscaledCanvas(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  maxDim: number,
  mirrorHorizontally = false
): HTMLCanvasElement {
  const scale = Math.min(1, maxDim / Math.max(srcWidth, srcHeight));
  const targetW = Math.max(1, Math.round(srcWidth * scale));
  const targetH = Math.max(1, Math.round(srcHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (mirrorHorizontally) {
    ctx.save();
    ctx.translate(targetW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(source, 0, 0, targetW, targetH);
    ctx.restore();
  } else {
    ctx.drawImage(source, 0, 0, targetW, targetH);
  }

  return canvas;
}

export function createThumbnailDataUrl(sourceCanvas: HTMLCanvasElement): string {
  const thumb = createDownscaledCanvas(
    sourceCanvas,
    sourceCanvas.width,
    sourceCanvas.height,
    200
  );
  return thumb.toDataURL('image/jpeg', 0.82);
}

/**
 * Decodes an uploaded image File with automatic EXIF orientation handling
 * and downscales oversized phone photos so mobile browsers stay fast and crash-free.
 */
export async function decodeImageFile(file: File): Promise<DecodedPhotoResult> {
  const lowerName = file.name.toLowerCase();
  const isLikelyHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    lowerName.endsWith('.heic') ||
    lowerName.endsWith('.heif');

  // Attempt 1: createImageBitmap with EXIF 'from-image' orientation
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      });
      const canvas = createDownscaledCanvas(
        bitmap,
        bitmap.width,
        bitmap.height,
        MAX_SOURCE_DIMENSION
      );
      bitmap.close();
      return {
        canvas,
        previewDataUrl: createThumbnailDataUrl(canvas),
      };
    } catch {
      // Fall through to HTMLImageElement decoder
    }
  }

  // Attempt 2: HTMLImageElement via Object URL (modern browsers also apply EXIF orientation)
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image element failed to decode'));
      el.src = objectUrl;
    });

    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;
    if (!naturalW || !naturalH) {
      throw new Error('Zero image dimensions');
    }

    const canvas = createDownscaledCanvas(img, naturalW, naturalH, MAX_SOURCE_DIMENSION);
    return {
      canvas,
      previewDataUrl: createThumbnailDataUrl(canvas),
    };
  } catch {
    if (isLikelyHeic) {
      throw new UnsupportedImageError(
        `We couldn't open "${file.name}" because this browser doesn't support HEIC/HEIF photos directly. Please choose a JPG, PNG, or WebP image (or take a live shot in Photo Booth Mode!).`
      );
    }
    throw new UnsupportedImageError(
      `We couldn't read "${file.name}". Please try a standard JPG, PNG, or WebP photo.`
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Captures a frame from a live <video> element into an offscreen canvas.
 */
export function captureVideoFrame(
  video: HTMLVideoElement,
  mirrorHorizontally: boolean
): DecodedPhotoResult {
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 960;
  const canvas = createDownscaledCanvas(
    video,
    vw,
    vh,
    MAX_SOURCE_DIMENSION,
    mirrorHorizontally
  );
  return {
    canvas,
    previewDataUrl: createThumbnailDataUrl(canvas),
  };
}

/**
 * Generates a cute kawaii pastel illustration directly on Canvas as a zero-broken-image fallback.
 */
export function createFallbackCuteIllustration(index: number): DecodedPhotoResult {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  const backdrops = [
    ['#FFE5F0', '#FFD1E6'],
    ['#EAE0FF', '#D5C6FF'],
    ['#FFF4CC', '#FFE4A3'],
    ['#DCF7EA', '#C2EED9'],
  ];
  const [c1, c2] = backdrops[index % backdrops.length];
  const grad = ctx.createLinearGradient(0, 0, 960, 720);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 960, 720);

  // Cute curtain stripes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  for (let x = 0; x < 960; x += 96) {
    ctx.fillRect(x, 0, 44, 720);
  }

  // Cute round kawaii character buddies
  const drawBuddy = (cx: number, cy: number, bodyColor: string, earType: 'bunny' | 'bear') => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = '#593A4E';
    ctx.lineWidth = 6;
    ctx.fillStyle = bodyColor;

    if (earType === 'bunny') {
      ctx.beginPath();
      ctx.ellipse(-45, -135, 26, 68, -0.14, 0, Math.PI * 2);
      ctx.ellipse(45, -135, 26, 68, 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(-72, -88, 36, 0, Math.PI * 2);
      ctx.arc(72, -88, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 108, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Blush
    ctx.fillStyle = '#FFA3C4';
    ctx.beginPath();
    ctx.ellipse(-54, 14, 18, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(54, 14, 18, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#4A2E40';
    ctx.beginPath();
    ctx.arc(-36, -12, 9, 0, Math.PI * 2);
    ctx.arc(36, -12, 9, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(0, 4, 22, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.restore();
  };

  drawBuddy(345, 420, '#FFFFFF', 'bunny');
  drawBuddy(615, 435, '#FFF5E4', 'bear');

  return {
    canvas,
    previewDataUrl: createThumbnailDataUrl(canvas),
  };
}

/**
 * Loads a bundled sample image URL onto an offscreen canvas with automatic procedural fallback.
 */
export async function loadSampleImageCanvas(
  url: string,
  fallbackIndex: number
): Promise<DecodedPhotoResult> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Sample load error'));
      el.src = url;
    });
    const canvas = createDownscaledCanvas(
      img,
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      MAX_SOURCE_DIMENSION
    );
    return {
      canvas,
      previewDataUrl: createThumbnailDataUrl(canvas),
    };
  } catch {
    return createFallbackCuteIllustration(fallbackIndex);
  }
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Applies one of the 7 aesthetic photo booth filters using cross-browser pixel & composite math
 * so filters look identical on iOS Safari, Android, and Desktop browsers.
 */
export function applyPhotoFilter(
  source: HTMLCanvasElement,
  filterId: FilterId,
  forFullExport = false
): HTMLCanvasElement {
  if (filterId === 'original') {
    return source;
  }

  const maxDim = forFullExport ? MAX_SOURCE_DIMENSION : PREVIEW_FILTER_MAX_DIMENSION;
  const work = createDownscaledCanvas(source, source.width, source.height, maxDim);
  const w = work.width;
  const h = work.height;
  const ctx = work.getContext('2d', { willReadFrequently: true });
  if (!ctx) return source;

  // For Dreamy Glow, capture a soft bilinear bloom pyramid before pixel grading
  let bloomCanvas: HTMLCanvasElement | null = null;
  if (filterId === 'dreamy') {
    const downW = Math.max(16, Math.round(w / 14));
    const downH = Math.max(16, Math.round(h / 14));
    const tiny = document.createElement('canvas');
    tiny.width = downW;
    tiny.height = downH;
    const tCtx = tiny.getContext('2d');
    if (tCtx) {
      tCtx.imageSmoothingEnabled = true;
      tCtx.imageSmoothingQuality = 'high';
      tCtx.drawImage(work, 0, 0, downW, downH);

      const mid = document.createElement('canvas');
      mid.width = Math.max(32, Math.round(w / 4));
      mid.height = Math.max(32, Math.round(h / 4));
      const mCtx = mid.getContext('2d');
      if (mCtx) {
        mCtx.imageSmoothingEnabled = true;
        mCtx.imageSmoothingQuality = 'high';
        mCtx.drawImage(tiny, 0, 0, mid.width, mid.height);
        bloomCanvas = mid;
      }
    }
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Deterministic pseudo-random seed for vintage film grain
  let seed = 1337;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    switch (filterId) {
      case 'soft-pink': {
        // Luminous rosy Korean photo booth tone
        r = r * 1.08 + 16;
        g = g * 1.01 + 8;
        b = b * 1.04 + 13;
        // Subtle soft contrast around midtone
        r = (r - 128) * 0.96 + 132;
        g = (g - 128) * 0.95 + 129;
        b = (b - 128) * 0.96 + 131;
        break;
      }

      case 'warm-film': {
        // Golden analog warmth with lifted matte shadows
        r = r * 1.1 + 14;
        g = g * 1.03 + 8;
        b = b * 0.91 + 4;
        // Matte shadow lift
        r = r * 0.94 + 10;
        g = g * 0.94 + 8;
        b = b * 0.94 + 6;
        break;
      }

      case 'bw': {
        // Flattering silver monochrome with gentle S-curve contrast
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const norm = lum / 255;
        const curved = norm < 0.5
          ? 2 * norm * norm * 0.35 + norm * 0.65
          : (1 - 2 * (1 - norm) * (1 - norm)) * 0.35 + norm * 0.65;
        const val = curved * 250 + 4;
        r = val;
        g = val;
        b = val;
        break;
      }

      case 'vintage-grain': {
        // Muted warm sepia-cream analog film + grain
        const avg = (r + g + b) / 3;
        r = r * 0.72 + avg * 0.28;
        g = g * 0.72 + avg * 0.28;
        b = b * 0.72 + avg * 0.28;

        r = r * 1.05 + 18;
        g = g * 0.99 + 12;
        b = b * 0.86 + 10;

        // Fast LCG film grain
        seed = (seed * 1664525 + 1013904223) | 0;
        const grain = ((seed >>> 24) - 128) * 0.16;
        r += grain;
        g += grain;
        b += grain;
        break;
      }

      case 'cool-blue': {
        // Crisp Haru-Film Korean cool studio cast
        r = r * 0.94 + 6;
        g = g * 1.01 + 10;
        b = b * 1.11 + 16;
        // Slight crisp contrast
        r = (r - 128) * 1.04 + 128;
        g = (g - 128) * 1.04 + 128;
        b = (b - 128) * 1.04 + 130;
        break;
      }

      case 'dreamy': {
        // Pastel lifted base before soft bloom overlay
        r = r * 1.04 + 14;
        g = g * 1.02 + 11;
        b = b * 1.05 + 16;
        break;
      }
    }

    data[i] = clampByte(r);
    data[i + 1] = clampByte(g);
    data[i + 2] = clampByte(b);
  }

  ctx.putImageData(imageData, 0, 0);

  // Extra composite touches for Vintage Vignette & Dreamy Soft Glow
  if (filterId === 'vintage-grain') {
    const rad = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.32,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.75
    );
    rad.addColorStop(0, 'rgba(0,0,0,0)');
    rad.addColorStop(1, 'rgba(58, 38, 28, 0.24)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);
  } else if (filterId === 'dreamy' && bloomCanvas) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.36;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bloomCanvas, 0, 0, w, h);
    ctx.restore();
  }

  return work;
}
