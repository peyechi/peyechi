import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'otp' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    login,
    register,
    requestPasswordReset,
    resetPassword,
    requestEmailOtp,
    loginWithOtp,
  } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Login states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeOtp, setActiveOtp] = useState<string | null>(null);

  // Password Reset states
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeResetCode, setActiveResetCode] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetAllStates = () => {
    setError(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setResetSent(false);
    setOtpCode('');
    setResetCode('');
  };

  const handleModeChange = (newMode: 'login' | 'register' | 'otp' | 'forgot') => {
    setMode(newMode);
    resetAllStates();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।' : 'Login failed. Check credentials.'));
        } else {
          onClose();
        }
      } else if (mode === 'register') {
        if (!agreeTerms) {
          setError(language === 'bn' ? 'অনুগ্রহ করে শর্তাবলীতে সম্মতি জানান।' : 'Please accept the terms.');
          setLoading(false);
          return;
        }
        const res = await register(email, password, displayName, language);
        if (!res.success) {
          setError(res.error || 'Registration failed');
        } else {
          onClose();
        }
      } else if (mode === 'otp') {
        if (!otpSent) {
          // Request OTP
          if (!email || !email.includes('@')) {
            setError(language === 'bn' ? 'সঠিক ইমেইল ঠিকানা লিখুন।' : 'Please enter a valid email address.');
            setLoading(false);
            return;
          }
          const res = await requestEmailOtp(email);
          if (res.success) {
            setOtpSent(true);
            setActiveOtp(res.otp || null);
            setSuccessMsg(
              language === 'bn'
                ? `আপনার ইমেইল (${email}) এ ৬ সংখ্যার লগইন ওটিপি পাঠানো হয়েছে: ${res.otp || '123456'}`
                : `A 6-digit login passcode has been sent to ${email}: ${res.otp || '123456'}`
            );
          } else {
            setError(res.error || 'Failed to send OTP');
          }
        } else {
          // Verify OTP
          const res = await loginWithOtp(email, otpCode);
          if (res.success) {
            onClose();
          } else {
            setError(res.error || (language === 'bn' ? 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি।' : 'Invalid or expired OTP.'));
          }
        }
      } else if (mode === 'forgot') {
        if (!resetSent) {
          // Request Password Reset Code
          if (!email || !email.includes('@')) {
            setError(language === 'bn' ? 'সঠিক ইমেইল ঠিকানা লিখুন।' : 'Please enter a valid email address.');
            setLoading(false);
            return;
          }
          const res = await requestPasswordReset(email);
          if (res.success) {
            setResetSent(true);
            setActiveResetCode(res.code || null);
            setSuccessMsg(
              language === 'bn'
                ? `আপনার ইমেইল (${email}) এ পাসওয়ার্ড রিসেট কোড পাঠানো হয়েছে: ${res.code || '839201'}`
                : `Password reset code sent to ${email}: ${res.code || '839201'}`
            );
          } else {
            setError(res.error || 'Failed to send code');
          }
        } else {
          // Reset Password
          if (newPassword.length < 6) {
            setError(language === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
            setLoading(false);
            return;
          }
          const res = await resetPassword(email, resetCode, newPassword);
          if (res.success) {
            setSuccessMsg(
              language === 'bn'
                ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! এখন লগইন করুন।'
                : 'Password reset successfully! Please sign in.'
            );
            setTimeout(() => {
              setMode('login');
              setPassword(newPassword);
              setResetSent(false);
            }, 1500);
          } else {
            setError(res.error || (language === 'bn' ? 'কোড যাচাই ব্যর্থ হয়েছে।' : 'Code verification failed.'));
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantAdminLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await login('admin@lostfound.bd', 'Admin@123456');
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Admin login failed');
      }
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
    resetAllStates();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              পেয়েছি • সিকিউর অথেনটিকেশন
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'login'
              ? (language === 'bn' ? 'নাগরিক একাউন্টে সাইন ইন' : 'Sign In to Citizen Account')
              : mode === 'register'
              ? (language === 'bn' ? 'নতুন একাউন্ট নিবন্ধন' : 'Register New Account')
              : mode === 'otp'
              ? (language === 'bn' ? 'পাসওয়ার্ড ছাড়া ওটিপি লগইন' : 'Passwordless OTP Sign In')
              : (language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার করুন' : 'Reset Your Password')}
          </h2>
          <p className="text-2xs text-slate-300 mt-1">
            {language === 'bn'
              ? 'নিরাপদ ইমেইল অথেনটিকেশন • কোনো প্রকাশ্য ফোন নম্বর নেই'
              : 'Secure email authentication with zero public phone leaks'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl text-2xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  mode === 'login'
                    ? 'bg-white text-emerald-900 shadow-2xs font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'পাসওয়ার্ড লগইন' : 'Password'}
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('otp')}
                className={`py-2 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                  mode === 'otp'
                    ? 'bg-white text-emerald-900 shadow-2xs font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{language === 'bn' ? 'ইমেইল ওটিপি' : 'Email OTP'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  mode === 'register'
                    ? 'bg-white text-emerald-900 shadow-2xs font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'নিবন্ধন' : 'Sign Up'}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.displayNameLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: আব্দুর রহিম' : 'e.g. Abdur Rahim'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.emailLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  disabled={(mode === 'otp' && otpSent) || (mode === 'forgot' && resetSent)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            {/* Password (Regular Login & Register only) */}
            {(mode === 'login' || mode === 'register') && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.passwordLabel} <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-xs text-emerald-700 hover:underline font-bold cursor-pointer"
                    >
                      {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Flow (Mode OTP) */}
            {mode === 'otp' && otpSent && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? '৬ সংখ্যার ওটিপি কোড' : '6-Digit Email Passcode'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    placeholder="e.g. 123456"
                    className="w-full pl-10 pr-3.5 py-2.5 text-base rounded-xl border border-emerald-300 font-mono tracking-widest text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-emerald-50/30"
                  />
                </div>
                <p className="text-3xs text-slate-500 mt-1">
                  {language === 'bn'
                    ? 'আপনার ইমেইলে প্রাপ্ত কোডটি টাইপ করুন।'
                    : 'Check your email inbox or spam folder for the passcode.'}
                </p>
              </div>
            )}

            {/* Forgot Password Flow */}
            {mode === 'forgot' && resetSent && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? '৬ সংখ্যার রিসেট কোড' : '6-Digit Reset Code'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.trim())}
                      placeholder="e.g. 839201"
                      className="w-full pl-10 pr-3.5 py-2.5 text-base rounded-xl border border-emerald-300 font-mono tracking-widest text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-emerald-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? 'নতুন পাসওয়ার্ড দিন' : 'Set New Password'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Terms checkbox on register */}
            {mode === 'register' && (
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <span>
                  {language === 'bn'
                    ? 'আমি প্ল্যাটফর্মের গোপনীয়তা নীতি ও ব্যবহারের শর্তাবলীতে সম্মতি জানাচ্ছি।'
                    : 'I agree to the privacy policy, anti-fraud rules, and terms of service.'}
                </span>
              </label>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {mode === 'login'
                      ? (language === 'bn' ? 'সাইন ইন করুন' : 'Sign In')
                      : mode === 'register'
                      ? (language === 'bn' ? 'একাউন্ট খুলুন' : 'Create Account')
                      : mode === 'otp'
                      ? otpSent
                        ? (language === 'bn' ? 'ওটিপি যাচাই করে প্রবেশ করুন' : 'Verify & Sign In')
                        : (language === 'bn' ? 'ইমেইলে ওটিপি কোড পাঠান' : 'Send One-Time Passcode')
                      : resetSent
                      ? (language === 'bn' ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Save New Password')
                      : (language === 'bn' ? 'রিসেট কোড পাঠান' : 'Send Reset Code')}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Back to Login if in Forgot mode */}
          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Sign In'}</span>
              </button>
            </div>
          )}

          {/* DEDICATED 1-CLICK ADMIN ACCESS SECTION */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span className="text-2xs uppercase tracking-wider font-extrabold text-purple-950">
                  {language === 'bn' ? 'অ্যাডমিন ও মডারেশন অ্যাক্সেস' : 'Admin & Moderation Access'}
                </span>
              </div>
              <span className="text-3xs text-purple-800 bg-purple-100 font-black px-2 py-0.5 rounded-md">
                ADMIN ACCESS
              </span>
            </div>

            <button
              type="button"
              onClick={handleInstantAdminLogin}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 text-purple-950 rounded-xl text-xs font-bold flex items-center justify-between transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <div className="text-left">
                  <span className="block font-black text-purple-950 group-hover:text-purple-800">
                    {language === 'bn' ? '১-ক্লিকে অ্যাডমিন লগইন (Admin Access)' : '1-Click Instant Admin Sign In'}
                  </span>
                  <span className="text-3xs text-purple-700 font-mono">
                    admin@lostfound.bd
                  </span>
                </div>
              </div>
              <span className="text-2xs bg-purple-700 text-white px-2.5 py-1 rounded-lg font-bold group-hover:bg-purple-800 transition-colors">
                ENTER →
              </span>
            </button>

            <button
              type="button"
              onClick={() => fillQuickAccount('user')}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>👤 {language === 'bn' ? 'সাধারণ নাগরিক একাউন্ট (Citizen Demo)' : 'Citizen Demo Account'}</span>
              <span className="text-3xs text-slate-500 font-mono">rahim@example.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
