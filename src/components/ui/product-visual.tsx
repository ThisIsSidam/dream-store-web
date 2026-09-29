import { cn } from "@/lib/utils";

interface ProductVisualProps {
  visualId: string;
  name?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
  size?: "sm" | "md" | "lg" | "xl";
  showStudioLighting?: boolean;
}

export function ProductVisual({
  visualId,
  name,
  className,
  aspectRatio = "square",
  size = "md",
  showStudioLighting = true,
}: ProductVisualProps) {
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
        ? "aspect-video"
        : "aspect-[4/3]";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-neutral-50/80 select-none",
        aspectClass,
        className,
      )}
      role="img"
      aria-label={name || visualId}
    >
      {/* Studio Backdrop Lighting & Soft Radial Vignette */}
      {showStudioLighting && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1)_0%,rgba(245,245,247,0.7)_60%,rgba(235,236,240,0.9)_100%)]" />
          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-neutral-200/30 to-transparent" />
          {/* Subtle studio pedestal drop shadow */}
          <div className="absolute bottom-6 w-3/5 h-4 bg-neutral-900/10 rounded-full blur-md" />
        </>
      )}

      {/* Product Artwork Vector by visualId */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
        {renderVisual(visualId)}
      </div>

      {/* Tiny subtle authenticity watermark / watermark badge */}
      <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
        <span className="text-[9px] font-mono tracking-wider uppercase text-neutral-400/80 bg-white/70 px-1.5 py-0.5 rounded border border-neutral-200/50 backdrop-blur-xs">
          YC-AUTH
        </span>
      </div>
    </div>
  );
}

