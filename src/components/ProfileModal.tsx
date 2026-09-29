import React, { useState } from 'react';
import { X, Check, User, Sparkles, Flame, BookOpen, Trophy } from 'lucide-react';
import { PlayerProfile } from '../types/quiz';
import { AVATAR_LIST } from '../data/rewards';
import { soundManager } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onSaveProfile: (updated: Partial<PlayerProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState<string>(profile.name);
  const [schoolClass, setSchoolClass] = useState<string>(profile.schoolClass);
  const [avatarId, setAvatarId] = useState<string>(profile.avatarId);

  const handleSave = () => {
    soundManager.playClick();
    onSaveProfile({
      name: name.trim() || 'Học Sinh Toán 6',
      schoolClass: schoolClass.trim() || '6A1',
      avatarId,
    });
    onClose();
  };

  const accuracy =
    profile.totalAnswersCount > 0
      ? Math.round((profile.correctAnswersCount / profile.totalAnswersCount) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Hồ Sơ Học Sinh & Nhân Vật
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn Nhân Vật Đại Diện
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATAR_LIST.map((av) => {
                const isSelected = avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => {
                      soundManager.playClick();
                      setAvatarId(av.id);
                    }}
                    className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-300'
                        : 'border-slate-200 hover:border-amber-200 bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                      {av.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Class inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Họ và Tên Học Sinh
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                placeholder="Nhập tên của bạn..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lớp Học
              </label>
              <select
                value={schoolClass}
                onChange={(e) => setSchoolClass(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="6A1">Lớp 6A1</option>
                <option value="6A2">Lớp 6A2</option>
                <option value="6A3">Lớp 6A3</option>
                <option value="6A4">Lớp 6A4</option>
                <option value="6A5">Lớp 6A5</option>
                <option value="6A6">Lớp 6A6</option>
              </select>
            </div>
          </div>

          {/* Current Stats Grid */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Thống Kê Quá Trình Học Tập
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">Tổng Điểm</span>
                <span className="text-base font-bold text-amber-900 tabular-nums font-heading">
                  {profile.totalScore}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">Độ Chính Xác</span>
                <span className="text-base font-bold text-emerald-700 tabular-nums font-heading">
                  {accuracy}%
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">Chuỗi Kỷ Lục</span>
                <span className="text-base font-bold text-orange-600 tabular-nums font-heading">
                  {profile.highestStreak}🔥
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">Đã Đúng</span>
                <span className="text-base font-bold text-blue-700 tabular-nums font-heading">
                  {profile.correctAnswersCount}/{profile.totalAnswersCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
