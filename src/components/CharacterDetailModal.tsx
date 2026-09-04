import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, TabType } from '../types';
import { CommentSection } from './CommentSection';
import {
  X,
  Sparkles,
  BookOpen,
  Info,
  MessageSquare,
  StickyNote,
  ExternalLink,
  Share2,
  Edit3,
  Trash2,
  HelpCircle,
  Bot,
  Check,
  ArrowLeft,
  Moon,
  Cloud,
} from 'lucide-react';
import { playDreamyChime } from '../lib/utils';

interface CharacterDetailModalProps {
  character: Character | null;
  onClose: () => void;
  onEdit?: (character: Character) => void;
  onDelete?: (character: Character) => void;
  isAdmin: boolean;
  soundEnabled: boolean;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  onEdit,
  onDelete,
  isAdmin,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INFO);
  const [copied, setCopied] = useState(false);

  if (!character) return null;

  const hashtagsList = character.hashtags
    ? character.hashtags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean)
    : [];

  const handleShare = () => {
    if (soundEnabled) playDreamyChime('sparkle');

    const shareUrl = `${window.location.origin}${window.location.pathname}?character=${character.id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        prompt('Sao chép đường dẫn nhân vật này:', shareUrl);
      });
  };

  const tabs = [
    { id: TabType.INFO, label: 'Thông Tin Nhân Vật', icon: Info },
    { id: TabType.STORY, label: 'Cốt Truyện', icon: BookOpen },
    { id: TabType.FIRST_MESSAGE, label: 'Lời Nhắn Đầu Tiên', icon: MessageSquare },
    { id: TabType.MOON_NOTE, label: 'Ghi Chú Của Moon', icon: StickyNote },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#31465A]/55 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-[#FFFDF7]/95 backdrop-blur-xl rounded-[36px] border border-[#D9F0FF] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#31465A]"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#FFFDF7]/92 backdrop-blur-md border-b border-[#D9F0FF]">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9F0FF]/60 hover:bg-[#D9F0FF] text-[#31465A] text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Share */}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C7DFA3]/65 hover:bg-[#C7DFA3] text-[#31465A] text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="Sao chép link chia sẻ"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#31465A]" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
              </button>

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => onEdit?.(character)}
                    className="p-2 rounded-full bg-[#D9F0FF] hover:bg-[#89B9E6]/30 text-[#31465A] transition-all"
                    title="Chỉnh sửa nhân vật"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete?.(character)}
                    className="p-2 rounded-full bg-[#FFFDF7] border border-[#D9F0FF] hover:bg-red-500 hover:text-white hover:border-red-500 text-red-500 transition-all"
                    title="Xóa nhân vật"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#31465A]/45 hover:text-[#31465A] hover:bg-[#D9F0FF]/60 transition-all"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">

            {/* Character Hero */}
            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* Character Image */}
              <div className="w-full md:w-56 lg:w-64 shrink-0">
                <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#D9F0FF] via-[#FFFDF7] to-[#C7DFA3]/50 border border-[#D9F0FF] shadow-md">
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#31465A]/40">
                      <Moon className="w-12 h-12 mb-3 text-[#89B9E6]" />
                      <span className="text-xs font-semibold text-[#31465A]/60">
                        Giấc Mộng Dưới Trăng
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#31465A]/30 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFFDF7]/75 backdrop-blur-sm flex items-center justify-center">
                    <Cloud className="w-4 h-4 text-[#89B9E6]" />
                  </div>
                </div>
              </div>

              {/* Character Overview */}
              <div className="flex-1 flex flex-col justify-between self-stretch">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#D9F0FF] text-[#31465A] text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#89B9E6]" />
                      Nhân Vật Gamebook
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-[#31465A] tracking-tight mb-2">
                    {character.name}
                  </h1>

                  {character.slogan && (
                    <p className="text-sm sm:text-base italic font-serif text-[#31465A]/75 mb-4 bg-[#C7DFA3]/20 p-3.5 rounded-2xl border border-[#C7DFA3]/60 leading-relaxed">
                      “{character.slogan}”
                    </p>
                  )}

                  {hashtagsList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {hashtagsList.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#FFFDF7] border border-[#D9F0FF] text-[#31465A]/75 shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* External Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-[#D9F0FF]">

                  {/* Google AI Studio */}
                  {character.googleAIStudioLink ? (
                    <a
                      href={character.googleAIStudioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#D9F0FF] hover:bg-[#89B9E6]/30 text-[#31465A] text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all border border-[#89B9E6]/40"
                    >
                      <Bot className="w-4 h-4 text-[#89B9E6]" />
                      <span>Truy Cập GGAI STUDIO</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#D9F0FF]/45 text-[#31465A]/35 text-xs sm:text-sm font-medium cursor-not-allowed"
                    >
                      <Bot className="w-4 h-4" />
                      <span>GGAI STUDIO (Chưa có link)</span>
                    </button>
                  )}

                  {/* NGL */}
                  {character.nglLink ? (
                    <a
                      href={character.nglLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#C7DFA3]/60 hover:bg-[#C7DFA3] text-[#31465A] text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all border border-[#C7DFA3]"
                    >
                      <HelpCircle className="w-4 h-4 text-[#31465A]" />
                      <span>Giải Đáp Thắc Mắc (NGL)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#C7DFA3]/20 text-[#31465A]/35 text-xs sm:text-sm font-medium cursor-not-allowed"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Giải Đáp Thắc Mắc (Chưa có link)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[#D9F0FF]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (soundEnabled) playDreamyChime('click');
                        setActiveTab(tab.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#31465A] text-[#FFFDF7] shadow-sm'
                          : 'bg-[#FFFDF7] text-[#31465A]/70 hover:bg-[#D9F0FF]/55 border border-[#D9F0FF]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-[#FFFDF7]/85 rounded-3xl p-5 sm:p-6 border border-[#D9F0FF] shadow-sm min-h-[160px]">

              {/* INFO */}
              {activeTab === TabType.INFO && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#31465A]">
                    <Info className="w-4 h-4 text-[#89B9E6]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Thông Tin Nhân Vật
                    </h3>
                  </div>

                  {character.characterInfo ? (
                    <div className="text-xs sm:text-sm text-[#31465A]/85 leading-relaxed whitespace-pre-wrap">
                      {character.characterInfo}
                    </div>
                  ) : (
                    <p className="text-xs text-[#31465A]/40 italic">
                      Chưa có thông tin nhân vật.
                    </p>
                  )}
                </div>
              )}

              {/* STORY */}
              {activeTab === TabType.STORY && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#31465A]">
                    <BookOpen className="w-4 h-4 text-[#89B9E6]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Cốt Truyện
                    </h3>
                  </div>

                  {character.story ? (
                    <div className="max-h-[420px] overflow-y-auto pr-2 text-xs sm:text-sm text-[#31465A]/85 leading-relaxed whitespace-pre-wrap space-y-3 font-serif">
                      {character.story}
                    </div>
                  ) : (
                    <p className="text-xs text-[#31465A]/40 italic">
                      Chưa có cốt truyện.
                    </p>
                  )}
                </div>
              )}

              {/* FIRST MESSAGE */}
              {activeTab === TabType.FIRST_MESSAGE && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#31465A]">
                    <MessageSquare className="w-4 h-4 text-[#89B9E6]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Lời Nhắn Đầu Tiên
                    </h3>
                  </div>

                  {character.firstMessage ? (
                    <div className="p-4 rounded-2xl bg-[#D9F0FF]/55 border border-[#89B9E6]/30 text-xs sm:text-sm text-[#31465A]/85 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto font-serif">
                      {character.firstMessage}
                    </div>
                  ) : (
                    <p className="text-xs text-[#31465A]/40 italic">
                      Chưa có lời nhắn đầu tiên.
                    </p>
                  )}
                </div>
              )}

              {/* MOON NOTE */}
              {activeTab === TabType.MOON_NOTE && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#31465A]">
                    <StickyNote className="w-4 h-4 text-[#C7DFA3]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Ghi Chú Của Moon
                    </h3>
                  </div>

                  {character.moonNote ? (
                    <div className="p-4 rounded-2xl bg-[#C7DFA3]/25 border border-[#C7DFA3]/65 text-xs sm:text-sm text-[#31465A]/85 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                      {character.moonNote}
                    </div>
                  ) : (
                    <p className="text-xs text-[#31465A]/40 italic">
                      Chưa có ghi chú của Moon.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Comments */}
            <CommentSection
              characterId={character.id}
              characterName={character.name}
              soundEnabled={soundEnabled}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
