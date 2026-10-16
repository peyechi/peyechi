import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  CreditCard,
  Eye,
  CheckCircle2,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { AntiScamNotice } from '../components/AntiScamNotice.tsx';

export const SafetyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-emerald-700" />
          <span>{language === 'bn' ? 'নাগরিক সুরক্ষা ম্যানুয়াল' : 'Citizen Safety Manual'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'bn' ? 'নিরাপত্তা ও প্রতারণা রোধ সহায়িকা' : 'Safety & Anti-Scam Guidelines'}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {language === 'bn'
            ? 'হারানো জিনিস পুনরুদ্ধার কিংবা প্রাপ্ত জিনিস প্রকৃত মালিকের কাছে নিরাপদে হস্তান্তরের সময় নিচের নির্দেশনাবলী কঠোরভাবে মেনে চলুন।'
            : 'Essential safety protocols when recovering lost belongings or safely handing over found items in Bangladesh.'}
        </p>
      </div>

      {/* Main Notice */}
      <AntiScamNotice />

      {/* 4 Pillars of Safe Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            {language === 'bn' ? '১. কখনোই অগ্রিম টাকা পাঠাবেন না' : '1. Never Pay Advance Money'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'জিনিস ফেরত দেওয়ার অজুহাতে কুরিয়ার চার্জ, যাতায়াত খরচ বা উপহার বাবদ অগ্রিম বিকাশ, নগদ বা রকেটে টাকা চাওয়া প্রতারণার মূল লক্ষণ। জিনিস চোখে দেখার পূর্বে কোনো অবস্থাতেই টাকা পাঠাবেন না।'
              : 'Fraudsters often claim they will courier the item upon receiving advance bKash or Nagad transfer. Never send money before personally verifying the physical item.'}
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            {language === 'bn' ? '২. জনসমাগমপূর্ণ স্থানে দেখা করুন' : '2. Meet Only in Crowded Public Places'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'হস্তান্তরের জন্য নির্জন এলাকা এড়িয়ে চলুন। নিকটস্থ থানা চত্বর, মেট্রোরেল স্টেশন, বড় শপিং মল বা জনপ্রিয় মসজিদের প্রবেশদ্বারের মতো উন্মুক্ত ও জনবহুল স্থানে দিনের আলোয় সাক্ষাৎ করুন।'
              : 'Never meet in isolated areas or private rooms. Prefer well-lit crowded public spots like metro stations, police station compounds, or busy shopping centers during daytime.'}
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            {language === 'bn' ? '৩. গোপন নিদর্শনের মাধ্যমে মালিকানা যাচাই' : '3. Verify Secret Distinguishing Proof'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'শুধুমাত্র বাহ্যিক ছবির ভিত্তিতে কাউকে মালিক সাব্যস্ত করবেন না। ব্যাগের ভেতরের কোনো বিশেষ কাগজ, ফোনের নির্দিষ্ট লকস্ক্রিন ওয়ালপেপার বা অন্য কোনো গোপন চিহ্ন মিলিয়ে নিশ্চিত হোন।'
              : 'Merely possessing an ID photo is not proof of ownership. Demand unique distinguishing features (e.g., lockscreen picture, specific inner items, or purchase receipt).'}
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            {language === 'bn' ? '৪. জাতীয় জরুরি সেবা (৯৯৯)' : '4. National Emergency Services (999)'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'কোনো ব্যক্তি হুমকি দিলে, চাঁদাবাজি করার চেষ্টা করলে বা ব্ল্যাকমেইল করলে তাৎক্ষণিকভাবে ৯৯৯ এ ফোন দিয়ে পুলিশ সহায়তা নিন এবং সংশ্লিষ্ট থানায় সাধারণ ডায়েরি (GD) করুন।'
              : 'If anyone attempts extortion, intimidation, or fraudulent threats, promptly dial 999 for police assistance and report the individual.'}
          </p>
        </div>
      </div>

      {/* Sensitive Documents Guidance */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-emerald-400">
          {language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID) ও পাসপোর্ট সংক্রান্ত সতর্কতা' : 'Official Document Privacy Standards'}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'bn'
            ? 'পাসপোর্ট বা জাতীয় পরিচয়পত্রের সম্পূর্ণ নম্বর অনলাইনে প্রকাশ করলে পরিচয় চুরির (Identity Theft) ঝুঁকি থাকে। ছবি তোলার সময় সবসময় নম্বরের শেষ কয়েকটি ডিজিট আঙুল বা এডিটর দিয়ে ঢেকে দিন। প্ল্যাটফর্মের মডারেটররা কোনো পূর্ণ নম্বর যুক্ত পোস্ট প্রকাশ করবেন না।'
            : 'Publishing full National ID or Passport numbers exposes victims to identity theft and SIM cloning. Always mask the document numbers before taking photos.'}
        </p>
      </div>
    </div>
  );
};
