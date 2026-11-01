import { Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { getLayoutGeometry, getLayoutSpec } from '../data/presets';
import {
  FontStyleId,
  LayoutId,
  PhotoSlot,
  PlacedSticker,
  ThemeId,
} from '../types/strip';
import { renderPhotoStrip } from '../utils/canvasRenderer';

interface StripPreviewCanvasProps {
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
  selectedFrameIndex: number | null;
  swapMode: boolean;
  swapSourceIndex: number | null;
  selectedStickerId: string | null;
  onSelectFrame: (index: number) => void;
  onEmptyFrameTap: (index: number) => void;
  onUpdatePhotoTransform: (
    index: number,
    updates: Partial<Pick<PhotoSlot, 'zoom' | 'offsetX' | 'offsetY'>>
  ) => void;
  onSelectSticker: (id: string | null) => void;
  onUpdateSticker: (
    id: string,
    updates: Partial<Pick<PlacedSticker, 'x' | 'y' | 'scale' | 'rotation'>>
  ) => void;
  onDeleteSticker: (id: string) => void;
}

type DragInteraction =
  | {
      type: 'sticker';
      stickerId: string;
      startClientX: number;
      startClientY: number;
      initialX: number;
      initialY: number;
    }
  | {
      type: 'frame';
      frameIndex: number;
      startClientX: number;
      startClientY: number;
      initialOffsetX: number;
      initialOffsetY: number;
      maxPanX: number;
      maxPanY: number;
      moved: boolean;
      isEmpty: boolean;
    };

export function StripPreviewCanvas({
  layoutId,
  themeId,
  photos,
  filteredCanvases,
  stickers,
  caption,
  showDateStamp,
  dateText,
  fontStyleId,
  textColorOverride,
  selectedFrameIndex,
  swapMode,
  swapSourceIndex,
  selectedStickerId,
  onSelectFrame,
  onEmptyFrameTap,
  onUpdatePhotoTransform,
  onSelectSticker,
  onUpdateSticker,
  onDeleteSticker,
}: StripPreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<DragInteraction | null>(null);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{
    initialDistance: number;
    targetType: 'sticker' | 'frame';
    stickerId?: string;
    frameIndex?: number;
    initialScale: number;
  } | null>(null);

  const spec = getLayoutSpec(layoutId);
  // Render crisp preview at ~0.48x export resolution (fast 60fps & sharp on retina)
  const previewScale = layoutId === 'classic-4' ? 0.45 : 0.44;
  const canvasWidth = Math.round(spec.exportWidth * previewScale);
  const canvasHeight = Math.round(spec.exportHeight * previewScale);

  const scheduleDraw = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      renderPhotoStrip(canvas, {
        layoutId,
        themeId,
        photos,
        filteredCanvases,
        stickers,
        caption,
        showDateStamp,
        dateText,
        fontStyleId,
        textColorOverride,
        isExport: false,
        selectedFrameIndex,
        swapSourceIndex: swapMode ? swapSourceIndex : null,
        selectedStickerId,
      });
    });
  }, [
    layoutId,
    themeId,
    photos,
    filteredCanvases,
    stickers,
    caption,
    showDateStamp,
    dateText,
    fontStyleId,
    textColorOverride,
    selectedFrameIndex,
    swapMode,
    swapSourceIndex,
    selectedStickerId,
  ]);

  useEffect(() => {
    scheduleDraw();
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scheduleDraw]);

  // Redraw once custom Google Fonts finish loading so canvas text uses exact glyphs
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        scheduleDraw();
      });
    }
  }, [scheduleDraw]);

  const clientToCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { cx: 0, cy: 0, rectWidth: 1, rectHeight: 1 };
    const rect = canvas.getBoundingClientRect();
    const cx = ((clientX - rect.left) / Math.max(1, rect.width)) * canvas.width;
    const cy = ((clientY - rect.top) / Math.max(1, rect.height)) * canvas.height;
    return { cx, cy, rectWidth: rect.width, rectHeight: rect.height };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const geometry = getLayoutGeometry(layoutId, canvas.width, canvas.height);

    // Check 2-finger pinch gesture
    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      dragRef.current = null;

      if (selectedStickerId) {
        const st = stickers.find((s) => s.id === selectedStickerId);
        if (st && dist > 10) {
          pinchRef.current = {
            initialDistance: dist,
            targetType: 'sticker',
            stickerId: st.id,
            initialScale: st.scale,
          };
          return;
        }
      }

      const activeFrame = selectedFrameIndex ?? 0;
      const slot = photos[activeFrame];
      if (slot && slot.sourceCanvas && dist > 10) {
        pinchRef.current = {
          initialDistance: dist,
          targetType: 'frame',
          frameIndex: activeFrame,
          initialScale: slot.zoom,
        };
      }
      return;
    }

    const { cx, cy } = clientToCanvasCoords(e.clientX, e.clientY);

    // 1. Hit-test stickers from top-most to bottom-most (unless in swap frames mode)
    if (!swapMode) {
      for (let i = stickers.length - 1; i >= 0; i--) {
        const st = stickers[i];
        const sx = st.x * canvas.width;
        const sy = st.y * canvas.height;
        const hitRadius = Math.max(24, geometry.baseStickerSize * st.scale * 0.56);
        if (Math.hypot(cx - sx, cy - sy) <= hitRadius) {
          onSelectSticker(st.id);
          dragRef.current = {
            type: 'sticker',
            stickerId: st.id,
            startClientX: e.clientX,
            startClientY: e.clientY,
            initialX: st.x,
            initialY: st.y,
          };
          return;
        }
      }
    }

    // Clicked outside any sticker -> deselect sticker
    if (selectedStickerId) {
      onSelectSticker(null);
    }

    // 2. Hit-test photo frames
    for (const frame of geometry.frames) {
      if (
        cx >= frame.x &&
        cx <= frame.x + frame.width &&
        cy >= frame.y &&
        cy <= frame.y + frame.height
      ) {
        if (swapMode) {
          onSelectFrame(frame.index);
          return;
        }

        const slot = photos[frame.index];
        const img = slot?.sourceCanvas;
        onSelectFrame(frame.index);

        let maxPanX = 0;
        let maxPanY = 0;
        if (slot && img) {
          const zoom = Math.max(1, Math.min(3, slot.zoom || 1));
          const baseScale = Math.max(frame.width / img.width, frame.height / img.height);
          const drawW = img.width * baseScale * zoom;
          const drawH = img.height * baseScale * zoom;
          maxPanX = Math.max(0, (drawW - frame.width) / 2);
          maxPanY = Math.max(0, (drawH - frame.height) / 2);
        }

        dragRef.current = {
          type: 'frame',
          frameIndex: frame.index,
          startClientX: e.clientX,
          startClientY: e.clientY,
          initialOffsetX: slot?.offsetX || 0,
          initialOffsetY: slot?.offsetY || 0,
          maxPanX,
          maxPanY,
          moved: false,
          isEmpty: !img,
        };
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Handle 2-finger pinch resize
    if (activePointersRef.current.size === 2 && pinchRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const ratio = dist / Math.max(10, pinchRef.current.initialDistance);

      if (pinchRef.current.targetType === 'sticker' && pinchRef.current.stickerId) {
        const nextScale = Math.max(
          0.5,
          Math.min(2.4, Number((pinchRef.current.initialScale * ratio).toFixed(2)))
        );
        onUpdateSticker(pinchRef.current.stickerId, { scale: nextScale });
      } else if (
        pinchRef.current.targetType === 'frame' &&
        pinchRef.current.frameIndex !== undefined
      ) {
        const nextZoom = Math.max(
          1,
          Math.min(3, Number((pinchRef.current.initialScale * ratio).toFixed(2)))
        );
        onUpdatePhotoTransform(pinchRef.current.frameIndex, { zoom: nextZoom });
      }
      return;
    }

    const drag = dragRef.current;
    if (!drag) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dxClient = e.clientX - drag.startClientX;
    const dyClient = e.clientY - drag.startClientY;

    if (drag.type === 'sticker') {
      const nx = Math.max(0.04, Math.min(0.96, drag.initialX + dxClient / rect.width));
      const ny = Math.max(0.03, Math.min(0.96, drag.initialY + dyClient / rect.height));
      onUpdateSticker(drag.stickerId, { x: nx, y: ny });
      return;
    }

    if (drag.type === 'frame') {
      if (Math.hypot(dxClient, dyClient) > 5) {
        drag.moved = true;
      }
      if (drag.isEmpty) return;

      const scaleToCanvasX = canvas.width / rect.width;
      const scaleToCanvasY = canvas.height / rect.height;
      const dxCanvas = dxClient * scaleToCanvasX;
      const dyCanvas = dyClient * scaleToCanvasY;

      const nextOffsetX =
        drag.maxPanX > 0.5
          ? Math.max(-1, Math.min(1, drag.initialOffsetX + dxCanvas / drag.maxPanX))
          : 0;
      const nextOffsetY =
        drag.maxPanY > 0.5
          ? Math.max(-1, Math.min(1, drag.initialOffsetY + dyCanvas / drag.maxPanY))
          : 0;

      onUpdatePhotoTransform(drag.frameIndex, {
        offsetX: nextOffsetX,
        offsetY: nextOffsetY,
      });
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    const drag = dragRef.current;
    if (drag && drag.type === 'frame' && drag.isEmpty && !drag.moved && !swapMode) {
      onEmptyFrameTap(drag.frameIndex);
    }
    if (activePointersRef.current.size === 0) {
      dragRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!selectedStickerId) return;
    const st = stickers.find((s) => s.id === selectedStickerId);
    if (!st) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDeleteSticker(st.id);
      return;
    }
    const step = e.shiftKey ? 0.04 : 0.015;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onUpdateSticker(st.id, { x: Math.max(0.04, st.x - step) });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onUpdateSticker(st.id, { x: Math.min(0.96, st.x + step) });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onUpdateSticker(st.id, { y: Math.max(0.03, st.y - step) });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onUpdateSticker(st.id, { y: Math.min(0.96, st.y + step) });
    }
  };

  const activeSticker = selectedStickerId
    ? stickers.find((s) => s.id === selectedStickerId)
    : null;

  // Height limits keep the entire strip comfortably visible on mobile & desktop screens
  const maxHeightClass =
    layoutId === 'classic-4'
      ? 'max-h-[430px] sm:max-h-[540px] lg:max-h-[630px]'
      : layoutId === 'strip-3'
      ? 'max-h-[410px] sm:max-h-[510px] lg:max-h-[590px]'
      : 'max-h-[380px] sm:max-h-[460px] lg:max-h-[520px]';

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          tabIndex={0}
          role="img"
          aria-label={`Live photo booth preview in ${spec.name} layout. Drag photos to crop or drag stickers to reposition.`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onKeyDown={handleKeyDown}
          style={{ aspectRatio: `${spec.exportWidth} / ${spec.exportHeight}` }}
          className={`w-auto max-w-full ${maxHeightClass} cursor-grab touch-none rounded-[18px] shadow-[0_18px_42px_-12px_rgba(92,40,73,0.28)] ring-1 ring-black/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E14D8A] active:cursor-grabbing`}
        />

        {/* Quick floating delete button when a sticker is actively selected */}
        {activeSticker && (
          <button
            type="button"
            onClick={() => onDeleteSticker(activeSticker.id)}
            aria-label="Delete selected sticker"
            className="btn-bounce absolute -top-3 -right-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#2D1F2D] text-white shadow-lg hover:bg-[#D63376] focus-visible:outline-2 focus-visible:outline-[#E14D8A]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
