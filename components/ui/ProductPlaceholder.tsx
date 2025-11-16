/**
 * ProductPlaceholder Component
 * Generates a professional SVG placeholder for products
 */

interface ProductPlaceholderProps {
  className?: string;
  text?: string;
}

export default function ProductPlaceholder({
  className = "",
  text = "NOWIHT"
}: ProductPlaceholderProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="400" height="600" fill="#F5F5F5" />

      {/* Center Icon - Minimalist Hanger */}
      <g transform="translate(200, 250)">
        {/* Hanger hook */}
        <circle cx="0" cy="-40" r="8" stroke="#A3A3A3" strokeWidth="2" fill="none" />
        <line x1="0" y1="-32" x2="0" y2="-10" stroke="#A3A3A3" strokeWidth="2" />

        {/* Hanger bar */}
        <path
          d="M -60 -10 L 60 -10"
          stroke="#A3A3A3"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Hanger sides */}
        <line x1="-60" y1="-10" x2="-80" y2="30" stroke="#A3A3A3" strokeWidth="2" />
        <line x1="60" y1="-10" x2="80" y2="30" stroke="#A3A3A3" strokeWidth="2" />
      </g>

      {/* Brand Text */}
      <text
        x="200"
        y="380"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="24"
        fontWeight="600"
        fill="#525252"
        letterSpacing="0.2em"
      >
        {text}
      </text>

      {/* Subtitle */}
      <text
        x="200"
        y="410"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
        fontWeight="300"
        fill="#A3A3A3"
        letterSpacing="0.1em"
      >
        NO IMAGE
      </text>

      {/* Decorative lines */}
      <line x1="120" y1="430" x2="180" y2="430" stroke="#E5E5E5" strokeWidth="1" />
      <line x1="220" y1="430" x2="280" y2="430" stroke="#E5E5E5" strokeWidth="1" />
    </svg>
  );
}