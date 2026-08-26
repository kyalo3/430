import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbars/AuthNavbar.jsx';
import Footer from '../components/Footers/Footer.jsx';
import { AuthModal } from '../components/Popups/AuthModal.jsx';
import { FAQS } from '../constants/faqs';
import { MEDIA } from '../constants/media';

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [popupType, setPopupType] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const togglePopup = (type) => {
    if (type === '' && isOpen) {
      setPopupType(type);
      setIsOpen(!isOpen);
    } else if (type !== '' && isOpen) {
      setPopupType(type);
    } else {
      setPopupType(type);
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <Navbar togglePopup={togglePopup} />
      <AuthModal isOpen={isOpen} popupType={popupType} togglePopup={togglePopup} />

      <main className="min-h-screen bg-[#eef5f0] pt-16">
        <header className="relative overflow-hidden bg-emerald-950 text-white">
          <img
            src={MEDIA.produce.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            style={{ objectPosition: MEDIA.produce.objectPosition }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/92 to-emerald-900/85" />
          <div className="container relative z-10 mx-auto px-6 sm:px-8 py-14 sm:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300 mb-3">FAQs</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight max-w-2xl">
              Questions before you join
            </h1>
            <p className="mt-4 text-emerald-100/80 text-lg max-w-xl">
              Honest answers about roles, privacy, verification, and impact — no marketing fog.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Talk to us
              </Link>
              <button
                type="button"
                onClick={() => togglePopup('register')}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
              >
                Create your account
              </button>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-6 sm:px-8 py-12 sm:py-16" aria-label="Frequently asked questions">
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((item, index) => {
              const open = openIndex === index;
              return (
                <article
                  key={item.q}
                  className={`rounded-2xl border transition duration-300 ${
                    open
                      ? 'border-emerald-200 bg-white shadow-lg shadow-emerald-900/10'
                      : 'border-emerald-100/80 bg-white/70 hover:border-emerald-200 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-start gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-2xl"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        open ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      <i className={`fas ${item.icon}`} aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-emerald-950">{item.q}</span>
                      {open && (
                        <span className="mt-3 block text-sm leading-relaxed text-emerald-900/75">{item.a}</span>
                      )}
                    </span>
                    <i
                      className={`fas ${open ? 'fa-minus' : 'fa-plus'} mt-1 text-sm text-orange-500`}
                      aria-hidden="true"
                    />
                  </button>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-emerald-950">Still unsure?</h2>
            <p className="mt-2 text-sm text-emerald-800/75">
              Leave a note on the landing page or create an account and choose your role when you&apos;re ready.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                to="/#contact"
                className="rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
