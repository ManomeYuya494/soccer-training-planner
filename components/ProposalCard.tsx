"use client";

import { TrainingProposal, TrainingMenuItem } from "@/lib/types";

interface ProposalCardProps {
  proposal: TrainingProposal;
  onSelect: (proposal: TrainingProposal) => void;
  isSelected: boolean;
}

function MenuItem({ item, type }: { item: TrainingMenuItem; type: string }) {
  return (
    <div className="border-l-4 border-green-500 pl-3 py-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
          {type}
        </span>
        <span className="font-medium text-gray-900">{item.name}</span>
        <span className="text-sm text-gray-500">{item.duration}分</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{item.description}</p>

      {(item.gridSize || item.playerArrangement) && (
        <div className="flex gap-4 text-xs text-gray-500 mb-2">
          {item.gridSize && <span>グリッド: {item.gridSize}</span>}
          {item.playerArrangement && <span>配置: {item.playerArrangement}</span>}
        </div>
      )}

      {item.rules.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 mb-1">ルール:</p>
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
            {item.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {item.coachingPoints.length > 0 && (
        <div className="bg-yellow-50 p-2 rounded">
          <p className="text-xs font-medium text-yellow-800 mb-1">コーチングポイント:</p>
          <ul className="list-disc list-inside text-xs text-yellow-700 space-y-0.5">
            {item.coachingPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProposalCard({
  proposal,
  onSelect,
  isSelected,
}: ProposalCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-green-500 shadow-lg"
          : "hover:shadow-lg"
      }`}
    >
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{proposal.title}</h3>
          <span className="text-sm bg-white/20 px-2 py-1 rounded">
            計{proposal.totalDuration}分
          </span>
        </div>
        <p className="text-green-100 text-sm mt-1">{proposal.overview}</p>
      </div>

      {/* コンテンツ */}
      <div className="p-4 space-y-4">
        {/* ウォーミングアップ */}
        <MenuItem item={proposal.warmup} type="W-UP" />

        {/* メイントレーニング */}
        {proposal.mainTraining.map((training, index) => (
          <MenuItem
            key={index}
            item={training}
            type={`MAIN ${index + 1}`}
          />
        ))}

        {/* クールダウン */}
        <MenuItem item={proposal.cooldown} type="C-DOWN" />

        {/* 今日のポイント */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">今日のポイント</p>
          <ul className="space-y-1">
            {proposal.keyPoints.map((point, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 選択ボタン */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onSelect(proposal)}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isSelected
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
          }`}
        >
          {isSelected ? "✓ 選択中" : "このメニューを選択"}
        </button>
      </div>
    </div>
  );
}
