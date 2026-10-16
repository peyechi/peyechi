import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AntiScamNoticeProps {
  compact?: boolean;
}

export const AntiScamNotice: React.FC<AntiScamNoticeProps> = ({ compact = false }) => {
  const { language } = useLanguage();

  return (
    <div
      role="alert"
      className={`bg-amber-50 border-l-4 border-amber-600 rounded-r-lg p-4 text-amber-950 shadow-xs ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <ShieldAlert className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-amber-700`} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-amber-900 tracking-wide mb-1 flex items-center gap-1.5">
            {language === 'bn' ? 'সতর্কতা ও নিরাপত্তা নোটিশ' : 'Safety & Anti-Scam Notice'}
          </h4>
          <p className="leading-relaxed font-medium">
            {language === 'bn' ? (
              <>
                <strong>সতর্কতা:</strong> জিনিস ফেরত পাওয়ার জন্য অগ্রিম বিকাশ, নগদ, কুরিয়ার বা অন্য কোনো ফি দেবেন না। ব্যক্তিগত তথ্য ও OTP শেয়ার করবেন না। নিরাপদ ও জনসমাগমপূর্ণ স্থানে জিনিস হস্তান্তর করুন।
              </>
            ) : (
              <>
                <strong>Warning:</strong> Never pay advance bKash, Nagad, courier fees, or processing charges to recover items. Never disclose OTPs or private credentials. Always meet in safe, public places for handover.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
