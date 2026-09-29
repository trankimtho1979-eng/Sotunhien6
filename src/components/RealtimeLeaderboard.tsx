import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Clock,
  Sparkles,
  Users,
  Search,
  ArrowUp,
  Award,
} from 'lucide-react';
import { LeaderboardEntry, LiveActivityItem, PlayerProfile } from '../types/quiz';
import { AVATAR_LIST } from '../data/rewards';
import { soundManager } from '../utils/audio';

interface RealtimeLeaderboardProps {
  profile: PlayerProfile;
  onStartArena: () => void;
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'user-1',
    name: 'Nguyễn Minh Khang',
    schoolClass: '6A1',
    avatarId: 'owl-pipi',
    score: 420,
    streak: 8,
    accuracy: 96,
    badge: 'Chiến Thần Luỹ Thừa',
    timeAgo: '1 phút trước',
  },
  {
    id: 'user-2',
    name: 'Trần Bảo Ngọc',
    schoolClass: '6A2',
    avatarId: 'cat-miu',
    score: 380,
    streak: 6,
    accuracy: 94,
    badge: 'Bậc Thầy Toán 6',
    timeAgo: '3 phút trước',
  },
  {
    id: 'user-3',
    name: 'Lê Gia Huy',
    schoolClass: '6A1',
    avatarId: 'fox-milo',
    score: 350,
    streak: 5,
    accuracy: 92,
    badge: 'Thợ Săn Số Nguyên Tố',
    timeAgo: '7 phút trước',
  },
  {
    id: 'user-4',
    name: 'Phạm Quỳnh Chi',
    schoolClass: '6A3',
    avatarId: 'bunny-luna',
    score: 310,
    streak: 5,
    accuracy: 90,
    badge: 'Hiệp Sĩ Luỹ Thừa',
    timeAgo: '12 phút trước',
  },
  {
    id: 'user-5',
    name: 'Vũ Đức Anh',
    schoolClass: '6A4',
    avatarId: 'dino-toby',
    score: 280,
    streak: 4,
    accuracy: 88,
    badge: 'Nhà Thám Hiểm',
    timeAgo: '18 phút trước',
  },
  {
    id: 'user-6',
    name: 'Đặng Tuệ Lâm',
    schoolClass: '6A2',
    avatarId: 'panda-bao',
    score: 250,
    streak: 4,
    accuracy: 86,
    badge: 'Bậc Thầy ƯCLN',
    timeAgo: '25 phút trước',
  },
  {
    id: 'user-7',
    name: 'Hoàng Quốc Việt',
    schoolClass: '6A5',
    avatarId: 'fox-milo',
    score: 220,
    streak: 3,
    accuracy: 85,
    badge: 'Tân Binh Xuất Sắc',
    timeAgo: '30 phút trước',
  },
];

const RECENT_ACTIVITIES: LiveActivityItem[] = [
  {
    id: 'act-1',
    studentName: 'Trần Bảo Ngọc',
    studentClass: '6A2',
    avatarId: 'cat-miu',
    action: 'Vừa trả lời đúng 5 câu liên tiếp chủ đề ƯCLN & BCNN!',
    pointsAdded: 85,
    timeAgo: 'Vừa xong',
  },
  {
    id: 'act-2',
    studentName: 'Nguyễn Minh Khang',
    studentClass: '6A1',
    avatarId: 'owl-pipi',
    action: 'Đạt danh hiệu "Chiến Thần Luỹ Thừa" với 420 điểm!',
    pointsAdded: 50,
    timeAgo: '2 phút trước',
  },
  {
    id: 'act-3',
    studentName: 'Phạm Quỳnh Chi',
    studentClass: '6A3',
    avatarId: 'bunny-luna',
    action: 'Hoàn thành thử thách Dấu hiệu chia hết không sai câu nào!',
    pointsAdded: 60,
    timeAgo: '5 phút trước',
  },
];

