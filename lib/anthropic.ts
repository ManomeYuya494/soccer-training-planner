import Anthropic from "@anthropic-ai/sdk";

// 遅延初期化（ビルド時エラー回避のため）
let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

// 自然言語からメニュー情報を抽出するプロンプト
export const EXTRACT_MENU_PROMPT = `あなたはサッカー指導者のアシスタントです。
ユーザーが自然言語で説明した練習メニューから、以下の情報を抽出してJSON形式で出力してください。

## 出力形式
必ず以下のJSON形式のみを出力してください（説明文は不要）：

{
  "menu": {
    "title": "練習メニューのタイトル（例：3vs1のロンド）",
    "targetAge": "対象年齢（U-6, U-7, U-8, U-9, U-10, U-11, U-12, U-13〜 のいずれか、不明ならU-10）",
    "players": "人数（例：4人、8人など）",
    "difficulty": 3,
    "courtSize": "コートサイズ（例：5m × 5m、20m × 12m）",
    "duration": "時間（例：10分、10min×2セット）",
    "organize": "オーガナイズ（ルール・配置の説明）",
    "keyFactors": "キーファクター（技術的なポイント）",
    "coachingPoints": "留意点・コーチングポイント",
    "memo": "その他のメモ",
    "notes": "備考",
    "graphicDescription": "図解の説明（選手配置、マーカー位置、矢印など）"
  }
}

## 注意事項
- 明示されていない情報は、練習内容から推測して適切な値を設定する
- タイトルは練習の特徴を端的に表す名前にする
- graphicDescriptionは図解を描くために必要な配置情報を詳細に記述する
- 不明な場合は空文字""ではなく、合理的なデフォルト値を設定する
- difficulty は1〜5の数値（とても簡単:1 〜 とても難しい:5、不明なら3）`;

// 図解生成用のプロンプト
export const GRAPHIC_SYSTEM_PROMPT = `あなたはサッカーのトレーニング図解を生成するアシスタントです。
ユーザーの説明から、コート上の選手配置、マーカー、矢印などの情報をJSON形式で出力してください。

## 座標系
- コートは左上が(0,0)、右下が(100,100)のパーセント座標です
- x軸：左が0、右が100
- y軸：上が0、下が100

## 出力形式
必ず以下のJSON形式のみを出力してください（説明文は不要）：

{
  "graphic": {
    "courtWidth": 100,
    "courtHeight": 100,
    "players": [
      {
        "id": "player1",
        "x": 20,
        "y": 80,
        "team": "attack",
        "label": "A",
        "hasBall": true
      }
    ],
    "arrows": [
      {
        "id": "arrow1",
        "fromX": 20,
        "fromY": 80,
        "toX": 50,
        "toY": 20,
        "type": "pass",
        "label": ""
      }
    ],
    "markers": [
      {
        "id": "marker1",
        "x": 0,
        "y": 0,
        "type": "cone"
      }
    ]
  }
}

## チームの種類
- "attack": 攻撃側（オレンジ色で表示）
- "defense": 守備側（青色で表示）
- "neutral": 中立/GKなど（緑色で表示）

## 矢印の種類
- "pass": パス（点線）
- "move": 動き（実線）
- "dribble": ドリブル（波線）

## マーカーの種類
- "cone": コーン
- "marker": マーカー（平らなディスク）
- "goal": ゴール
- "flag": フラッグ

## 注意事項
- 選手のラベルはA, B, C...などのアルファベットを使用
- 守備選手は通常D, E, F...から始める
- ボールを持っている選手は1人だけhasBall: trueにする
- コートサイズの情報があれば、それに応じた縦横比を考慮する
- 四隅にマーカーを置くことが多い
- 説明に矢印や動きの記載がなければ、arrowsは空配列でOK
- ゴールがある場合は、markersにtype: "goal"で追加する`;