function renderVisual(id: string) {
  switch (id) {
    case "bottled-echoes":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Subtle acoustic resonance rings floating around bottle */}
          <circle
            cx="100"
            cy="115"
            r="45"
            stroke="#4f46e5"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.35"
            className="animate-pulse"
          />
          <circle
            cx="100"
            cy="115"
            r="60"
            stroke="#818cf8"
            strokeWidth="0.75"
            strokeDasharray="4 4"
            opacity="0.25"
          />

          {/* Sound wave internal suggestion */}
          <path
            d="M78 120 Q 88 110 98 120 T 118 120"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M84 128 Q 94 122 102 128 T 114 128"
            stroke="#a5b4fc"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Glass Bottle Body */}
          <path
            d="M86 48 L86 65 Q70 82 70 115 Q70 152 100 152 Q130 152 130 115 Q130 82 114 65 L114 48 Z"
            fill="url(#glassGrad)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          {/* Glass Highlight */}
          <path
            d="M76 100 Q74 130 90 144"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Neck ring */}
          <rect
            x="83"
            y="44"
            width="34"
            height="6"
            rx="2"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          {/* Cork stopper */}
          <path
            d="M85 44 L87 30 L113 30 L115 44 Z"
            fill="#b45309"
            stroke="#92400e"
            strokeWidth="1"
            opacity="0.85"
          />
          <rect x="88" y="32" width="24" height="3" fill="#d97706" rx="1" />
          {/* Gold seal band */}
          <rect
            x="84"
            y="60"
            width="32"
            height="4"
            rx="1"
            fill="#f59e0b"
            opacity="0.9"
          />

          <defs>
            <linearGradient
              id="glassGrad"
              x1="70"
              y1="50"
              x2="130"
              y2="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f8fafc" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#e0e7ff" stopOpacity="0.25" />
              <stop offset="1" stopColor="#c7d2fe" stopOpacity="0.45" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "luxury-cardboard":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Isometric Luxury Cardboard Box */}
          <g transform="translate(10, 5)">
            {/* Top flap */}
            <path
              d="M90 35 L145 62 L90 88 L35 62 Z"
              fill="#d4a373"
              stroke="#b07d52"
              strokeWidth="1.5"
            />
            {/* Left face with corrugation texture hint */}
            <path
              d="M35 62 L90 88 L90 152 L35 124 Z"
              fill="#bc8a5f"
              stroke="#9d6b42"
              strokeWidth="1.5"
            />
            {/* Right face */}
            <path
              d="M90 88 L145 62 L145 124 L90 152 Z"
              fill="#a47148"
              stroke="#8b572a"
              strokeWidth="1.5"
            />

            {/* Subtle fluting lines on side */}
            <path
              d="M48 76 L48 131"
              stroke="#a7774e"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M62 82 L62 138"
              stroke="#a7774e"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M76 86 L76 144"
              stroke="#a7774e"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Gold foil stamp emblem */}
            <g transform="translate(105, 95) rotate(-18)">
              <rect
                x="0"
                y="0"
                width="26"
                height="26"
                rx="2"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1"
              />
              <circle
                cx="13"
                cy="13"
                r="9"
                stroke="#ffffff"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x="13"
                y="16"
                fill="#ffffff"
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
              >
                7-PLY
              </text>
            </g>

            {/* Top tape seal with subtle gloss */}
            <path
              d="M62 50 L117 76"
              stroke="#faedcd"
              strokeWidth="3"
              opacity="0.7"
            />
          </g>
        </svg>
      );

    case "diy-black-hole-kit":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Tungsten Chassis Base */}
          <rect
            x="36"
            y="55"
            width="128"
            height="95"
            rx="6"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Metallic faceplate bevel */}
          <rect x="42" y="61" width="116" height="83" rx="4" fill="#0f172a" />

          {/* Singularity Aperture with Gravitational Lensing Glow */}
          <circle cx="100" cy="102" r="32" fill="#020617" />
          <circle
            cx="100"
            cy="102"
            r="32"
            stroke="#4f46e5"
            strokeWidth="2"
            opacity="0.8"
            className="animate-pulse"
          />
          <circle
            cx="100"
            cy="102"
            r="36"
            stroke="#818cf8"
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray="2 3"
          />
          <circle cx="100" cy="102" r="18" fill="#000000" />

          {/* Accretion Disk Particle Trail */}
          <path
            d="M72 102 Q 100 86 128 102 Q 100 118 72 102"
            stroke="url(#accretionGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Dials and Toggle Switches */}
          <circle
            cx="56"
            cy="76"
            r="5"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="1"
          />
          <line
            x1="56"
            y1="76"
            x2="59"
            y2="73"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <circle
            cx="56"
            cy="94"
            r="5"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="1"
          />
          <circle
            cx="56"
            cy="112"
            r="5"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="1"
          />

          {/* Warning Stripe Label */}
          <rect x="122" y="68" width="30" height="8" fill="#eab308" rx="1" />
          <text
            x="137"
            y="74.5"
            fill="#000000"
            fontSize="5"
            fontWeight="bold"
            textAnchor="middle"
          >
            EVENT H.
          </text>

          <defs>
            <linearGradient
              id="accretionGrad"
              x1="72"
              y1="102"
              x2="128"
              y2="102"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#c084fc" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "extra-tuesday":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Isometric Calendar Box / Ingot */}
          <g transform="translate(18, 12)">
            {/* Box Base */}
            <path
              d="M82 30 L140 60 L82 92 L24 60 Z"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <path
              d="M24 60 L82 92 L82 145 L24 113 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <path
              d="M82 92 L140 60 L140 113 L82 145 Z"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Embossed Typography */}
            <g transform="translate(82, 60) rotate(-16) scale(0.9, 0.7)">
              <text
                x="0"
                y="0"
                fill="#1e293b"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="1"
              >
                TUESDAY
              </text>
              <text
                x="0"
                y="10"
                fill="#6366f1"
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
              >
                +24 HOURS
              </text>
            </g>

            {/* Gold Ribbon band */}
            <path
              d="M72 35 L72 140"
              stroke="#f59e0b"
              strokeWidth="2.5"
              opacity="0.8"
            />
            <path
              d="M72 35 L76 37 L76 142 L72 140 Z"
              fill="#d97706"
              opacity="0.4"
            />
          </g>
        </svg>
      );

    case "emergency-backup-moon":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Lunar Glow */}
          <circle
            cx="100"
            cy="95"
            r="54"
            fill="#f8fafc"
            opacity="0.6"
            className="animate-pulse"
          />
          <circle
            cx="100"
            cy="95"
            r="48"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Detailed Craters on Backup Moon */}
          <circle
            cx="85"
            cy="80"
            r="11"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <circle cx="83" cy="78" r="8" fill="#cbd5e1" opacity="0.6" />
          <circle
            cx="118"
            cy="98"
            r="14"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <circle cx="115" cy="95" r="10" fill="#cbd5e1" opacity="0.6" />
          <circle
            cx="95"
            cy="115"
            r="7"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <circle cx="120" cy="75" r="5" fill="#e2e8f0" />
          <circle cx="75" cy="105" r="6" fill="#e2e8f0" />

          {/* Backup Tether & Mounting Bracket */}
          <path
            d="M100 143 L100 175"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          <rect x="92" y="140" width="16" height="5" rx="1.5" fill="#334155" />
          <circle cx="100" cy="176" r="3" fill="#6366f1" />

          {/* Status LED */}
          <circle cx="100" cy="52" r="2.5" fill="#22c55e" />
        </svg>
      );

    case "invisible-umbrella":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Rain droplets deflecting off invisible dome */}
          <path
            d="M60 50 L63 56"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M140 50 L137 56"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M100 35 L100 42"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Splash rings on invisible dome */}
          <ellipse
            cx="65"
            cy="58"
            rx="5"
            ry="1.5"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.7"
          />
          <ellipse
            cx="135"
            cy="58"
            rx="5"
            ry="1.5"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.7"
          />
          <ellipse
            cx="100"
            cy="44"
            rx="6"
            ry="2"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Faint refractive canopy outline (0% visible in theory, subtle refraction here) */}
          <path
            d="M35 110 Q 100 45 165 110"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />

          {/* Titanium Shaft & Runner */}
          <line
            x1="100"
            y1="46"
            x2="100"
            y2="150"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="96" y="90" width="8" height="6" rx="1" fill="#64748b" />

          {/* Ergonomic J-Hook Handle */}
          <path
            d="M100 150 C100 170 125 170 125 156"
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "premium-nothing":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Ultra-clear Museum Borosilicate Cube */}
          <g transform="translate(20, 10)">
            <path
              d="M80 30 L135 58 L80 86 L25 58 Z"
              fill="#ffffff"
              fillOpacity="0.3"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <path
              d="M25 58 L80 86 L80 142 L25 114 Z"
              fill="#f8fafc"
              fillOpacity="0.25"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <path
              d="M80 86 L135 58 L135 114 L80 142 Z"
              fill="#e2e8f0"
              fillOpacity="0.2"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Crisp Internal Vacuum Reflections (Empty!) */}
            <line
              x1="45"
              y1="72"
              x2="65"
              y2="125"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <line
              x1="95"
              y1="95"
              x2="115"
              y2="135"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Tiny Center Coordinate Dot (Absolute Center of Void) */}
            <circle cx="80" cy="86" r="1.5" fill="#4f46e5" opacity="0.4" />
          </g>
        </svg>
      );

    case "suspiciously-normal-rock":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Granite River Stone */}
          <g transform="translate(10, 15)">
            {/* Velvet Display Ring */}
            <ellipse
              cx="90"
              cy="135"
              rx="55"
              ry="14"
              fill="#1e1b4b"
              stroke="#312e81"
              strokeWidth="2"
            />

            {/* Rock Body */}
            <path
              d="M50 120 C35 95 55 60 85 55 C115 50 140 70 142 98 C144 125 115 138 85 136 C60 134 45 130 50 120 Z"
              fill="url(#graniteGrad)"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Granite Fleck Texture */}
            <circle cx="75" cy="80" r="1.5" fill="#f8fafc" opacity="0.8" />
            <circle cx="95" cy="70" r="2" fill="#0f172a" opacity="0.6" />
            <circle cx="115" cy="85" r="1.5" fill="#f8fafc" opacity="0.8" />
            <circle cx="85" cy="105" r="2" fill="#0f172a" opacity="0.5" />
            <circle cx="68" cy="100" r="1.5" fill="#cbd5e1" opacity="0.7" />
            <circle cx="120" cy="110" r="2.5" fill="#0f172a" opacity="0.6" />
            <circle cx="102" cy="95" r="1" fill="#ffffff" opacity="0.9" />
          </g>

          <defs>
            <linearGradient
              id="graniteGrad"
              x1="50"
              y1="60"
              x2="135"
              y2="135"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#94a3b8" />
              <stop offset="0.5" stopColor="#64748b" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "pocket-sized-void":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Leather Holster Case */}
          <rect
            x="52"
            y="45"
            width="96"
            height="110"
            rx="12"
            fill="#3f2e23"
            stroke="#2a1d15"
            strokeWidth="2"
          />
          {/* Stitching */}
          <rect
            x="58"
            y="51"
            width="84"
            height="98"
            rx="8"
            stroke="#d4a373"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
            opacity="0.7"
          />

          {/* Circular Singularity Pocket Window */}
          <circle
            cx="100"
            cy="100"
            r="28"
            fill="#020617"
            stroke="#b45309"
            strokeWidth="2"
          />
          {/* Violet singularity horizon */}
          <circle
            cx="100"
            cy="100"
            r="22"
            fill="#000000"
            stroke="#6366f1"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          <circle cx="100" cy="100" r="8" fill="#000000" />

          {/* Light rays bending into void */}
          <path
            d="M82 82 L94 94"
            stroke="#a5b4fc"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M118 82 L106 94"
            stroke="#a5b4fc"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Brass Latch */}
          <rect
            x="92"
            y="38"
            width="16"
            height="12"
            rx="2"
            fill="#eab308"
            stroke="#ca8a04"
            strokeWidth="1"
          />
        </svg>
      );

    case "certified-unnecessary-box":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          <g transform="translate(15, 10)">
            {/* Precision Aluminum Box */}
            <rect
              x="35"
              y="55"
              width="100"
              height="70"
              rx="3"
              fill="#475569"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <line
              x1="35"
              y1="88"
              x2="135"
              y2="88"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Top lid highlight */}
            <rect
              x="37"
              y="57"
              width="96"
              height="30"
              fill="#64748b"
              opacity="0.7"
            />

            {/* ISO certification seal */}
            <circle cx="85" cy="72" r="8" stroke="#cbd5e1" strokeWidth="1" />
            <text
              x="85"
              y="74.5"
              fill="#f8fafc"
              fontSize="5"
              fontWeight="bold"
              textAnchor="middle"
            >
              0.00%
            </text>

            {/* Micro chamfer corner screws */}
            <circle cx="42" cy="62" r="1.5" fill="#94a3b8" />
            <circle cx="128" cy="62" r="1.5" fill="#94a3b8" />
            <circle cx="42" cy="118" r="1.5" fill="#94a3b8" />
            <circle cx="128" cy="118" r="1.5" fill="#94a3b8" />
          </g>
        </svg>
      );

    case "quantum-left-sock":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Combed Cotton Athletic Sock */}
          <g transform="translate(25, 10)">
            {/* Sock Leg & Foot contour */}
            <path
              d="M75 35 L105 35 L105 100 C105 125 115 130 135 132 C145 133 148 145 140 152 C125 160 90 162 70 140 C55 122 75 100 75 90 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* Heel patch */}
            <path
              d="M75 108 C65 120 70 135 82 135"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Toe cap */}
            <path
              d="M125 135 C140 138 145 148 136 153"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Ribbed Cuff */}
            <line
              x1="75"
              y1="42"
              x2="105"
              y2="42"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <line
              x1="75"
              y1="48"
              x2="105"
              y2="48"
              stroke="#e2e8f0"
              strokeWidth="1"
            />

            {/* Dual Red/Blue athletic stripes */}
            <rect x="75" y="52" width="30" height="4" fill="#4f46e5" />
            <rect x="75" y="58" width="30" height="4" fill="#06b6d4" />

            {/* Embroidered Quantum Spin Symbol */}
            <text
              x="90"
              y="85"
              fill="#4f46e5"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              ħ
            </text>
          </g>
        </svg>
      );

    case "7-day-subscription-to-yesterday":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Dossier Folder */}
          <g transform="translate(20, 10)">
            <rect
              x="30"
              y="45"
              width="105"
              height="110"
              rx="3"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <rect x="36" y="40" width="40" height="8" rx="2" fill="#cbd5e1" />

            {/* Internal Parchment Sheets */}
            <rect
              x="38"
              y="55"
              width="88"
              height="92"
              rx="1"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1"
            />

            {/* Red Wax Seal */}
            <circle
              cx="82"
              cy="100"
              r="18"
              fill="#b91c1c"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            <text
              x="82"
              y="98"
              fill="#ffffff"
              fontSize="6"
              fontWeight="bold"
              textAnchor="middle"
            >
              CHRONO
            </text>
            <text
              x="82"
              y="106"
              fill="#fecaca"
              fontSize="5"
              fontWeight="bold"
              textAnchor="middle"
            >
              T-24H
            </text>
          </g>
        </svg>
      );

    case "portable-hole":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Flat 2D Aperture Mat */}
          <g transform="translate(10, 15)">
            {/* Outer Mat Perimeter */}
            <ellipse
              cx="90"
              cy="85"
              rx="70"
              ry="42"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Rolled fabric seam */}
            <ellipse
              cx="90"
              cy="85"
              rx="66"
              ry="38"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
            />
            {/* Absolute Bottomless Abyss */}
            <ellipse cx="90" cy="85" rx="60" ry="32" fill="#000000" />

            {/* Faint subtle grid below portal */}
            <line
              x1="60"
              y1="85"
              x2="120"
              y2="85"
              stroke="#312e81"
              strokeWidth="0.8"
              opacity="0.4"
            />
            <line
              x1="90"
              y1="65"
              x2="90"
              y2="105"
              stroke="#312e81"
              strokeWidth="0.8"
              opacity="0.4"
            />
          </g>
        </svg>
      );

    case "emotional-support-brick":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Felt Coaster Base */}
          <g transform="translate(15, 12)">
            <ellipse
              cx="85"
              cy="135"
              rx="62"
              ry="16"
              fill="#334155"
              opacity="0.8"
            />

            {/* Isometric Red Terracotta Brick */}
            <path
              d="M85 45 L145 72 L85 100 L25 72 Z"
              fill="#c2410c"
              stroke="#9a3412"
              strokeWidth="1.5"
            />
            <path
              d="M25 72 L85 100 L85 135 L25 107 Z"
              fill="#9a3412"
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            <path
              d="M85 100 L145 72 L145 107 L85 135 Z"
              fill="#ea580c"
              stroke="#c2410c"
              strokeWidth="1.5"
            />

            {/* Brick Core Holes on Top */}
            <ellipse cx="55" cy="67" rx="7" ry="4" fill="#7c2d12" />
            <ellipse cx="85" cy="72" rx="7" ry="4" fill="#7c2d12" />
            <ellipse cx="115" cy="77" rx="7" ry="4" fill="#7c2d12" />
          </g>
        </svg>
      );

    case "box-of-slightly-important-air":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Brass Display Stand */}
          <path
            d="M70 145 L130 145 L125 155 L75 155 Z"
            fill="#ca8a04"
            stroke="#a16207"
            strokeWidth="1"
          />
          <rect x="96" y="125" width="8" height="20" fill="#a16207" />

          {/* Sealed Borosilicate Glass Ampoule */}
          <g transform="translate(5, 0)">
            <path
              d="M95 40 Q 95 65 75 75 L75 120 Q 95 130 95 130 Q 95 130 115 120 L115 75 Q 95 65 95 40 Z"
              fill="url(#airGrad)"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Glass highlight */}
            <path
              d="M80 80 L80 115"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Brass Tag with 1994 */}
            <rect
              x="80"
              y="95"
              width="30"
              height="10"
              rx="1"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="0.8"
            />
            <text
              x="95"
              y="102"
              fill="#713f12"
              fontSize="5.5"
              fontWeight="bold"
              textAnchor="middle"
            >
              1994
            </text>
          </g>

          <defs>
            <linearGradient
              id="airGrad"
              x1="75"
              y1="50"
              x2="115"
              y2="130"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f0fdf4" stopOpacity="0.4" />
              <stop offset="1" stopColor="#e0f2fe" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "temporal-paperweight":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Heavy Tungsten Pyramid */}
          <g transform="translate(20, 10)">
            <path
              d="M80 35 L135 125 L80 145 Z"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <path
              d="M80 35 L25 125 L80 145 Z"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <line
              x1="80"
              y1="35"
              x2="80"
              y2="145"
              stroke="#1e293b"
              strokeWidth="1.5"
            />

            {/* Relativistic Time Warp Rings */}
            <ellipse
              cx="80"
              cy="148"
              rx="60"
              ry="12"
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.4"
            />
          </g>
        </svg>
      );

    case "reverse-flashlight":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Tactical Torch Body */}
          <g transform="translate(15, 15)">
            {/* Shadow Beam projection */}
            <path
              d="M125 75 L165 40 L165 110 L125 75 Z"
              fill="#0f172a"
              opacity="0.85"
            />

            {/* Flashlight Head */}
            <rect
              x="95"
              y="60"
              width="30"
              height="30"
              rx="3"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Textured Barrel */}
            <rect
              x="40"
              y="66"
              width="55"
              height="18"
              rx="2"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <line
              x1="55"
              y1="66"
              x2="55"
              y2="84"
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1="65"
              y1="66"
              x2="65"
              y2="84"
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1="75"
              y1="66"
              x2="75"
              y2="84"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Tail cap button */}
            <rect x="34" y="69" width="6" height="12" rx="1" fill="#ef4444" />
          </g>
        </svg>
      );

    case "pre-owned-deja-vu":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Amber Dropper Bottle */}
          <g transform="translate(20, 10)">
            {/* Bottle Body */}
            <rect
              x="58"
              y="70"
              width="44"
              height="68"
              rx="6"
              fill="#b45309"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            {/* Bottle Neck */}
            <rect
              x="73"
              y="52"
              width="14"
              height="18"
              fill="#d97706"
              stroke="#78350f"
              strokeWidth="1"
            />
            {/* Ribbed Pipette Cap */}
            <rect x="70" y="44" width="20" height="8" rx="1.5" fill="#1e293b" />
            {/* Rubber Bulb */}
            <path d="M72 44 Q 80 26 88 44 Z" fill="#0f172a" />

            {/* Label */}
            <rect
              x="62"
              y="80"
              width="36"
              height="46"
              rx="2"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="0.8"
            />
            <text
              x="80"
              y="95"
              fill="#78350f"
              fontSize="6"
              fontWeight="bold"
              textAnchor="middle"
            >
              DÉJÀ VU
            </text>
            <text
              x="80"
              y="104"
              fill="#92400e"
              fontSize="4.5"
              textAnchor="middle"
            >
              PRE-OWNED
            </text>
          </g>
        </svg>
      );

    case "schrodingers-gift-card":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* Titanium Gift Card */}
          <g transform="translate(15, 20) rotate(-6)">
            <rect
              x="25"
              y="45"
              width="120"
              height="75"
              rx="6"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <rect x="25" y="58" width="120" height="14" fill="#0f172a" />

            {/* Quantum Wavefunction Symbol */}
            <text x="45" y="100" fill="#f8fafc" fontSize="16" fontWeight="bold">
              Ψ
            </text>
            <text x="75" y="95" fill="#94a3b8" fontSize="8" fontWeight="bold">
              [$0.00 / $500.00]
            </text>

            {/* Gold EMV Chip */}
            <rect
              x="115"
              y="82"
              width="18"
              height="14"
              rx="2"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="0.8"
            />
          </g>
        </svg>
      );

    case "metaphorical-hammer":
      return (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-h-[170px]"
          fill="none"
        >
          {/* American Hickory Handle */}
          <g transform="translate(10, 10)">
            <path
              d="M95 65 L55 155 L65 158 L105 68 Z"
              fill="#d4a373"
              stroke="#b07d52"
              strokeWidth="1.5"
            />
            {/* Carbon Steel Hammer Head */}
            <path
              d="M80 60 L130 50 L132 66 L110 68 L105 78 L85 75 Z"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Claw curve */}
            <path
              d="M80 60 Q 65 55 60 70"
              stroke="#334155"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center text-neutral-400">
          <div className="size-16 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center font-mono text-sm">
            YC
          </div>
          <span className="text-xs font-mono mt-2">{id}</span>
        </div>
      );
  }
}
