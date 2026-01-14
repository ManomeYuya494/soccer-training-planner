import { GoogleGenerativeAI } from "@google/generative-ai";

// 遅延初期化
let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

// 自然言語からメニュー情報を抽出するプロンプト
export const EXTRACT_MENU_PROMPT = `あなたはサッカー指導者のアシスタントです。
ユーザーが自然言語で説明した練習メニューから、情報を抽出してJSON形式で出力してください。

## 入力の特徴
- ChatGPT/Claudeなど他のAIが生成した練習メニュー説明をコピペすることが多い
- Webサイトの情報を参考にしていることもある
- 様々な形式（箇条書き、段落、会話調など）で入力される

## 最重要ルール
1. **詳細な指示がある場合は必ずその通りに抽出**
   - 数値（「10m×6m」「コーン4本」など）は正確に
   - 配置指示（「四隅に」「上部に」など）は正確に
2. **曖昧・不明な場合のみ**合理的なデフォルトで補完
3. 各項目は**短く簡潔に**（キーワードレベル）

## 出力形式
必ず以下のJSON形式のみを出力してください：

{
  "menu": {
    "title": "練習メニューのタイトル",
    "category": "カテゴリ（守備/ドリブル/パス/シュート/ポゼッション/ゲーム形式など）",
    "organize": {
      "gridSize": "大きさ（例：10m×6m）※指定があれば正確に",
      "equipment": "用具（例：コーン4本、マーカー8枚）※数量を正確に",
      "method": "方法（例：1対1、ボールなし）",
      "scoring": "得点方法",
      "totalDuration": "トータル練習時間（例：10分）",
      "roundDuration": "1回あたりの時間（例：30秒、1分）",
      "markersInterval": "マーカー間隔",
      "notes": "備考（ルールや運営の細かい点）"
    },
    "keyFactors": ["キーファクター1", "キーファクター2"],
    "recognition": ["何を見るか1", "何を見るか2"],
    "criteria": ["基準1", "基準2"],
    "graphicDescription": "【重要】図解に必要な配置情報を詳細に記述"
  }
}

## graphicDescriptionの書き方（重要）
図解生成に必要な情報を漏れなく記述する：
- 選手の人数と役割（攻撃○人、守備○人）
- 選手の配置（「攻撃は下側」「守備は中央やや上」など）
- 道具の種類と数（コーン○本、マーカー○枚、ゴール○個）
- 道具の配置（「四隅にコーン」「上部にゴール2つ、5m間隔」など）
- グリッドの縦横比（縦長か横長か）

例：「1対1。縦10m×横6mの縦長グリッド。四隅にコーン4本。上部にゴール2つを5m間隔で配置。攻撃1人は下側中央、守備1人は中央やや上に配置。」

## 注意事項
- 入力に明記されている情報は必ず抽出（見落とさない）
- 不明な項目は空文字""（無理に推測しない）
- keyFactors/recognition/criteriaは短いキーワードで`;

// 図解生成用のプロンプト
export const GRAPHIC_SYSTEM_PROMPT = `あなたはサッカーのトレーニング図解を生成するアシスタントです。
ユーザーの説明から、コート上の選手配置、マーカー、矢印などの情報をJSON形式で出力してください。

## 最重要ルール
**詳細な指示がある場合は必ずその通りに配置する**
- 「四隅にコーン」→ 4つのコーナーに配置
- 「上部にゴール2つ」→ 上側に2つ配置
- 「攻撃は下」→ y座標を大きく（70-85あたり）
- 「守備は中央やや上」→ y座標を小さめに（30-45あたり）
- 数量が指定されていれば、その数だけ配置

## 座標系
- コートは左上が(0,0)、右下が(100,100)のパーセント座標
- x軸：左が0、右が100
- y軸：上が0、下が100

## 位置の目安
| 指示 | x座標 | y座標 |
|------|-------|-------|
| 左上 | 5-15 | 5-15 |
| 右上 | 85-95 | 5-15 |
| 左下 | 5-15 | 85-95 |
| 右下 | 85-95 | 85-95 |
| 中央 | 45-55 | 45-55 |
| 上側/上部 | 30-70 | 5-20 |
| 下側/下部 | 30-70 | 80-95 |
| 左側 | 5-20 | 30-70 |
| 右側 | 80-95 | 30-70 |

## 出力形式
必ず以下のJSON形式のみを出力：

{
  "graphic": {
    "courtWidth": 100,
    "courtHeight": 100,
    "players": [
      { "id": "player1", "x": 50, "y": 80, "team": "attack", "label": "A", "hasBall": true }
    ],
    "arrows": [
      { "id": "arrow1", "fromX": 50, "fromY": 80, "toX": 50, "toY": 30, "type": "move" }
    ],
    "markers": [
      { "id": "marker1", "x": 5, "y": 5, "type": "cone" }
    ],
    "dimensionLabels": [
      { "id": "dim1", "x1": 5, "y1": 100, "x2": 95, "y2": 100, "label": "10m", "position": "horizontal" }
    ]
  }
}

## 矢印の種類
- "move": 移動（白い実線）
- "pass": パス（青い破線）
- "dribble": ドリブル（緑の点線）

## サイズ表記（dimensionLabels）
グリッドサイズが指定されている場合は、dimensionLabelsでサイズ表記を追加：
- horizontal: 横幅を示す（y座標を揃えて左右に配置）
- vertical: 縦幅を示す（x座標を揃えて上下に配置）
例：10m×6mのグリッド
  { "id": "dim-w", "x1": 5, "y1": 100, "x2": 95, "y2": 100, "label": "10m", "position": "horizontal" },
  { "id": "dim-h", "x1": 100, "y1": 5, "x2": 100, "y2": 95, "label": "6m", "position": "vertical" }

## チームの種類
- "attack": 味方/攻撃側（オレンジ）
- "defense": 相手/守備側（青）
- "freeman": フリーマン（黄）
- "neutral": 中立/GK（緑）

## マーカー・道具の種類
- "cone": カラーコーン（赤い三角形）
- "flatMarker": フラットマーカー（黄色い平たい円）
- "soccerMarker": サッカーマーカー（青い円）
- "miniGoal": ミニゴール/ゲート（白い四角）

## 配置パターン例
### 四隅にコーン4本
markers: [
  { id: "c1", x: 5, y: 5, type: "cone" },
  { id: "c2", x: 95, y: 5, type: "cone" },
  { id: "c3", x: 5, y: 95, type: "cone" },
  { id: "c4", x: 95, y: 95, type: "cone" }
]

### 上部にゴール2つ（5m間隔→左右に分けて配置）
markers: [
  { id: "g1", x: 35, y: 5, type: "miniGoal" },
  { id: "g2", x: 65, y: 5, type: "miniGoal" }
]

### 1対1の基本配置（攻撃下、守備中央上）
players: [
  { id: "p1", x: 50, y: 80, team: "attack", label: "A", hasBall: true },
  { id: "p2", x: 50, y: 40, team: "defense", label: "X", hasBall: false }
]

## 注意事項
- 選手ラベル：味方はA,B,C...、相手はX,Y,Z...、フリーマンはF
- 選手の動きの説明があれば矢印（arrows）を追加。なければ空配列[]
- 「ボールなし」の練習ではhasBallは全員false
- グリッドが縦長（例：10m×6m）なら縦方向に広く配置を意識
- グリッドサイズが指定されていたらdimensionLabelsでサイズ表記を必ず追加`;
