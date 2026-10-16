import React from 'react';

interface PeyechiLogoProps {
  className?: string;
  variant?: 'full' | 'header' | 'compact' | 'hero';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
}

export const PeyechiLogo: React.FC<PeyechiLogoProps> = ({
  className = '',
  variant = 'header',
  theme = 'light',
  showTagline = true,
}) => {
  const isDark = theme === 'dark';

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-950 via-emerald-800 to-teal-700 flex items-center justify-center text-white shadow-md relative overflow-hidden group">
          {/* Location Pin */}
          <svg viewBox="0 0 32 32" className="w-6 h-6 text-white" fill="none">
            <path
              d="M16 3C11.58 3 8 6.58 8 11C8 17 16 26 16 26C16 26 24 17 24 11C24 6.58 20.42 3 16 3Z"
              fill="#00A86B"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx="16" cy="11" r="2.5" fill="#FFFFFF" />
          </svg>
          {/* Golden sparkle */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <div className="relative inline-flex items-center justify-center">
          {/* Main Wordmark */}
          <div className="relative flex items-center font-['Hind_Siliguri',system-ui,sans-serif]">
            <span className="text-5xl sm:text-7xl font-black tracking-tight text-white flex items-center">
              <span className="relative inline-block text-emerald-400">
                পে
                {/* Embedded Location Pin */}
                <span className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 drop-shadow-sm" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="9" r="3" fill="#ffffff" />
                    <circle cx="12" cy="9" r="1.5" fill="#04563a" />
                  </svg>
                </span>
              </span>
              <span className="text-white">য়েছি</span>
            </span>

            {/* 3 Golden Yellow Sparkle Rays */}
            <div className="absolute -top-3 -right-8 sm:-top-4 sm:-right-10 pointer-events-none">
              <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-11 sm:h-11">
                <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
                  <line x1="16" y1="36" x2="22" y2="12" />
                  <line x1="26" y1="38" x2="42" y2="20" />
                  <line x1="30" y1="44" x2="46" y2="38" />
                </g>
                <circle cx="24" cy="34" r="3.5" fill="#fbbf24" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className="flex items-center gap-2 sm:gap-3 text-emerald-300 font-bold text-sm sm:text-lg tracking-wide mt-2">
            <span className="w-4 sm:w-6 h-0.5 bg-emerald-400 inline-block rounded-full"></span>
            <span>হারানো জিনিস ফিরে আসুক আপন ঠিকানায়।</span>
            <span className="w-4 sm:w-6 h-0.5 bg-emerald-400 inline-block rounded-full"></span>
          </div>
        )}
      </div>
    );
  }

  // Header / Full Variant
  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Wordmark Container */}
        <div className="relative flex items-center font-['Hind_Siliguri',system-ui,sans-serif]">
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="relative inline-block text-emerald-600 dark:text-emerald-400">
              পে
              {/* Location pin symbol in 'প' */}
              <span className="absolute top-[52%] left-[6px] sm:left-[8px] -translate-y-1/2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-xs" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
                  <circle cx="12" cy="9" r="1.2" fill="#04563a" />
                </svg>
              </span>
            </span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>য়েছি</span>
          </span>

          {/* 3 Golden Sparkle Rays */}
          <div className="relative -top-2 ml-0.5 pointer-events-none">
            <svg viewBox="0 0 32 32" className="w-4 h-4 sm:w-5 sm:h-5">
              <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
                <line x1="10" y1="24" x2="14" y2="8" />
                <line x1="16" y1="26" x2="28" y2="14" />
                <line x1="18" y1="29" x2="30" y2="26" />
              </g>
              <circle cx="14" cy="22" r="2" fill="#fbbf24" />
            </svg>
          </div>
        </div>
      </div>

      {showTagline && (
        <p
          className={`text-[9px] sm:text-2xs font-bold tracking-tight sm:tracking-wide -mt-1 hidden xs:flex items-center gap-1 ${
            isDark ? 'text-emerald-400' : 'text-emerald-800'
          }`}
        >
          <span className="inline-block w-2 sm:w-2.5 h-0.5 bg-emerald-500 rounded-full"></span>
          <span>হারানো জিনিস ফিরে আসুক আপন ঠিকানায়।</span>
          <span className="inline-block w-2 sm:w-2.5 h-0.5 bg-emerald-500 rounded-full"></span>
        </p>
      )}
    </div>
  );
};
