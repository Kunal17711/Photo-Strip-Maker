export type LayoutId = 'classic-4' | 'strip-3' | 'grid-2x2' | 'polaroid-1';

export type ThemeId =
  | 'pink'
  | 'lavender'
  | 'butter'
  | 'mint'
  | 'peach'
  | 'sky'
  | 'cream'
  | 'white'
  | 'black'
  | 'gradient-candy'
  | 'gradient-sorbet'
  | 'checkered';

export type FilterId =
  | 'original'
  | 'soft-pink'
  | 'warm-film'
  | 'bw'
  | 'vintage-grain'
  | 'cool-blue'
  | 'dreamy';

export type FontStyleId = 'bubble' | 'diary' | 'retro';

export type StickerKind =
  | 'heart'
  | 'double-hearts'
  | 'star'
  | 'shooting-star'
  | 'sparkles'
  | 'daisy'
  | 'tulip'
  | 'bow'
  | 'cloud'
  | 'cherries'
  | 'smiley-blush'
  | 'smiley-wink'
  | 'bunny'
  | 'butterfly'
  | 'crown'
  | 'love-letter';

export type ToolTabId = 'photos' | 'layout' | 'theme' | 'filters' | 'stickers' | 'text';

export type PageRoute = '/' | '/about' | '/privacy';

export interface PhotoSlot {
  id: string;
  sourceCanvas: HTMLCanvasElement | null;
  previewDataUrl: string | null;
  zoom: number; // 1.0 to 3.0
  offsetX: number; // -1.0 to 1.0
  offsetY: number; // -1.0 to 1.0
}

export interface PlacedSticker {
  id: string;
  kind: StickerKind;
  /** Normalized horizontal position across the strip (0.0 to 1.0) */
  x: number;
  /** Normalized vertical position across the strip (0.0 to 1.0) */
  y: number;
  /** Scale multiplier (0.5 to 2.4) */
  scale: number;
  /** Rotation in degrees (-45 to 45) */
  rotation: number;
}

export interface LayoutSpec {
  id: LayoutId;
  name: string;
  shortLabel: string;
  description: string;
  frameCount: number;
  exportWidth: number;
  exportHeight: number;
}

export interface ThemeSpec {
  id: ThemeId;
  name: string;
  fillType: 'solid' | 'gradient' | 'checkered';
  bgPrimary: string;
  bgSecondary?: string;
  bgTertiary?: string;
  frameInnerBg: string;
  frameBorderColor: string;
  textColor: string;
  mutedTextColor: string;
  swatchPreview: string;
}

export interface FilterSpec {
  id: FilterId;
  name: string;
  tagline: string;
  previewGradient: string;
}

export interface FontStyleSpec {
  id: FontStyleId;
  name: string;
  sampleText: string;
  canvasFontFamily: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacingRatio: number;
}

export interface FrameRect {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface LayoutGeometry {
  width: number;
  height: number;
  outerRadius: number;
  frames: FrameRect[];
  captionY: number;
  captionFontSize: number;
  dateY: number;
  dateFontSize: number;
  watermarkY: number;
  watermarkFontSize: number;
  baseStickerSize: number;
}
