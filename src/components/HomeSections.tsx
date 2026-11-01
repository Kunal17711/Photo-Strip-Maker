import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS } from '../data/presets';

const STEPS = [
  {
    number: '01.',
    title: 'Snap 4 Poses or Pick Photos',
    body: 'Open Photo Booth Mode for an authentic mirrored 3-2-1 camera countdown with flash, or select 1 to 4 favorite photos straight from your gallery.',
  },
  {
    number: '02.',
    title: 'Style Your Frame, Filter & Stickers',
    body: 'Switch between classic 4-cut vertical strips, 2×2 grids, 3-frame strips, or Polaroids. Try pastel themes, soft film filters, and drag cute stickers anywhere.',
  },
  {
    number: '03.',
    title: 'Save High-Res PNG or Share',
    body: 'Add a sweet caption and date stamp, then download a crisp 1200 × 3600 px print-ready PNG—all processed privately right inside your browser.',
  },
];

export function HomeSections() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-16 max-w-5xl space-y-20 px-4 sm:px-6">
      {/* AdSense snippet can be added here later */}

      {/* How to Make a Photo Booth Strip */}
      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="how-heading"
            style={{ textWrap: 'balance' }}
            className="font-heading text-2xl font-bold text-[#2D1F2D] sm:text-3xl"
          >
            How to make a photo booth strip
          </h2>
          <p className="mt-2.5 text-base leading-relaxed text-[#5E495E]">
            Create Korean-style Life4Cuts and Pinterest aesthetic photo strips in under a minute—no apps to install and no sign-up required.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-[26px] bg-white/90 p-6 shadow-[0_10px_30px_-14px_rgba(160,95,135,0.16)]"
            >
              <span className="font-heading text-sm font-bold text-[#C92A6A] tabular-nums">
                {step.number}
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-[#2D1F2D]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5E495E]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="faq-heading"
            style={{ textWrap: 'balance' }}
            className="font-heading text-2xl font-bold text-[#2D1F2D] sm:text-3xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2.5 text-base leading-relaxed text-[#5E495E]">
            Everything you need to know about making private, print-quality photo strips online.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl divide-y divide-pink-100 rounded-[28px] bg-white/95 px-6 py-2 shadow-[0_10px_30px_-14px_rgba(160,95,135,0.16)] sm:px-8">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={item.question} className="py-4">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-4 text-left font-heading text-base font-semibold text-[#2D1F2D] transition-colors hover:text-[#C92A6A] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14D8A] sm:text-lg"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#9E6B85] transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-[#E14D8A]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="mt-2 pr-6 text-sm leading-relaxed text-[#5E495E] sm:text-base"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
