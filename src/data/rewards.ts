import { VirtualBadge, VirtualTitle } from '../types/quiz';

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  tag: string;
}

export const AVATAR_LIST: AvatarOption[] = [
  { id: 'owl-pipi', name: 'Cú Pi-Pi', emoji: '🦉', bgColor: 'bg-amber-100 text-amber-700', tag: 'Dẫn dắt' },
  { id: 'fox-milo', name: 'Cáo Milo', emoji: '🦊', bgColor: 'bg-orange-100 text-orange-700', tag: 'Lém lỉnh' },
  { id: 'bunny-luna', name: 'Thỏ Luna', emoji: '🐰', bgColor: 'bg-pink-100 text-pink-700', tag: 'Chăm chỉ' },
  { id: 'panda-bao', name: 'Gấu Bao', emoji: '🐼', bgColor: 'bg-emerald-100 text-emerald-700', tag: 'Kiên trì' },
  { id: 'cat-miu', name: 'Mèo Miu', emoji: '🐱', bgColor: 'bg-purple-100 text-purple-700', tag: 'Nhanh nhẹn' },
  { id: 'dino-toby', name: 'Khủng Long Toby', emoji: '🦖', bgColor: 'bg-cyan-100 text-cyan-700', tag: 'Khám phá' },
];

export const VIRTUAL_BADGES: VirtualBadge[] = [
  {
    id: 'first-step',
    name: 'Bước Chân Đầu Tiên',
    description: 'Hoàn thành bài trắc nghiệm ôn tập đầu tiên.',
    icon: '🌱',
    category: 'score',
    conditionText: 'Hoàn thành 1 bài trắc nghiệm',
  },
  {
    id: 'streak-master',
    name: 'Chuỗi Bất Bại',
    description: 'Trả lời chính xác liên tiếp 3 câu hỏi.',
    icon: '🔥',
    category: 'streak',
    conditionText: 'Đạt combo 3 câu đúng',
  },
  {
    id: 'streak-legend',
    name: 'Huyền Thoại Combo',
    description: 'Đạt chuỗi 7 câu trả lời đúng liên tục.',
    icon: '⚡',
    category: 'streak',
    conditionText: 'Đạt combo 7 câu đúng',
  },
  {
    id: 'power-expert',
    name: 'Chiến Thần Luỹ Thừa',
    description: 'Làm chủ công thức nhân chia luỹ thừa cùng cơ số.',
    icon: '💥',
    category: 'topic',
    conditionText: 'Hoàn thành chủ đề Phép tính & Luỹ thừa',
  },
  {
    id: 'prime-hunter',
    name: 'Thợ Săn Số Nguyên Tố',
    description: 'Nắm vững bảng số nguyên tố và hợp số.',
    icon: '💎',
    category: 'topic',
    conditionText: 'Hoàn thành chủ đề Số nguyên tố',
  },
  {
    id: 'gcd-master',
    name: 'Bậc Thầy ƯCLN & BCNN',
    description: 'Giải xuất sắc các bài toán thực tế chia quà, chu kỳ.',
    icon: '🏆',
    category: 'mastery',
    conditionText: 'Đạt điểm tuyệt đối chủ đề ƯCLN & BCNN',
  },
  {
    id: 'notebook-hero',
    name: 'Chiến Binh Chăm Chỉ',
    description: 'Ôn tập và sửa đúng các câu hỏi trong Sổ tay câu sai.',
    icon: '📖',
    category: 'mastery',
    conditionText: 'Sửa đúng ít nhất 1 câu trong Sổ tay',
  },
  {
    id: 'score-100',
    name: 'Thủ Khoa Đấu Trường',
    description: 'Tích lũy tổng điểm số đạt mốc 100 điểm.',
    icon: '👑',
    category: 'score',
    conditionText: 'Đạt mốc 100 điểm thưởng',
  },
];

export const VIRTUAL_TITLES: VirtualTitle[] = [
  {
    id: 'tan-binh',
    name: 'Tân Binh Toán Học',
    color: 'text-slate-700 bg-slate-100 border-slate-300',
    requiredCoins: 0,
    description: 'Danh hiệu khởi đầu của mọi học sinh lớp 6.',
  },
  {
    id: 'nha-tham-hiem',
    name: 'Nhà Thám Hiểm Số Học',
    color: 'text-amber-800 bg-amber-100 border-amber-300',
    requiredCoins: 40,
    description: 'Dành cho những bạn ham học hỏi, yêu thích con số.',
  },
  {
    id: 'hiep-si-luy-thua',
    name: 'Hiệp Sĩ Luỹ Thừa',
    color: 'text-blue-800 bg-blue-100 border-blue-300',
    requiredCoins: 80,
    description: 'Tốc độ tính toán luỹ thừa nhanh như gió.',
  },
  {
    id: 'phu-thuy-tinh-nham',
    name: 'Phù Thuỷ Tính Nhanh',
    color: 'text-purple-800 bg-purple-100 border-purple-300',
    requiredCoins: 120,
    description: 'Khả năng chia hết và nhẩm số xuất thần.',
  },
  {
    id: 'bac-thay-toan-6',
    name: 'Bậc Thầy Toán 6 KNTT',
    color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
    requiredCoins: 200,
    description: 'Vững vàng toàn bộ kiến thức Số Tự Nhiên Lớp 6.',
  },
  {
    id: 'huyen-thoai-bang-vang',
    name: 'Huyền Thoại Bảng Vàng',
    color: 'text-rose-800 bg-rose-100 border-rose-300',
    requiredCoins: 350,
    description: 'Danh hiệu cao quý nhất của đấu trường số tự nhiên.',
  },
];
