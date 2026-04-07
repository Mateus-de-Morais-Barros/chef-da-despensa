export default function ToasterMascot({ size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chef hat */}
      <ellipse cx="62" cy="38" rx="18" ry="7" fill="#FFF8E7" stroke="#4A2800" strokeWidth="2" />
      <rect x="48" y="20" width="28" height="20" rx="6" fill="#FFF8E7" stroke="#4A2800" strokeWidth="2" />
      <line x1="54" y1="22" x2="54" y2="36" stroke="#4A2800" strokeWidth="1.5" />
      <line x1="62" y1="20" x2="62" y2="36" stroke="#4A2800" strokeWidth="1.5" />
      <line x1="70" y1="22" x2="70" y2="36" stroke="#4A2800" strokeWidth="1.5" />

      {/* Spatula */}
      <rect x="28" y="52" width="6" height="28" rx="3" fill="#D4920A" stroke="#4A2800" strokeWidth="1.5" />
      <rect x="24" y="76" width="14" height="8" rx="3" fill="#E8A020" stroke="#4A2800" strokeWidth="1.5" />
      <line x1="26" y1="79" x2="36" y2="79" stroke="#4A2800" strokeWidth="1" />
      <line x1="26" y1="82" x2="36" y2="82" stroke="#4A2800" strokeWidth="1" />

      {/* Toaster body */}
      <rect x="42" y="44" width="48" height="48" rx="10" fill="#E8A020" stroke="#4A2800" strokeWidth="2.5" />

      {/* Toaster slots */}
      <rect x="51" y="48" width="10" height="16" rx="3" fill="#4A2800" opacity="0.15" />
      <rect x="65" y="48" width="10" height="16" rx="3" fill="#4A2800" opacity="0.15" />

      {/* Face - eyes */}
      <circle cx="56" cy="74" r="4" fill="white" stroke="#4A2800" strokeWidth="1.5" />
      <circle cx="72" cy="74" r="4" fill="white" stroke="#4A2800" strokeWidth="1.5" />
      <circle cx="57" cy="75" r="2" fill="#4A2800" />
      <circle cx="73" cy="75" r="2" fill="#4A2800" />
      <circle cx="58" cy="74" r="0.8" fill="white" />
      <circle cx="74" cy="74" r="0.8" fill="white" />

      {/* Smile */}
      <path d="M56 83 Q64 90 72 83" stroke="#4A2800" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="52" cy="81" r="4" fill="#F5A623" opacity="0.4" />
      <circle cx="76" cy="81" r="4" fill="#F5A623" opacity="0.4" />

      {/* Side dots */}
      <circle cx="87" cy="62" r="2" fill="#4A2800" opacity="0.25" />
      <circle cx="87" cy="70" r="2" fill="#4A2800" opacity="0.25" />
      <circle cx="87" cy="78" r="2" fill="#4A2800" opacity="0.25" />

      {/* Feet */}
      <rect x="52" y="90" width="10" height="6" rx="3" fill="#D4920A" stroke="#4A2800" strokeWidth="1.5" />
      <rect x="70" y="90" width="10" height="6" rx="3" fill="#D4920A" stroke="#4A2800" strokeWidth="1.5" />
    </svg>
  )
}
