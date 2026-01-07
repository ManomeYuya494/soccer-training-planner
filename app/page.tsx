"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TrainingForm from "@/components/TrainingForm";
import CourtGraphic from "@/components/CourtGraphic";
import { TrainingMenuInput, GraphicData, GenerateGraphicResponse } from "@/lib/types";

// PDFDownloadButtonは動的インポート（SSR無効）
const PDFDownloadButton = dynamic(
  () => import("@/components/PDFDownloadButton"),
  { ssr: false }
);

type ViewState = "form" | "preview";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputData, setInputData] = useState<TrainingMenuInput | null>(null);
  const [graphicData, setGraphicData] = useState<GraphicData | null>(null);

  const handleSubmit = async (data: TrainingMenuInput) => {
    setIsLoading(true);
    setError(null);
    setInputData(data);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "エラーが発生しました");
      }

      const result: GenerateGraphicResponse = await response.json();
      setGraphicData(result.graphic);
      setViewState("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setViewState("form");
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            サッカートレーニング図解ツール
          </h1>
          <p className="text-gray-600">
            練習メニューを入力すると、AIが図解付きA4 PDFを自動生成します
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 入力フォーム */}
        {viewState === "form" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              練習メニュー入力
            </h2>
            <TrainingForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* プレビュー画面 */}
        {viewState === "preview" && inputData && graphicData && (
          <div className="space-y-6">
            {/* 戻るボタン */}
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              ← 入力画面に戻る
            </button>

            {/* プレビュー */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                【練習メニュー：{inputData.title}】
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左側：情報 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-bold text-gray-500">対象年齢：</span>
                      <span>{inputData.targetAge}〜</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-500">人数：</span>
                      <span>{inputData.players || "-"}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-500">コートサイズ：</span>
                      <span>{inputData.courtSize || "-"}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-500">時間：</span>
                      <span>{inputData.duration || "-"}</span>
                    </div>
                  </div>

                  {inputData.organize && (
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">オーガナイズ</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {inputData.organize}
                      </p>
                    </div>
                  )}

                  {inputData.keyFactors && (
                    <div className="bg-yellow-50 p-3 rounded">
                      <h3 className="font-bold text-yellow-800 mb-1">キーファクター</h3>
                      <p className="text-sm text-yellow-700 whitespace-pre-wrap">
                        {inputData.keyFactors}
                      </p>
                    </div>
                  )}

                  {inputData.coachingPoints && (
                    <div className="bg-blue-50 p-3 rounded">
                      <h3 className="font-bold text-blue-800 mb-1">
                        留意点・コーチングポイント
                      </h3>
                      <p className="text-sm text-blue-700 whitespace-pre-wrap">
                        {inputData.coachingPoints}
                      </p>
                    </div>
                  )}
                </div>

                {/* 右側：図解 */}
                <div>
                  <h3 className="font-bold text-gray-700 mb-2 text-center">
                    グラフィック
                  </h3>
                  <div className="flex justify-center">
                    <CourtGraphic data={graphicData} width={350} height={350} />
                  </div>
                </div>
              </div>
            </div>

            {/* ダウンロードボタン */}
            <div className="text-center">
              <PDFDownloadButton input={inputData} graphic={graphicData} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
