/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav, ActiveTab } from './components/TopNav';
import { ExploreHome } from './components/ExploreHome';
import { QuizStage } from './components/QuizStage';
import { RealtimeLeaderboard } from './components/RealtimeLeaderboard';
import { WrongAnswersNotebook } from './components/WrongAnswersNotebook';
import { VirtualRewardsModal } from './components/VirtualRewardsModal';
import { ProfileModal } from './components/ProfileModal';
import { RoundSummary } from './components/RoundSummary';
import { PlayerProfile, Question, TopicId } from './types/quiz';
import { QUESTIONS_BANK, TOPICS } from './data/questions';
import { soundManager } from './utils/audio';

const STORAGE_KEY = 'toan6_kntt_player_profile';

const DEFAULT_PROFILE: PlayerProfile = {
  id: 'student-user-1',
  name: 'Học Sinh Chăm Chỉ',
  schoolClass: '6A1',
  avatarId: 'owl-pipi',
  totalScore: 0,
  coins: 50, // Welcome gift 50 coins to explore
  diamonds: 5,
  streak: 0,
  highestStreak: 0,
  unlockedBadges: ['first-step'],
  unlockedTitles: ['Tân Binh Toán Học'],
  equippedTitle: 'Tân Binh Toán Học',
  completedQuizzesCount: 0,
  correctAnswersCount: 0,
  totalAnswersCount: 0,
  wrongQuestionIds: [],
};

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());

  // Current active quiz session
  const [activeQuiz, setActiveQuiz] = useState<{
    questions: Question[];
    topicTitle: string;
    isArena: boolean;
  } | null>(null);

  // Round summary modal state
  const [roundSummary, setRoundSummary] = useState<{
    totalQuestions: number;
    correctCount: number;
    scoreEarned: number;
    coinsEarned: number;
    highestStreak: number;
  } | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignored
    }
  }, [profile]);

  // Answer handler
  const handleUpdateProfileOnAnswer = (isCorrect: boolean, question: Question) => {
    setProfile((prev) => {
      const newTotalAnswers = prev.totalAnswersCount + 1;
      const newCorrectAnswers = prev.correctAnswersCount + (isCorrect ? 1 : 0);
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newHighestStreak = Math.max(prev.highestStreak, newStreak);

      const unlockedBadges = [...prev.unlockedBadges];
      if (newStreak >= 3 && !unlockedBadges.includes('streak-master')) {
        unlockedBadges.push('streak-master');
      }
      if (newStreak >= 7 && !unlockedBadges.includes('streak-legend')) {
        unlockedBadges.push('streak-legend');
      }

      // Handle wrong questions pool
      let wrongQuestionIds = [...prev.wrongQuestionIds];
      if (!isCorrect) {
        if (!wrongQuestionIds.includes(question.id)) {
          wrongQuestionIds.push(question.id);
        }
      }

      return {
        ...prev,
        streak: newStreak,
        highestStreak: newHighestStreak,
        totalAnswersCount: newTotalAnswers,
        correctAnswersCount: newCorrectAnswers,
        wrongQuestionIds,
        unlockedBadges,
      };
    });
  };

  // Finish quiz handler
  const handleFinishQuiz = (result: {
    totalQuestions: number;
    correctCount: number;
    scoreEarned: number;
    coinsEarned: number;
    highestStreak: number;
  }) => {
    setProfile((prev) => {
      const newScore = prev.totalScore + result.scoreEarned;
      const newCoins = prev.coins + result.coinsEarned;
      const newCompletedCount = prev.completedQuizzesCount + 1;
      const unlockedBadges = [...prev.unlockedBadges];

      if (newScore >= 100 && !unlockedBadges.includes('score-100')) {
        unlockedBadges.push('score-100');
      }
      if (newCompletedCount >= 1 && !unlockedBadges.includes('first-step')) {
        unlockedBadges.push('first-step');
      }

      return {
        ...prev,
        totalScore: newScore,
        coins: newCoins,
        completedQuizzesCount: newCompletedCount,
        unlockedBadges,
      };
    });

    setRoundSummary(result);
    setActiveQuiz(null);
  };

  // Start quiz by topic
  const handleSelectTopic = (topicId: TopicId) => {
    if (topicId === 'dau-truong') {
      handleStartArena();
      return;
    }

    const topicQuestions = QUESTIONS_BANK.filter((q) => q.topicId === topicId);
    const foundTopic = TOPICS.find((t) => t.id === topicId);

    setActiveQuiz({
      questions: topicQuestions,
      topicTitle: foundTopic?.title || 'Ôn Tập Số Tự Nhiên',
      isArena: false,
    });
    setRoundSummary(null);
  };

  // Start arena mode (10 randomized questions with timer)
  const handleStartArena = () => {
    const shuffled = [...QUESTIONS_BANK].sort(() => 0.5 - Math.random());
    const arenaQuestions = shuffled.slice(0, 10);

    setActiveQuiz({
      questions: arenaQuestions,
      topicTitle: 'Đấu Trường Leo Tháp (Tính Giờ)',
      isArena: true,
    });
    setRoundSummary(null);
  };

  // Clear wrong question from notebook
  const handleClearWrongQuestion = (questionId: string) => {
    setProfile((prev) => {
      const wrongQuestionIds = prev.wrongQuestionIds.filter((id) => id !== questionId);
      const unlockedBadges = [...prev.unlockedBadges];
      if (!unlockedBadges.includes('notebook-hero')) {
        unlockedBadges.push('notebook-hero');
      }
      return {
        ...prev,
        coins: prev.coins + 15,
        totalScore: prev.totalScore + 20,
        wrongQuestionIds,
        unlockedBadges,
      };
    });
  };

  // Start practice with custom question set (e.g. from notebook)
  const handleStartQuizWithQuestions = (questions: Question[], title: string) => {
    setActiveQuiz({
      questions,
      topicTitle: title,
      isArena: false,
    });
    setRoundSummary(null);
  };

  // Equip title
  const handleEquipTitle = (titleName: string) => {
    setProfile((prev) => ({
      ...prev,
      equippedTitle: titleName,
    }));
  };

  // Buy title
  const handleBuyTitle = (titleId: string, cost: number, titleName: string) => {
    setProfile((prev) => {
      if (prev.coins < cost) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        unlockedTitles: [...prev.unlockedTitles, titleName],
        equippedTitle: titleName,
      };
    });
  };

  // Mystery Box claim
  const handleOpenMysteryBox = (rewardCoins: number) => {
    setProfile((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
    }));
  };

  // Save profile changes
  const handleSaveProfile = (updated: Partial<PlayerProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Contract (3 zones) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveQuiz(null);
          setRoundSummary(null);
        }}
        profile={profile}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {/* If Quiz is Active */}
        {activeQuiz ? (
          <QuizStage
            questions={activeQuiz.questions}
            topicTitle={activeQuiz.topicTitle}
            isArenaMode={activeQuiz.isArena}
            onFinishQuiz={handleFinishQuiz}
            onBackToExplore={() => setActiveQuiz(null)}
            profile={profile}
            updateProfileOnAnswer={handleUpdateProfileOnAnswer}
          />
        ) : roundSummary ? (
          /* If Round Summary is Shown */
          <RoundSummary
            summary={roundSummary}
            onPlayAgain={() => {
              setRoundSummary(null);
              setActiveTab('explore');
            }}
            onGoToLeaderboard={() => {
              setRoundSummary(null);
              setActiveTab('leaderboard');
            }}
            onGoToNotebook={() => {
              setRoundSummary(null);
              setActiveTab('notebook');
            }}
            wrongCount={profile.wrongQuestionIds.length}
          />
        ) : (
          /* Normal Tab Views */
          <>
            {activeTab === 'explore' && (
              <ExploreHome
                profile={profile}
                onSelectTopic={handleSelectTopic}
                onStartArena={handleStartArena}
                onOpenNotebook={() => setActiveTab('notebook')}
              />
            )}

            {activeTab === 'arena' && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-300 flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xs">
                    👑
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mb-2">
                    Đấu Trường Leo Tháp Toán 6
                  </h1>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
                    Mỗi lượt gồm 10 câu hỏi tổng hợp ngẫu nhiên các chuyên đề (Tập hợp, Luỹ thừa, Chia hết, Số nguyên tố, ƯCLN & BCNN) với thời gian đếm ngược 30 giây mỗi câu. Ghi điểm cao nhất để leo đỉnh Bảng Vàng!
                  </p>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      handleStartArena();
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md transition-all text-base cursor-pointer hover:scale-105 active:scale-95"
                  >
                    Bắt Đầu Leo Tháp Ngay
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <RealtimeLeaderboard
                profile={profile}
                onStartArena={handleStartArena}
              />
            )}

            {activeTab === 'notebook' && (
              <WrongAnswersNotebook
                profile={profile}
                onClearWrongQuestion={handleClearWrongQuestion}
                onStartQuizWithQuestions={handleStartQuizWithQuestions}
              />
            )}

            {activeTab === 'rewards' && (
              <VirtualRewardsModal
                profile={profile}
                onEquipTitle={handleEquipTitle}
                onBuyTitle={handleBuyTitle}
                onOpenMysteryBox={handleOpenMysteryBox}
              />
            )}
          </>
        )}
      </main>

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Vương Quốc Số Tự Nhiên · Ôn tập Toán 6 Kết Nối Tri Thức Với Cuộc Sống
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Trắc nghiệm tương tác</span>
            <span aria-hidden="true">·</span>
            <span>Bảng xếp hạng thời gian thực</span>
            <span aria-hidden="true">·</span>
            <span>Cú Pi-Pi đồng hành</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
