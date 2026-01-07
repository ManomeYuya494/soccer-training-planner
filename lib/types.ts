// トレーニング入力フォームの型
export interface TrainingInput {
  date: string;
  participants: number;
  duration: number; // 分
  location: string;
  groundSize: string;
  theme: string;
  preferences: string; // 指導者のこだわり・前提条件
}

// トレーニングメニュー項目の型
export interface TrainingMenuItem {
  name: string;
  duration: number; // 分
  description: string;
  gridSize?: string;
  playerArrangement?: string;
  rules: string[];
  coachingPoints: string[];
}

// AIからの提案1件の型
export interface TrainingProposal {
  id: string;
  title: string;
  overview: string;
  warmup: TrainingMenuItem;
  mainTraining: TrainingMenuItem[];
  cooldown: TrainingMenuItem;
  totalDuration: number;
  keyPoints: string[];
}

// API レスポンスの型
export interface GenerateResponse {
  proposals: TrainingProposal[];
}

// テーマの選択肢
export const THEME_OPTIONS = [
  { value: "attack", label: "攻撃（シュート・崩し）" },
  { value: "defense", label: "守備（プレス・カバー）" },
  { value: "buildup", label: "ビルドアップ" },
  { value: "passing", label: "パス・コントロール" },
  { value: "dribble", label: "ドリブル・1対1" },
  { value: "goalkeeper", label: "ゴールキーパー" },
  { value: "physical", label: "フィジカル・体力" },
  { value: "game", label: "ゲーム形式" },
] as const;

// グラウンドサイズの選択肢
export const GROUND_SIZE_OPTIONS = [
  { value: "full", label: "フルコート（68m×105m）" },
  { value: "half", label: "ハーフコート" },
  { value: "quarter", label: "クォーターコート" },
  { value: "small", label: "小グラウンド（30m×40m程度）" },
  { value: "futsal", label: "フットサルコート" },
  { value: "gym", label: "体育館" },
] as const;
