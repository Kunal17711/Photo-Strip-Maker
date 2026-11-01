# Photo Strip Maker ✨📸

A cute, fast, privacy-first **Photo Booth Strip Maker** inspired by Korean 4-cut self-photo studios (Life4Cuts, Haru Film) and Pinterest photo strips. Everything runs **100% locally in your web browser** using the HTML5 Canvas API — no backend, no database, no login, and zero photo uploads.

Built by [Kunal Builds](https://websitebykunalbuilds.vercel.app) · **Free & Open Source** (Apache-2.0 / MIT friendly).

---

## Features

- **Add Photos Your Way**:
  - **Upload 1–4 Photos** from your phone or computer gallery (with automatic EXIF orientation handling, smart downscaling for large camera-roll files so mobile browsers never crash, and friendly guidance for unsupported formats like desktop HEIC).
  - **Photo Booth Mode**: Live mirrored front-camera preview (`getUserMedia`), front/rear camera flip, automatic **3–2–1 countdown**, gentle flash effect, and 4 consecutive poses. Includes a friendly fallback to gallery upload if camera permission is declined.
- **4 Instant Layouts**:
  - **Classic 4-Cut Strip** (`1200 × 3600 px` PNG)
  - **3-Frame Strip** (`1200 × 2850 px` PNG)
  - **2×2 Booth Grid** (`1800 × 2250 px` PNG)
  - **Polaroid Frame** (`1500 × 1860 px` PNG)
- **12 Cute Pastel & Studio Themes**:
  - Blush Pink, Lavender, Butter Yellow, Mint Matcha, Sweet Peach, Sky Blue, Warm Cream, Studio White, Midnight Booth, Cotton Candy Gradient, Peach Sorbet Gradient, and Pink Gingham Checkered.
- **7 Real-Time Filters**:
  - Original, Soft Pink, Warm Film, Black & White, Vintage Grain, Cool Blue, and Dreamy Glow — rendered deterministically on Canvas so they work identically across iOS Safari, Android, and desktop browsers.
- **16 Die-Cut Kawaii Vector Stickers**:
  - Hearts, twin hearts, satin bow, twinkles, pastel star, shooting star, cherries, daisy, tulip, fluffy cloud, blush smiley, star wink, bunny charm, butterfly, mini crown, and love note. Tap to add, drag on the strip to move, pinch or slide to resize/tilt, duplicate, or delete.
- **Custom Text & Date Stamp**:
  - Optional bottom caption, automatic editable/removable date stamp, and 3 cute font styles (*Bubble Cute*, *Soft Diary*, and *Retro Booth*).
- **Crop, Zoom & Swap**:
  - Drag photos directly inside any frame to pan/reposition, zoom from `1.0×` to `3.0×`, and swap any two frames in two taps.
- **High-Res PNG Export & Web Share**:
  - One-tap crisp PNG download + native mobile **Share** sheet (`navigator.share`) with graceful download fallback.
- **Sample Mode & Privacy**:
  - Preloaded with cute sample illustrations (`Try a sample` cycles styles; `Start over` clears with one-tap Undo).
  - Strict client-side privacy: *"Your photos never leave your phone. Nothing is uploaded."*
- **SEO & AdSense Ready**:
  - Includes Home (`/`), About (`/about`), and Privacy Policy (`/privacy`) pages, OpenGraph & Twitter cards, `sitemap.xml`, `robots.txt`, and `WebApplication` + `FAQPage` JSON-LD structured data.

---

## Local Development

### Prerequisites
- Node.js 18+ and npm

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server on http://localhost:3000
npm run dev
```

### Typecheck & Build for Production

```bash
# Run TypeScript check
npm run lint

# Build static production bundle into dist/
npm run build
```

---

## Deploy on Vercel (Free Tier)

This project compiles to a pure static client-side bundle with zero serverless functions or databases required, making it ideal for the **Vercel Free Hobby Tier**:

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Photo Strip Maker"
   git branch -M main
   git remote add origin https://github.com/Kunal17711/Photo-Strip-Maker.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
3. Optional Environment Variable:
   - Set `NEXT_PUBLIC_SITE_URL` (or `VITE_SITE_URL`) to your deployed production domain (defaults to `https://photo-strip-maker.vercel.app`). Canonical URLs, `og:url`, `sitemap.xml`, and `robots.txt` automatically use this URL at build time.
4. Click **Deploy**! `vercel.json` is pre-configured so `/`, `/about`, `/privacy`, `/sitemap.xml`, and `/robots.txt` work out of the box.

---

## Open Source

Free and open source — feel free to fork, customize themes or stickers, and share what you build!
- More free tools: [websitebykunalbuilds.vercel.app](https://websitebykunalbuilds.vercel.app)
- Instagram: [@bykunalbuilds](https://instagram.com/bykunalbuilds)