export const RealtimeLeaderboard: React.FC<RealtimeLeaderboardProps> = ({
  profile,
  onStartArena,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'all'>('today');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activities, setActivities] = useState<LiveActivityItem[]>(RECENT_ACTIVITIES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Simulated live event feed every 14s
  useEffect(() => {
    const liveNames = ['Võ Tấn Phát', 'Ngô Hà My', 'Bùi Tuấn Kiệt', 'Đỗ Thảo Vy', 'Trịnh Hữu Phước'];
    const liveClasses = ['6A1', '6A2', '6A3', '6A4'];
    const liveAvatars = ['fox-milo', 'cat-miu', 'bunny-luna', 'dino-toby', 'panda-bao'];
    const liveActions = [
      'vừa đạt chuỗi 3 câu đúng chủ đề Tập hợp!',
      'vừa vượt qua câu đố chia kẹo tìm ƯCLN!',
      'vừa ghi được 45 điểm trong Đấu Trường Leo Tháp!',
      'vừa hoàn thành bài ôn tập Luỹ thừa!',
    ];

    const interval = setInterval(() => {
      const randomName = liveNames[Math.floor(Math.random() * liveNames.length)];
      const randomClass = liveClasses[Math.floor(Math.random() * liveClasses.length)];
      const randomAvatar = liveAvatars[Math.floor(Math.random() * liveAvatars.length)];
      const randomAction = liveActions[Math.floor(Math.random() * liveActions.length)];
      const points = Math.floor(Math.random() * 4 + 2) * 10;

      const newAct: LiveActivityItem = {
        id: `act-${Date.now()}`,
        studentName: randomName,
        studentClass: randomClass,
        avatarId: randomAvatar,
        action: randomAction,
        pointsAdded: points,
        timeAgo: 'Vừa xong',
      };

      setActivities((prev) => [newAct, ...prev.slice(0, 4)]);
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  // Merge player into leaderboard
  const userEntry: LeaderboardEntry = {
    id: profile.id,
    name: profile.name,
    schoolClass: profile.schoolClass,
    avatarId: profile.avatarId,
    score: profile.totalScore,
    streak: profile.highestStreak,
    accuracy:
      profile.totalAnswersCount > 0
        ? Math.round((profile.correctAnswersCount / profile.totalAnswersCount) * 100)
        : 100,
    badge: profile.equippedTitle || 'Tân Binh Toán Học',
    isUser: true,
    timeAgo: 'Hiện tại',
  };

  const combinedList = [...leaderboard.filter((i) => i.id !== profile.id), userEntry].sort(
    (a, b) => b.score - a.score
  );

  const userRankIndex = combinedList.findIndex((item) => item.isUser);

  // Filter list
  const filteredList = combinedList.filter((item) => {
    const matchClass = filterClass === 'all' || item.schoolClass === filterClass;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  const getAvatarEmoji = (avatarId: string) => {
    const found = AVATAR_LIST.find((a) => a.id === avatarId);
    return found?.emoji || '🦉';
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) {
      return {
        bg: 'bg-amber-400 text-white shadow-xs',
        icon: <Trophy className="w-4 h-4 text-white fill-amber-200" />,
      };
    }
    if (rank === 2) {
      return {
        bg: 'bg-slate-300 text-slate-800 shadow-xs',
        icon: <Medal className="w-4 h-4 text-slate-700" />,
      };
    }
    if (rank === 3) {
      return {
        bg: 'bg-amber-700 text-white shadow-xs',
        icon: <Medal className="w-4 h-4 text-amber-200" />,
      };
    }
    return {
      bg: 'bg-slate-100 text-slate-600 font-bold',
      icon: null,
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header section with live feed ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-500 fill-amber-300" />
            <span>Bảng Xếp Hạng Thời Gian Thực</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Đua top cùng các bạn học sinh lớp 6 trên khắp cả nước theo chương trình Kết Nối Tri Thức.
          </p>
        </div>

        {/* CTA to jump into Arena */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartArena();
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Vào Đấu Trường Leo Điểm</span>
        </button>
      </div>

      {/* Live Activity Ticker */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 sm:p-4 mb-6 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider shrink-0 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>Thời gian thực</span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap text-xs text-slate-700 flex items-center gap-4">
          {activities.slice(0, 3).map((act) => (
            <div key={act.id} className="flex items-center gap-1.5 shrink-0">
              <span className="font-semibold text-slate-900">
                {act.studentName} ({act.studentClass})
              </span>
              <span>{act.action}</span>
              {act.pointsAdded && (
                <span className="font-bold text-amber-600">+{act.pointsAdded}đ</span>
              )}
              <span className="text-slate-400 text-[10px]">· {act.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaderboard Table (2 Columns on large) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Period tabs (Interactive buttons) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setFilterPeriod('today');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterPeriod === 'today'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hôm Nay
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setFilterPeriod('week');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterPeriod === 'week'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tuần Này
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setFilterPeriod('all');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterPeriod === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bảng Vàng
              </button>
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Tất cả các lớp</option>
                <option value="6A1">Lớp 6A1</option>
                <option value="6A2">Lớp 6A2</option>
                <option value="6A3">Lớp 6A3</option>
                <option value="6A4">Lớp 6A4</option>
              </select>

              {/* Search query */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm bạn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 w-28 sm:w-36"
                />
              </div>
            </div>
          </div>

          {/* Leaderboard entries list */}
          <div className="bg-white border border-slate-200 rounded-3xl p-3 sm:p-5 shadow-xs divide-y divide-slate-100">
            {filteredList.map((entry, index) => {
              const rank = index + 1;
              const badgeStyle = getRankBadgeStyle(rank);
              const isCurrentUser = entry.isUser;

              return (
                <div
                  key={entry.id}
                  className={`py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                    isCurrentUser
                      ? 'bg-amber-50/90 border border-amber-300 ring-2 ring-amber-400/30'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Rank & Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank badge */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold ${badgeStyle.bg}`}
                    >
                      {badgeStyle.icon || rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      {getAvatarEmoji(entry.avatarId)}
                    </div>

                    {/* Name & Class info */}
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {entry.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500 text-white shrink-0">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Lớp {entry.schoolClass}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-800 font-medium truncate">
                          {entry.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Score */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-right">
                    {/* Streak flame */}
                    {entry.streak > 1 && (
                      <div className="hidden sm:flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span className="tabular-nums font-bold">x{entry.streak}</span>
                      </div>
                    )}

                    {/* Accuracy */}
                    <div className="hidden sm:block text-xs text-slate-500">
                      <span className="block font-semibold text-slate-700 tabular-nums">
                        {entry.accuracy}%
                      </span>
                      <span className="text-[10px]">chính xác</span>
                    </div>

                    {/* Main Score */}
                    <div className="min-w-[70px]">
                      <span className="text-base sm:text-lg font-bold text-amber-900 tabular-nums block font-heading">
                        {entry.score}
                      </span>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">
                        Điểm
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Your Personal Status Card & Mascot Cheer */}
        <div className="space-y-5">
          {/* User's Current Position Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100 bg-white/20 px-2.5 py-1 rounded-xl">
                Vị Trí Của Bạn
              </span>
              <span className="text-xs text-amber-100 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Cập nhật tức thì
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-3xl shadow-sm">
                {getAvatarEmoji(profile.avatarId)}
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading">{profile.name}</h3>
                <p className="text-xs text-amber-100">Lớp {profile.schoolClass}</p>
                <div className="inline-block mt-1 text-[11px] font-semibold bg-white/25 px-2 py-0.5 rounded-lg text-white">
                  {profile.equippedTitle || 'Tân Binh Toán Học'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-black/10 rounded-2xl p-3 border border-white/10">
              <div>
                <span className="text-xs text-amber-100 block">Hạng</span>
                <span className="text-xl font-bold font-heading tabular-nums">
                  #{userRankIndex + 1}
                </span>
              </div>
              <div>
                <span className="text-xs text-amber-100 block">Tổng Điểm</span>
                <span className="text-xl font-bold font-heading tabular-nums">
                  {profile.totalScore}
                </span>
              </div>
              <div>
                <span className="text-xs text-amber-100 block">Kỷ Lục Chuỗi</span>
                <span className="text-xl font-bold font-heading tabular-nums">
                  {profile.highestStreak}🔥
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 text-xs text-amber-100 flex items-center justify-between">
              <span>Chỉ cần thêm điểm để leo top cao hơn!</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartArena();
                }}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Leo Top Ngay →
              </button>
            </div>
          </div>

          {/* Mini Study Tip Card */}
          <div className="bg-white border border-amber-200 rounded-3xl p-5 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 font-heading mb-2 flex items-center gap-1.5">
              <span>💡 Cách Tích Điểm Leo Bảng Vàng</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Trả lời đúng liên tiếp để nhận điểm combo x1.2 và x1.5!</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Tham gia Đấu Trường Leo Tháp để nhận x2 điểm thưởng.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Xem kỹ lời giải các câu sai trong Sổ tay để không bị mất điểm oan.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
