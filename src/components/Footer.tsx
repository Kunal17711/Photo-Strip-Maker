import { PageRoute } from '../types/strip';

interface FooterProps {
  onNavigate: (route: PageRoute, hash?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-10 mt-16 border-t border-pink-200/60 bg-white/75 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm text-[#5E495E] sm:px-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-heading text-base font-semibold text-[#2D1F2D]">
            Built by Kunal Builds, free &amp; open source
          </p>
          <p className="mt-1 text-xs text-[#6E5A6E]">
            100% browser-based photo booth strip maker · Nothing is ever uploaded.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="min-h-[44px] inline-flex items-center transition-colors hover:text-[#2D1F2D] hover:underline underline-offset-4 whitespace-nowrap"
          >
            Photo Booth
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/about');
            }}
            className="min-h-[44px] inline-flex items-center transition-colors hover:text-[#2D1F2D] hover:underline underline-offset-4 whitespace-nowrap"
          >
            About
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/privacy');
            }}
            className="min-h-[44px] inline-flex items-center transition-colors hover:text-[#2D1F2D] hover:underline underline-offset-4 whitespace-nowrap"
          >
            Privacy Policy
          </a>
          <a
            href="https://instagram.com/bykunalbuilds"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center transition-colors hover:text-[#D63376] hover:underline underline-offset-4 whitespace-nowrap"
          >
            Instagram @bykunalbuilds
          </a>
          <a
            href="https://github.com/Kunal17711/Photo-Strip-Maker"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center transition-colors hover:text-[#2D1F2D] hover:underline underline-offset-4 whitespace-nowrap"
          >
            GitHub
          </a>
          <a
            href="https://websitebykunalbuilds.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center transition-colors hover:text-[#D63376] hover:underline underline-offset-4 whitespace-nowrap"
          >
            More Free Tools
          </a>
        </nav>
      </div>
    </footer>
  );
}
