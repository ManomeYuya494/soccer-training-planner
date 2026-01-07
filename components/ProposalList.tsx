"use client";

import { TrainingProposal, TrainingInput } from "@/lib/types";
import ProposalCard from "./ProposalCard";

interface ProposalListProps {
  proposals: TrainingProposal[];
  selectedProposal: TrainingProposal | null;
  onSelect: (proposal: TrainingProposal) => void;
  onGeneratePDF: () => void;
  onBack: () => void;
  inputData: TrainingInput;
  isGeneratingPDF: boolean;
}

export default function ProposalList({
  proposals,
  selectedProposal,
  onSelect,
  onGeneratePDF,
  onBack,
  inputData,
  isGeneratingPDF,
}: ProposalListProps) {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            練習メニュー提案
          </h2>
          <p className="text-sm text-gray-600">
            {inputData.date} / {inputData.participants}人 / {inputData.duration}分
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
        >
          ← 条件を変更
        </button>
      </div>

      {/* 提案カード */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onSelect={onSelect}
            isSelected={selectedProposal?.id === proposal.id}
          />
        ))}
      </div>

      {/* PDF生成ボタン */}
      {selectedProposal && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                選択中: {selectedProposal.title}
              </p>
              <p className="text-sm text-gray-600">
                このメニューでA4 PDFを作成します
              </p>
            </div>
            <button
              onClick={onGeneratePDF}
              disabled={isGeneratingPDF}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isGeneratingPDF ? (
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
                  PDF生成中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDFをダウンロード
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 下部のスペース確保 */}
      {selectedProposal && <div className="h-24" />}
    </div>
  );
}
