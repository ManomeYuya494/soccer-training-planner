# サッカーTR計画効率化ツール

## 概要
参加人数・時間・場所・指導方針をもとに、AIがトレーニングメニューを生成しA4 PDFで出力するWebアプリ。

## 技術スタック
- Next.js 14 (TypeScript)
- Tailwind CSS
- AI: Anthropic Claude / OpenAI GPT-4o / Google Gemini
- PDF生成: @react-pdf/renderer
- Vercelデプロイ対応

## 開発コマンド
```
npm run dev    # 開発サーバー起動
npm run build  # ビルド
```

## 作業ルール
- AI APIキーは.env.localに設定（.env.local.example参照）
- トレーニングメニューの出力フォーマット変更はPDF関連コンポーネントを修正
