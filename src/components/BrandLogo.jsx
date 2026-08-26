import { Link } from 'react-router-dom';
import mark from '../assets/images/logo.svg';

const SIZES = {
  sm: { mark: 'h-8 w-8', text: 'text-base' },
  md: { mark: 'h-10 w-10', text: 'text-lg' },
  lg: { mark: 'h-12 w-12', text: 'text-xl' },
};

/**
 * Brand mark + optional wordmark. Works on light and dark surfaces (transparent SVG).
 */
export default function BrandLogo({
  to = '/',
  size = 'md',
  showWordmark = true,
  onDark = false,
  className = '',
  onClick,
}) {
  const s = SIZES[size] || SIZES.md;
  const content = (
    <>
      <img
        src={mark}
        alt=""
        className={`${s.mark} shrink-0 rounded-full shadow-sm shadow-emerald-950/10`}
        width={40}
        height={40}
      />
      {showWordmark && (
        <span
          className={`font-display font-semibold tracking-tight ${s.text} ${
            onDark ? 'text-white' : 'text-emerald-950'
          }`}
        >
          Sustainashare
        </span>
      )}
    </>
  );

  const classes = `inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label="Sustainashare home">
        {content}
      </Link>
    );
  }

  return (
    <span className={classes} aria-hidden={!showWordmark}>
      {content}
    </span>
  );
}
