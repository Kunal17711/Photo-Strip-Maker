import { ExternalLink } from 'lucide-react';
import { PageRoute } from '../types/strip';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, hash?: string) => void;
}

export function Header({ currentRoute, onNavigate }: HeaderProps) {
  return (
    <header className="relative z-20 border-b border-pink-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:h-16 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="font-heading text-lg font-bold tracking-tight text-[#2D1F2D] transition-colors hover:text-[#D63376] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E14D8A] sm:text-xl whitespace-nowrap shrink-0"
        >
          Photo Strip Maker
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm font-semibold text-[#5E495E] md:flex"
        >
          <a
            href="/#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/', 'how-it-works');
            }}
            className="underline-offset-4 transition-colors hover:text-[#2D1F2D] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E14D8A] whitespace-nowrap shrink-0"
          >
            How It Works
          </a>
          <a
            href="/#faq"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/', 'faq');
            }}
            className="underline-offset-4 transition-colors hover:text-[#2D1F2D] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E14D8A] whitespace-nowrap shrink-0"
          >
            FAQ
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/about');
            }}
            aria-current={currentRoute === '/about' ? 'page' : undefined}
            className={`underline-offset-4 transition-colors hover:text-[#2D1F2D] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E14D8A] whitespace-nowrap shrink-0 ${
              currentRoute === '/about' ? 'text-[#C92A6A] underline' : ''
            }`}
          >
            About
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/privacy');
            }}
            aria-current={currentRoute === '/privacy' ? 'page' : undefined}
            className={`underline-offset-4 transition-colors hover:text-[#2D1F2D] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E14D8A] whitespace-nowrap shrink-0 ${
              currentRoute === '/privacy' ? 'text-[#C92A6A] underline' : ''
            }`}
          >
            Privacy
          </a>
        </nav>

        {/* Zone 3: 1 primary action link */}
        <div className="flex items-center shrink-0">
          <a
            href="https://websitebykunalbuilds.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bounce inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/90 px-4 py-2 text-xs font-bold text-[#9E2458] hover:border-pink-300 hover:bg-pink-100/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] sm:text-sm whitespace-nowrap shrink-0"
          >
            <span>More free tools</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
