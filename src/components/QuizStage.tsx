import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  Lightbulb,
  Award,
  BookOpen,
} from 'lucide-react';
import { Question, PlayerProfile } from '../types/quiz';
import { PiPiMascot, MascotMood } from './PiPiMascot';
import { soundManager } from '../utils/audio';

interface QuizStageProps {
  questions: Question[];
  topicTitle: string;
  isArenaMode?: boolean;
  onFinishQuiz: (result: {
    totalQuestions: number;
    correctCount: number;
    scoreEarned: number;
    coinsEarned: number;
    highestStreak: number;
  }) => void;
  onBackToExplore: () => void;
  profile: PlayerProfile;
  updateProfileOnAnswer: (isCorrect: boolean, question: Question) => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  questions,
  topicTitle,
  isArenaMode = false,
  onFinishQuiz,
  onBackToExplore,
  profile,
  updateProfileOnAnswer,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasUsedFiftyFifty, setHasUsedFiftyFifty] = useState<boolean>(false);

  // Round statistics
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [scoreEarned, setScoreEarned] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(profile.streak || 0);
  const [maxRoundStreak, setMaxRoundStreak] = useState<number>(0);

  // Timer for arena mode
  const [timeLeft, setTimeLeft] = useState<number>(isArenaMode ? 30 : 0);

  const currentQ = questions[currentIndex];

  // Mascot dynamic state
  const [mascotMood, setMascotMood] = useState<MascotMood>('happy');
  const [mascotSpeech, setMascotSpeech] = useState<string>('');
  const [mascotSub, setMascotSub] = useState<string>('');

  useEffect(() => {
    // Reset state for new question
    setSelectedOption(null);
    setIsAnswered(false);
    setEliminatedOptions([]);
    setShowHint(false);
    if (isArenaMode) {
      setTimeLeft(30);
    }

    setMascotMood('thinking');
    setMascotSpeech(
      `Câu số ${currentIndex + 1}/${questions.length}: Đọc kỹ đề bài và tính nhẩm cẩn thận nhé!`
    );
    setMascotSub(currentQ?.pipiTip ? `Gợi ý nhỏ: ${currentQ.pipiTip}` : '');
  }, [currentIndex, isArenaMode, questions.length]);

  // Arena countdown timer
  useEffect(() => {
    if (!isArenaMode || isAnswered) return;

    if (timeLeft <= 0) {
      // Time up counts as wrong selection
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isArenaMode, isAnswered, timeLeft]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1); // No option chosen
    soundManager.playWrong();
    setMascotMood('comforting');
    setMascotSpeech('Hết thời gian rồi! Hãy xem kỹ lời giải chi tiết dưới đây nhé.');
    setMascotSub('Đừng lo, ở câu tiếp theo ta sẽ cố gắng bấm nhanh hơn một chút!');
    setCurrentStreak(0);
    updateProfileOnAnswer(false, currentQ);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    updateProfileOnAnswer(isCorrect, currentQ);

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playCoin();

      // Confetti celebration effect
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch {
        // Ignored
      }

      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxRoundStreak) {
        setMaxRoundStreak(newStreak);
      }

      // Calculate streak bonus
      const bonusMultiplier = newStreak >= 5 ? 1.5 : newStreak >= 3 ? 1.2 : 1;
      const pts = Math.round(currentQ.points * bonusMultiplier);
      const earnedC = 10 + (newStreak >= 3 ? 5 : 0);

      setScoreEarned((prev) => prev + pts);
      setCoinsEarned((prev) => prev + earnedC);
      setCorrectCount((prev) => prev + 1);

      setMascotMood('celebrate');
      if (newStreak >= 3) {
        setMascotSpeech(
          `Tuyệt đỉnh! Chuỗi ${newStreak} câu đúng liên tiếp! Bạn nhận thêm điểm thưởng combo!`
        );
      } else {
        const praises = [
          'Chính xác 100%! Bạn nắm công thức rất chắc chắn!',
          'Xuất sắc! Lời giải của bạn hoàn toàn chuẩn xác!',
          'Rất giỏi! Thêm một ngôi sao tri thức đã vào túi bạn!',
        ];
        setMascotSpeech(praises[Math.floor(Math.random() * praises.length)]);
      }
      setMascotSub(currentQ.pipiTip);
    } else {
      soundManager.playWrong();
      setCurrentStreak(0);

      setMascotMood('comforting');
      setMascotSpeech(
        'Ôi chưa chính xác rồi! Nhưng đừng buồn nhé, sai là cơ hội để nhớ lâu hơn!'
      );
      setMascotSub(
        'Cú Pi-Pi đã mở lời giải chi tiết từng bước bên dưới. Hãy đọc kỹ để nắm vững nha!'
      );
    }
  };

  // 50:50 Lifeline
  const handleFiftyFifty = () => {
    if (hasUsedFiftyFifty || isAnswered) return;
    soundManager.playClick();
    setHasUsedFiftyFifty(true);

    const wrongIndexes = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);

    // Shuffle and pick 2 to eliminate
    const shuffled = wrongIndexes.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffled.slice(0, 2));

    setMascotMood('thinking');
    setMascotSpeech('Cú Pi-Pi đã loại giúp bạn 2 phương án sai! Giờ bạn chỉ cần chọn giữa 2 đáp án còn lại.');
  };

  // Hint Lifeline
  const handleToggleHint = () => {
    soundManager.playClick();
    setShowHint((prev) => !prev);
    if (!showHint) {
      setMascotMood('reading');
      setMascotSpeech(`Gợi ý bài học: ${currentQ.pipiTip}`);
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz complete
      soundManager.playFanfare();
      onFinishQuiz({
        totalQuestions: questions.length,
        correctCount: correctCount + (selectedOption === currentQ.correctIndex ? 0 : 0),
        scoreEarned,
        coinsEarned,
        highestStreak: Math.max(maxRoundStreak, currentStreak),
      });
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Status & Progress Bar */}
      <div className="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200">
              {topicTitle}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Câu {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Arena Mode Countdown */}
            {isArenaMode && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold tabular-nums ${
                  timeLeft <= 10
                    ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}

            {/* Streak indicator */}
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                <span>🔥 Chuỗi {currentStreak}</span>
              </div>
            )}

            {/* Score */}
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="tabular-nums">+{scoreEarned} điểm</span>
            </div>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Mascot Guidance Callout */}
      <div className="mb-6">
        <PiPiMascot
          mood={mascotMood}
          speechText={mascotSpeech}
          subText={mascotSub}
          size="md"
          onMascotClick={() => {
            soundManager.playClick();
            setMascotMood('celebrate');
            setMascotSpeech('Cố lên nhé! Cú Pi-Pi luôn đồng hành cùng bạn trên con đường chinh phục môn Toán 6!');
          }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm mb-6">
        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-4">
          {currentQ.question}
        </h2>

        {/* Math Expression Box if present */}
        {currentQ.mathExpression && (
          <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center font-mono text-xl sm:text-2xl font-bold text-amber-950 tracking-wider shadow-2xs">
            {currentQ.mathExpression}
          </div>
        )}

        {/* Lifeline buttons before answering */}
        {!isAnswered && (
          <div className="flex items-center justify-end gap-2 my-4">
            <button
              onClick={handleToggleHint}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                showHint
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'Ẩn gợi ý' : 'Hỏi Cú Pi-Pi'}</span>
            </button>

            {!hasUsedFiftyFifty && (
              <button
                onClick={handleFiftyFifty}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Trợ giúp 50:50</span>
              </button>
            )}
          </div>
        )}

        {/* Hint Box */}
        {showHint && !isAnswered && (
          <div className="mb-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Gợi ý từ Cú Pi-Pi: </span>
              {currentQ.pipiTip}
            </div>
          </div>
        )}

        {/* 4 Interactive Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {currentQ.options.map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle =
              'border-slate-200 bg-slate-50/50 hover:bg-amber-50/60 hover:border-amber-300 text-slate-800';

            if (isAnswered) {
              if (isCorrect) {
                // Correct answer always green
                btnStyle =
                  'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400 font-semibold';
              } else if (isSelected) {
                // User picked wrong answer
                btnStyle =
                  'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-300 font-medium';
              } else {
                // Other unchosen options
                btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }
            } else if (isEliminated) {
              btnStyle = 'border-slate-100 bg-slate-100 text-slate-300 opacity-30 cursor-not-allowed';
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isEliminated}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-sm sm:text-base cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isAnswered && isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 shadow-2xs'
                    }`}
                  >
                    {letters[idx]}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>

                {/* Status icon after answering */}
                {isAnswered && (
                  <div className="shrink-0">
                    {isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    )}
                    {isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 fill-rose-100" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LỜI GIẢI CHI TIẾT - Hiển thị sau khi trả lời, đặc biệt khi chọn sai */}
      {isAnswered && (
        <div
          className={`rounded-3xl p-5 sm:p-7 border-2 mb-6 transition-all animate-fadeIn ${
            selectedOption === currentQ.correctIndex
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/70 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen
              className={`w-5 h-5 ${
                selectedOption === currentQ.correctIndex
                  ? 'text-emerald-700'
                  : 'text-rose-700'
              }`}
            />
            <h3 className="font-bold text-base sm:text-lg font-heading">
              {selectedOption === currentQ.correctIndex
                ? 'Lời Giải Chi Tiết Của Bài Toán'
                : 'Giải Thích Chi Tiết & Khắc Phục Lỗi Sai'}
            </h3>
          </div>

          {/* Explanation Text */}
          <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-sm sm:text-base leading-relaxed text-slate-800 space-y-2 whitespace-pre-line shadow-2xs">
            {currentQ.explanation}
          </div>

          {/* Key formula reminder from Pi-Pi */}
          <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-white/60 p-3 rounded-xl border border-amber-200/70">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900">Bí kíp ghi nhớ: </span>
              {currentQ.pipiTip}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToExplore();
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          Thoát Ra Menu
        </button>

        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 transition-transform cursor-pointer"
          >
            <span>
              {currentIndex < questions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Tổng Kết Điểm'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
