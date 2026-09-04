import React from 'react';

export const DreamyBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Blue Matcha Vanilla Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D9F0FF] via-[#FFFDF7] to-[#FFFDF7]" />

      {/* Soft Moonlight Atmosphere */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-[#89B9E6]/30 opacity-50 blur-[120px] rounded-full" />

      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#C7DFA3]/35 opacity-40 blur-[100px] rounded-full" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D9F0FF]/50 blur-[140px] rounded-full" />

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C7DFA3]/25 blur-[110px] rounded-full" />

      {/* Delicate Moonlit Stars */}
      <div className="absolute top-10 left-20 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(137,185,230,0.7)] animate-pulse" />

      <div className="absolute top-40 right-40 w-2 h-2 bg-white rounded-full opacity-70 shadow-[0_0_8px_1px_rgba(137,185,230,0.6)]" />

      <div className="absolute bottom-60 left-1/4 w-1 h-1 bg-[#89B9E6] rounded-full opacity-50" />

      <div
        className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-75 animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      <div
        className="absolute top-20 right-1/2 w-2.5 h-2.5 bg-[#C7DFA3] rounded-full blur-[1px] opacity-60 animate-pulse"
        style={{ animationDuration: '5s' }}
      />

      <div className="absolute bottom-24 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-65" />

      {/* Tiny Blue Matcha Accent */}
      <div
        className="absolute top-1/4 left-1/3 w-1 h-1 bg-[#89B9E6] rounded-full opacity-45 animate-pulse"
        style={{ animationDuration: '6s' }}
      />

      <div
        className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-[#C7DFA3] rounded-full opacity-50 animate-pulse"
        style={{ animationDuration: '7s' }}
      />
    </div>
  );
};
