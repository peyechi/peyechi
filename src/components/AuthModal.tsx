import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Login failed');
        } else {
          onClose();
        }
      } else {
        const res = await register(email, password, displayName, language);
        if (!res.success) {
          setError(res.error || 'Registration failed');
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@lostfound.bd');
      setPassword('Admin@123456');
    } else {
      setEmail('rahim@example.com');
      setPassword('User@123456');
    }
    setMode('login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {language === 'bn' ? 'নিরাপদ প্ল্যাটফর্ম অথেনটিকেশন' : 'Secure Citizen Auth'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'login' ? t.loginTitle : t.registerTitle}
          </h2>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.displayNameLabel}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: আব্দুর রহিম' : 'e.g. Abdur Rahim'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{mode === 'login' ? t.loginBtn : t.registerBtn}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch Login / Register */}
          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-600">
                {t.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  {t.registerBtn}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                {t.hasAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  {t.loginBtn}
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Pre-fill Box for seamless evaluation */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-2xs uppercase tracking-wider font-bold text-slate-400 mb-2">
              {language === 'bn' ? 'এক ক্লিকে পরীক্ষামূলক লগইন (Test Logins)' : '1-Click Evaluation Credentials'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin')}
                className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-md text-xs font-semibold text-left transition-colors flex flex-col"
              >
                <span className="font-bold">🛡️ মডারেটর অ্যাডমিন</span>
                <span className="text-3xs text-purple-600 truncate">admin@lostfound.bd</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('user')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 rounded-md text-xs font-semibold text-left transition-colors flex flex-col"
              >
                <span className="font-bold">👤 সাধারণ নাগরিক</span>
                <span className="text-3xs text-slate-500 truncate">rahim@example.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
