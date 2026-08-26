/**
 * Sticky mobile CTA bar — primary action only to reduce decision fatigue.
 */
export default function StickyMobileCta({ onPrimary, onSecondary }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-100 bg-white/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(16,57,34,0.08)] md:hidden">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSecondary}
          className="flex-1 rounded-md border border-emerald-200 px-3 py-3 text-sm font-semibold text-emerald-900"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={onPrimary}
          className="flex-[1.4] rounded-md bg-orange-500 px-3 py-3 text-sm font-semibold text-white"
        >
          Join free
        </button>
      </div>
    </div>
  );
}
