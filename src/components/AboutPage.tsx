import { ArrowLeft, Camera, Heart, Lock, Sparkles } from 'lucide-react';
import { PageRoute } from '../types/strip';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="btn-bounce mb-6 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-[#7A284F] shadow-xs hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to Photo Strip Maker</span>
      </button>

      <article className="rounded-[28px] bg-white/95 p-6 shadow-[0_14px_38px_-14px_rgba(160,95,135,0.18)] sm:p-10">
        <h1
          style={{ textWrap: 'balance' }}
          className="font-heading text-3xl font-bold text-[#2D1F2D] sm:text-4xl"
        >
          About Photo Strip Maker
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[#5E495E]">
          <strong>Photo Strip Maker</strong> is a free, cozy, browser-based photo booth tool inspired by Korean 4-cut self-photo studios (like Life4Cuts and Haru Film) and classic vintage photo booths. Whether you are capturing silly poses with your best friends, making a sweet Polaroid keepsake of your pet, or turning camera-roll memories into an aesthetic strip, you can design and download high-resolution prints in just a few taps.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#FDF5F9] p-5">
            <Lock className="h-5 w-5 text-[#C92A6A]" aria-hidden="true" />
            <h2 className="mt-2.5 font-heading text-base font-bold text-[#2D1F2D]">
              100% Private
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#5E495E]">
              Every filter, frame, and sticker renders locally in your browser with HTML5 Canvas. Your photos never leave your device.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F7F4FD] p-5">
            <Camera className="h-5 w-5 text-[#7843B8]" aria-hidden="true" />
            <h2 className="mt-2.5 font-heading text-base font-bold text-[#2D1F2D]">
              Real Booth Feel
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#5E495E]">
              Use your front or rear camera with a mirrored preview, automatic 3-2-1 countdown, and gentle studio flash.
            </p>
          </div>

          <div className="rounded-2xl bg-[#FFF9EC] p-5">
            <Sparkles className="h-5 w-5 text-[#B87A14]" aria-hidden="true" />
            <h2 className="mt-2.5 font-heading text-base font-bold text-[#2D1F2D]">
              Print-Ready PNGs
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#5E495E]">
              Export crisp 1200 × 3600 px strips ready for printing, journaling, scrapbooks, or sharing with friends.
            </p>
          </div>
        </div>

        <h2 className="mt-8 font-heading text-xl font-bold text-[#2D1F2D]">
          Built by Kunal Builds
        </h2>
        <p className="mt-2.5 text-base leading-relaxed text-[#5E495E]">
          Photo Strip Maker is crafted by{' '}
          <a
            href="https://websitebykunalbuilds.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#C92A6A] underline underline-offset-4 hover:text-[#9E2458]"
          >
            Kunal Builds
          </a>{' '}
          as part of a growing collection of fast, joyful, privacy-respecting web tools that require zero accounts, zero paywalls, and zero clutter. The project is completely free and open source.
        </p>

        <p className="mt-3 text-base leading-relaxed text-[#5E495E]">
          Have feedback, a sticker request, or want to see what we are building next? Say hi on Instagram at{' '}
          <a
            href="https://instagram.com/bykunalbuilds"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#C92A6A] underline underline-offset-4 hover:text-[#9E2458]"
          >
            @bykunalbuilds
          </a>{' '}
          or explore the source code on{' '}
          <a
            href="https://github.com/Kunal17711/Photo-Strip-Maker"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#C92A6A] underline underline-offset-4 hover:text-[#9E2458]"
          >
            GitHub
          </a>
          .
        </p>

        <div className="mt-8 border-t border-pink-100 pt-6">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="btn-bounce inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#E14D8A] px-6 py-3 text-sm font-bold text-white shadow-md shadow-pink-500/20 hover:bg-[#CE3B78]"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>Make Your Photo Strip Now</span>
          </button>
        </div>
      </article>
    </main>
  );
}
