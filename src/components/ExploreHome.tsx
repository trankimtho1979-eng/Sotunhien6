import React from 'react';
import {
  Sparkles,
  Trophy,
  Flame,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Award,
  Play,
} from 'lucide-react';
import { TopicInfo, PlayerProfile, TopicId } from '../types/quiz';
import { TOPICS, QUESTIONS_BANK } from '../data/questions';
import { PiPiMascot } from './PiPiMascot';
import { soundManager } from '../utils/audio';

interface ExploreHomeProps {
  profile: PlayerProfile;
  onSelectTopic: (topicId: TopicId) => void;
  onStartArena: () => void;
  onOpenNotebook: () => void;
}

export const ExploreHome: React.FC<ExploreHomeProps> = ({
  profile,
  onSelectTopic,
  onStartArena,
  onOpenNotebook,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Welcome Card with Mascot */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-black/5 blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-amber-950 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Toán Học Lớp 6 · Chương Số Tự Nhiên</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight text-white mb-2 leading-tight">
              Xin chào, {profile.name}!
            </h1>
            <p className="text-sm sm:text-base text-amber-50 max-w-xl font-normal leading-relaxed">
              Cùng Cú Thông Thái Pi-Pi ôn luyện các chuyên đề Số Tự Nhiên theo sách Kết Nối Tri Thức, giải đáp chi tiết từng câu sai và tranh tài trên Bảng Vàng!
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartArena();
                }}
                className="px-5 py-2.5 bg-white text-amber-900 hover:bg-amber-50 active:scale-95 font-bold rounded-2xl shadow-sm text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Vào Đấu Trường Leo Tháp</span>
              </button>

              {profile.wrongQuestionIds.length > 0 && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenNotebook();
                  }}
                  className="px-4 py-2.5 bg-rose-500/80 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-2xl border border-rose-300 text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Sửa {profile.wrongQuestionIds.length} Câu Sai</span>
                </button>
              )}
            </div>
          </div>

          {/* Animated Mascot Presentation */}
          <div className="shrink-0 bg-white/10 backdrop-blur rounded-3xl p-4 border border-white/20">
            <PiPiMascot
              mood="happy"
              speechText="Hôm nay bạn muốn cùng Pi-Pi chinh phục chuyên đề nào?"
              subText="Nhớ đọc kỹ lý thuyết trước khi chọn đáp án nhé!"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Mini Stat Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tổng Điểm</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading tabular-nums">
            {profile.totalScore}
          </div>
        </div>

        <div className="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Sao Tri Thức</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 font-heading tabular-nums">
            {profile.coins} ⭐
          </div>
        </div>

        <div className="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Kỷ Lục Chuỗi Đúng</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-orange-600 font-heading tabular-nums">
            {profile.highestStreak} liên tiếp
          </div>
        </div>

        <div className="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-medium">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Huy Hiệu Đạt</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-purple-700 font-heading tabular-nums">
            {profile.unlockedBadges.length}/8
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Các Chuyên Đề Ôn Tập Trọng Tâm
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Bám sát 10 bài học SGK Toán 6 Kết Nối Tri Thức Với Cuộc Sống
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TOPICS.map((topic) => {
            const count =
              topic.id === 'dau-truong'
                ? 10
                : QUESTIONS_BANK.filter((q) => q.topicId === topic.id).length;

            return (
              <div
                key={topic.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectTopic(topic.id);
                }}
                className="group relative bg-white border border-slate-200 hover:border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {topic.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {topic.badgeText}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium block">
                    {topic.subtitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5 mb-2 group-hover:text-amber-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {count} câu hỏi trắc nghiệm
                  </span>
                  <span className="font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Bắt đầu ôn tập →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
