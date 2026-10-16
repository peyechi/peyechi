import React, { useState } from 'react';
import {
  Compass,
  PlusCircle,
  Shield,
  User as UserIcon,
  LogOut,
  FileText,
  FileQuestion,
  Lock,
  Globe,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

import { PeyechiLogo } from './PeyechiLogo.tsx';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  const handleNav = (page: string, params?: any) => {
    onNavigate(page, params);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-bar: Brand slogan & quick access */}
      <div className="bg-emerald-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="truncate text-emerald-200 font-medium">
              {language === 'bn'
                ? 'পেয়েছি — হারানো জিনিস ফিরে আসুক আপন ঠিকানায়।'
                : 'Peyechi — Reconnecting lost belongings with their rightful owners.'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Admin Access Button for review / testing */}
            <button
              onClick={() => handleNav('admin')}
              className="flex items-center gap-1 text-3xs sm:text-2xs bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-emerald-700/80 transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{language === 'bn' ? 'অ্যাডমিন অ্যাক্সেস' : 'Admin'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-700 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo with Peyechi typography & map pin & sparkles */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group py-1"
          >
            <PeyechiLogo variant="full" showTagline={true} />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('explore')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentPage === 'explore'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>{t.navExplore}</span>
            </button>

            <button
              onClick={() => handleNav('report-lost')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentPage === 'report-lost'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-rose-700 hover:bg-rose-50/60'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>{t.navReportLost}</span>
            </button>

            <button
              onClick={() => handleNav('report-found')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentPage === 'report-found'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>{t.navReportFound}</span>
            </button>

            <button
              onClick={() => handleNav('safety')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentPage === 'safety'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>{t.navSafety}</span>
            </button>

            {/* Direct Admin Access Button */}
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors ${
                currentPage.startsWith('admin')
                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Lock className="w-4 h-4 text-purple-600" />
              <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin'}</span>
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-800"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.display_name}</span>
                  {user.role === 'ADMIN' && (
                    <span className="text-3xs bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-sm">
                      ADMIN
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.display_name}</p>
                    </div>

                    <button
                      onClick={() => handleNav('my-posts')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>{t.navMyPosts}</span>
                    </button>

                    <button
                      onClick={() => handleNav('my-claims')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileQuestion className="w-4 h-4 text-slate-400" />
                      <span>{t.navMyClaims}</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-medium"
                      >
                        <Lock className="w-4 h-4 text-purple-600" />
                        <span>{t.navAdmin}</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.navLogout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.navLogin}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('explore')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>{t.navExplore}</span>
          </button>

          <button
            onClick={() => handleNav('report-lost')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50/60 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-rose-600" />
            <span>{t.navReportLost}</span>
          </button>

          <button
            onClick={() => handleNav('report-found')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50/60 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>{t.navReportFound}</span>
          </button>

          <button
            onClick={() => handleNav('safety')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-slate-500" />
            <span>{t.navSafety}</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50 flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-purple-600" />
            <span>{language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
          </button>

          {user && (
            <>
              <div className="border-t border-slate-100 my-2 pt-2"></div>
              <button
                onClick={() => handleNav('my-posts')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>{t.navMyPosts}</span>
              </button>

              <button
                onClick={() => handleNav('my-claims')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <FileQuestion className="w-4 h-4 text-slate-500" />
                <span>{t.navMyClaims}</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>{t.navAdmin}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout}</span>
              </button>
            </>
          )}

          {!user && (
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.navLogin}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
