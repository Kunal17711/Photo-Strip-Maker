import {
  FONT_STYLES,
  getLayoutGeometry,
  getThemeSpec,
  WATERMARK_TEXT,
} from '../data/presets';
import {
  FontStyleId,
  FrameRect,
  LayoutId,
  PhotoSlot,
  PlacedSticker,
  ThemeId,
} from '../types/strip';
import { drawStickerGraphic } from './stickers';

export interface RenderStripOptions {
  layoutId: LayoutId;
  themeId: ThemeId;
  photos: PhotoSlot[];
  filteredCanvases: (HTMLCanvasElement | null)[];
  stickers: PlacedSticker[];
  caption: string;
  showDateStamp: boolean;
  dateText: string;
  fontStyleId: FontStyleId;
  textColorOverride: string;
  isExport: boolean;
  selectedFrameIndex?: number | null;
  swapSourceIndex?: number | null;
  selectedStickerId?: string | null;
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
}

function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  themeId: ThemeId,
  width: number,
  height: number
): void {
  const theme = getThemeSpec(themeId);

  if (theme.fillType === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, theme.bgPrimary);
    grad.addColorStop(0.5, theme.bgSecondary || theme.bgPrimary);
    grad.addColorStop(1, theme.bgTertiary || theme.bgPrimary);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (theme.fillType === 'checkered') {
    ctx.fillStyle = theme.bgPrimary;
    ctx.fillRect(0, 0, width, height);

    const tile = Math.max(12, Math.round(width / 20));
    ctx.fillStyle = theme.bgSecondary || '#FFC9DF';
    for (let y = 0; y < height; y += tile) {
      const row = Math.floor(y / tile);
      for (let x = 0; x < width; x += tile) {
        const col = Math.floor(x / tile);
        if ((row + col) % 2 === 1) {
          ctx.fillRect(x, y, tile, tile);
        }
      }
    }
    return;
  }

  ctx.fillStyle = theme.bgPrimary;
  ctx.fillRect(0, 0, width, height);
}

function drawCoverPhotoInFrame(
  ctx: CanvasRenderingContext2D,
  imgCanvas: HTMLCanvasElement,
  slot: PhotoSlot,
  frame: FrameRect
): void {
  const imgW = imgCanvas.width;
  const imgH = imgCanvas.height;
  if (!imgW || !imgH) return;

  const zoom = Math.max(1, Math.min(3, slot.zoom || 1));
  const baseScale = Math.max(frame.width / imgW, frame.height / imgH);
  const drawW = imgW * baseScale * zoom;
  const drawH = imgH * baseScale * zoom;

  const maxPanX = Math.max(0, (drawW - frame.width) / 2);
  const maxPanY = Math.max(0, (drawH - frame.height) / 2);

  const clampedX = Math.max(-1, Math.min(1, slot.offsetX || 0));
  const clampedY = Math.max(-1, Math.min(1, slot.offsetY || 0));

  const drawX = frame.x + (frame.width - drawW) / 2 + clampedX * maxPanX;
  const drawY = frame.y + (frame.height - drawH) / 2 + clampedY * maxPanY;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imgCanvas, drawX, drawY, drawW, drawH);
}

function drawEmptySlotPlaceholder(
  ctx: CanvasRenderingContext2D,
  frame: FrameRect,
  innerBg: string,
  textColor: string,
  isExport: boolean
): void {
  ctx.fillStyle = innerBg;
  ctx.fillRect(frame.x, frame.y, frame.width, frame.height);

  const cx = frame.x + frame.width / 2;
  const cy = frame.y + frame.height / 2;
  const iconR = Math.min(frame.width, frame.height) * 0.1;

  ctx.save();
  ctx.translate(cx, cy - (isExport ? 0 : iconR * 0.45));
  ctx.beginPath();
  ctx.moveTo(0, iconR * 0.65);
  ctx.bezierCurveTo(
    -iconR * 0.95,
    iconR * 0.1,
    -iconR,
    -iconR * 0.7,
    -iconR * 0.42,
    -iconR * 0.72
  );
  ctx.bezierCurveTo(-iconR * 0.15, -iconR * 0.72, 0, -iconR * 0.45, 0, -iconR * 0.3);
  ctx.bezierCurveTo(0, -iconR * 0.45, iconR * 0.15, -iconR * 0.72, iconR * 0.42, -iconR * 0.72);
  ctx.bezierCurveTo(iconR, -iconR * 0.7, iconR * 0.95, iconR * 0.1, 0, iconR * 0.65);
  ctx.closePath();
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.22;
  ctx.fill();
  ctx.restore();

  if (!isExport) {
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.56;
    const labelSize = Math.max(11, Math.round(frame.height * 0.065));
    ctx.font = `600 ${labelSize}px "Nunito", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Frame ${frame.index + 1} · Tap to add photo`, cx, cy + iconR * 0.85);
    ctx.restore();
  }
}

