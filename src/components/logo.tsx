/** Mark from logo concept 2: the letter A with a play triangle for a crossbar */
export function Logo({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 55 L32 9 L55 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.5 34.5 L26.5 49.5 Q26.5 51.5 28.3 50.5 L39.5 43.6 Q41 42.5 39.5 41.4 L28.3 34.5 Q26.5 33.5 26.5 34.5Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-wordmark ${className}`}>
      intexa-ai<span className="brand-domain">.com</span>
    </span>
  );
}
