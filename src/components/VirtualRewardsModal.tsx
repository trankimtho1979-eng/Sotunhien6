import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  Check,
  Lock,
  ShoppingBag,
  Gift,
  Coins,
  Star,
} from 'lucide-react';
import { PlayerProfile } from '../types/quiz';
import { VIRTUAL_BADGES, VIRTUAL_TITLES } from '../data/rewards';
import { soundManager } from '../utils/audio';

interface VirtualRewardsModalProps {
  profile: PlayerProfile;
  onEquipTitle: (titleName: string) => void;
  onBuyTitle: (titleId: string, cost: number, titleName: string) => void;
  onOpenMysteryBox: (rewardCoins: number) => void;
}

export const VirtualRewardsModal: React.FC<VirtualRewardsModalProps> = ({
  profile,
  onEquipTitle,
  onBuyTitle,
  onOpenMysteryBox,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'titles' | 'mystery'>('badges');
  const [isOpeningBox, setIsOpeningBox] = useState<boolean>(false);
  const [openedReward, setOpenedReward] = useState<number | null>(null);

  const handleOpenChest = () => {
    if (isOpeningBox) return;
    setIsOpeningBox(true);
    setOpenedReward(null);
    soundManager.playClick();

    setTimeout(() => {
      // Mystery reward between 25 and 75 coins
      const reward = Math.floor(Math.random() * 6 + 3) * 10;
      setOpenedReward(reward);
      setIsOpeningBox(false);
      soundManager.playCoin();
      soundManager.playFanfare();

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignored
      }

      onOpenMysteryBox(reward);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading flex items-center gap-2.5">
            <Award className="w-7 h-7 text-amber-500 fill-amber-300" />
            <span>Kho Báu Tri Thức & Danh Hiệu Ảo</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Dùng Ngôi Sao Tri Thức bạn kiếm được từ các câu trả lời đúng để nhận huy hiệu và mở khoá danh xưng huyền thoại.
          </p>
        </div>

        {/* Current Balance */}
        <div className="flex items-center gap-2 bg-amber-100/80 border border-amber-300 px-4 py-2 rounded-2xl shadow-2xs shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600 fill-amber-400" />
          <div>
            <span className="text-xs text-amber-800 block font-medium">Sao Tích Luỹ</span>
            <span className="text-lg font-bold text-amber-950 font-heading tabular-nums">
              {profile.coins} Sao
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6 max-w-md">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('badges');
          }}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Huy Hiệu ({profile.unlockedBadges.length}/{VIRTUAL_BADGES.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('titles');
          }}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'titles'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-blue-500" />
          <span>Danh Hiệu</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('mystery');
          }}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'mystery'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4 text-pink-500" />
          <span>Rương Bí Mật</span>
        </button>
      </div>

      {/* Tab 1: Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {VIRTUAL_BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-xs ring-1 ring-amber-400/20'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-3 shadow-2xs">
                    {badge.icon}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1 font-heading">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {badge.conditionText}
                  </span>
                  {isUnlocked ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Đã Đạt
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Khóa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Titles */}
      {activeTab === 'titles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VIRTUAL_TITLES.map((t) => {
            const isUnlocked = profile.unlockedTitles.includes(t.name) || t.requiredCoins === 0;
            const isEquipped = profile.equippedTitle === t.name;
            const canAfford = profile.coins >= t.requiredCoins;

            return (
              <div
                key={t.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-2 ring-amber-300'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-xl border ${t.color}`}
                    >
                      {t.name}
                    </span>
                    {isEquipped && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        Đang Sử Dụng
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">{t.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-700">
                    {t.requiredCoins === 0 ? (
                      <span className="text-emerald-600 font-bold">Miễn Phí</span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-900 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        {t.requiredCoins} Sao
                      </span>
                    )}
                  </div>

                  {isEquipped ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-default"
                    >
                      Đang Mang
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onEquipTitle(t.name);
                      }}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Sử Dụng
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          onBuyTitle(t.id, t.requiredCoins, t.name);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Mở Khóa' : 'Chưa Đủ Sao'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Mystery Chest */}
      {activeTab === 'mystery' && (
        <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
          <div className="max-w-md mx-auto">
            {/* Chest Graphic */}
            <div className="relative inline-block mb-6">
              <div
                className={`w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 border-4 border-amber-200 flex items-center justify-center text-5xl shadow-md mx-auto transition-transform ${
                  isOpeningBox ? 'animate-bounce' : 'hover:scale-105'
                }`}
              >
                🎁
              </div>
              {openedReward && (
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md animate-ping">
                  +{openedReward} ⭐
                </div>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mb-2">
              Rương Tri Thức May Mắn
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Mỗi lần mở rương, Cú Pi-Pi sẽ tặng ngẫu nhiên từ 30 đến 70 Ngôi Sao Tri Thức để bạn nhanh chóng mở khóa danh hiệu trên Bảng Xếp Hạng!
            </p>

            {openedReward ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-sm font-bold mb-6 animate-fadeIn">
                🎉 Bạn nhận được +{openedReward} Ngôi Sao Tri Thức! Hãy kiểm tra cửa hàng danh hiệu nhé!
              </div>
            ) : null}

            <button
              disabled={isOpeningBox}
              onClick={handleOpenChest}
              className={`px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md transition-all text-base cursor-pointer ${
                isOpeningBox ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {isOpeningBox ? 'Đang Mở Rương...' : 'Mở Rương Ngay (Miễn Phí)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
