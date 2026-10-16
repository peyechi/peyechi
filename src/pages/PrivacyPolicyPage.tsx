import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{language === 'bn' ? 'সুরক্ষা ও গোপনীয়তা' : 'Privacy Protection'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn' ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬' : 'Last Updated: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? '১. নীতিমালার মূল দর্শন' : '1. Core Philosophy'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'আমাদের প্ল্যাটফর্মটি "প্রাইভেসি-বাই-ডিজাইন" নীতিতে পরিচালিত। আমরা নাগরিকদের ব্যক্তিগত ফোন নম্বর বা গোপনীয় তথ্য উন্মুক্ত না রেখে কেবল হারানো জিনিস পুনরুদ্ধারে সহায়তা করি।'
              : 'Our platform is strictly privacy-by-design. We facilitate the reconnection of lost belongings without exposing citizen phone numbers or sensitive credentials.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? '২. যোগাযোগ তথ্য গোপন রাখার বিধান' : '2. Private Contact Masking'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'সার্বজনীন বিজ্ঞপ্তিতে কোনো মোবাইল নম্বর, ব্যক্তিগত ঠিকানা বা পূর্ণ ইমেইল প্রদর্শিত হয় না। সকল যোগাযোগ প্ল্যাটফর্মের এনক্রিপ্টেড রিলে ও যাচাইকরণ প্রক্রিয়ার মাধ্যমে সম্পন্ন হয়।'
              : 'Public listings never display phone numbers or direct email addresses. Inquiries pass through private encrypted relays.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? '৩. গোপন মালিকানা যাচাই প্রমাণের নিরাপত্তা' : '3. Secret Claim Verification Protection'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'দাবিদারদের প্রদত্ত গোপন শনাক্তকরণ তথ্য অন্য কোনো দাবিদার বা সর্বসাধারণের কাছে প্রকাশ করা হয় না। এটি কেবল জিনিসটি পাওয়া ব্যক্তি এবং অনুমোদিত মডারেটর দেখতে পারেন।'
              : 'Distinguishing verification details provided by claimants are strictly protected. They are never visible to competitors or the public.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? '৪. অ্যাকাউন্ট ও তথ্য স্থায়ীভাবে মুছে ফেলার অধিকার' : '4. Data Purge & Account Deletion'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'ব্যবহারকারীরা যে কোনো সময় তাদের অ্যাকাউন্ট ও যাবতীয় ব্যক্তিগত তথ্য এক ক্লিকে স্থায়ীভাবে মুছে ফেলার অধিকারী। জিনিস হস্তান্তর সম্পন্ন হওয়ার পর সংশ্লিষ্ট তথ্য আর্কাইভ করা হয়।'
              : 'Users possess the explicit right to permanently delete their account and associated private data at any time from their dashboard.'}
          </p>
        </section>
      </div>
    </div>
  );
};
