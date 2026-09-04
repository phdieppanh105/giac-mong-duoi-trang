import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  LogOut,
  PlusCircle,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';
import { playDreamyChime } from '../lib/utils';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onOpenAddCharacter: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenProfile,
  onOpenAddCharacter,
  soundEnabled,
  setSoundEnabled,
}) => {
  const { user, profile, isAdmin, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      if (soundEnabled) playDreamyChime('sparkle');
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      if (soundEnabled) playDreamyChime('click');
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFDF7]/90 backdrop-blur-md border-b border-[#D9F0FF] shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-3">

        {/* Moon Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center justify-center cursor-pointer select-none"
          aria-label="Về đầu trang"
          title="Giấc Mộng Dưới Trăng"
        >
          <div className="w-11 h-11 rounded-full bg-[#D9F0FF] border border-[#89B9E6]/40 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-6deg] group-hover:shadow-md">
            <span className="text-[23px] leading-none text-[#31465A] transition-transform duration-300 group-hover:scale-110">
              ☾
            </span>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playDreamyChime('sparkle');
            }}
            title={
              soundEnabled
                ? 'Tắt âm thanh hiệu ứng'
                : 'Bật âm thanh huyền diệu'
            }
            className="w-9 h-9 rounded-full bg-[#FFFDF7]/90 border border-[#D9F0FF] text-[#31465A] hover:text-[#89B9E6] hover:bg-[#D9F0FF]/50 flex items-center justify-center transition-all shadow-sm"
            aria-label="Sound Toggle"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#89B9E6]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#31465A]/45" />
            )}
          </button>

          {/* Admin Area Quick Buttons */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (soundEnabled) playDreamyChime('sparkle');
                  onOpenAddCharacter();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#C7DFA3]/55 border border-[#C7DFA3] text-[#31465A] text-xs font-semibold shadow-sm hover:shadow-md hover:bg-[#C7DFA3]/80 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>＋ Thêm Nhân Vật</span>
              </button>

              <button
                onClick={() => {
                  if (soundEnabled) playDreamyChime('open');
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#D9F0FF] border border-[#89B9E6]/50 text-[#31465A] text-xs font-semibold hover:bg-[#89B9E6]/25 transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#31465A]" />
                <span className="hidden md:inline">Khu Vực Của Moon</span>
                <span className="md:hidden">Moon</span>
              </button>
            </div>
          )}

          {/* User Account / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (soundEnabled) playDreamyChime('click');
                  onOpenProfile();
                }}
                className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-[#FFFDF7]/90 border border-[#D9F0FF] hover:border-[#89B9E6]/60 hover:bg-[#D9F0FF]/35 transition-all shadow-sm cursor-pointer"
                title="Hồ sơ người dùng & Biệt danh"
              >
                {profile?.photoURL || user.photoURL ? (
                  <img
                    src={profile?.photoURL || user.photoURL || ''}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-[#89B9E6]/60"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#C7DFA3] text-[#31465A] flex items-center justify-center text-xs font-bold">
                    {profile?.nickname?.charAt(0) ||
                      user.displayName?.charAt(0) ||
                      '☾'}
                  </div>
                )}

                <span className="text-xs font-semibold text-[#31465A] max-w-[100px] truncate hidden sm:inline">
                  {profile?.nickname || user.displayName || 'Bảo bối'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="w-9 h-9 rounded-full bg-[#FFFDF7]/90 border border-[#D9F0FF] text-[#31465A]/70 hover:text-[#31465A] hover:bg-[#D9F0FF]/55 flex items-center justify-center transition-all shadow-sm"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleLogin}
                className="text-sm font-medium text-[#31465A]/80 hover:text-[#89B9E6] transition-colors cursor-pointer hidden sm:inline"
              >
                Đăng nhập
              </button>

              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-1.5 bg-[#C7DFA3] px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#31465A] shadow-sm hover:shadow-md hover:bg-[#C7DFA3]/80 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
