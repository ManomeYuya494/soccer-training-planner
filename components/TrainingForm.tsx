"use client";

import { useState } from "react";
import {
  TrainingInput,
  THEME_OPTIONS,
  GROUND_SIZE_OPTIONS,
} from "@/lib/types";

interface TrainingFormProps {
  onSubmit: (data: TrainingInput) => void;
  isLoading: boolean;
}

export default function TrainingForm({ onSubmit, isLoading }: TrainingFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<TrainingInput>({
    date: today,
    participants: 12,
    duration: 60,
    location: "",
    groundSize: "half",
    theme: "passing",
    preferences: "",
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
      [name]: name === "participants" || name === "duration" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 日付 */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            日付
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* 参加人数 */}
        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
            参加人数
          </label>
          <input
            type="number"
            id="participants"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            min={4}
            max={30}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* 練習時間 */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            練習時間（分）
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={45}>45分</option>
            <option value={60}>60分</option>
            <option value={75}>75分</option>
            <option value={90}>90分</option>
            <option value={120}>120分</option>
          </select>
        </div>

        {/* グラウンドサイズ */}
        <div>
          <label htmlFor="groundSize" className="block text-sm font-medium text-gray-700 mb-1">
            グラウンドサイズ
          </label>
          <select
            id="groundSize"
            name="groundSize"
            value={formData.groundSize}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {GROUND_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 場所 */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          練習場所（任意）
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="例：○○小学校グラウンド"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* テーマ */}
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
          今日のテーマ
        </label>
        <select
          id="theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* こだわり・前提条件 */}
      <div>
        <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">
          こだわり・前提条件（任意）
        </label>
        <textarea
          id="preferences"
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
          rows={3}
          placeholder="例：ボールは10個しかない、コーンが少ない、初心者が多い、試合前なので強度を抑えたい など"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
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
            AIが考え中...
          </>
        ) : (
          "練習メニューを提案してもらう"
        )}
      </button>
    </form>
  );
}
