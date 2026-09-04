import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Sparkles,
  Edit3,
  Trash2,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
  Heart,
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
  const { user, login } = useAuth();

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const hashtagsList = character.hashtags
    ? character.hashtags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean)
    : [];

  /*
   * ==========================================
   * REALTIME LIKES
   * ==========================================
   *
   * Mỗi character có một subcollection:
   *
   * characters/{characterId}/likes/{userId}
   *
   * Mỗi Google account chỉ có một document.
   */
  useEffect(() => {
    const likesRef = collection(
      db,
      'characters',
      character.id,
      'likes'
    );

    const unsubscribe = onSnapshot(
      likesRef,
      (snapshot) => {
        setLikesCount(snapshot.size);

        if (user) {
          setIsLiked(
            snapshot.docs.some((likeDoc) => likeDoc.id === user.uid)
          );
        } else {
          setIsLiked(false);
        }
      },
      (error) => {
        console.error('Error listening to character likes:', error);
      }
    );

    return () => unsubscribe();
  }, [character.id, user]);

  /*
   * ==========================================
   * LIKE / UNLIKE
   * ==========================================
   */
  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (isLiking) return;

    /*
     * Chưa đăng nhập:
     * mở Google Login trước.
     */
    if (!user) {
      try {
        await login();
      } catch (error) {
        console.error('Login failed:', error);
      }

      return;
    }

    try {
      setIsLiking(true);

      const likeRef = doc(
        db,
        'characters',
        character.id,
        'likes',
        user.uid
      );

      if (isLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, {
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="
        group relative flex flex-col h-full
        bg-[#FFFDF7]/90
        backdrop-blur-md
        rounded-[28px]
        border border-[#D9F0FF]
        shadow-md
        hover:shadow-lg
        hover:border-[#89B9E6]/50
        transition-all
        overflow-hidden
      "
    >
      {/* ==========================================
          TOP MEDIA
          ========================================== */}
      <div
        onClick={() => onSelect(character)}
        className="
          relative w-full
          aspect-[4/5]
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
              object-cover
              object-center
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />
        ) : (
          <div
            className="
              w-full h-full
              flex flex-col
              items-center justify-center
              bg-gradient-to-br
              from-[#D9F0FF]
              via-[#FFFDF7]
              to-[#C7DFA3]/40
              text-[#31465A]
            "
          >
            <span className="text-4xl mb-2">
              ☾
            </span>

            <span className="text-xs font-semibold">
              Giấc Mộng Dưới Trăng
            </span>
          </div>
        )}

        {/* Soft overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#31465A]/45
            via-transparent
            to-transparent
            opacity-70
            group-hover:opacity-50
            transition-opacity
          "
        />

        {/* ==========================================
            LIKE BUTTON
            ========================================== */}
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          aria-label={isLiked ? 'Bỏ thích' : 'Thích nhân vật'}
          title={
            user
              ? isLiked
                ? 'Bỏ thích'
                : 'Thích nhân vật'
              : 'Đăng nhập Google để thả tim'
          }
          className="
            absolute
            left-3
            bottom-3
            z-20
            flex
            items-center
            gap-1.5
            px-3
            py-1.5
            rounded-full
            bg-[#FFFDF7]/95
            backdrop-blur-sm
            border border-[#D9F0FF]
            shadow-sm
            transition-all
            cursor-pointer
            disabled:opacity-60
            hover:scale-105
          "
        >
          <Heart
            className={`
              w-3.5 h-3.5
              transition-all
              ${
                isLiked
                  ? 'fill-[#31465A] text-[#31465A] scale-110'
                  : 'text-[#31465A]'
              }
            `}
          />

          <span className="text-[11px] font-bold text-[#31465A]">
            {likesCount}
          </span>
        </button>

        {/* ==========================================
            EXPLORE
            ========================================== */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(character);
          }}
          className="
            absolute
            bottom-3
            right-3
            z-20
            px-3
            py-1.5
            rounded-full
            bg-[#FFFDF7]/95
            backdrop-blur-sm
            text-[#31465A]
            text-[11px]
            font-bold
            flex
            items-center
            gap-1
            shadow-sm
            hover:bg-[#C7DFA3]
            transition-colors
            cursor-pointer
          "
        >
          <BookOpen className="w-3 h-3" />

          <span>
            Khám Phá
          </span>

          <ArrowUpRight className="w-3 h-3" />
        </button>

        {/* ==========================================
            ADMIN ACTIONS
            ========================================== */}
        {isAdmin && (
          <div
            className="
              absolute
              top-3
              right-3
              flex
              items-center
              gap-1.5
              z-20
            "
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(character);
              }}
              title="Chỉnh sửa nhân vật"
              className="
                p-2
                rounded-full
                bg-[#FFFDF7]/95
                backdrop-blur-sm
                text-[#31465A]
                hover:bg-[#C7DFA3]
                transition-all
                shadow-sm
                cursor-pointer
              "
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(character);
              }}
              title="Xóa nhân vật"
              className="
                p-2
                rounded-full
                bg-[#FFFDF7]/95
                backdrop-blur-sm
                text-[#31465A]
                hover:bg-[#31465A]
                hover:text-[#FFFDF7]
                transition-all
                shadow-sm
                cursor-pointer
              "
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ==========================================
          BODY
          ========================================== */}
      <div
        onClick={() => onSelect(character)}
        className="
          flex-1
          p-5
          sm:p-6
          flex flex-col
          justify-between
          cursor-pointer
          select-none
        "
      >
        <div>
          {/* Character Name */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#89B9E6] shrink-0" />

            <h3
              className="
                text-base
                sm:text-lg
                font-bold
                text-[#31465A]
                group-hover:text-[#89B9E6]
                transition-colors
                line-clamp-1
              "
            >
              {character.name}
            </h3>
          </div>

          {/* Slogan */}
          {character.slogan && (
            <p
              className="
                text-xs
                sm:text-sm
                italic
                font-serif
                text-[#31465A]/60
                line-clamp-2
                mb-3
              "
            >
              “{character.slogan}”
            </p>
          )}
        </div>

        {/* ==========================================
            HASHTAGS
            ========================================== */}
        <div className="mt-2 pt-3 border-t border-[#D9F0FF]">
          {hashtagsList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {hashtagsList.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="
                    text-[11px]
                    font-medium
                    px-2.5
                    py-0.5
                    rounded-full
                    bg-[#D9F0FF]
                    text-[#31465A]
                    border
                    border-[#89B9E6]/25
                  "
                >
                  #{tag}
                </span>
              ))}

              {hashtagsList.length > 3 && (
                <span
                  className="
                    text-[10px]
                    text-[#31465A]/45
                    self-center
                  "
                >
                  +{hashtagsList.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span
              className="
                text-[11px]
                text-[#31465A]/45
                flex
                items-center
                gap-1
              "
            >
              <MessageCircle className="w-3 h-3 text-[#89B9E6]" />

              Chạm để đọc cốt truyện
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
