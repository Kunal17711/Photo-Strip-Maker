import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types/strip';

interface PrivacyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
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

      <article className="space-y-6 rounded-[28px] bg-white/95 p-6 shadow-[0_14px_38px_-14px_rgba(160,95,135,0.18)] sm:p-10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C92A6A]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Last updated: November 2026</span>
          </div>
          <h1
            style={{ textWrap: 'balance' }}
            className="mt-2 font-heading text-3xl font-bold text-[#2D1F2D] sm:text-4xl"
          >
            Privacy Policy
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#5E495E]">
            Your privacy is at the heart of <strong>Photo Strip Maker</strong>. In short:{' '}
            <strong>your photos never leave your phone or computer.</strong> Nothing you upload or capture with your camera is ever sent to a server.
          </p>
        </div>

        <section className="space-y-2 border-t border-pink-100 pt-5">
          <h2 className="font-heading text-xl font-bold text-[#2D1F2D]">
            1. Zero Photo Uploads &amp; Local Processing
          </h2>
          <p className="text-sm leading-relaxed text-[#5E495E] sm:text-base">
            All image decoding, EXIF orientation correction, cropping, color filtering, sticker placement, text rendering, and PNG generation happen 100% locally inside your web browser using the standard HTML5 Canvas API. We do not operate a backend database or cloud storage bucket for user images, and we have no technical ability to view, access, or store your photos.
          </p>
        </section>

        <section className="space-y-2 border-t border-pink-100 pt-5">
          <h2 className="font-heading text-xl font-bold text-[#2D1F2D]">
            2. Camera Permissions
          </h2>
          <p className="text-sm leading-relaxed text-[#5E495E] sm:text-base">
            When you choose <strong>Photo Booth Mode</strong>, your browser asks for permission to access your camera via <code>navigator.mediaDevices.getUserMedia</code>. The live video stream is used strictly in temporary browser memory to capture your 4 photo booth frames and is stopped immediately as soon as you close the camera window. You can revoke camera permission at any time in your browser settings.
          </p>
        </section>

        <section className="space-y-2 border-t border-pink-100 pt-5">
          <h2 className="font-heading text-xl font-bold text-[#2D1F2D]">
            3. Personal Information &amp; Accounts
          </h2>
          <p className="text-sm leading-relaxed text-[#5E495E] sm:text-base">
            Photo Strip Maker does not require registration, accounts, email addresses, or personal profiles. You can use every feature anonymously.
          </p>
        </section>

        <section className="space-y-2 border-t border-pink-100 pt-5">
          <h2 className="font-heading text-xl font-bold text-[#2D1F2D]">
            4. Cookies, Hosting Logs &amp; Advertising Partners
          </h2>
          <p className="text-sm leading-relaxed text-[#5E495E] sm:text-base">
            Like most static websites hosted on platforms such as Vercel, standard anonymous server request metadata (such as browser user-agent and IP address for security and content delivery) may be processed transiently by the hosting provider.
          </p>
          <p className="text-sm leading-relaxed text-[#5E495E] sm:text-base">
            In the future, we may display non-intrusive advertisements through Google AdSense to help keep our tools free. Third-party vendors, including Google, may use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Users may opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#C92A6A] underline underline-offset-4 hover:text-[#9E2458]"
            >
              Google Ads Settings
            </a>
            . Advertising scripts never have access to your local photos or canvas creations.
          </p>
        </section>

        <section className="space-y-2 border-t border-pink-100 pt-5">
          <h2 className="font-heading text-xl font-bold text-[#2D1F2D]">
            5. Contact Us
          </h2>
          <p className="text-sm leading-relaxed text-[#5E495E] sm:text-base">
            If you have any questions about this Privacy Policy, you can reach Kunal Builds via Instagram at{' '}
            <a
              href="https://instagram.com/bykunalbuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#C92A6A] underline underline-offset-4 hover:text-[#9E2458]"
            >
              @bykunalbuilds
            </a>{' '}
            or through{' '}
            <a
              href="https://websitebykunalbuilds.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#C92A6A] underline underline-offset-4 hover:text-[#9E2458]"
            >
              websitebykunalbuilds.vercel.app
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
