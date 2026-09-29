import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Smile,
} from 'lucide-react';
import { Question, PlayerProfile } from '../types/quiz';
import { QUESTIONS_BANK } from '../data/questions';
import { PiPiMascot } from './PiPiMascot';
import { soundManager } from '../utils/audio';

interface WrongAnswersNotebookProps {
  profile: PlayerProfile;
  onClearWrongQuestion: (questionId: string) => void;
  onStartQuizWithQuestions: (questions: Question[], title: string) => void;
}

export const WrongAnswersNotebook: React.FC<WrongAnswersNotebookProps> = ({
  profile,
  onClearWrongQuestion,
  onStartQuizWithQuestions,
}) => {
  const [retryingQuestionId, setRetryingQuestionId] = useState<string | null>(null);
  const [retrySelectedOption, setRetrySelectedOption] = useState<number | null>(null);
  const [retryFeedback, setRetryFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Get list of questions from wrong question IDs
  const wrongQuestions = QUESTIONS_BANK.filter((q) =>
    profile.wrongQuestionIds.includes(q.id)
  );

  const handleStartRetry = (questionId: string) => {
    soundManager.playClick();
    setRetryingQuestionId(questionId);
    setRetrySelectedOption(null);
    setRetryFeedback(null);
  };

  const handleRetryAnswer = (question: Question, optionIndex: number) => {
    setRetrySelectedOption(optionIndex);
    const isCorrect = optionIndex === question.correctIndex;

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playCoin();
      setRetryFeedback('correct');
      // Automatically remove from wrong question pool after brief delay
      setTimeout(() => {
        onClearWrongQuestion(question.id);
        setRetryingQuestionId(null);
      }, 1500);
    } else {
      soundManager.playWrong();
      setRetryFeedback('wrong');
    }
  };

  const handlePracticeAllWrong = () => {
    if (wrongQuestions.length === 0) return;
    soundManager.playClick();
    onStartQuizWithQuestions(wrongQuestions, 'Luyện Tập Sổ Tay Câu Sai');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-rose-500" />
            <span>Sổ Tay Khắc Phục Lỗi Sai</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Nơi lưu lại các câu hỏi bạn từng chọn chưa đúng để cùng Cú Pi-Pi ôn lại và nắm vững.
          </p>
        </div>

        {wrongQuestions.length > 0 && (
          <button
            onClick={handlePracticeAllWrong}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Luyện Lại Tất Cả ({wrongQuestions.length})</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {wrongQuestions.length === 0 ? (
        <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
          <div className="max-w-md mx-auto">
            <PiPiMascot
              mood="celebrate"
              speechText="Tuyệt đỉnh! Sổ tay của bạn hiện đang trống hoàn toàn!"
              subText="Bạn không có câu hỏi nào bị sai chưa sửa. Hãy tiếp tục giữ vững phong độ nhé!"
              size="lg"
              className="justify-center mb-6"
            />
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-sm font-medium">
              Bạn là một cao thủ số tự nhiên thực thụ! Hãy thử sức với Đấu Trường Leo Tháp để xác lập kỷ lục mới.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mascot Note */}
          <PiPiMascot
            mood="comforting"
            speechText={`Bạn có ${wrongQuestions.length} câu cần ôn lại. Đừng ngại sai, hãy chọn 'Luyện Lại' để biến điểm yếu thành thế mạnh nhé!`}
            size="sm"
          />

          {/* List of wrong questions */}
          <div className="space-y-4">
            {wrongQuestions.map((q, index) => {
              const isRetrying = retryingQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs transition-all hover:border-amber-300"
                >
                  {/* Topic badge & index */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                      {q.topicTitle}
                    </span>
                    <span className="text-xs text-slate-400">Câu hỏi #{index + 1}</span>
                  </div>

                  {/* Question Title */}
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2">
                    {q.question}
                  </h3>

                  {/* Math Expression */}
                  {q.mathExpression && (
                    <div className="my-2 p-3 bg-amber-50/60 rounded-xl font-mono text-center text-lg font-bold text-amber-950">
                      {q.mathExpression}
                    </div>
                  )}

                  {/* If retrying this specific question */}
                  {isRetrying ? (
                    <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                      <p className="text-xs font-bold text-amber-900 mb-3 uppercase tracking-wide">
                        Chọn đáp án đúng để hoàn thành câu này:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = retrySelectedOption === optIdx;
                          const isCorrect = optIdx === q.correctIndex;

                          let optClass =
                            'bg-white border-slate-200 hover:bg-amber-100/50 text-slate-800';

                          if (retryFeedback) {
                            if (isCorrect) {
                              optClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                            } else if (isPicked) {
                              optClass = 'bg-rose-100 border-rose-400 text-rose-900';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={retryFeedback !== null}
                              onClick={() => handleRetryAnswer(q, optIdx)}
                              className={`p-3 rounded-xl border text-sm text-left transition-all cursor-pointer font-medium ${optClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {retryFeedback === 'correct' && (
                        <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Chính xác! Câu này đã được gỡ khỏi Sổ tay câu sai của bạn!</span>
                        </div>
                      )}
                      {retryFeedback === 'wrong' && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                          <span>Vẫn chưa đúng rồi. Hãy đọc kỹ phần giải thích chi tiết phía dưới nhé!</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Explanation Preview */
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      <span className="font-bold text-slate-900 block mb-1">
                        💡 Lời giải chi tiết:
                      </span>
                      {q.explanation}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-xs text-amber-800 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{q.pipiTip}</span>
                    </div>

                    {!isRetrying && (
                      <button
                        onClick={() => handleStartRetry(q.id)}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Luyện Lại Câu Này</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
