export type TopicId = 
  | 'tap-hop' 
  | 'phep-tinh' 
  | 'thu-tu-phep-tinh' 
  | 'chia-het' 
  | 'so-nguyen-to' 
  | 'ucln-bcnn' 
  | 'dau-truong';

export interface TopicInfo {
  id: TopicId;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  color: string;
  bgLight: string;
  borderColor: string;
  badgeText: string;
}

export interface Question {
  id: string;
  topicId: TopicId;
  topicTitle: string;
  question: string;
  mathExpression?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pipiTip: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  schoolClass: string;
  avatarId: string;
  totalScore: number;
  coins: number;
  diamonds: number;
  streak: number;
  highestStreak: number;
  unlockedBadges: string[];
  unlockedTitles: string[];
  equippedTitle: string;
  completedQuizzesCount: number;
  correctAnswersCount: number;
  totalAnswersCount: number;
  wrongQuestionIds: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  schoolClass: string;
  avatarId: string;
  score: number;
  streak: number;
  accuracy: number;
  badge: string;
  isUser?: boolean;
  timeAgo?: string;
}

export interface VirtualBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'score' | 'streak' | 'topic' | 'mastery';
  conditionText: string;
}

export interface VirtualTitle {
  id: string;
  name: string;
  color: string;
  requiredCoins: number;
  description: string;
}

export interface LiveActivityItem {
  id: string;
  studentName: string;
  studentClass: string;
  avatarId: string;
  action: string;
  pointsAdded?: number;
  timeAgo: string;
}
