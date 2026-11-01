import { Camera, Check, RefreshCw, SwitchCamera, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { captureVideoFrame, DecodedPhotoResult } from '../utils/imageProcessing';

interface CameraBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosCaptured: (captured: DecodedPhotoResult[]) => void;
  onFallbackUpload: () => void;
}

const TOTAL_BOOTH_SHOTS = 4;

export function CameraBoothModal({
  isOpen,
  onClose,
  onPhotosCaptured,
  onFallbackUpload,
}: CameraBoothModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [shots, setShots] = useState<DecodedPhotoResult[]>([]);

  const stopCamera = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    setIsShooting(false);
    setCountdown(null);
  }, []);

  const startCamera = useCallback(
    async (mode: 'user' | 'environment') => {
      stopCamera();
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          "Your browser doesn't support live camera access here. No worries—you can upload photos straight from your gallery instead!"
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
      } catch (err) {
        const errName = err instanceof Error ? err.name : '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError(
            'Camera permission was declined. Allow camera access in your browser address bar to use Photo Booth Mode, or upload photos from your gallery below!'
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError(
            "We couldn't find a connected camera on this device. You can still make a super cute strip by uploading photos from your gallery!"
          );
        } else {
          setCameraError(
            "We couldn't start the camera right now (another app may be using it). Try uploading photos from your gallery instead!"
          );
        }
      }
    },
    [stopCamera]
  );

  useEffect(() => {
    if (isOpen) {
      setShots([]);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const runBoothSequence = useCallback(() => {
    if (!cameraReady || isShooting) return;
    setShots([]);
    setIsShooting(true);

    const capturedList: DecodedPhotoResult[] = [];
    const isMirrored = facingMode === 'user';

    const runShot = (shotIndex: number) => {
      if (shotIndex >= TOTAL_BOOTH_SHOTS) {
        setIsShooting(false);
        setCountdown(null);
        return;
      }

      let count = 3;
      setCountdown(count);

      const tick = () => {
        timerRef.current = window.setTimeout(() => {
          count -= 1;
          if (count > 0) {
            setCountdown(count);
            tick();
          } else {
            setCountdown(null);
            // Trigger camera flash & capture
            setFlashActive(true);
            window.setTimeout(() => setFlashActive(false), 180);

            if (videoRef.current) {
              const result = captureVideoFrame(videoRef.current, isMirrored);
              capturedList.push(result);
              setShots([...capturedList]);
            }

            timerRef.current = window.setTimeout(() => {
              runShot(shotIndex + 1);
            }, 650);
          }
        }, 900);
      };

      tick();
    };

    runShot(0);
  }, [cameraReady, facingMode, isShooting]);

  if (!isOpen) return null;

  const sequenceComplete = shots.length === TOTAL_BOOTH_SHOTS && !isShooting;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-booth-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#231523]/65 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] bg-white p-5 shadow-2xl sm:p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-3">
          <div>
            <h2
              id="camera-booth-title"
              className="font-heading text-xl font-bold text-[#2D1F2D]"
            >
              Photo Booth Mode 📸
            </h2>
            <p className="text-xs text-[#6E5A6E]">
              3-2-1 countdown · Takes 4 poses automatically · Stays 100% on your device
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo booth"
            className="btn-bounce flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-pink-50 text-[#5E495E] hover:bg-pink-100 hover:text-[#2D1F2D] focus-visible:outline-2 focus-visible:outline-[#E14D8A]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Camera Error / Permission Denied Fallback */}
        {cameraError ? (
          <div className="my-4 flex flex-col items-center rounded-[24px] border border-pink-200 bg-pink-50/70 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#D63376] shadow-sm">
              <Camera className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-[#2D1F2D]">
              Camera isn&apos;t available right now
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5E495E]">
              {cameraError}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFallbackUpload();
                }}
                className="btn-bounce inline-flex min-h-[46px] items-center gap-2 rounded-2xl bg-[#E14D8A] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-500/20 hover:bg-[#CE3B78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A]"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                <span>Upload from Gallery Instead</span>
              </button>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="btn-bounce inline-flex min-h-[46px] items-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-bold text-[#5E495E] hover:bg-pink-50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>Try Camera Again</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live Mirrored Camera Viewport */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[#1F1722]">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`h-full w-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Camera Switch Button */}
              {cameraReady && !isShooting && (
                <button
                  type="button"
                  onClick={() =>
                    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
                  }
                  aria-label="Switch front and back camera"
                  className="btn-bounce absolute top-3 right-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-black/55 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <SwitchCamera className="h-4 w-4" aria-hidden="true" />
                  <span>Flip</span>
                </button>
              )}

              {/* Shot Progress Label */}
              {(isShooting || shots.length > 0) && (
                <div className="absolute top-3 left-3 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-bold text-white tabular-nums backdrop-blur-md">
                  {isShooting
                    ? `Pose ${Math.min(shots.length + 1, TOTAL_BOOTH_SHOTS)} of ${TOTAL_BOOTH_SHOTS}`
                    : `${shots.length} of ${TOTAL_BOOTH_SHOTS} captured`}
                </div>
              )}

              {/* 3-2-1 Countdown Overlay */}
              {countdown !== null && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
                  <span
                    key={countdown}
                    className="font-heading text-7xl font-bold text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)] tabular-nums sm:text-8xl"
                  >
                    {countdown}
                  </span>
                </div>
              )}

              {/* Gentle White Flash Effect */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-150 ${
                  flashActive ? 'opacity-95' : 'opacity-0'
                }`}
              />
            </div>

            {/* 4 Captured Thumbnail Slots */}
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {Array.from({ length: TOTAL_BOOTH_SHOTS }).map((_, idx) => {
                const shot = shots[idx];
                return (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-pink-200/80 bg-pink-50/60"
                  >
                    {shot ? (
                      <img
                        src={shot.previewDataUrl}
                        alt={`Captured pose ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-pink-400 tabular-nums">
                        #{idx + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {!sequenceComplete ? (
                <button
                  type="button"
                  disabled={!cameraReady || isShooting}
                  onClick={runBoothSequence}
                  className="btn-bounce inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#E14D8A] px-6 py-3 text-base font-bold text-white shadow-md shadow-pink-500/20 hover:bg-[#CE3B78] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[240px]"
                >
                  <Camera className="h-5 w-5" aria-hidden="true" />
                  <span>
                    {isShooting
                      ? 'Taking 4 Poses... Smile!'
                      : 'Start 3-2-1 Booth (4 Photos)'}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onPhotosCaptured(shots);
                      onClose();
                    }}
                    className="btn-bounce inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E14D8A] px-6 py-3 text-base font-bold text-white shadow-md shadow-pink-500/20 hover:bg-[#CE3B78]"
                  >
                    <Check className="h-5 w-5" aria-hidden="true" />
                    <span>Use These 4 Photos</span>
                  </button>
                  <button
                    type="button"
                    onClick={runBoothSequence}
                    className="btn-bounce inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-pink-50/80 px-5 py-3 text-sm font-bold text-[#7A284F] hover:bg-pink-100"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    <span>Retake</span>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
