/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AlertCircle,
  CheckCircle2,
  Download,
  Lock,
  RotateCcw,
  Share2,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { CameraBoothModal } from './components/CameraBoothModal';
import { FloatingDecor } from './components/FloatingDecor';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomeSections } from './components/HomeSections';
import { PrivacyPage } from './components/PrivacyPage';
import { StripPreviewCanvas } from './components/StripPreviewCanvas';
import { StudioControls } from './components/StudioControls';
import {
  formatDefaultDateStamp,
  getLayoutSpec,
  SAMPLE_IMAGE_URLS,
  SAMPLE_PRESETS,
  SITE_URL,
} from './data/presets';
import {
  FilterId,
  FontStyleId,
  LayoutId,
  PageRoute,
  PhotoSlot,
  PlacedSticker,
  StickerKind,
  ThemeId,
  ToolTabId,
} from './types/strip';
import { renderPhotoStrip } from './utils/canvasRenderer';
import {
  applyPhotoFilter,
  DecodedPhotoResult,
  decodeImageFile,
  loadSampleImageCanvas,
  UnsupportedImageError,
} from './utils/imageProcessing';

function createEmptySlots(): PhotoSlot[] {
  return Array.from({ length: 4 }, (_, idx) => ({
    id: `slot-${idx}`,
    sourceCanvas: null,
    previewDataUrl: null,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  }));
}

function resolveInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/about') return '/about';
  if (path === '/privacy') return '/privacy';
  return '/';
}

interface SnapshotState {
  photos: PhotoSlot[];
  stickers: PlacedSticker[];
  filterId: FilterId;
  themeId: ThemeId;
  caption: string;
  isUsingSample: boolean;
}

