// 練習メニュー入力の型
export interface TrainingMenuInput {
  title: string;
  targetAge: string;
  players: string;
  difficulty: number; // 1-5
  courtSize: string;
  duration: string;
  organize: string; // オーガナイズ（ルール・配置）
  keyFactors: string; // キーファクター
  coachingPoints: string; // 留意点・コーチングポイント
  memo: string;
  notes: string; // 備考
  // 図解用の追加情報
  graphicDescription: string; // 図解の説明（AIが解析）
}

// 選手の配置情報
export interface PlayerPosition {
  id: string;
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  team: "attack" | "defense" | "neutral";
  label?: string;
  hasBall?: boolean;
}

// 矢印（動きの方向）
export interface Arrow {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: "move" | "pass" | "dribble";
  label?: string;
}

// マーカー/コーン
export interface Marker {
  id: string;
  x: number;
  y: number;
  type: "cone" | "marker" | "goal" | "flag";
}

// 図解データ
export interface GraphicData {
  players: PlayerPosition[];
  arrows: Arrow[];
  markers: Marker[];
  courtWidth: number;
  courtHeight: number;
}

// 完成した練習メニューデータ
export interface TrainingMenu {
  input: TrainingMenuInput;
  graphic: GraphicData;
}

// APIレスポンス
export interface GenerateGraphicResponse {
  graphic: GraphicData;
}

// 難易度の選択肢
export const DIFFICULTY_OPTIONS = [
  { value: 1, label: "★☆☆☆☆", description: "とても簡単" },
  { value: 2, label: "★★☆☆☆", description: "簡単" },
  { value: 3, label: "★★★☆☆", description: "普通" },
  { value: 4, label: "★★★★☆", description: "難しい" },
  { value: 5, label: "★★★★★", description: "とても難しい" },
] as const;

// 対象年齢の選択肢
export const AGE_OPTIONS = [
  "U-6",
  "U-7",
  "U-8",
  "U-9",
  "U-10",
  "U-11",
  "U-12",
  "U-13〜",
] as const;
