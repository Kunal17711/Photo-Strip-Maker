import {
  ArrowLeftRight,
  Camera,
  Check,
  Copy,
  ImagePlus,
  LayoutGrid,
  Lock,
  Palette,
  RotateCcw,
  Sparkles,
  Sticker,
  Trash2,
  Type,
  Upload,
  Wand2,
} from 'lucide-react';
import React from 'react';
import {
  CAPTION_SUGGESTIONS,
  FILTERS,
  FONT_STYLES,
  formatDefaultDateStamp,
  getLayoutSpec,
  LAYOUTS,
  TEXT_COLOR_OVERRIDES,
  THEMES,
} from '../data/presets';
import {
  FilterId,
  FontStyleId,
  LayoutId,
  PhotoSlot,
  PlacedSticker,
  StickerKind,
  ThemeId,
  ToolTabId,
} from '../types/strip';
import { STICKER_CATALOG } from '../utils/stickers';
import { StickerIcon } from './StickerIcon';

interface StudioControlsProps {
  activeTab: ToolTabId;
  onTabChange: (tab: ToolTabId) => void;
  layoutId: LayoutId;
  onLayoutChange: (id: LayoutId) => void;
  themeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  filterId: FilterId;
  onFilterChange: (id: FilterId) => void;
  photos: PhotoSlot[];
  selectedFrameIndex: number;
  onSelectFrame: (index: number) => void;
  swapMode: boolean;
  swapSourceIndex: number | null;
  onToggleSwapMode: () => void;
  onOpenCamera: () => void;
  onTriggerMultiUpload: () => void;
  onTriggerSingleSlotUpload: (index: number) => void;
  onUpdatePhotoTransform: (
    index: number,
    updates: Partial<Pick<PhotoSlot, 'zoom' | 'offsetX' | 'offsetY'>>
  ) => void;
  onClearPhotoSlot: (index: number) => void;
  stickers: PlacedSticker[];
  selectedStickerId: string | null;
  onAddSticker: (kind: StickerKind) => void;
  onSelectSticker: (id: string | null) => void;
  onUpdateSticker: (
    id: string,
    updates: Partial<Pick<PlacedSticker, 'scale' | 'rotation'>>
  ) => void;
  onDuplicateSticker: (id: string) => void;
  onDeleteSticker: (id: string) => void;
  onClearAllStickers: () => void;
  caption: string;
  onCaptionChange: (value: string) => void;
  showDateStamp: boolean;
  onShowDateStampChange: (show: boolean) => void;
  dateText: string;
  onDateTextChange: (value: string) => void;
  fontStyleId: FontStyleId;
  onFontStyleChange: (id: FontStyleId) => void;
  textColorOverride: string;
  onTextColorOverrideChange: (value: string) => void;
}

const TABS: { id: ToolTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'photos', label: 'Photos', icon: ImagePlus },
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'filters', label: 'Filters', icon: Wand2 },
  { id: 'stickers', label: 'Stickers', icon: Sticker },
  { id: 'text', label: 'Text', icon: Type },
];

function LayoutDiagram({ id }: { id: LayoutId }) {
  if (id === 'classic-4') {
    return (
      <div className="flex h-12 w-6 flex-col gap-0.5 rounded bg-pink-200/80 p-1">
        <span className="flex-1 rounded-[2px] bg-white" />
        <span className="flex-1 rounded-[2px] bg-white" />
        <span className="flex-1 rounded-[2px] bg-white" />
        <span className="flex-1 rounded-[2px] bg-white" />
      </div>
    );
  }
  if (id === 'strip-3') {
    return (
      <div className="flex h-11 w-6 flex-col gap-0.5 rounded bg-purple-200/80 p-1">
        <span className="flex-1 rounded-[2px] bg-white" />
        <span className="flex-1 rounded-[2px] bg-white" />
        <span className="flex-1 rounded-[2px] bg-white" />
      </div>
    );
  }
  if (id === 'grid-2x2') {
    return (
      <div className="grid h-11 w-9 grid-cols-2 gap-0.5 rounded bg-amber-200/80 p-1 pb-2">
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-white" />
      </div>
    );
  }
  return (
    <div className="flex h-11 w-9 flex-col rounded bg-sky-200/80 p-1 pb-2.5">
      <span className="flex-1 rounded-[2px] bg-white" />
    </div>
  );
}

