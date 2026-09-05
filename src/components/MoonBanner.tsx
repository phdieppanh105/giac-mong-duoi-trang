import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Moon, Cloud, Heart } from 'lucide-react';

export const MoonBanner: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-4xl mx-auto px-4 pt-8 pb-5 text-center select-none"
    >
      {/* Decorative Sparkle */}
      <div className="absolute top-7 left-[12%] sm:left-[18%] text-[#89B9E6] animate-pulse">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Decorative Heart */}
      <div
        className="absolute top-16 right-[12%] sm:right-[18%] text-[#C7DFA3] animate-bounce"
        style={{ animationDuration: '3.5s' }}
      >
        <Heart className="w-3.5 h-3.5 fill-[#C7DFA3] text-[#C7DFA3]" />
      </div>

      {/* Moon & Cloud Badge */}
      <div className="relative inline-block mb-5">
        <div className="absolute -top-3 -left-3 text-[#89B9E6] animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>

        <div
          className="absolute -bottom-2 -right-3 text-[#C7DFA3] animate-bounce"
          style={{ animationDuration: '3.5s' }}
        >
          <Heart className="w-3.5 h-3.5 fill-[#C7DFA3] text-[#C7DFA3]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9F0FF]/75 backdrop-blur-md border border-[#89B9E6]/35 shadow-sm text-[#31465A] text-xs font-semibold tracking-wide">
          <Moon className="w-3.5 h-3.5 text-[#31465A] animate-pulse" />

          <span> GIẤC MỘNG DƯỚI TRĂNG </span>

          <Cloud className="w-3.5 h-3.5 text-[#89B9E6]" />
        </div>
      </div>

      {/* Welcome */}
      <div className="relative mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-[#31465A] tracking-tight leading-relaxed px-2 drop-shadow-sm">
          ⋆｡ ﾟ☁︎｡ welcome ｡ ﾟ☾ ﾟ｡ ⋆
        </h2>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center mt-1 mb-4">
        <span className="text-sm sm:text-base tracking-widest text-[#89B9E6]">
          ⊹•┈┈౨ৎ┈┈•⊹
        </span>
      </div>

      {/* Poem */}
      <div className="max-w-2xl mx-auto px-3">
        <p className="text-base sm:text-lg italic text-[#31465A]/75 font-serif tracking-wide leading-relaxed">
          “Trăng nghiêng một bóng bên thềm. Soi vào đáy mắt, dịu êm một đời.”
        </p>
      </div>

      {/* Bottom Divider */}
      <div className="flex items-center justify-center mt-4">
        <span className="text-sm sm:text-base tracking-widest text-[#89B9E6]">
          ⊹•┈┈౨ৎ┈┈•⊹
        </span>
      </div>
    </motion.section>
  );
};
