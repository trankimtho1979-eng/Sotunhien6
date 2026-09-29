import React from 'react';
import {
  Trophy,
  Sparkles,
  Flame,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';
import { PiPiMascot } from './PiPiMascot';
import { soundManager } from '../utils/audio';

interface RoundSummaryProps {
  summary: {
    totalQuestions: number;
    correctCount: number;
    scoreEarned: number;
    coinsEarned: number;
    highestStreak: number;
  };
  onPlayAgain: () => void;
  onGoToLeaderboard: () => void;
  onGoToNotebook: () => void;
  wrongCount: number;
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({
  summary,
  onPlayAgain,
  onGoToLeaderboard,
  onGoToNotebook,
  wrongCount,
}) => {
  const percentage = Math.round(
    (summary.correctCount / Math.max(summary.totalQuestions, 1)) * 100
  );

  const isGreat = percentage >= 80;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-lg text-center animate-scaleUp">
        {/* Mascot Reaction */}
        <div className="mb-6 flex justify-center">
          <PiPiMascot
            mood={isGreat ? 'celebrate' : 'comforting'}
            speechText={
              isGreat
                ? `Xuất sắc! Bạn đạt ${summary.correctCount}/${summary.totalQuestions} câu đúng (${percentage}%)!`
                : `Bạn đã hoàn thành bài ôn tập với ${summary.correctCount}/${summary.totalQuestions} câu đúng!`
            }
            subText={
              isGreat
                ? 'Kiến thức Số Tự Nhiên của bạn rất vững vàng! Hãy tiếp tục leo tháp Bảng Vàng nhé!'
                : 'Đừng lo lắng nhé! Hãy mở Sổ Tay Câu Sai để xem kỹ lời giải và luyện lại nha.'
            }
            size="lg"
            className="flex-col items-center text-center"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5">
            <span className="text-xs text-amber-800 font-medium block">Điểm Thưởng</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-950 font-heading tabular-nums">
              +{summary.scoreEarned}
            </span>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5">
            <span className="text-xs text-amber-800 font-medium block">Sao Thu Thập</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-950 font-heading tabular-nums">
              +{summary.coinsEarned} ⭐
            </span>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5">
            <span className="text-xs text-emerald-800 font-medium block">Độ Chính Xác</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 font-heading tabular-nums">
              {percentage}%
            </span>
          </div>

          <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-3.5">
            <span className="text-xs text-orange-800 font-medium block">Chuỗi Dài Nhất</span>
            <span className="text-xl sm:text-2xl font-bold text-orange-950 font-heading tabular-nums">
              {summary.highestStreak}🔥
            </span>
          </div>
        </div>

        {/* Notice for wrong questions */}
        {wrongCount > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm text-left flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lưu ý học tập: </span>
              Bạn có {wrongCount} câu hỏi chưa chính xác. Cú Pi-Pi đã tự động lưu vào{' '}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onGoToNotebook();
                }}
                className="underline font-bold hover:text-rose-800 cursor-pointer"
              >
                Sổ Tay Khắc Phục Lỗi Sai
              </button>{' '}
              để bạn có thể xem lại lời giải chi tiết và làm lại bất cứ lúc nào!
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tiếp Tục Luyện Tập</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoToLeaderboard();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Xem Bảng Xếp Hạng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
