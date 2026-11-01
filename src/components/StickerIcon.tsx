import { useEffect, useRef } from 'react';
import { StickerKind } from '../types/strip';
import { drawStickerGraphic } from '../utils/stickers';

interface StickerIconProps {
  kind: StickerKind;
  size?: number;
}

export function StickerIcon({ kind, size = 44 }: StickerIconProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    drawStickerGraphic(ctx, kind, size * dpr * 0.78);
    ctx.restore();
  }, [kind, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
      className="pointer-events-none select-none"
    />
  );
}
