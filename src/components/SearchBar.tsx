import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  availableTags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  availableTags,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 my-6">
      {/* Search Input */}
      <div className="relative group">
        <input
          id="character-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm nhân vật..."
          className="
            w-full
            pl-6 pr-14
            py-3.5 sm:py-4
            bg-[#FFFDF7]/90
            backdrop-blur-md
            border border-[#D9F0FF]
            rounded-full
            shadow-[0_8px_24px_rgba(49,70,90,0.07)]
            hover:shadow-[0_10px_28px_rgba(49,70,90,0.11)]
            hover:border-[#89B9E6]/60
            focus:outline-none
            focus:ring-2
            focus:ring-[#89B9E6]/35
            focus:border-[#89B9E6]
            transition-all
            text-[#31465A]
            placeholder-[#31465A]/40
            text-sm sm:text-base
          "
        />

        {/* Search / Clear */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="
                p-1.5
                rounded-full
                text-[#31465A]/40
                hover:text-[#31465A]
                hover:bg-[#D9F0FF]
                transition-colors
              "
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div
            className="
              w-9 h-9 sm:w-10 sm:h-10
              rounded-full
              bg-[#D9F0FF]
              border border-[#89B9E6]/30
              flex items-center justify-center
              text-[#31465A]
              shadow-sm
              transition-all duration-200
              group-focus-within:bg-[#C7DFA3]
              group-focus-within:border-[#C7DFA3]
            "
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      {/* Hashtag / Category Quick Chips */}
      {availableTags.length > 0 && (
        <div
          className="
            flex items-center
            gap-1.5
            mt-3
            overflow-x-auto
            py-1
            no-scrollbar
            px-1
          "
        >
          <span
            className="
              text-[11px]
              font-semibold
              text-[#31465A]/55
              flex items-center gap-1
              whitespace-nowrap
              pl-1
            "
          >
            <Sparkles className="w-3 h-3 text-[#89B9E6]" />
            Chủ đề:
          </span>

          {/* All */}
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`
              text-xs
              px-3 py-1
              rounded-full
              whitespace-nowrap
              transition-all
              font-medium
              cursor-pointer
              border
              ${
                selectedTag === null
                  ? `
                    bg-[#C7DFA3]
                    text-[#31465A]
                    border-[#C7DFA3]
                    font-semibold
                    shadow-sm
                  `
                  : `
                    bg-[#FFFDF7]/85
                    text-[#31465A]/65
                    border-[#D9F0FF]
                    hover:bg-[#D9F0FF]
                    hover:border-[#89B9E6]/50
                  `
              }
            `}
          >
            Tất cả
          </button>

          {/* Tags */}
          {availableTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() =>
                setSelectedTag(
                  selectedTag === tag ? null : tag
                )
              }
              className={`
                text-xs
                px-3 py-1
                rounded-full
                whitespace-nowrap
                transition-all
                font-medium
                cursor-pointer
                border
                ${
                  selectedTag === tag
                    ? `
                      bg-[#D9F0FF]
                      text-[#31465A]
                      border-[#89B9E6]/45
                      font-semibold
                      shadow-sm
                    `
                    : `
                      bg-[#FFFDF7]/85
                      text-[#31465A]/65
                      border-[#D9F0FF]
                      hover:bg-[#D9F0FF]
                      hover:border-[#89B9E6]/50
                    `
                }
              `}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
