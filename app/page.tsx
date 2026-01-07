"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TrainingForm from "@/components/TrainingForm";
import ProposalList from "@/components/ProposalList";
import { TrainingInput, TrainingProposal, GenerateResponse } from "@/lib/types";

// PDFDownloadButtonは動的インポート（SSR無効）
const PDFDownloadButton = dynamic(
  () => import("@/components/PDFDownloadButton"),
  { ssr: false }
);

type ViewState = "form" | "proposals" | "pdf";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<TrainingProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<TrainingProposal | null>(null);
  const [inputData, setInputData] = useState<TrainingInput | null>(null);

  const handleSubmit = async (data: TrainingInput) => {
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

      const result: GenerateResponse = await response.json();
      setProposals(result.proposals);
      setSelectedProposal(null);
      setViewState("proposals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProposal = (proposal: TrainingProposal) => {
    setSelectedProposal(proposal);
  };

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);
    setViewState("pdf");
  };

  const handleBack = () => {
    setViewState("form");
    setProposals([]);
    setSelectedProposal(null);
  };

  const handleBackToProposals = () => {
    setViewState("proposals");
    setIsGeneratingPDF(false);
  };

  const handlePDFComplete = () => {
    setIsGeneratingPDF(false);
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            サッカートレーニング計画ツール
          </h1>
          <p className="text-gray-600">
            AIがジュニアサッカーの練習メニューを提案し、A4 PDFを自動生成します
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
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              練習条件を入力
            </h2>
            <TrainingForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* 提案一覧 */}
        {viewState === "proposals" && inputData && (
          <ProposalList
            proposals={proposals}
            selectedProposal={selectedProposal}
            onSelect={handleSelectProposal}
            onGeneratePDF={handleGeneratePDF}
            onBack={handleBack}
            inputData={inputData}
            isGeneratingPDF={isGeneratingPDF}
          />
        )}

        {/* PDF生成・ダウンロード画面 */}
        {viewState === "pdf" && selectedProposal && inputData && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                PDFを生成しました
              </h2>
              <p className="text-gray-600 mb-1">{selectedProposal.title}</p>
              <p className="text-sm text-gray-500">
                {inputData.date} / {inputData.participants}人 / {selectedProposal.totalDuration}分
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer">
                <PDFDownloadButton
                  proposal={selectedProposal}
                  inputData={inputData}
                  onComplete={handlePDFComplete}
                />
              </div>

              <div>
                <button
                  onClick={handleBackToProposals}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← 提案一覧に戻る
                </button>
              </div>

              <div>
                <button
                  onClick={handleBack}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  新しい条件で作成する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