export function renderPhotoStrip(
  canvas: HTMLCanvasElement,
  options: RenderStripOptions
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const geometry = getLayoutGeometry(options.layoutId, width, height);
  const theme = getThemeSpec(options.themeId);
  const fontSpec =
    FONT_STYLES.find((f) => f.id === options.fontStyleId) || FONT_STYLES[0];

  ctx.clearRect(0, 0, width, height);

  // 1. Frame background
  drawThemeBackground(ctx, options.themeId, width, height);

  // 2. Photo frames
  for (const frame of geometry.frames) {
    const slot = options.photos[frame.index];
    const filteredImg = options.filteredCanvases[frame.index];

    ctx.save();
    drawRoundedRectPath(ctx, frame.x, frame.y, frame.width, frame.height, frame.radius);
    ctx.clip();

    if (slot && filteredImg) {
      ctx.fillStyle = theme.frameInnerBg;
      ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
      drawCoverPhotoInFrame(ctx, filteredImg, slot, frame);
    } else {
      drawEmptySlotPlaceholder(
        ctx,
        frame,
        theme.frameInnerBg,
        theme.textColor,
        options.isExport
      );
    }
    ctx.restore();

    // Subtle hairline border around each photo window
    ctx.save();
    drawRoundedRectPath(ctx, frame.x, frame.y, frame.width, frame.height, frame.radius);
    ctx.strokeStyle = theme.frameBorderColor;
    ctx.lineWidth = Math.max(1.5, width * 0.0022);
    ctx.stroke();
    ctx.restore();

    // Preview-only selection / swap highlight
    if (!options.isExport) {
      const isSwapSource = options.swapSourceIndex === frame.index;
      const isSelectedFrame = options.selectedFrameIndex === frame.index;

      if (isSwapSource || isSelectedFrame) {
        ctx.save();
        drawRoundedRectPath(
          ctx,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          frame.radius
        );
        ctx.strokeStyle = isSwapSource ? '#E14D8A' : 'rgba(225, 77, 138, 0.72)';
        ctx.lineWidth = Math.max(2.5, width * 0.005);
        if (isSwapSource) {
          ctx.setLineDash([width * 0.018, width * 0.012]);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // 3. Caption & Date Stamp
  const primaryTextCol = options.textColorOverride || theme.textColor;
  const trimmedCaption = options.caption.trim();
  const hasDate = options.showDateStamp && options.dateText.trim().length > 0;

  if (trimmedCaption) {
    ctx.save();
    ctx.fillStyle = primaryTextCol;
    const capY = hasDate
      ? geometry.captionY
      : (geometry.captionY + geometry.dateY) * 0.5;
    ctx.font = `${fontSpec.fontStyle} ${fontSpec.fontWeight} ${Math.round(
      geometry.captionFontSize
    )}px ${fontSpec.canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(trimmedCaption, width / 2, capY, width * 0.84);
    ctx.restore();
  }

  if (hasDate) {
    ctx.save();
    ctx.fillStyle = primaryTextCol;
    ctx.globalAlpha = 0.78;
    const dateY = trimmedCaption
      ? geometry.dateY
      : (geometry.captionY + geometry.dateY) * 0.5;
    ctx.font = `600 ${Math.round(geometry.dateFontSize)}px ${fontSpec.canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.dateText.trim(), width / 2, dateY, width * 0.84);
    ctx.restore();
  }

  // 4. Placed Stickers
  for (const sticker of options.stickers) {
    const sx = sticker.x * width;
    const sy = sticker.y * height;
    const stickerPx = geometry.baseStickerSize * sticker.scale;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    drawStickerGraphic(ctx, sticker.kind, stickerPx);

    if (!options.isExport && options.selectedStickerId === sticker.id) {
      ctx.beginPath();
      ctx.arc(0, 0, stickerPx * 0.56, 0, Math.PI * 2);
      ctx.strokeStyle = '#E14D8A';
      ctx.lineWidth = Math.max(2, width * 0.004);
      ctx.setLineDash([width * 0.015, width * 0.01]);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Tasteful Soft Watermark at the bottom margin (never touches photos)
  ctx.save();
  ctx.fillStyle = theme.mutedTextColor;
  ctx.font = `600 ${Math.max(9, Math.round(geometry.watermarkFontSize))}px "Nunito", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(WATERMARK_TEXT, width / 2, geometry.watermarkY);
  ctx.restore();
}
