import React from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';
import {
  Sparkles,
  Edit3,
  Trash2,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
} from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onEdit?: (character: Character) => void;
  onDelete?: (character: Character) => void;
  isAdmin: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const hashtagsList = character.hashtags
    ? character.hashtags
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="
        group relative flex flex-col h-full
        overflow-hidden
        rounded-[28px]
        border border-[#D9F0FF]
        bg-[#FFFDF7]
        shadow-[0_10px_30px_rgba(49,70,90,0.08)]
        transition-all duration-300
        hover:border-[#89B9E6]
        hover:shadow-[0_16px_38px_rgba(49,70,90,0.14)]
      "
    >
      {/* =========================
          IMAGE
      ========================== */}
      <div
        onClick={() => onSelect(character)}
        className="
          relative w-full aspect-[4/5]
          overflow-hidden
          cursor-pointer
          bg-[#D9F0FF]
        "
      >
        {character.image ? (
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="
              w-full h-full
              object-cover object-center
              transition-transform duration-700
              group-hover:scale-[1.045]
            "
          />
        ) : (
          <div
            className="
              w-full h-full
              flex flex-col items-center justify-center
              bg-gradient-to-br
              from-[#D9F0FF]
              via-[#FFFDF7]
              to-[#C7DFA3]
            "
          >
            <span className="mb-3 text-5xl text-[#31465A]">
              ☾
            </span>

            <span className="text-[11px] font-semibold tracking-[0.12em] text-[#31465A]/70">
              GIẤC MỘNG DƯỚI TRĂNG
            </span>
          </div>
        )}

        {/* Image overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#31465A]/45
            via-transparent
            to-[#31465A]/5
            opacity-80
            transition-opacity duration-300
            group-hover:opacity-60
          "
        />

        {/* =========================
            EXPLORE
        ========================== */}
        <button
          type="button"
          onClick={() => onSelect(character)}
          className="
            absolute bottom-3 right-3 z-10
            flex items-center gap-1.5
            rounded-full
            border border-white/70
            bg-[#FFFDF7]/95
            px-3 py-1.5
            text-[11px]
            font-bold
            tracking-wide
            text-[#31465A]
            shadow-sm
            backdrop-blur-sm
            transition-all duration-200
            hover:bg-[#C7DFA3]
            hover:scale-[1.03]
          "
        >
          <BookOpen className="h-3 w-3" />

          <span>Khám phá</span>

          <ArrowUpRight className="h-3 w-3" />
        </button>

        {/* =========================
            ADMIN ACTIONS
        ========================== */}
        {isAdmin && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(character);
              }}
              title="Chỉnh sửa nhân vật"
              className="
                rounded-full
                border border-white/70
                bg-[#FFFDF7]/95
                p-2
                text-[#31465A]
                shadow-sm
                backdrop-blur-sm
                transition-all
                hover:bg-[#C7DFA3]
                hover:scale-105
              "
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(character);
              }}
              title="Xóa nhân vật"
              className="
                rounded-full
                border border-white/70
                bg-[#FFFDF7]/95
                p-2
                text-[#31465A]
                shadow-sm
                backdrop-blur-sm
                transition-all
                hover:bg-[#31465A]
                hover:text-[#FFFDF7]
                hover:scale-105
              "
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* =========================
          CARD BODY
      ========================== */}
      <div
        onClick={() => onSelect(character)}
        className="
          flex flex-1
          cursor-pointer
          select-none
          flex-col
          justify-between
          p-5
        "
      >
        <div>
          {/* Character name */}
          <div className="mb-2 flex items-start gap-2">
            <div
              className="
                mt-0.5 flex h-6 w-6
                shrink-0 items-center justify-center
                rounded-full
                bg-[#D9F0FF]
                text-[#31465A]
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <h3
              className="
                line-clamp-2
                text-[15px]
                font-bold
                leading-snug
                tracking-wide
                text-[#31465A]
                transition-colors duration-200
                group-hover:text-[#89B9E6]
              "
            >
              {character.name}
            </h3>
          </div>

          {/* Slogan */}
          {character.slogan && (
            <p
              className="
                mb-4
                line-clamp-3
                text-xs
                leading-relaxed
                italic
                text-[#31465A]/65
              "
            >
              “{character.slogan}”
            </p>
          )}
        </div>

        {/* =========================
            HASHTAGS / FOOTER
        ========================== */}
        <div
          className="
            mt-4
            border-t border-[#D9F0FF]
            pt-3.5
          "
        >
          {hashtagsList.length > 0 ? (
            <div className="flex flex-wrap gap-x-2 gap-y-1.5">
              {hashtagsList.slice(0, 3).map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="
                    rounded-full
                    border border-[#C7DFA3]
                    bg-[#C7DFA3]/45
                    px-2.5 py-1
                    text-[10px]
                    font-semibold
                    tracking-wide
                    text-[#31465A]
                    transition-colors
                    group-hover:bg-[#D9F0FF]
                    group-hover:border-[#89B9E6]/50
                  "
                >
                  #{tag}
                </span>
              ))}

              {hashtagsList.length > 3 && (
                <span
                  className="
                    self-center
                    text-[10px]
                    font-semibold
                    text-[#31465A]/45
                  "
                >
                  +{hashtagsList.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span
              className="
                flex items-center gap-1.5
                text-[10px]
                font-medium
                tracking-wide
                text-[#31465A]/50
              "
            >
              <MessageCircle className="h-3 w-3 text-[#89B9E6]" />
              Chạm để đọc cốt truyện
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
