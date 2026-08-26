import { useEffect, useId, useRef } from 'react';
import BrandLogo from '../BrandLogo';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

export const AuthModal = ({ isOpen, togglePopup, popupType }) => {
  const titleId = useId();
  const closeRef = useRef(null);
  const isRegisterMode = popupType === 'register';

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') togglePopup('');
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, togglePopup]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/55 backdrop-blur-sm"
      role="presentation"
      onClick={() => togglePopup('')}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => togglePopup('')}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-emerald-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          aria-label="Close"
        >
          <i className="fas fa-times" aria-hidden="true" />
        </button>

        <div className="px-6 pt-8 pb-6 sm:px-8">
          <div className="mb-4 flex justify-center">
            <BrandLogo to={null} size="lg" showWordmark={false} />
          </div>
          <h2 id={titleId} className="text-center text-2xl font-semibold text-emerald-950">
            {isRegisterMode ? 'Create your Sustainashare account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-center text-sm text-emerald-800/80">
            {isRegisterMode
              ? 'Join as a donor, recipient, or volunteer. We’ll only ask for what you need to get started.'
              : 'Log in to continue your redistribution journey.'}
          </p>

          <div className="mt-6">
            {isRegisterMode ? (
              <RegistrationForm handleSwitch={(to) => togglePopup(to)} />
            ) : (
              <LoginForm handleSwitch={(to) => togglePopup(to)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
