import React from 'react';
import { FileText, AlertTriangle, Scale, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3">
          <Scale className="w-4 h-4 text-slate-700" />
          <span>{language === 'bn' ? 'শর্তাবলী' : 'Platform Rules'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Service)' : 'Terms of Service'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn' ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬' : 'Last Updated: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{language === 'bn' ? '১. মিথ্যা বা প্রতারণামূলক দাবি নিষিদ্ধ' : '1. Prohibition of False Claims'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'অন্যের কোনো জিনিসের ওপর মিথ্যা দাবি পেশ করা বা জালিয়াতির চেষ্টা করা আইনত দণ্ডনীয় অপরাধ। প্ল্যাটফর্মের মডারেটররা এই ধরনের কার্যক্রম শনাক্ত করলে সংশ্লিষ্ট অ্যাকাউন্ট স্থায়ীভাবে স্থগিত করবেন এবং জাতীয় আইনের আওতায় রিপোর্ট করবেন।'
              : 'Submitting fraudulent claims or attempting to extort rewards is strictly prohibited and subject to legal action and immediate account suspension.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? '২. পোস্ট মডারেশন ও অনুমোদন নীতি' : '2. Moderation Approval Mandate'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'কোনো বিজ্ঞপ্তি জমা দেওয়ার সাথে সাথে তা সার্বজনীনভাবে প্রদর্শিত হয় না। প্রতিটি বিজ্ঞপ্তি মডারেটর দ্বারা যাচাই হওয়ার পরেই কেবল সাইটে দৃশ্যমান হয়।'
              : 'All citizen listings are created in a PENDING state and become publicly viewable only after manual moderator review.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'bn' ? '৩. নাগরিক সহায়তা ও অবাণিজ্যিক চরিত্র' : '3. Non-Commercial Public Service'}</span>
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'এটি একটি স্বেচ্ছাসেবী নাগরিক সেবা। এই প্ল্যাটফর্মে কোনো প্রকার পণ্য বা সেবা বিক্রয়, প্রচার বা বাণিজ্যিক বিজ্ঞাপন দেওয়া সম্পূর্ণ নিষিদ্ধ।'
              : 'This platform is an impartial citizen utility. Commercial advertising and promotional posts are strictly prohibited.'}
          </p>
        </section>
      </div>
    </div>
  );
};