export function StudioControls({
  activeTab,
  onTabChange,
  layoutId,
  onLayoutChange,
  themeId,
  onThemeChange,
  filterId,
  onFilterChange,
  photos,
  selectedFrameIndex,
  onSelectFrame,
  swapMode,
  swapSourceIndex,
  onToggleSwapMode,
  onOpenCamera,
  onTriggerMultiUpload,
  onTriggerSingleSlotUpload,
  onUpdatePhotoTransform,
  onClearPhotoSlot,
  stickers,
  selectedStickerId,
  onAddSticker,
  onSelectSticker,
  onUpdateSticker,
  onDuplicateSticker,
  onDeleteSticker,
  onClearAllStickers,
  caption,
  onCaptionChange,
  showDateStamp,
  onShowDateStampChange,
  dateText,
  onDateTextChange,
  fontStyleId,
  onFontStyleChange,
  textColorOverride,
  onTextColorOverrideChange,
}: StudioControlsProps) {
  const layoutSpec = getLayoutSpec(layoutId);
  const clampedFrameIndex = Math.min(selectedFrameIndex, layoutSpec.frameCount - 1);
  const currentSlot = photos[clampedFrameIndex];
  const selectedSticker = selectedStickerId
    ? stickers.find((s) => s.id === selectedStickerId) || null
    : null;

  return (
    <div className="flex flex-col rounded-[28px] bg-white p-4 shadow-[0_14px_38px_-14px_rgba(160,95,135,0.18)] sm:p-6">
      {/* 6-Tab Interactive Bar */}
      <div
        role="tablist"
        aria-label="Photo strip customization tools"
        className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-[#FDF4F8] p-1.5"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`btn-bounce flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#E14D8A] sm:text-sm whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-[#C92A6A] shadow-sm'
                  : 'text-[#6E5A6E] hover:bg-white/60 hover:text-[#2D1F2D]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool Panel */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-5"
      >
        {/* 1. PHOTOS PANEL */}
        {activeTab === 'photos' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onOpenCamera}
                className="btn-bounce flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl bg-[#E14D8A] px-4 py-3 text-sm font-bold text-white shadow-md shadow-pink-500/20 hover:bg-[#CE3B78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] whitespace-nowrap"
              >
                <Camera className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <span>Photo Booth Mode</span>
              </button>

              <button
                type="button"
                onClick={onTriggerMultiUpload}
                className="btn-bounce flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl border-2 border-pink-200 bg-pink-50/70 px-4 py-3 text-sm font-bold text-[#8A2250] hover:border-pink-300 hover:bg-pink-100/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] whitespace-nowrap"
              >
                <Upload className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <span>Upload 1–4 Photos</span>
              </button>
            </div>

            {/* Required Visible Privacy Reassurance */}
            <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#6E5A6E] sm:justify-start">
              <Lock className="h-3.5 w-3.5 shrink-0 text-[#C92A6A]" aria-hidden="true" />
              <span>Your photos never leave your phone. Nothing is uploaded.</span>
            </p>

            {/* Frame Slots & Tap-to-Swap */}
            <div className="border-t border-pink-100 pt-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading text-sm font-semibold text-[#2D1F2D]">
                  Frames ({layoutSpec.frameCount})
                </span>
                {layoutSpec.frameCount > 1 && (
                  <button
                    type="button"
                    onClick={onToggleSwapMode}
                    aria-pressed={swapMode}
                    className={`btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap ${
                      swapMode
                        ? 'bg-[#2D1F2D] text-white'
                        : 'bg-pink-50 text-[#7A284F] hover:bg-pink-100'
                    }`}
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{swapMode ? 'Done Swapping' : 'Swap Frames'}</span>
                  </button>
                )}
              </div>

              {swapMode && (
                <p className="mb-3 text-xs font-semibold text-[#C92A6A]">
                  {swapSourceIndex === null
                    ? 'Tap the first frame you want to swap...'
                    : `Frame ${swapSourceIndex + 1} selected — now tap another frame to swap!`}
                </p>
              )}

              <div className="grid grid-cols-4 gap-2.5">
                {Array.from({ length: layoutSpec.frameCount }).map((_, idx) => {
                  const slot = photos[idx];
                  const isSelected = !swapMode && clampedFrameIndex === idx;
                  const isSwapFirst = swapMode && swapSourceIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectFrame(idx)}
                      aria-label={`Select frame ${idx + 1}`}
                      className={`btn-bounce group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition-all focus-visible:outline-2 focus-visible:outline-[#E14D8A] ${
                        isSwapFirst
                          ? 'border-dashed border-[#E14D8A] ring-2 ring-pink-300'
                          : isSelected
                          ? 'border-[#E14D8A] shadow-sm'
                          : 'border-pink-100 hover:border-pink-300'
                      }`}
                    >
                      {slot?.previewDataUrl ? (
                        <img
                          src={slot.previewDataUrl}
                          alt={`Frame ${idx + 1} thumbnail`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#FDF6F9] text-[#9E7B8E]">
                          <span className="text-xs font-bold tabular-nums">+{idx + 1}</span>
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                        #{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Photo Crop & Zoom */}
            <div className="border-t border-pink-100 pt-4">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="frame-zoom-slider"
                  className="font-heading text-sm font-semibold text-[#2D1F2D]"
                >
                  Frame #{clampedFrameIndex + 1} Zoom &amp; Crop
                </label>
                <span className="text-xs font-bold text-[#7A284F] tabular-nums">
                  {(currentSlot?.zoom || 1).toFixed(2)}×
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#6E5A6E]">
                Drag the photo directly on the preview strip to reposition it.
              </p>

              <input
                id="frame-zoom-slider"
                type="range"
                min={1}
                max={3}
                step={0.05}
                disabled={!currentSlot?.sourceCanvas}
                value={currentSlot?.zoom || 1}
                onChange={(e) =>
                  onUpdatePhotoTransform(clampedFrameIndex, {
                    zoom: parseFloat(e.target.value),
                  })
                }
                className="cute-slider mt-3 w-full disabled:opacity-40"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTriggerSingleSlotUpload(clampedFrameIndex)}
                  className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-pink-50 px-3.5 py-2 text-xs font-bold text-[#7A284F] hover:bg-pink-100 whitespace-nowrap"
                >
                  <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {currentSlot?.sourceCanvas ? 'Replace Photo' : 'Add Photo Here'}
                  </span>
                </button>

                {currentSlot?.sourceCanvas && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdatePhotoTransform(clampedFrameIndex, {
                          zoom: 1,
                          offsetX: 0,
                          offsetY: 0,
                        })
                      }
                      className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#F7F3FA] px-3.5 py-2 text-xs font-bold text-[#5E495E] hover:bg-[#EFE8F5] whitespace-nowrap"
                    >
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Reset Crop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onClearPhotoSlot(clampedFrameIndex)}
                      aria-label={`Remove photo from frame ${clampedFrameIndex + 1}`}
                      className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[#8E5670] hover:bg-pink-50 hover:text-[#C92A6A] whitespace-nowrap"
                    >
                      <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. LAYOUT PANEL */}
        {activeTab === 'layout' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#6E5A6E]">
              Switch booth layouts anytime — your photos and stickers adapt automatically.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {LAYOUTS.map((layout) => {
                const isSelected = layout.id === layoutId;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => onLayoutChange(layout.id)}
                    aria-pressed={isSelected}
                    className={`btn-bounce flex min-h-[76px] items-center gap-3.5 rounded-2xl border-2 p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#E14D8A] ${
                      isSelected
                        ? 'border-[#E14D8A] bg-pink-50/60'
                        : 'border-pink-100 bg-[#FFFCFE] hover:border-pink-200 hover:bg-pink-50/30'
                    }`}
                  >
                    <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs">
                      <LayoutDiagram id={layout.id} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-sm font-bold text-[#2D1F2D] truncate">
                          {layout.name}
                        </span>
                        {isSelected && (
                          <Check
                            className="h-4 w-4 shrink-0 text-[#E14D8A]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#6E5A6E] tabular-nums">
                        {layout.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. THEME PANEL */}
        {activeTab === 'theme' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#6E5A6E]">
              Choose from 12 pastel, classic, gradient, and gingham photo booth frames.
            </p>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {THEMES.map((theme) => {
                const isSelected = theme.id === themeId;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onThemeChange(theme.id)}
                    aria-pressed={isSelected}
                    className={`btn-bounce flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-2.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-[#E14D8A] ${
                      isSelected
                        ? 'border-[#E14D8A] bg-pink-50/60'
                        : 'border-pink-100/90 bg-[#FFFCFE] hover:border-pink-200'
                    }`}
                  >
                    <span
                      style={{ background: theme.swatchPreview }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 shadow-xs"
                    >
                      {isSelected && (
                        <Check
                          className={`h-4 w-4 ${
                            theme.id === 'black' ? 'text-white' : 'text-[#2D1F2D]'
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="w-full truncate text-xs font-bold text-[#2D1F2D]">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. FILTERS PANEL */}
        {activeTab === 'filters' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#6E5A6E]">
              Apply soft studio color grading across all frames in real time.
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {FILTERS.map((f) => {
                const isSelected = f.id === filterId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onFilterChange(f.id)}
                    aria-pressed={isSelected}
                    className={`btn-bounce flex min-h-[72px] flex-col justify-between rounded-2xl border-2 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#E14D8A] ${
                      isSelected
                        ? 'border-[#E14D8A] bg-pink-50/60'
                        : 'border-pink-100 bg-[#FFFCFE] hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{ background: f.previewGradient }}
                        className="h-6 w-6 shrink-0 rounded-full border border-black/10"
                      />
                      {isSelected && (
                        <Sparkles
                          className="h-3.5 w-3.5 shrink-0 text-[#E14D8A]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="font-heading text-sm font-bold text-[#2D1F2D] truncate">
                        {f.name}
                      </div>
                      <div className="text-[11px] text-[#6E5A6E] truncate">{f.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. STICKERS PANEL */}
        {activeTab === 'stickers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#6E5A6E]">
                Tap a sticker to add · Drag on strip to move · Pinch or slide to resize
              </p>
              {stickers.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllStickers}
                  className="btn-bounce min-h-[44px] shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-[#8E5670] hover:bg-pink-50 hover:text-[#C92A6A] whitespace-nowrap"
                >
                  Clear all ({stickers.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
              {STICKER_CATALOG.map((item) => (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => onAddSticker(item.kind)}
                  aria-label={`Add ${item.label} sticker`}
                  className="btn-bounce flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border border-pink-100 bg-[#FFFAFC] p-2 hover:border-pink-300 hover:bg-pink-50/60 focus-visible:outline-2 focus-visible:outline-[#E14D8A]"
                >
                  <StickerIcon kind={item.kind} size={38} />
                  <span className="w-full truncate text-center text-[11px] font-bold text-[#4F3B4F]">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Sticker Adjustment Controls */}
            {selectedSticker ? (
              <div className="space-y-3 border-t border-pink-100 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-sm font-semibold text-[#2D1F2D]">
                    Selected Sticker
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDuplicateSticker(selectedSticker.id)}
                      className="btn-bounce inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-pink-50 px-3 py-1.5 text-xs font-bold text-[#7A284F] hover:bg-pink-100 whitespace-nowrap"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSticker(selectedSticker.id)}
                      className="btn-bounce inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-[#2D1F2D] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#C92A6A] whitespace-nowrap"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#5E495E]">
                      <label htmlFor="sticker-size-slider">Size</label>
                      <span className="tabular-nums">
                        {Math.round(selectedSticker.scale * 100)}%
                      </span>
                    </div>
                    <input
                      id="sticker-size-slider"
                      type="range"
                      min={0.5}
                      max={2.4}
                      step={0.05}
                      value={selectedSticker.scale}
                      onChange={(e) =>
                        onUpdateSticker(selectedSticker.id, {
                          scale: parseFloat(e.target.value),
                        })
                      }
                      className="cute-slider mt-2 w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#5E495E]">
                      <label htmlFor="sticker-rotate-slider">Tilt</label>
                      <span className="tabular-nums">{selectedSticker.rotation}°</span>
                    </div>
                    <input
                      id="sticker-rotate-slider"
                      type="range"
                      min={-45}
                      max={45}
                      step={1}
                      value={selectedSticker.rotation}
                      onChange={(e) =>
                        onUpdateSticker(selectedSticker.id, {
                          rotation: parseInt(e.target.value, 10),
                        })
                      }
                      className="cute-slider mt-2 w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              stickers.length > 0 && (
                <div className="border-t border-pink-100 pt-3">
                  <p className="text-xs text-[#6E5A6E]">
                    Tap any sticker on your photo strip to resize, tilt, or delete it.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {stickers.map((st, idx) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => onSelectSticker(st.id)}
                        className="btn-bounce inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-pink-200 bg-white px-2.5 py-1 text-xs font-bold text-[#5E495E] hover:border-[#E14D8A]"
                      >
                        <StickerIcon kind={st.kind} size={22} />
                        <span className="tabular-nums">#{idx + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* 6. TEXT & DATE PANEL */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Caption */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="strip-caption-input"
                  className="font-heading text-sm font-semibold text-[#2D1F2D]"
                >
                  Bottom Caption (Optional)
                </label>
                {caption && (
                  <button
                    type="button"
                    onClick={() => onCaptionChange('')}
                    className="text-xs font-bold text-[#9E2458] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                id="strip-caption-input"
                type="text"
                maxLength={38}
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
                placeholder="e.g. us <3 or my day"
                className="mt-2 w-full min-h-[46px] rounded-2xl border-2 border-pink-200/80 bg-[#FFFCFE] px-4 py-2.5 text-sm font-semibold text-[#2D1F2D] placeholder:text-[#A892A8] focus:border-[#E14D8A] focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CAPTION_SUGGESTIONS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => onCaptionChange(idea)}
                    className="btn-bounce min-h-[44px] rounded-xl bg-pink-50 px-3.5 py-2 text-xs font-bold text-[#7A284F] hover:bg-pink-100 whitespace-nowrap"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Stamp */}
            <div className="border-t border-pink-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <label
                    htmlFor="date-stamp-toggle"
                    className="font-heading text-sm font-semibold text-[#2D1F2D]"
                  >
                    Date Stamp
                  </label>
                  <p className="text-xs text-[#6E5A6E]">
                    Automatic photo booth date stamp — edit or hide anytime
                  </p>
                </div>
                <button
                  id="date-stamp-toggle"
                  type="button"
                  role="switch"
                  aria-checked={showDateStamp}
                  onClick={() => onShowDateStampChange(!showDateStamp)}
                  className={`btn-bounce relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] ${
                    showDateStamp ? 'bg-[#E14D8A]' : 'bg-pink-200/70'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                      showDateStamp ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {showDateStamp && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    aria-label="Date stamp text"
                    maxLength={24}
                    value={dateText}
                    onChange={(e) => onDateTextChange(e.target.value)}
                    placeholder="YYYY.MM.DD"
                    className="min-h-[44px] flex-1 rounded-2xl border-2 border-pink-200/80 bg-[#FFFCFE] px-4 py-2 text-sm font-semibold text-[#2D1F2D] tabular-nums focus:border-[#E14D8A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onDateTextChange(formatDefaultDateStamp())}
                    className="btn-bounce min-h-[44px] rounded-2xl bg-pink-50 px-3.5 py-2 text-xs font-bold text-[#7A284F] hover:bg-pink-100 whitespace-nowrap"
                  >
                    Today
                  </button>
                </div>
              )}
            </div>

            {/* 3 Cute Font Styles */}
            <div className="border-t border-pink-100 pt-4">
              <span className="font-heading text-sm font-semibold text-[#2D1F2D]">
                Font Style
              </span>
              <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                {FONT_STYLES.map((font) => {
                  const isSelected = font.id === fontStyleId;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => onFontStyleChange(font.id)}
                      aria-pressed={isSelected}
                      className={`btn-bounce flex min-h-[68px] flex-col items-center justify-center rounded-2xl border-2 p-2.5 text-center focus-visible:outline-2 focus-visible:outline-[#E14D8A] ${
                        isSelected
                          ? 'border-[#E14D8A] bg-pink-50/60'
                          : 'border-pink-100 bg-[#FFFCFE] hover:border-pink-200'
                      }`}
                    >
                      <span
                        style={{
                          fontFamily: font.canvasFontFamily,
                          fontStyle: font.fontStyle,
                          fontWeight: font.fontWeight,
                        }}
                        className="text-base text-[#2D1F2D]"
                      >
                        {font.sampleText}
                      </span>
                      <span className="mt-1 text-[11px] font-bold text-[#6E5A6E] whitespace-nowrap">
                        {font.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Ink Color Override */}
            <div className="border-t border-pink-100 pt-4">
              <span className="font-heading text-sm font-semibold text-[#2D1F2D]">
                Text Color
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {TEXT_COLOR_OVERRIDES.map((item) => {
                  const isSelected = textColorOverride === item.value;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTextColorOverrideChange(item.value)}
                      aria-pressed={isSelected}
                      className={`btn-bounce inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-xs font-bold whitespace-nowrap ${
                        isSelected
                          ? 'border-[#E14D8A] bg-pink-50/70 text-[#2D1F2D]'
                          : 'border-pink-100 bg-white text-[#5E495E] hover:border-pink-200'
                      }`}
                    >
                      {item.value && (
                        <span
                          style={{ backgroundColor: item.value }}
                          className="h-3.5 w-3.5 rounded-full border border-black/15"
                        />
                      )}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
