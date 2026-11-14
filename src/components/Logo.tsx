import { Link } from 'react-router-dom';

export function Logo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} aria-label="MOTORES M. — Ir al inicio" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <svg aria-hidden viewBox="0 0 40 28" className="h-6 w-auto shrink-0">
        <path d="M0 28 9 0h7l4 12 4-12h7l9 28h-7L27 9l-4 13h-6L13 9 7 28z" fill="currentColor" />
        <rect x="33" y="22" width="6" height="6" className="fill-lime transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
      </svg>
      <span className="display whitespace-nowrap text-[1.65rem] leading-none tracking-[0.06em]">
        Motores <span className="text-lime">M.</span>
      </span>
    </Link>
  );
}
