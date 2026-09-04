import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { compressImage, playDreamyChime } from '../lib/utils';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Save,
  Bot,
  HelpCircle,
  BookOpen,
  Info,
  MessageSquare,
  StickyNote,
  Tag,
  Quote,
} from 'lucide-react';

interface AdminCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterToEdit: Character | null;
  onSuccess: (savedChar: Character) => void;
  soundEnabled: boolean;
}

export const AdminCharacterModal: React.FC<AdminCharacterModalProps> = ({
  isOpen,
  onClose,
  characterToEdit,
  onSuccess,
  soundEnabled,
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [slogan, setSlogan] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [characterInfo, setCharacterInfo] = useState('');
  const [story, setStory] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [moonNote, setMoonNote] = useState('');
  const [googleAIStudioLink, setGoogleAIStudioLink] = useState('');
  const [nglLink, setNglLink] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name || '');
      setImage(characterToEdit.image || '');
      setSlogan(characterToEdit.slogan || '');
      setHashtags(characterToEdit.hashtags || '');
      setCharacterInfo(characterToEdit.characterInfo || '');
      setStory(characterToEdit.story || '');
      setFirstMessage(characterToEdit.firstMessage || '');
      setMoonNote(characterToEdit.moonNote || '');
      setGoogleAIStudioLink(characterToEdit.googleAIStudioLink || '');
      setNglLink(characterToEdit.nglLink || '');
    } else {
      setName('');
      setImage('');
      setSlogan('');
      setHashtags('');
      setCharacterInfo('');
      setStory('');
      setFirstMessage('');
      setMoonNote('');
      setGoogleAIStudioLink('');
      setNglLink('');
    }

    setErrorMsg('');
  }, [characterToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      setUploadingImage(true);
      setErrorMsg('');

      const compressedDataUrl = await compressImage(file, 900, 900, 0.85);
      setImage(compressedDataUrl);

      if (soundEnabled) playDreamyChime('sparkle');
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMsg('Không thể xử lý ảnh tải lên. Vui lòng chọn ảnh khác.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên nhân vật!');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      if (soundEnabled) playDreamyChime('sparkle');

      const nowIso = new Date().toISOString();

      const characterData: Omit<Character, 'id'> = {
        name: name.trim(),
        image: image.trim(),
        slogan: slogan.trim(),
        hashtags: hashtags.trim(),
        characterInfo: characterInfo.trim(),
        story: story.trim(),
        firstMessage: firstMessage.trim(),
        moonNote: moonNote.trim(),
        googleAIStudioLink: googleAIStudioLink.trim(),
        nglLink: nglLink.trim(),
        createdAt: characterToEdit?.createdAt || nowIso,
        updatedAt: nowIso,
        authorEmail: user?.email || '',
      };

      if (characterToEdit) {
        const docRef = doc(db, 'characters', characterToEdit.id);

        await setDoc(docRef, characterData, { merge: true });

        onSuccess({
          id: characterToEdit.id,
          ...characterData,
        });
      } else {
        const docRef = await addDoc(
          collection(db, 'characters'),
          characterData
        );

        onSuccess({
          id: docRef.id,
          ...characterData,
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving character:', error);

      setErrorMsg(
        'Đã xảy ra lỗi khi lưu nhân vật vào cơ sở dữ liệu. Vui lòng thử lại.'
      );

      handleFirestoreError(
        error,
        OperationType.WRITE,
        'characters'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#31465A]/55 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 text-[#31465A]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-[#FFFDF7] rounded-[36px] border border-[#89B9E6]/35 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#89B9E6]/25">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D9F0FF] text-[#31465A] flex items-center justify-center text-base font-bold shadow-sm">
                ☾
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#31465A]">
                  {characterToEdit
                    ? 'Chỉnh Sửa Nhân Vật'
                    : '＋ Thêm Nhân Vật Mới'}
                </h2>

                <span className="text-[11px] text-[#31465A]/55">
                  Khu vực quản trị Giấc Mộng Dưới Trăng
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#31465A]/45 hover:text-[#31465A] hover:bg-[#D9F0FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Scroll Container */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#D9F0FF] border border-[#89B9E6]/35 text-[#31465A] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Group 1: Basic Info */}
            <div className="space-y-4 bg-[#D9F0FF]/55 p-4 sm:p-5 rounded-3xl border border-[#89B9E6]/25">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#31465A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#89B9E6]" />
                Thông Tin Cơ Bản
              </h3>

              {/* Character Name */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1">
                  Tên nhân vật <span className="text-[#89B9E6]">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyệt Ảnh, Tuyết Y, Mộc Linh..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] focus:ring-2 focus:ring-[#89B9E6]/20 transition-all"
                />
              </div>

              {/* Character Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1">
                  Ảnh nhân vật
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-[#89B9E6]/45 overflow-hidden flex items-center justify-center shrink-0 relative group">
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="absolute inset-0 bg-[#31465A]/65 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                        >
                          Xóa ảnh
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-7 h-7 text-[#89B9E6]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C7DFA3] text-[#31465A] hover:bg-[#b7d18d] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingImage
                            ? 'Đang nén...'
                            : 'Tải ảnh từ thiết bị'}
                        </span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={image.startsWith('data:') ? '' : image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Hoặc dán liên kết URL hình ảnh..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-xs text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6]"
                    />
                  </div>
                </div>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <Quote className="w-3 h-3 text-[#89B9E6]" />
                  Slogan nhân vật
                </label>

                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Ví dụ: Gió thoảng qua rèm trúc, trăng sáng soi lòng người..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all"
                />
              </div>

              {/* Hashtag */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#C7DFA3]" />
                  Hashtag (phân cách bằng dấu phẩy)
                </label>

                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="Ví dụ: TienHiep, DiuDang, CoTrang, Gamebook"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all"
                />
              </div>
            </div>

            {/* Group 2: Content Details */}
            <div className="space-y-4 bg-[#FFFDF7] p-4 sm:p-5 rounded-3xl border border-[#89B9E6]/25">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#31465A] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#89B9E6]" />
                Nội Dung Nhân Vật & Cốt Truyện
              </h3>

              {/* Character Info */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#89B9E6]" />
                  Thông Tin Nhân Vật
                </label>

                <textarea
                  value={characterInfo}
                  onChange={(e) => setCharacterInfo(e.target.value)}
                  rows={3}
                  placeholder="Tuổi, tính cách, bối cảnh, sở thích, đặc điểm nổi bật..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-xs sm:text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all"
                />
              </div>

              {/* Story */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#89B9E6]" />
                  Cốt Truyện
                </label>

                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={5}
                  placeholder="Diễn biến câu chuyện, hành trình, sự kiện gamebook..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-xs sm:text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all font-serif"
                />
              </div>

              {/* First Message */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#89B9E6]" />
                  Tin Nhắn Đầu Tiên / Lời Nhắn Đầu
                </label>

                <textarea
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  rows={3}
                  placeholder="Lời thoại đầu tiên của nhân vật gửi tới bạn đọc..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-xs sm:text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all font-serif"
                />
              </div>

              {/* Moon's Note */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <StickyNote className="w-3 h-3 text-[#C7DFA3]" />
                  Ghi Chú Của Moon
                </label>

                <textarea
                  value={moonNote}
                  onChange={(e) => setMoonNote(e.target.value)}
                  rows={3}
                  placeholder="Lời nhắn nhủ đặc biệt từ Moon, hướng dẫn route, bí mật cốt truyện..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-xs sm:text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all"
                />
              </div>
            </div>

            {/* Group 3: External Links */}
            <div className="space-y-4 bg-[#D9F0FF]/40 p-4 sm:p-5 rounded-3xl border border-[#89B9E6]/25">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#31465A] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#89B9E6]" />
                Liên Kết Ngoài
              </h3>

              {/* Google AI Studio Link */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <Bot className="w-3 h-3 text-[#89B9E6]" />
                  Link Google AI Studio
                </label>

                <input
                  type="url"
                  value={googleAIStudioLink}
                  onChange={(e) => setGoogleAIStudioLink(e.target.value)}
                  placeholder="https://aistudio.google.com/..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all"
                />
              </div>

              {/* NGL Link */}
              <div>
                <label className="block text-xs font-bold text-[#31465A] mb-1 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-[#C7DFA3]" />
                  Link NGL / Giải Đáp Thắc Mắc
                </label>

                <input
                  type="url"
                  value={nglLink}
                  onChange={(e) => setNglLink(e.target.value)}
                  placeholder="https://ngl.link/..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#89B9E6]/30 text-sm text-[#31465A] placeholder-[#31465A]/35 focus:outline-hidden focus:border-[#89B9E6] transition-all"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#D9F0FF] hover:bg-[#c7e8fb] text-[#31465A] text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C7DFA3] hover:bg-[#b7d18d] text-[#31465A] text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />

                <span>
                  {saving
                    ? 'Đang lưu vào hệ thống...'
                    : 'LƯU NHÂN VẬT'}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
