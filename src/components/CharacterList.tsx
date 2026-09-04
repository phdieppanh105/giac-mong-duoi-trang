import React from 'react';
import { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { PlusCircle, SearchX } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  searchQuery: string;
  selectedTag: string | null;
  onSelectCharacter: (character: Character) => void;
  onEditCharacter: (character: Character) => void;
  onDeleteCharacter: (character: Character) => void;
  onAddNew: () => void;
  isAdmin: boolean;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  loading,
  searchQuery,
  selectedTag,
  onSelectCharacter,
  onEditCharacter,
  onDeleteCharacter,
  onAddNew,
  isAdmin,
}) => {
  // Filter characters based on search query & selected tag
  const filteredCharacters = characters.filter((char) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      char.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (char.slogan &&
        char.slogan
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())) ||
      (char.hashtags &&
        char.hashtags
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()));

    const matchesTag =
      !selectedTag ||
      (char.hashtags &&
        char.hashtags
          .toLowerCase()
          .includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div
          className="
            w-10 h-10
            rounded-full
            border-[3px]
            border-[#D9F0FF]
            border-t-[#31465A]
            animate-spin
            mb-4
          "
        />

        <p className="text-sm font-semibold text-[#31465A]/65">
          Đang đón ánh trăng và tải dữ liệu nhân vật...
        </p>
      </div>
    );
  }

  // =========================
  // NO CHARACTERS
  // =========================
  if (characters.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div
          className="
            w-full
            flex flex-col
            items-center justify-center
            py-16 sm:py-20
            rounded-[36px]
            border-2 border-dashed border-[#89B9E6]/45
            bg-[#FFFDF7]/60
            backdrop-blur-sm
            text-center
            px-6
          "
        >
          {/* Celestial graphic */}
          <div
            className="
              w-20 h-20 sm:w-24 sm:h-24
              mb-6
              rounded-full
              flex items-center justify-center
              bg-[#D9F0FF]
              text-[#31465A]
              opacity-80
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-11 h-11 sm:w-13 sm:h-13"
            >
              <path
                d="M12 3V4M12 20V21M4 12H3M21 12H20M18.364 5.636L17.6569 6.34315M6.34315 17.6569L5.63604 18.364M18.364 18.364L17.6569 17.6569M6.34315 6.34315L5.63604 5.636M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="text-[#31465A] text-base sm:text-lg font-semibold">
            Chưa có nhân vật nào được thêm vào đây.
          </p>

          <p className="text-[#31465A]/50 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
            Hãy kiên nhẫn chờ đợi những câu chuyện mộng mơ sắp tới nhé!
          </p>

          {isAdmin && (
            <button
              type="button"
              onClick={onAddNew}
              className="
                mt-6
                inline-flex items-center gap-2
                px-6 py-2.5
                rounded-full
                bg-[#C7DFA3]
                text-[#31465A]
                border border-[#C7DFA3]
                text-xs sm:text-sm
                font-semibold
                shadow-sm
                hover:shadow-md
                hover:bg-[#D9F0FF]
                hover:border-[#89B9E6]
                transition-all
                cursor-pointer
              "
            >
              <PlusCircle className="w-4 h-4" />
              <span>＋ Thêm Nhân Vật Đầu Tiên</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================
  // NO SEARCH RESULTS
  // =========================
  if (filteredCharacters.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 text-center">
        <div
          className="
            w-16 h-16
            rounded-full
            bg-[#FFFDF7]
            border border-[#D9F0FF]
            flex items-center justify-center
            mx-auto mb-4
            text-[#31465A]/55
            shadow-sm
          "
        >
          <SearchX className="w-7 h-7" />
        </div>

        <h4 className="text-base font-bold text-[#31465A] mb-1">
          Không tìm thấy nhân vật phù hợp
        </h4>

        <p className="text-xs text-[#31465A]/55 max-w-sm mx-auto leading-relaxed">
          Không tìm thấy nhân vật nào khớp với từ khóa
          &ldquo;{searchQuery}&rdquo;. Hãy thử tìm kiếm với tên hoặc từ
          khóa khác nhé!
        </p>
      </div>
    );
  }

  // =========================
  // CHARACTER LIST
  // =========================
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-7 sm:py-9">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="
              w-2.5 h-2.5
              rounded-full
              bg-[#C7DFA3]
              shadow-[0_0_0_4px_rgba(217,240,255,0.7)]
            "
          />

          <h2
            className="
              text-sm sm:text-base
              font-bold
              text-[#31465A]
              uppercase
              tracking-[0.12em]
            "
          >
            Danh Sách Nhân Vật
          </h2>

          <span
            className="
              px-2.5 py-0.5
              rounded-full
              bg-[#D9F0FF]
              border border-[#89B9E6]/35
              text-[#31465A]
              text-[11px]
              font-bold
            "
          >
            {filteredCharacters.length}
          </span>
        </div>
      </div>

      {/* =========================
          CHARACTER GRID
      ========================== */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-5 lg:gap-6"
      >
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onSelect={onSelectCharacter}
            onEdit={onEditCharacter}
            onDelete={onDeleteCharacter}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
};
