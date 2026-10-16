import React from 'react';
import { ShieldCheck, PhoneCall, Heart, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { PeyechiLogo } from './PeyechiLogo.tsx';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About */}
          <div className="md:col-span-1 space-y-3">
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <PeyechiLogo variant="header" theme="dark" showTagline={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'বাংলাদেশের নাগরিকদের জন্য একটি নিরপেক্ষ, সুরক্ষিত ও গোপনীয়তা-সুরক্ষিত ডিজিটাল হারানো ও প্রাপ্তি রেজিস্ট্রি।'
                : 'A safe, impartial, and privacy-first digital lost & found registry for the citizens of Bangladesh.'}
            </p>
            <div className="flex items-center gap-2 text-2xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 rounded-md p-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {language === 'bn'
                  ? 'কোনো পাবলিক ফোন নম্বর নেই • কঠোর মডারেশন'
                  : 'Zero Public Phone Leaks • Strict Moderation'}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              {language === 'bn' ? 'গুরুত্বপূর্ণ সংযোগ' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'বিজ্ঞপ্তি অনুসন্ধান' : 'Explore Listings'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report-lost')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'হারানো বিজ্ঞপ্তি দিন' : 'Report Lost Item'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report-found')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'প্রাপ্তি বিজ্ঞপ্তি দিন' : 'Report Found Item'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'নিরাপত্তা ও প্রতারণা রোধ গাইড' : 'Safety & Anti-Fraud Guide'}
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'bn' ? 'মডারেটর ও অ্যাডমিন পোর্টাল' : 'Moderator / Admin Portal'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Legal */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              {language === 'bn' ? 'গোপনীয়তা ও নীতি' : 'Privacy & Trust'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Use)' : 'Terms of Use'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'অ্যান্টি-স্ক্যাম নিরাপত্তা তথ্য' : 'Anti-Scam Protocols'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Assistance */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              {language === 'bn' ? 'জরুরি রাষ্ট্রীয় সেবা' : 'National Emergency'}
            </h4>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>৯৯৯ (জাতীয় জরুরি সেবা / 999 Police)</span>
              </div>
              <p className="text-2xs text-slate-400 leading-normal">
                {language === 'bn'
                  ? 'গুরুত্বপূর্ণ পাসপোর্ট, জাতীয় পরিচয়পত্র বা মূল্যবান সম্পদ হারানোর ক্ষেত্রে নিকটস্থ থানায় সাধারণ ডায়েরি (GD) করার পরামর্শ দেওয়া হচ্ছে।'
                  : 'For vital passports, NID cards or high-value stolen items, lodging a General Diary (GD) with the local police station is advised.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Lost & Found Bangladesh. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{language === 'bn' ? 'বাংলাদেশের জনগণের কল্যাণে নিবেদিত' : 'Dedicated to the people of Bangladesh'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
