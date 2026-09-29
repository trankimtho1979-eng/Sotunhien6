import React from 'react';

export type MascotMood = 'happy' | 'thinking' | 'celebrate' | 'comforting' | 'reading';

interface PiPiMascotProps {
  mood?: MascotMood;
  speechText?: string;
  subText?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onMascotClick?: () => void;
  className?: string;
}

export const PiPiMascot: React.FC<PiPiMascotProps> = ({
  mood = 'happy',
  speechText,
  subText,
  size = 'md',
  interactive = true,
  onMascotClick,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
  };

  const getMoodColors = () => {
    switch (mood) {
      case 'celebrate':
        return {
          body: '#F59E0B', // Amber gold
          belly: '#FEF3C7',
          beak: '#D97706',
          glasses: '#B45309',
          blush: '#F87171',
        };
      case 'comforting':
        return {
          body: '#F97316', // Warm soft orange
          belly: '#FFF7ED',
          beak: '#EA580C',
          glasses: '#C2410C',
          blush: '#FDA4AF',
        };
      case 'thinking':
        return {
          body: '#3B82F6', // Curious soft blue
          belly: '#EFF6FF',
          beak: '#2563EB',
          glasses: '#1D4ED8',
          blush: '#93C5FD',
        };
      default:
        return {
          body: '#F59E0B',
          belly: '#FFFBEB',
          beak: '#D97706',
          glasses: '#92400E',
          blush: '#FCA5A5',
        };
    }
  };

  const colors = getMoodColors();

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* Mascot Graphic Avatar */}
      <div
        onClick={onMascotClick}
        className={`relative shrink-0 ${sizeMap[size]} transition-transform duration-200 ${
          interactive ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''
        }`}
        title="Cú Thông Thái Pi-Pi - Dẫn dắt bạn học Toán 6"
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md overflow-visible select-none"
        >
          {/* Animated Celebration stars or Thinking bulb */}
          {mood === 'celebrate' && (
            <g className="animate-pulse">
              <path
                d="M10,25 L13,18 L20,15 L13,12 L10,5 L7,12 L0,15 L7,18 Z"
                fill="#FBBF24"
              />
              <path
                d="M105,20 L108,13 L115,10 L108,7 L105,0 L102,7 L95,10 L102,13 Z"
                fill="#FBBF24"
              />
              <circle cx="15" cy="45" r="3" fill="#F472B6" />
              <circle cx="100" cy="40" r="3" fill="#60A5FA" />
            </g>
          )}

          {mood === 'thinking' && (
            <g className="animate-bounce">
              <circle cx="95" cy="18" r="8" fill="#FDE047" />
              <path
                d="M91,26 L99,26 L97,30 L93,30 Z"
                fill="#CA8A04"
              />
              {/* Little light bulb ray */}
              <line x1="95" y1="6" x2="95" y2="2" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
              <line x1="104" y1="10" x2="108" y2="7" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
              <line x1="86" y1="10" x2="82" y2="7" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {mood === 'comforting' && (
            <g className="animate-pulse">
              {/* Little heart floating */}
              <path
                d="M100,22 C97,17 90,18 90,24 C90,30 100,36 100,36 C100,36 110,30 110,24 C110,18 103,17 100,22 Z"
                fill="#FB7185"
              />
            </g>
          )}

          {/* Owl Ear Tufts */}
          <path d="M35,32 L44,12 L56,26 Z" fill={colors.body} />
          <path d="M85,32 L76,12 L64,26 Z" fill={colors.body} />
          <path d="M40,28 L45,18 L51,26 Z" fill="#D97706" opacity="0.6" />
          <path d="M80,28 L75,18 L69,26 Z" fill="#D97706" opacity="0.6" />

          {/* Owl Main Body */}
          <ellipse cx="60" cy="65" rx="42" ry="46" fill={colors.body} />

          {/* Graduation Cap (Mũ cử nhân mọt sách) */}
          <g>
            <polygon points="60,8 102,22 60,34 18,22" fill="#1E293B" />
            <polygon points="60,8 96,20 60,30 24,20" fill="#334155" />
            <rect x="42" y="27" width="36" height="10" rx="3" fill="#0F172A" />
            {/* Tassel */}
            <circle cx="60" cy="21" r="3" fill="#F59E0B" />
            <path
              d="M60,21 C72,21 82,28 85,38"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            <rect x="83" y="38" width="4" height="8" rx="1.5" fill="#F59E0B" />
          </g>

          {/* Belly */}
          <ellipse cx="60" cy="74" rx="28" ry="32" fill={colors.belly} />
          {/* Feather marks on belly */}
          <path
            d="M52,65 Q60,70 68,65 M50,75 Q60,80 70,75 M54,85 Q60,90 66,85"
            fill="none"
            stroke="#FDE68A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Wings */}
          {mood === 'celebrate' ? (
            // Cheering raised wings
            <>
              <ellipse cx="20" cy="46" rx="14" ry="24" fill={colors.body} transform="rotate(-35 20 46)" />
              <ellipse cx="100" cy="46" rx="14" ry="24" fill={colors.body} transform="rotate(35 100 46)" />
            </>
          ) : mood === 'comforting' ? (
            // Open warm wings
            <>
              <ellipse cx="22" cy="66" rx="12" ry="22" fill={colors.body} transform="rotate(-15 22 66)" />
              <ellipse cx="98" cy="66" rx="12" ry="22" fill={colors.body} transform="rotate(15 98 66)" />
            </>
          ) : (
            // Normal folded wings
            <>
              <ellipse cx="24" cy="70" rx="10" ry="22" fill={colors.body} />
              <ellipse cx="96" cy="70" rx="10" ry="22" fill={colors.body} />
            </>
          )}

          {/* Eye Outer Whites */}
          <circle cx="45" cy="52" r="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="75" cy="52" r="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Glasses Frame (Kính tròn thông thái) */}
          <circle cx="45" cy="52" r="15" fill="none" stroke={colors.glasses} strokeWidth="3.5" />
          <circle cx="75" cy="52" r="15" fill="none" stroke={colors.glasses} strokeWidth="3.5" />
          <path d="M60,50 L60,54" stroke={colors.glasses} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M30,52 L22,50" stroke={colors.glasses} strokeWidth="3" strokeLinecap="round" />
          <path d="M90,52 L98,50" stroke={colors.glasses} strokeWidth="3" strokeLinecap="round" />

          {/* Pupils & Eye Expressions */}
          {mood === 'happy' || mood === 'celebrate' ? (
            // Big sparkling smiling eyes
            <>
              <circle cx="46" cy="52" r="8" fill="#1E293B" />
              <circle cx="74" cy="52" r="8" fill="#1E293B" />
              {/* Eye sparkle highlights */}
              <circle cx="49" cy="49" r="3" fill="#FFFFFF" />
              <circle cx="77" cy="49" r="3" fill="#FFFFFF" />
              <circle cx="44" cy="54" r="1.5" fill="#FFFFFF" />
              <circle cx="72" cy="54" r="1.5" fill="#FFFFFF" />
            </>
          ) : mood === 'thinking' ? (
            // Looking up right thoughtfully
            <>
              <circle cx="48" cy="48" r="7" fill="#1E293B" />
              <circle cx="78" cy="48" r="7" fill="#1E293B" />
              <circle cx="50" cy="46" r="2.5" fill="#FFFFFF" />
              <circle cx="80" cy="46" r="2.5" fill="#FFFFFF" />
            </>
          ) : mood === 'comforting' ? (
            // Kind smiling crescents
            <>
              <path
                d="M39,53 Q45,46 51,53"
                fill="none"
                stroke="#1E293B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M69,53 Q75,46 81,53"
                fill="none"
                stroke="#1E293B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          ) : (
            // Normal
            <>
              <circle cx="46" cy="52" r="7.5" fill="#1E293B" />
              <circle cx="74" cy="52" r="7.5" fill="#1E293B" />
              <circle cx="48" cy="50" r="2.5" fill="#FFFFFF" />
              <circle cx="76" cy="50" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="32" cy="62" rx="5" ry="3.5" fill={colors.blush} opacity="0.75" />
          <ellipse cx="88" cy="62" rx="5" ry="3.5" fill={colors.blush} opacity="0.75" />

          {/* Beak */}
          <polygon points="60,56 66,66 54,66" fill={colors.beak} />

          {/* Cute Math Book held in wings if reading or normal */}
          <g transform="translate(48, 86)">
            <rect x="0" y="0" width="24" height="16" rx="2" fill="#2563EB" />
            <rect x="2" y="2" width="20" height="12" rx="1" fill="#FFFFFF" />
            <text x="6" y="11" fontSize="9" fontWeight="bold" fill="#2563EB" fontFamily="monospace">
              N*
            </text>
          </g>

          {/* Little Yellow Feet */}
          <ellipse cx="48" cy="110" rx="7" ry="4" fill="#D97706" />
          <ellipse cx="72" cy="110" rx="7" ry="4" fill="#D97706" />
        </svg>

        {/* Small floating status badge */}
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
          <span>Pi-Pi</span>
        </div>
      </div>

      {/* Speech Bubble Container */}
      {(speechText || subText) && (
        <div className="relative flex-1 bg-white border border-amber-200/90 rounded-2xl p-3 sm:p-4 shadow-sm text-left">
          {/* Bubble tail pointing left towards mascot */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[8px] border-r-amber-200 border-b-[7px] border-b-transparent" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[7px] border-r-white border-b-[6px] border-b-transparent" />

          {speechText && (
            <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
              {speechText}
            </p>
          )}
          {subText && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-normal">
              {subText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
