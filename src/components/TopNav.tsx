import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, User, Flame } from 'lucide-react';
import { PlayerProfile } from '../types/quiz';
import { soundManager } from '../utils/audio';

export type ActiveTab = 'explore' | 'arena' | 'leaderboard' | 'notebook' | 'rewards';

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: PlayerProfile;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenProfile: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  profile,
  isMuted,
  setIsMuted,
  onOpenProfile,
}) => {
  const toggleSound = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const navLinks: { id: ActiveTab; label: string; count?: number }[] = [
    { id: 'explore', label: 'Khám Phá Bài Học' },
    { id: 'arena', label: 'Đấu Trường Leo Tháp' },
    { id: 'leaderboard', label: 'Bảng Xếp Hạng' },
    { id: 'notebook', label: 'Sổ Tay Sai Sót', count: profile.wrongQuestionIds.length },
    { id: 'rewards', label: 'Kho Báu & Danh Hiệu' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-200/80 px-4 sm:px-6 py-3 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('explore');
          }}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            N
          </span>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block font-heading leading-tight">
              Số Tự Nhiên 6
            </span>
            <span className="text-[11px] text-amber-700 font-medium tracking-wide block">
              Kết Nối Tri Thức
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(item.id);
                }}
                className={`relative py-1 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-amber-600 font-semibold'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    {item.count}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions & stats */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak indicator if active */}
          {profile.streak > 1 && (
            <div
              className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2 py-1 rounded-lg text-xs font-semibold"
              title={`Chuỗi ${profile.streak} câu đúng liên tiếp!`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span className="tabular-nums font-bold">{profile.streak}</span>
            </div>
          )}

          {/* Star Coins */}
          <div
            className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/90 text-amber-900 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs"
            title="Ngôi Sao Tri Thức tích luỹ"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="tabular-nums font-bold">{profile.coins}</span>
            <span className="text-[11px] text-amber-700 hidden sm:inline">Sao</span>
          </div>

          {/* Sound toggle button */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-700 transition-all cursor-pointer"
            title="Hồ sơ học sinh & Tùy chỉnh nhân vật"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs shadow-2xs">
              <User className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <div className="text-left hidden sm:block max-w-[90px] truncate">
              <span className="text-xs font-semibold text-slate-800 block truncate">
                {profile.name}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto no-scrollbar pt-2.5 pb-0.5 border-t border-slate-100 mt-2">
        {navLinks.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(item.id);
              }}
              className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
                isActive
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[9px] font-bold px-1 rounded-full ${
                    isActive ? 'bg-white text-amber-600' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
