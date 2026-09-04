import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { compressImage, playDreamyChime } from '../lib/utils';
import { X, User, Upload, Check, Smile, Shield, Moon, Cloud } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

const DREAMY_AVATARS = [
  '🌙',
  '✨',
  '🌸',
  '🐰',
  '🐱',
  '🦋',
  '☁️',
  '🔮',
  '🧸',
  '🍓',
  '🎀',
  '⭐',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const { user, profile, isAdmin, saveUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setNickname(profile?.nickname || user.displayName || '');
      setPhotoURL(profile?.photoURL || user.photoURL || '');
    }

    setSuccessMsg('');
  }, [user, profile, isOpen]);

  if (!isOpen || !user) return null;

  const handleAvatarFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);

      const compressed = await compressImage(
        files[0],
        400,
        400,
        0.85
      );

      setPhotoURL(compressed);

      if (soundEnabled) {
        playDreamyChime('sparkle');
      }
    } catch (err) {
      console.error('Error compressing avatar:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSelectEmojiAvatar = (emoji: string) => {
    const canvas = document.createElement('canvas');

    canvas.width = 120;
    canvas.height = 120;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#D9F0FF';
      ctx.fillRect(0, 0, 120, 120);

      ctx.font = '70px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(emoji, 60, 65);

      setPhotoURL(canvas.toDataURL('image/png'));

      if (soundEnabled) {
        playDreamyChime('sparkle');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      if (soundEnabled) {
        playDreamyChime('sparkle');
      }

      await saveUserProfile(nickname, photoURL);

      setSuccessMsg('Đã cập nhật hồ sơ thành công!');

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#31465A]/55 backdrop-blur-md flex items-center justify-center p-4 text-[#31465A]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{
            duration: 0.25,
            ease: 'easeOut',
          }}
          className="relative w-full max-w-md bg-[#FFFDF7] rounded-[32px] border border-[#D9F0FF] shadow-2xl overflow-hidden"
        >
          {/* Decorative ambient details */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[#C7DFA3]/30 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-[#89B9E6]/20 blur-2xl pointer-events-none" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D9F0FF] mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#D9F0FF] text-[#31465A] flex items-center justify-center border border-[#89B9E6]/30">
                  <Moon className="w-4 h-4" />

                  <span className="absolute -right-1 -bottom-1 text-[10px]">
                    ☁︎
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#31465A] tracking-tight">
                    Hồ Sơ Của Bạn
                  </h3>

                  <span className="text-[11px] text-[#89B9E6]">
                    Tùy chỉnh biệt danh và ảnh đại diện
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-full text-[#89B9E6] hover:text-[#31465A] hover:bg-[#D9F0FF] transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success message */}
            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-2xl bg-[#C7DFA3]/35 border border-[#C7DFA3] text-[#31465A] text-xs font-semibold flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C7DFA3] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#31465A]" />
                  </div>

                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Avatar Selection Area */}
              <div className="flex flex-col items-center justify-center pb-2">
                <div className="relative group mb-3">
                  <div className="absolute inset-[-5px] rounded-full border border-[#C7DFA3]/70 pointer-events-none" />

                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#89B9E6] shadow-sm bg-[#D9F0FF] flex items-center justify-center">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-9 h-9 text-[#89B9E6]" />
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#31465A] text-[#FFFDF7] shadow-sm hover:bg-[#89B9E6] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Tải ảnh từ máy"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] text-[#89B9E6] mb-2 text-center">
                  {uploadingImage
                    ? 'Đang nén ảnh...'
                    : 'Chạm nút để tải ảnh từ thiết bị'}
                </span>

                {/* Quick Dreamy Avatars */}
                <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                  {DREAMY_AVATARS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelectEmojiAvatar(emoji)}
                      whileHover={{ scale: 1.1, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-7 h-7 rounded-lg bg-[#D9F0FF]/60 hover:bg-[#C7DFA3]/55 flex items-center justify-center text-sm transition-colors cursor-pointer border border-[#89B9E6]/25"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 text-[#89B9E6] text-[10px] select-none">
                <span>⊹</span>
                <span>•┈┈౨ৎ┈┈•</span>
                <span>⊹</span>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1.5 flex items-center justify-between">
                  <span>Biệt Danh Hiển Thị</span>

                  <span className="text-[10px] text-[#89B9E6] font-normal">
                    Ưu tiên khi bình luận
                  </span>
                </label>

                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nhập biệt danh của bạn..."
                  maxLength={40}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#D9F0FF] text-xs sm:text-sm text-[#31465A] placeholder-[#89B9E6]/70 focus:outline-none focus:border-[#89B9E6] focus:ring-2 focus:ring-[#89B9E6]/20 transition-all"
                />
              </div>

              {/* Google account */}
              <div className="p-3 bg-[#D9F0FF]/45 rounded-2xl border border-[#D9F0FF] flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#FFFDF7] border border-[#89B9E6]/30 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-[#89B9E6]" />
                  </div>

                  <span className="text-[#89B9E6]">
                    Tài khoản Google:
                  </span>
                </div>

                <span className="font-semibold text-[#31465A] truncate max-w-[190px]">
                  {user.email}
                </span>
              </div>

              {/* Admin notice */}
              {isAdmin && (
                <div className="p-3 bg-[#C7DFA3]/30 rounded-2xl border border-[#C7DFA3] text-[11px] text-[#31465A] font-semibold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C7DFA3] flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5 text-[#31465A]" />
                  </div>

                  <span>
                    Bạn đang đăng nhập với quyền Quản Trị Viên (Moon)
                  </span>
                </div>
              )}

              {/* Save Actions */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-[#D9F0FF] hover:bg-[#89B9E6]/25 text-[#31465A] text-xs font-bold transition-colors cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 rounded-full bg-[#31465A] hover:bg-[#89B9E6] text-[#FFFDF7] text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>

            {/* Bottom dreamy decoration */}
            <div className="mt-5 pt-3 border-t border-[#D9F0FF] flex items-center justify-center gap-2 text-[#89B9E6] text-[10px] select-none">
              <span>☾</span>
              <span>⊹•┈┈౨ৎ┈┈•⊹</span>
              <span>☁︎</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
