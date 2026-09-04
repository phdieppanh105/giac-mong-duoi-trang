import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import {
  PlusCircle,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  Cloud,
  Moon,
  Sparkles,
} from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

interface AdminZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onAddNew: () => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
  onView: (character: Character) => void;
}

export const AdminZoneModal: React.FC<AdminZoneModalProps> = ({
  isOpen,
  onClose,
  characters,
  onAddNew,
  onEdit,
  onDelete,
  onView,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#31465A]/45 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 text-[#536b80]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-[#FFFDF7] rounded-[32px] border border-[#D9F0FF] shadow-[0_25px_70px_rgba(49,70,90,0.22)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Decorative background */}
          <Cloud className="absolute -right-8 -top-10 w-32 h-32 text-[#89B9E6]/10 pointer-events-none" />
          <Moon className="absolute -left-8 -bottom-10 w-28 h-28 text-[#C7DFA3]/15 pointer-events-none" />

          {/* =====================================================
              HEADER
          ====================================================== */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 py-4 bg-[#D9F0FF]/45 border-b border-[#89B9E6]/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#FFFDF7] border border-[#89B9E6]/35 text-[#31465A] flex items-center justify-center shadow-sm shrink-0">
                <Moon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-[#31465A] flex items-center gap-2 flex-wrap">
                  <span>KHU VỰC CỦA MOON</span>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#C7DFA3]/60 border border-[#C7DFA3] text-[#31465A] text-[10px] sm:text-xs font-bold">
                    Admin
                  </span>
                </h2>

                <span className="text-[10px] sm:text-xs text-[#71899d] block mt-0.5">
                  Quản lý nội dung gamebook & hệ thống nhân vật
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#91a5b6] hover:text-[#31465A] hover:bg-[#D9F0FF] transition-colors cursor-pointer shrink-0"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* =====================================================
              ACTION BAR
          ====================================================== */}
          <div className="relative z-10 px-5 sm:px-6 py-3.5 bg-[#FFFDF7] border-b border-[#D9F0FF] flex items-center justify-between flex-wrap gap-2.5">
            <div className="text-xs font-semibold text-[#5f7890]">
              Tổng số nhân vật hiện có:{' '}
              <strong className="text-[#31465A] font-bold">
                {characters.length}
              </strong>
            </div>

            <button
              onClick={() => {
                onClose();
                onAddNew();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#31465A] hover:bg-[#26394b] text-[#FFFDF7] text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>＋ Thêm Nhân Vật Mới</span>
            </button>
          </div>

          {/* =====================================================
              CHARACTERS LIST
          ====================================================== */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
            {characters.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#D9F0FF] border border-[#89B9E6]/30 flex items-center justify-center mx-auto mb-3 text-[#31465A] shadow-sm">
                  <Moon className="w-7 h-7" />
                </div>

                <h4 className="text-base font-bold text-[#31465A] mb-1">
                  Danh sách hoàn toàn trống
                </h4>

                <p className="text-xs text-[#71899d] max-w-sm mx-auto mb-5 leading-relaxed">
                  Chưa có nhân vật nào trong cơ sở dữ liệu. Bấm nút bên dưới để tạo nhân vật đầu tiên cho website.
                </p>

                <button
                  onClick={() => {
                    onClose();
                    onAddNew();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#31465A] text-[#FFFDF7] hover:bg-[#26394b] text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>＋ Thêm Nhân Vật Đầu Tiên</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className="p-3.5 bg-[#FFFDF7] rounded-[20px] border border-[#D9F0FF] shadow-sm hover:shadow-md hover:border-[#89B9E6]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Character preview */}
                    <div
                      onClick={() => {
                        onClose();
                        onView(char);
                      }}
                      className="flex items-center gap-3 cursor-pointer group min-w-0"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#D9F0FF]/55 shrink-0 border border-[#89B9E6]/25">
                        {char.image ? (
                          <img
                            src={char.image}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#31465A]">
                            <Moon className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#31465A] group-hover:text-[#5f7890] transition-colors truncate">
                          {char.name}
                        </h4>

                        {char.slogan && (
                          <p className="text-xs text-[#71899d] italic line-clamp-1 font-serif">
                            “{char.slogan}”
                          </p>
                        )}

                        <span className="text-[10px] text-[#91a5b6] block mt-0.5">
                          Tạo lúc: {formatRelativeTime(char.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        QUICK ADMIN ACTIONS
                    ================================================== */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onClose();
                          onView(char);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#D9F0FF]/70 hover:bg-[#D9F0FF] text-[#31465A] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xem trang nhân vật"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onEdit(char);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#C7DFA3]/45 hover:bg-[#C7DFA3]/70 text-[#31465A] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Chỉnh sửa nhân vật"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => {
                          onDelete(char);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#31465A] hover:bg-[#26394b] text-[#FFFDF7] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xóa nhân vật"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =====================================================
              FOOTER DECORATION
          ====================================================== */}
          <div className="relative z-10 px-6 py-2.5 border-t border-[#D9F0FF] bg-[#D9F0FF]/20 text-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-[#89B9E6]">
              <Sparkles className="w-3 h-3" />
              ⊹•┈┈౨ৎ┈┈•⊹
              <Moon className="w-3 h-3" />
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