export default function App() {
  const [route, setRoute] = useState<PageRoute>(resolveInitialRoute);

  // Studio customization state
  const [activeTab, setActiveTab] = useState<ToolTabId>('photos');
  const [layoutId, setLayoutId] = useState<LayoutId>('classic-4');
  const [themeId, setThemeId] = useState<ThemeId>('pink');
  const [filterId, setFilterId] = useState<FilterId>('original');
  const [photos, setPhotos] = useState<PhotoSlot[]>(createEmptySlots);
  const [isUsingSample, setIsUsingSample] = useState<boolean>(true);
  const [samplePresetIdx, setSamplePresetIdx] = useState<number>(0);

  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);
  const [swapMode, setSwapMode] = useState<boolean>(false);
  const [swapSourceIndex, setSwapSourceIndex] = useState<number | null>(null);

  const [stickers, setStickers] = useState<PlacedSticker[]>(
    () => SAMPLE_PRESETS[0].stickers
  );
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const [caption, setCaption] = useState<string>(SAMPLE_PRESETS[0].caption);
  const [showDateStamp, setShowDateStamp] = useState<boolean>(true);
  const [dateText, setDateText] = useState<string>(() => formatDefaultDateStamp());
  const [fontStyleId, setFontStyleId] = useState<FontStyleId>('bubble');
  const [textColorOverride, setTextColorOverride] = useState<string>('');

  // Camera & File inputs
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const multiFileInputRef = useRef<HTMLInputElement | null>(null);
  const singleSlotInputRef = useRef<HTMLInputElement | null>(null);
  const pendingSingleSlotRef = useRef<number>(0);

  // Status banners & undo snapshot
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<SnapshotState | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Cache filtered preview canvases per source canvas to keep live preview at 60fps
  const filterCacheRef = useRef<
    WeakMap<HTMLCanvasElement, Map<FilterId, HTMLCanvasElement>>
  >(new WeakMap());

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 4200);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  // Load initial cute kawaii sample illustrations on mount
  const sampleDecodedCacheRef = useRef<DecodedPhotoResult[] | null>(null);

  const loadSampleStrip = useCallback(async (presetIndex: number) => {
    let decoded = sampleDecodedCacheRef.current;
    if (!decoded) {
      decoded = await Promise.all(
        SAMPLE_IMAGE_URLS.map((url, idx) => loadSampleImageCanvas(url, idx))
      );
      sampleDecodedCacheRef.current = decoded;
    }

    const preset = SAMPLE_PRESETS[presetIndex % SAMPLE_PRESETS.length];
    setPhotos(
      decoded.map((item, idx) => ({
        id: `sample-${idx}-${Date.now()}`,
        sourceCanvas: item.canvas,
        previewDataUrl: item.previewDataUrl,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      }))
    );
    setThemeId(preset.themeId);
    setCaption(preset.caption);
    setStickers(preset.stickers.map((s) => ({ ...s, id: `${s.id}-${Date.now()}` })));
    setSelectedStickerId(null);
    setSwapMode(false);
    setSwapSourceIndex(null);
    setIsUsingSample(true);
    setUndoSnapshot(null);
  }, []);

  useEffect(() => {
    loadSampleStrip(0);
  }, [loadSampleStrip]);

  // Client-side routing + SEO canonical & title sync
  const handleNavigate = useCallback((nextRoute: PageRoute, hash?: string) => {
    const targetUrl = hash ? `${nextRoute}#${hash}` : nextRoute;
    if (window.location.pathname + window.location.hash !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    setRoute(nextRoute);

    if (hash) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(resolveInitialRoute());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const pageTitle =
      route === '/about'
        ? 'About – Photo Strip Maker (Free Private Online Photo Booth)'
        : route === '/privacy'
        ? 'Privacy Policy – Photo Strip Maker'
        : 'Free Photo Strip Maker Online (Photo Booth, No Login)';
    document.title = pageTitle;

    const canonicalHref = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', canonicalHref);
    }
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) {
      ogUrlEl.setAttribute('content', canonicalHref);
    }
  }, [route]);

  // Compute cached preview filtered canvases
  const filteredCanvases = useMemo(() => {
    return photos.map((slot) => {
      if (!slot.sourceCanvas) return null;
      if (filterId === 'original') return slot.sourceCanvas;

      let perCanvasMap = filterCacheRef.current.get(slot.sourceCanvas);
      if (!perCanvasMap) {
        perCanvasMap = new Map();
        filterCacheRef.current.set(slot.sourceCanvas, perCanvasMap);
      }
      const cached = perCanvasMap.get(filterId);
      if (cached) return cached;

      const computed = applyPhotoFilter(slot.sourceCanvas, filterId, false);
      perCanvasMap.set(filterId, computed);
      return computed;
    });
  }, [photos, filterId]);

  // Handle multi-photo upload (1 to 4 files)
  const handleMultiFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files: File[] = Array.from(fileList).slice(0, 4);
    e.target.value = '';

    setErrorBanner(null);
    const decodedResults: DecodedPhotoResult[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const res = await decodeImageFile(file);
        decodedResults.push(res);
      } catch (err) {
        if (err instanceof UnsupportedImageError) {
          errors.push(err.message);
        } else {
          errors.push(`Couldn't load "${file.name}". Please try a JPG, PNG, or WebP image.`);
        }
      }
    }

    if (errors.length > 0) {
      setErrorBanner(errors[0]);
    }

    if (decodedResults.length === 0) return;

    setPhotos((prev) => {
      // If currently showing sample illustrations, start fresh with the user's uploaded photos
      const base = isUsingSample ? createEmptySlots() : [...prev];

      if (isUsingSample) {
        decodedResults.forEach((res, idx) => {
          if (idx < 4) {
            base[idx] = {
              id: `upload-${idx}-${Date.now()}`,
              sourceCanvas: res.canvas,
              previewDataUrl: res.previewDataUrl,
              zoom: 1,
              offsetX: 0,
              offsetY: 0,
            };
          }
        });
      } else {
        // Fill empty slots first, then overwrite sequentially from selectedFrameIndex
        let cursor = 0;
        for (let i = 0; i < 4 && cursor < decodedResults.length; i++) {
          if (!base[i].sourceCanvas) {
            const res = decodedResults[cursor++];
            base[i] = {
              id: `upload-${i}-${Date.now()}`,
              sourceCanvas: res.canvas,
              previewDataUrl: res.previewDataUrl,
              zoom: 1,
              offsetX: 0,
              offsetY: 0,
            };
          }
        }
        let overwriteIdx = selectedFrameIndex;
        while (cursor < decodedResults.length) {
          const target = overwriteIdx % 4;
          const res = decodedResults[cursor++];
          base[target] = {
            id: `upload-${target}-${Date.now()}`,
            sourceCanvas: res.canvas,
            previewDataUrl: res.previewDataUrl,
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
          };
          overwriteIdx += 1;
        }
      }
      return base;
    });

    setIsUsingSample(false);
    setUndoSnapshot(null);
    setSelectedFrameIndex(0);
    showToast(
      decodedResults.length === 1
        ? 'Added 1 photo to your strip!'
        : `Added ${decodedResults.length} photos to your strip!`
    );
  };

  // Handle single-frame photo upload / replacement
  const handleSingleSlotFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setErrorBanner(null);

    const targetIndex = pendingSingleSlotRef.current;
    try {
      const res = await decodeImageFile(file);
      setPhotos((prev) => {
        const next = isUsingSample ? createEmptySlots() : [...prev];
        next[targetIndex] = {
          id: `slot-${targetIndex}-${Date.now()}`,
          sourceCanvas: res.canvas,
          previewDataUrl: res.previewDataUrl,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        };
        return next;
      });
      setIsUsingSample(false);
      setSelectedFrameIndex(targetIndex);
      showToast(`Updated Frame #${targetIndex + 1}!`);
    } catch (err) {
      if (err instanceof UnsupportedImageError) {
        setErrorBanner(err.message);
      } else {
        setErrorBanner('Could not decode that image format. Please try a JPG, PNG, or WebP photo.');
      }
    }
  };

  // Handle 4 photos captured from Photo Booth Camera
  const handleCameraCaptured = useCallback(
    (captured: DecodedPhotoResult[]) => {
      setErrorBanner(null);
      setPhotos(
        Array.from({ length: 4 }, (_, idx) => {
          const shot = captured[idx];
          return {
            id: `booth-${idx}-${Date.now()}`,
            sourceCanvas: shot ? shot.canvas : null,
            previewDataUrl: shot ? shot.previewDataUrl : null,
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
          };
        })
      );
      setIsUsingSample(false);
      setUndoSnapshot(null);
      setSelectedFrameIndex(0);
      showToast('Captured 4 photo booth poses!');
    },
    [showToast]
  );

  // Frame selection & Tap-to-Swap logic
  const handleSelectOrSwapFrame = useCallback(
    (index: number) => {
      if (swapMode) {
        if (swapSourceIndex === null) {
          setSwapSourceIndex(index);
        } else if (swapSourceIndex === index) {
          setSwapSourceIndex(null);
        } else {
          setPhotos((prev) => {
            const next = [...prev];
            const temp = next[swapSourceIndex];
            next[swapSourceIndex] = next[index];
            next[index] = temp;
            return next;
          });
          setSwapSourceIndex(null);
          setSelectedFrameIndex(index);
          showToast(`Swapped Frame #${swapSourceIndex + 1} and Frame #${index + 1}!`);
        }
        return;
      }
      setSelectedFrameIndex(index);
    },
    [swapMode, swapSourceIndex, showToast]
  );

  const handleTriggerSingleUpload = useCallback((index: number) => {
    pendingSingleSlotRef.current = index;
    singleSlotInputRef.current?.click();
  }, []);

  const handleUpdatePhotoTransform = useCallback(
    (
      index: number,
      updates: Partial<Pick<PhotoSlot, 'zoom' | 'offsetX' | 'offsetY'>>
    ) => {
      setPhotos((prev) =>
        prev.map((slot, idx) => (idx === index ? { ...slot, ...updates } : slot))
      );
    },
    []
  );

  const handleClearPhotoSlot = useCallback((index: number) => {
    setPhotos((prev) =>
      prev.map((slot, idx) =>
        idx === index
          ? {
              ...slot,
              sourceCanvas: null,
              previewDataUrl: null,
              zoom: 1,
              offsetX: 0,
              offsetY: 0,
            }
          : slot
      )
    );
  }, []);

  // Sticker operations
  const handleAddSticker = useCallback((kind: StickerKind) => {
    const newId = `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    // Slightly stagger newly added stickers near the center so multiple taps never stack invisibly
    const jitterX = 0.5 + (Math.random() - 0.5) * 0.24;
    const jitterY = 0.44 + (Math.random() - 0.5) * 0.24;
    const tilt = Math.round((Math.random() - 0.5) * 20);

    const newSticker: PlacedSticker = {
      id: newId,
      kind,
      x: jitterX,
      y: jitterY,
      scale: 1,
      rotation: tilt,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newId);
  }, []);

  const handleUpdateSticker = useCallback(
    (
      id: string,
      updates: Partial<Pick<PlacedSticker, 'x' | 'y' | 'scale' | 'rotation'>>
    ) => {
      setStickers((prev) =>
        prev.map((st) => (st.id === id ? { ...st, ...updates } : st))
      );
    },
    []
  );

  const handleDuplicateSticker = useCallback((id: string) => {
    setStickers((prev) => {
      const target = prev.find((s) => s.id === id);
      if (!target) return prev;
      const copy: PlacedSticker = {
        ...target,
        id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x: Math.min(0.92, target.x + 0.06),
        y: Math.min(0.92, target.y + 0.04),
      };
      setSelectedStickerId(copy.id);
      return [...prev, copy];
    });
  }, []);

  const handleDeleteSticker = useCallback((id: string) => {
    setStickers((prev) => prev.filter((st) => st.id !== id));
    setSelectedStickerId((curr) => (curr === id ? null : curr));
  }, []);

  const handleClearAllStickers = useCallback(() => {
    setStickers([]);
    setSelectedStickerId(null);
  }, []);

  // Try Sample & Start Over
  const handleTrySample = () => {
    const nextIdx = isUsingSample
      ? (samplePresetIdx + 1) % SAMPLE_PRESETS.length
      : samplePresetIdx;
    setSamplePresetIdx(nextIdx);
    loadSampleStrip(nextIdx);
    showToast('Loaded cute sample strip! Tap again to try another style.');
  };

  const handleStartOver = () => {
    setUndoSnapshot({
      photos,
      stickers,
      filterId,
      themeId,
      caption,
      isUsingSample,
    });
    setPhotos(createEmptySlots());
    setStickers([]);
    setSelectedStickerId(null);
    setFilterId('original');
    setCaption('');
    setIsUsingSample(false);
    setSwapMode(false);
    setSwapSourceIndex(null);
    setActiveTab('photos');
  };

  const handleUndoStartOver = () => {
    if (!undoSnapshot) return;
    setPhotos(undoSnapshot.photos);
    setStickers(undoSnapshot.stickers);
    setFilterId(undoSnapshot.filterId);
    setThemeId(undoSnapshot.themeId);
    setCaption(undoSnapshot.caption);
    setIsUsingSample(undoSnapshot.isUsingSample);
    setUndoSnapshot(null);
    showToast('Restored your strip!');
  };

  // Generate full-resolution PNG Blob (1200x3600 for 4-strip, etc.)
  const generateHighResPngBlob = useCallback(async (): Promise<{
    blob: Blob;
    fileName: string;
    dimensionsLabel: string;
  }> => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const spec = getLayoutSpec(layoutId);
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = spec.exportWidth;
    exportCanvas.height = spec.exportHeight;

    const fullResFiltered = photos.map((slot) =>
      slot.sourceCanvas
        ? applyPhotoFilter(slot.sourceCanvas, filterId, true)
        : null
    );

    renderPhotoStrip(exportCanvas, {
      layoutId,
      themeId,
      photos,
      filteredCanvases: fullResFiltered,
      stickers,
      caption,
      showDateStamp,
      dateText,
      fontStyleId,
      textColorOverride,
      isExport: true,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      exportCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to encode PNG'));
        },
        'image/png',
        1.0
      );
    });

    const dateSlug = new Date().toISOString().slice(0, 10);
    return {
      blob,
      fileName: `photo-strip-${layoutId}-${dateSlug}.png`,
      dimensionsLabel: `${spec.exportWidth} × ${spec.exportHeight} px`,
    };
  }, [
    layoutId,
    themeId,
    photos,
    filterId,
    stickers,
    caption,
    showDateStamp,
    dateText,
    fontStyleId,
    textColorOverride,
  ]);

  const triggerBlobDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleDownloadPng = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setErrorBanner(null);
    try {
      const { blob, fileName, dimensionsLabel } = await generateHighResPngBlob();
      triggerBlobDownload(blob, fileName);
      showToast(`Downloaded high-res PNG (${dimensionsLabel})!`);
    } catch {
      setErrorBanner('Could not export the PNG image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareStrip = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setErrorBanner(null);
    try {
      const { blob, fileName, dimensionsLabel } = await generateHighResPngBlob();
      const file = new File([blob], fileName, { type: 'image/png' });

      if (
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Photo Strip',
            text: 'Made with Photo Strip Maker ✨',
          });
          showToast('Shared your photo strip!');
          return;
        } catch (shareErr) {
          if (shareErr instanceof Error && shareErr.name === 'AbortError') {
            return;
          }
          // Fall back to direct download if sharing fails in embedded context
        }
      }

      triggerBlobDownload(blob, fileName);
      showToast(`Saved PNG (${dimensionsLabel}) ready to share anywhere!`);
    } catch {
      setErrorBanner('Could not prepare image for sharing. Please try Download PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  const activeLayoutSpec = getLayoutSpec(layoutId);

  return (
    <div className="relative flex min-h-screen flex-col">
      <FloatingDecor />

      <Header currentRoute={route} onNavigate={handleNavigate} />

      {/* Hidden File Inputs */}
      <input
        ref={multiFileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleMultiFilesChange}
        className="sr-only"
        aria-label="Upload 1 to 4 photos from gallery"
      />
      <input
        ref={singleSlotInputRef}
        type="file"
        accept="image/*"
        onChange={handleSingleSlotFileChange}
        className="sr-only"
        aria-label="Upload photo for selected frame"
      />

      {route === '/about' ? (
        <AboutPage onNavigate={handleNavigate} />
      ) : route === '/privacy' ? (
        <PrivacyPage onNavigate={handleNavigate} />
      ) : (
        <main className="relative z-10 flex-1 pb-12">
          {/* Studio Hero & Two-Column Workspace */}
          <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8">
            <div className="mb-6 flex flex-col items-center justify-between gap-3 text-center lg:flex-row lg:items-end lg:text-left">
              <div>
                <h1
                  style={{ textWrap: 'balance' }}
                  className="font-heading text-2xl font-bold tracking-tight text-[#2D1F2D] sm:text-4xl"
                >
                  Cute photo booth strips in a few taps ✨
                </h1>
                <p className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold text-[#5E495E] sm:text-sm lg:justify-start">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-[#C92A6A]" aria-hidden="true" />
                  <span>Your photos never leave your phone. Nothing is uploaded.</span>
                </p>
              </div>

              {/* Quick Sample & Start Over Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleTrySample}
                  className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border border-pink-200 bg-white/90 px-4 py-2 text-xs font-bold text-[#8A2250] shadow-xs hover:bg-white sm:text-sm whitespace-nowrap"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-[#E14D8A]" aria-hidden="true" />
                  <span>Try a sample</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border border-pink-200/70 bg-white/75 px-4 py-2 text-xs font-bold text-[#5E495E] hover:bg-white hover:text-[#2D1F2D] sm:text-sm whitespace-nowrap"
                >
                  <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Start over</span>
                </button>
              </div>
            </div>

            {/* Friendly Error Alert (e.g. unsupported HEIC) */}
            {errorBanner && (
              <div
                role="alert"
                className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-white p-4 text-sm text-[#7A1C44] shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#D63376]"
                    aria-hidden="true"
                  />
                  <p className="font-semibold leading-relaxed">{errorBanner}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorBanner(null)}
                  aria-label="Dismiss message"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-pink-50"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Undo Start Over Banner */}
            {undoSnapshot && (
              <div
                role="status"
                className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-200 bg-white/95 px-4 py-3 text-sm font-semibold text-[#4A324A] shadow-xs"
              >
                <span>Cleared your photo strip. Ready for fresh photos!</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndoStartOver}
                    className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-pink-100 px-3.5 py-2 text-xs font-bold text-[#8A2250] hover:bg-pink-200/80"
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Undo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUndoSnapshot(null)}
                    aria-label="Dismiss undo notice"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#6E5A6E] hover:bg-pink-50"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
              <div
                role="status"
                aria-live="polite"
                className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-[#2D1F2D] px-4 py-2.5 text-xs font-bold text-white shadow-md sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-300" aria-hidden="true" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Main Studio Grid: Preview Left / Controls Right on Desktop */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Live Strip Stage + Download/Share */}
              <div className="flex flex-col items-center rounded-[28px] bg-white/75 p-4 shadow-[0_14px_38px_-14px_rgba(160,95,135,0.16)] backdrop-blur-sm sm:p-6 lg:sticky lg:top-6 lg:col-span-5">
                <StripPreviewCanvas
                  layoutId={layoutId}
                  themeId={themeId}
                  photos={photos}
                  filteredCanvases={filteredCanvases}
                  stickers={stickers}
                  caption={caption}
                  showDateStamp={showDateStamp}
                  dateText={dateText}
                  fontStyleId={fontStyleId}
                  textColorOverride={textColorOverride}
                  selectedFrameIndex={
                    activeTab === 'photos' ? selectedFrameIndex : null
                  }
                  swapMode={swapMode}
                  swapSourceIndex={swapSourceIndex}
                  selectedStickerId={selectedStickerId}
                  onSelectFrame={handleSelectOrSwapFrame}
                  onEmptyFrameTap={handleTriggerSingleUpload}
                  onUpdatePhotoTransform={handleUpdatePhotoTransform}
                  onSelectSticker={(id) => {
                    setSelectedStickerId(id);
                    if (id) setActiveTab('stickers');
                  }}
                  onUpdateSticker={handleUpdateSticker}
                  onDeleteSticker={handleDeleteSticker}
                />

                <p className="mt-3 text-center text-xs font-semibold text-[#6E5A6E] tabular-nums">
                  Drag photo to crop · Pinch or slide to zoom · {activeLayoutSpec.exportWidth} ×{' '}
                  {activeLayoutSpec.exportHeight} px PNG
                </p>

                {/* Primary Export Actions */}
                <div className="mt-4 flex w-full gap-2.5">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={handleDownloadPng}
                    className="btn-bounce inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E14D8A] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-500/25 hover:bg-[#CE3B78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] disabled:opacity-60 sm:text-base whitespace-nowrap"
                  >
                    <Download className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                    <span>{isExporting ? 'Saving...' : 'Download PNG'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={handleShareStrip}
                    className="btn-bounce inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-sm font-bold text-[#7A284F] hover:border-pink-300 hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] disabled:opacity-60 sm:px-5 whitespace-nowrap"
                  >
                    <Share2 className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Tabbed Tool Controls */}
              <div className="lg:col-span-7">
                <StudioControls
                  activeTab={activeTab}
                  onTabChange={(nextTab) => {
                    setActiveTab(nextTab);
                    if (nextTab !== 'photos') {
                      setSwapMode(false);
                      setSwapSourceIndex(null);
                    }
                  }}
                  layoutId={layoutId}
                  onLayoutChange={(nextLayout) => {
                    setLayoutId(nextLayout);
                    const maxIdx = getLayoutSpec(nextLayout).frameCount - 1;
                    if (selectedFrameIndex > maxIdx) {
                      setSelectedFrameIndex(0);
                    }
                    setSwapSourceIndex(null);
                  }}
                  themeId={themeId}
                  onThemeChange={setThemeId}
                  filterId={filterId}
                  onFilterChange={setFilterId}
                  photos={photos}
                  selectedFrameIndex={selectedFrameIndex}
                  onSelectFrame={handleSelectOrSwapFrame}
                  swapMode={swapMode}
                  swapSourceIndex={swapSourceIndex}
                  onToggleSwapMode={() => {
                    setSwapMode((prev) => !prev);
                    setSwapSourceIndex(null);
                  }}
                  onOpenCamera={() => setIsCameraOpen(true)}
                  onTriggerMultiUpload={() => multiFileInputRef.current?.click()}
                  onTriggerSingleSlotUpload={handleTriggerSingleUpload}
                  onUpdatePhotoTransform={handleUpdatePhotoTransform}
                  onClearPhotoSlot={handleClearPhotoSlot}
                  stickers={stickers}
                  selectedStickerId={selectedStickerId}
                  onAddSticker={handleAddSticker}
                  onSelectSticker={setSelectedStickerId}
                  onUpdateSticker={handleUpdateSticker}
                  onDuplicateSticker={handleDuplicateSticker}
                  onDeleteSticker={handleDeleteSticker}
                  onClearAllStickers={handleClearAllStickers}
                  caption={caption}
                  onCaptionChange={setCaption}
                  showDateStamp={showDateStamp}
                  onShowDateStampChange={setShowDateStamp}
                  dateText={dateText}
                  onDateTextChange={setDateText}
                  fontStyleId={fontStyleId}
                  onFontStyleChange={setFontStyleId}
                  textColorOverride={textColorOverride}
                  onTextColorOverrideChange={setTextColorOverride}
                />
              </div>
            </div>
          </div>

          {/* Below-the-fold How It Works & FAQ */}
          <HomeSections />
        </main>
      )}

      <Footer onNavigate={handleNavigate} />

      {/* Photo Booth Camera Modal */}
      <CameraBoothModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotosCaptured={handleCameraCaptured}
        onFallbackUpload={() => multiFileInputRef.current?.click()}
      />
    </div>
  );
}
