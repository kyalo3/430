import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbars/AuthNavbar.jsx';
import Footer from '../components/Footers/Footer.jsx';
import { AuthModal } from '../components/Popups/AuthModal.jsx';

const SECTIONS = [
  {
    title: 'Donation quality',
    body: 'List only usable resources. Include category, quantity, condition, expiry where relevant, and an approximate collection area. Do not list items that are unsafe to consume or handle.',
  },
  {
    title: 'Recipient dignity',
    body: 'Needs are matched privately. Do not publish recipient names, exact addresses, or household circumstances. Coordinators must not rank people by “deservingness”.',
  },
  {
    title: 'Volunteer safety',
    body: 'Accept only tasks you can complete. Exact handover details appear after assignment. Decline if a situation feels unsafe and report problems through the assignment, not public channels.',
  },
  {
    title: 'Verification and trust',
    body: 'Listings and needs are reviewed before they become available. Impact counts only after the recipient confirms receipt. We never invent counters or convert quantities into meals unless a documented method exists.',
  },
];

export default function GuidancePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar togglePopup={togglePopup} />
      <AuthModal isOpen={isOpen} togglePopup={togglePopup} popupType={popupType} />
      <main className="pt-24 pb-16 bg-[#f3f7f4] min-h-screen">
        <div className="container mx-auto max-w-3xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Community</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-emerald-950">Safety and participation guidance</h1>
          <p className="mt-4 text-lg text-emerald-800/85">
            Sustainashare is a redistribution orchestrator. These notes help donors, recipients, and volunteers complete
            the journey without turning need into a public spectacle.
          </p>
          <div className="mt-10 space-y-5">
            {SECTIONS.map((section) => (
              <article key={section.title} className="rounded-2xl border border-emerald-100 bg-white p-6">
                <h2 className="font-display text-xl font-semibold text-emerald-950">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900/85">{section.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm text-emerald-800/75">
            Questions about data use belong on your{' '}
            <Link className="font-semibold text-emerald-900 underline" to="/account/privacy">
              privacy settings
            </Link>{' '}
            after you sign in.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
