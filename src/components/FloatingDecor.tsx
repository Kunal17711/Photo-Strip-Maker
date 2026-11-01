export function FloatingDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top-left soft heart */}
      <svg
        viewBox="0 0 40 40"
        className="decor-float-slow absolute top-20 left-[6%] h-7 w-7 text-pink-300/60"
      >
        <path
          fill="currentColor"
          d="M20 34C10 26 4 19 4 12.5 4 8 7.6 4.5 12 4.5c2.8 0 5.4 1.4 8 4.1 2.6-2.7 5.2-4.1 8-4.1 4.4 0 8 3.5 8 8C36 19 30 26 20 34z"
        />
      </svg>

      {/* Top-right 4-point sparkle */}
      <svg
        viewBox="0 0 40 40"
        className="decor-twinkle absolute top-28 right-[8%] h-7 w-7 text-purple-300/65"
      >
        <path
          fill="currentColor"
          d="M20 2c1.5 11 5.5 15 16.5 16.5C25.5 20 21.5 24 20 35c-1.5-11-5.5-15-16.5-16.5C14.5 17 18.5 13 20 2z"
        />
      </svg>

      {/* Mid-left sparkle */}
      <svg
        viewBox="0 0 40 40"
        className="decor-twinkle absolute top-[54%] left-[4%] hidden h-6 w-6 text-amber-300/65 md:block"
      >
        <path
          fill="currentColor"
          d="M20 3c1.3 10 5 13.7 15 15-10 1.3-13.7 5-15 15-1.3-10-5-13.7-15-15 10-1.3 13.7-5 15-15z"
        />
      </svg>

      {/* Mid-right soft heart */}
      <svg
        viewBox="0 0 40 40"
        className="decor-float-delayed absolute top-[62%] right-[5%] hidden h-6 w-6 text-pink-300/55 md:block"
      >
        <path
          fill="currentColor"
          d="M20 34C10 26 4 19 4 12.5 4 8 7.6 4.5 12 4.5c2.8 0 5.4 1.4 8 4.1 2.6-2.7 5.2-4.1 8-4.1 4.4 0 8 3.5 8 8C36 19 30 26 20 34z"
        />
      </svg>

      {/* Bottom-left pastel sparkle */}
      <svg
        viewBox="0 0 40 40"
        className="decor-float-delayed absolute bottom-16 left-[12%] h-5 w-5 text-violet-300/55"
      >
        <path
          fill="currentColor"
          d="M20 3c1.3 10 5 13.7 15 15-10 1.3-13.7 5-15 15-1.3-10-5-13.7-15-15 10-1.3 13.7-5 15-15z"
        />
      </svg>
    </div>
  );
}
