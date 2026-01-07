"use client";

import { useState } from "react";
import { TrainingMenuInput, DIFFICULTY_OPTIONS, AGE_OPTIONS } from "@/lib/types";

interface TrainingFormProps {
  onSubmit: (data: TrainingMenuInput) => void;
  isLoading: boolean;
}

export default function TrainingForm({ onSubmit, isLoading }: TrainingFormProps) {
  const [formData, setFormData] = useState<TrainingMenuInput>({
    title: "",
    targetAge: "U-8",
    players: "",
    difficulty: 1,
    courtSize: "",
    duration: "",
    organize: "",
    keyFactors: "",
    coachingPoints: "",
    memo: "",
    notes: "",
    graphicDescription: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "difficulty" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="例：3vs1のロンド"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 対象年齢 */}
        <div>
          <label htmlFor="targetAge" className="block text-sm font-medium text-gray-700 mb-1">
            対象年齢
          </label>
          <select
            id="targetAge"
            name="targetAge"
            value={formData.targetAge}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {AGE_OPTIONS.map((age) => (
              <option key={age} value={age}>
                {age}〜
              </option>
            ))}
          </select>
        </div>

        {/* 人数 */}
        <div>
          <label htmlFor="players" className="block text-sm font-medium text-gray-700 mb-1">
            人数
          </label>
          <input
            type="text"
            id="players"
            name="players"
            value={formData.players}
            onChange={handleChange}
            placeholder="例：4人"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* 難易度 */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            難易度
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 時間 */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            時間
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="例：10min×2セット"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* コートサイズ */}
      <div>
        <label htmlFor="courtSize" className="block text-sm font-medium text-gray-700 mb-1">
          コートサイズ
        </label>
        <input
          type="text"
          id="courtSize"
          name="courtSize"
          value={formData.courtSize}
          onChange={handleChange}
          placeholder="例：5m × 5m、20m × 12m"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* オーガナイズ */}
      <div>
        <label htmlFor="organize" className="block text-sm font-medium text-gray-700 mb-1">
          オーガナイズ（ルール・配置）
        </label>
        <textarea
          id="organize"
          name="organize"
          value={formData.organize}
          onChange={handleChange}
          rows={3}
          placeholder="例：①攻撃側は三角形を作るように配置&#10;②DFに取られないようにボールを保持する&#10;③DFはボールを奪ったら攻守交代"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* キーファクター */}
      <div>
        <label htmlFor="keyFactors" className="block text-sm font-medium text-gray-700 mb-1">
          キーファクター
        </label>
        <textarea
          id="keyFactors"
          name="keyFactors"
          value={formData.keyFactors}
          onChange={handleChange}
          rows={3}
          placeholder="例：①パスを受ける際には、ボールホルダーから遠いほうのインサイドでコントロールをする&#10;②パスを出した後に、ポジショニングを修正してすぐにパスラインを作る"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* 留意点・コーチングポイント */}
      <div>
        <label htmlFor="coachingPoints" className="block text-sm font-medium text-gray-700 mb-1">
          留意点・コーチングポイント
        </label>
        <textarea
          id="coachingPoints"
          name="coachingPoints"
          value={formData.coachingPoints}
          onChange={handleChange}
          rows={3}
          placeholder="例：◇初めからパスサポートが確保されているトレーニングのため、その場にただ立っているような状態が起きる可能性がある"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* メモ・備考 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            id="memo"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            rows={2}
            placeholder="自由記述"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            備考
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            placeholder="例：必要に応じてタッチ数制限"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 図解の説明 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <label htmlFor="graphicDescription" className="block text-sm font-medium text-blue-800 mb-1">
          図解の説明（AIが図を生成します） <span className="text-red-500">*</span>
        </label>
        <textarea
          id="graphicDescription"
          name="graphicDescription"
          value={formData.graphicDescription}
          onChange={handleChange}
          rows={4}
          placeholder="例：5m×5mの正方形コート。攻撃3人が三角形に配置（左下、右下、上）。守備1人が中央。左下の選手がボールを持っている。四隅にマーカーを置く。"
          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-blue-600 mt-1">
          選手の配置、ボールの位置、マーカーの位置などを自由に記述してください
        </p>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            AIが図解を生成中...
          </>
        ) : (
          "図解付きPDFを生成"
        )}
      </button>
    </form>
  );
}
