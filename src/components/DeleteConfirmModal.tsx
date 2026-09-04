import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, Cloud, Moon } from 'lucide-react';
import { Character } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  character: Character | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  character,
  onConfirm,
  onCancel,
  deleting,
}) => {
  if (!isOpen || !character) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 overflow-y-auto bg-[#31465A]/45 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#FFFDF7] rounded-[32px] p-6 sm:p-7 border border-[#D9F0FF] shadow-[0_20px_60px_rgba(49,70,90,0.18)] overflow-hidden text-center"
        >
          {/* Decorative background */}
          <div className="pointer-events-none absolute -top-8 -right-8 text-[#89B9E6]/20">
            <Cloud className="w-24 h-24" />
          </div>

          <div className="pointer-events-none absolute -bottom-8 -left-8 text-[#C7DFA3]/30">
            <Moon className="w-20 h-20" />
          </div>

          {/* Main content */}
          <div className="relative z-10">
            {/* Warning icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D9F0FF] border border-[#89B9E6]/40 text-[#31465A] flex items-center justify-center mx-auto mb-4 shadow-sm"
            >
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-[#31465A] mb-2">
              Xác Nhận Xóa Nhân Vật
            </h3>

            {/* Character name */}
            <p className="text-xs sm:text-sm font-bold text-[#5f7890] mb-3">
              “{character.name}”
            </p>

            {/* Divider */}
            <div className="text-[#89B9E6] text-xs mb-4">
              ⊹•┈┈౨ৎ┈┈•⊹
            </div>

            {/* Warning message */}
            <div className="p-3.5 sm:p-4 bg-[#D9F0FF]/55 rounded-2xl border border-[#89B9E6]/25 mb-6">
              <p className="text-xs sm:text-sm text-[#31465A] leading-relaxed font-medium">
                Bạn có chắc chắn muốn xóa nhân vật này không? Hành động này không thể hoàn tác.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onCancel}
                disabled={deleting}
                className="px-5 py-2.5 rounded-full bg-[#D9F0FF] hover:bg-[#c9e8fa] text-[#31465A] text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#89B9E6]/20"
              >
                Hủy bỏ
              </button>

              <button
                onClick={onConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#31465A] hover:bg-[#26394b] text-[#FFFDF7] text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {deleting ? 'Đang xóa...' : 'XÓA NHÂN VẬT'}
                </span>
              </button>
            </div>

            {/* Bottom decoration */}
            <div className="mt-5 text-[#89B9E6] text-xs">
              ☾ · · · ☁︎ · · · ☾
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
