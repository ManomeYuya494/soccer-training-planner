// オーガナイズ（練習の設定情報）
export interface Organize {
  gridSize: string; // 大きさ（例：30m×30m）
  equipment: string; // 用具（例：ボール、ビブス、コーン4本）
  method: string; // 方法（例：4対4のゲーム）
  scoring: string; // 得点方法
  totalDuration: string; // トータル練習時間（例：10分）
  roundDuration: string; // 1回あたりの時間（例：30秒）
  markersInterval: string; // マーカー間隔
  notes?: string; // 備考（ルールや運営の細かい点）
}

// フロー説明
export interface FlowDescription {
  hasTransition: boolean; // トランジションあり/なし
  startPosition: string; // スタート位置（例：コーチ配球、下側から）
  endCondition: string; // 終了条件（例：ボールがラインを出たら）
  notes: string; // その他の流れの説明
}

// 練習メニュー入力の型
export interface TrainingMenuInput {
  title: string;
  category: string; // カテゴリ（ドリブル/パス/守備など）
  organize: Organize; // オーガナイズ情報
  flow?: FlowDescription; // フロー説明（オプション）
  keyFactors: string[]; // キーファクター（技術的なポイント）
  recognition: string[]; // 認知（何を見て判断するか）
  criteria: string[]; // 基準（デモで見せるべきこと）
  graphicDescription: string; // 図解の説明（AIが解析）
}

// 選手の配置情報
export interface PlayerPosition {
  id: string;
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  team: "attack" | "defense" | "freeman" | "neutral";
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

// マーカー/道具
export interface Marker {
  id: string;
  x: number;
  y: number;
  type: "cone" | "soccerMarker" | "flatMarker" | "miniGoal";
}

// サイズ表記ラベル（図解内に表示）
export interface DimensionLabel {
  id: string;
  x1: number; // 開始位置
  y1: number;
  x2: number; // 終了位置
  y2: number;
  label: string; // 表示テキスト（例：7m）
  position: "horizontal" | "vertical"; // 横線か縦線か
}

// 図解データ
export interface GraphicData {
  players: PlayerPosition[];
  arrows: Arrow[];
  markers: Marker[];
  dimensionLabels: DimensionLabel[]; // サイズ表記
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
