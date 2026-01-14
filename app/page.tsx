"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SimpleInput from "@/components/SimpleInput";
import TrainingForm from "@/components/TrainingForm";
import CourtGraphic from "@/components/CourtGraphic";
import { TrainingMenuInput, GraphicData, GenerateGraphicResponse } from "@/lib/types";

// PDFDownloadButtonは動的インポート（SSR無効）
const PDFDownloadButton = dynamic(
  () => import("@/components/PDFDownloadButton"),
  { ssr: false }
);

type ViewState = "input" | "preview";
type InputMode = "simple" | "detailed";

// 編集可能なフィールド
function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-500 whitespace-nowrap min-w-[70px]">{label}：</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="クリックして入力"
        className="flex-1 text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

// 編集可能なリスト
function EditableList({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <span className="text-gray-400">({i + 1})</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => removeItem(i)}
            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="text-blue-500 hover:text-blue-700 text-sm mt-1"
      >
        + 追加
      </button>
    </div>
  );
}

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("input");
  const [inputMode, setInputMode] = useState<InputMode>("simple");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputData, setInputData] = useState<TrainingMenuInput | null>(null);
  const [graphicData, setGraphicData] = useState<GraphicData | null>(null);

  // シンプル入力からの送信
  const handleSimpleSubmit = async (description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quick-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "エラーが発生しました");
      }

      const result = await response.json();
      setInputData(result.input);
      setGraphicData(result.graphic);
      setViewState("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 詳細フォームからの送信
  const handleDetailedSubmit = async (data: TrainingMenuInput) => {
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
    setViewState("input");
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
            練習メニューを説明するだけで、AIが図解付きA4 PDFを自動生成します
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 入力画面 */}
        {viewState === "input" && (
          <div className="space-y-4">
            {/* 入力モード切り替え */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => setInputMode("simple")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === "simple"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                かんたん入力
              </button>
              <button
                onClick={() => setInputMode("detailed")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === "detailed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                詳細入力
              </button>
            </div>

            {/* シンプル入力 */}
            {inputMode === "simple" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">
                    かんたん入力
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  音声またはテキストで練習メニューを説明するだけ。AIが自動で整理してPDFを作成します。
                </p>
                <SimpleInput onSubmit={handleSimpleSubmit} isLoading={isLoading} />
              </div>
            )}

            {/* 詳細フォーム */}
            {inputMode === "detailed" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  詳細入力
                </h2>
                <TrainingForm onSubmit={handleDetailedSubmit} isLoading={isLoading} />
              </div>
            )}
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

            {/* プレビュー - 白背景 + 編集可能 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* ヘッダー：カテゴリ + タイトル */}
              <div className="flex items-center gap-3 mb-4 border-b pb-3">
                {inputData.category && (
                  <span className="bg-gray-800 text-white px-3 py-1 rounded font-bold text-sm">
                    {inputData.category}
                  </span>
                )}
                <input
                  type="text"
                  value={inputData.title}
                  onChange={(e) => setInputData({ ...inputData, title: e.target.value })}
                  className="text-xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左側：グラフィック（編集可能） */}
                <div>
                  <CourtGraphic
                    data={graphicData}
                    width={360}
                    height={300}
                    editable={true}
                    onUpdate={setGraphicData}
                  />
                  {/* 凡例 */}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 justify-center">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                      <span>味方</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>相手</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-red-500"></span>
                      <span>コーン</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-1 rounded-full bg-yellow-400"></span>
                      <span>マーカー</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-blue-600"></span>
                      <span>フラット</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-2 bg-white border border-gray-800"></span>
                      <span>ゴール</span>
                    </div>
                  </div>
                  {/* 矢印凡例 */}
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600 justify-center">
                    <div className="flex items-center gap-1">
                      <span className="w-5 h-0.5 bg-white border-t-2 border-white"></span>
                      <span>移動</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-5 h-0 border-t-2 border-dashed border-blue-500"></span>
                      <span>パス</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-5 h-0 border-t-2 border-dotted border-green-500"></span>
                      <span>ドリブル</span>
                    </div>
                  </div>
                  {/* 追加ボタン */}
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        const newPlayer = {
                          id: `player-${Date.now()}`,
                          x: 50,
                          y: 50,
                          team: "attack" as const,
                          label: String.fromCharCode(65 + graphicData.players.filter(p => p.team === "attack").length),
                          hasBall: false,
                        };
                        setGraphicData({ ...graphicData, players: [...graphicData.players, newPlayer] });
                      }}
                      className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                    >
                      + 味方
                    </button>
                    <button
                      onClick={() => {
                        const newPlayer = {
                          id: `player-${Date.now()}`,
                          x: 50,
                          y: 30,
                          team: "defense" as const,
                          label: String.fromCharCode(88 + graphicData.players.filter(p => p.team === "defense").length),
                          hasBall: false,
                        };
                        setGraphicData({ ...graphicData, players: [...graphicData.players, newPlayer] });
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + 相手
                    </button>
                    <button
                      onClick={() => {
                        const newMarker = {
                          id: `marker-${Date.now()}`,
                          x: 50,
                          y: 50,
                          type: "cone" as const,
                        };
                        setGraphicData({ ...graphicData, markers: [...graphicData.markers, newMarker] });
                      }}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      + コーン
                    </button>
                    <button
                      onClick={() => {
                        const newMarker = {
                          id: `marker-${Date.now()}`,
                          x: 50,
                          y: 50,
                          type: "flatMarker" as const,
                        };
                        setGraphicData({ ...graphicData, markers: [...graphicData.markers, newMarker] });
                      }}
                      className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      + マーカー
                    </button>
                    <button
                      onClick={() => {
                        const newMarker = {
                          id: `marker-${Date.now()}`,
                          x: 50,
                          y: 50,
                          type: "soccerMarker" as const,
                        };
                        setGraphicData({ ...graphicData, markers: [...graphicData.markers, newMarker] });
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + フラット
                    </button>
                    <button
                      onClick={() => {
                        const newMarker = {
                          id: `marker-${Date.now()}`,
                          x: 50,
                          y: 10,
                          type: "miniGoal" as const,
                        };
                        setGraphicData({ ...graphicData, markers: [...graphicData.markers, newMarker] });
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      + ゴール
                    </button>
                  </div>
                  {/* 矢印追加ボタン */}
                  <div className="mt-2 flex flex-wrap gap-2 justify-center border-t pt-2">
                    <span className="text-xs text-gray-500">矢印:</span>
                    <button
                      onClick={() => {
                        const newArrow = {
                          id: `arrow-${Date.now()}`,
                          fromX: 50,
                          fromY: 70,
                          toX: 50,
                          toY: 30,
                          type: "move" as const,
                        };
                        setGraphicData({ ...graphicData, arrows: [...graphicData.arrows, newArrow] });
                      }}
                      className="px-2 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                    >
                      + 移動
                    </button>
                    <button
                      onClick={() => {
                        const newArrow = {
                          id: `arrow-${Date.now()}`,
                          fromX: 30,
                          fromY: 50,
                          toX: 70,
                          toY: 50,
                          type: "pass" as const,
                        };
                        setGraphicData({ ...graphicData, arrows: [...graphicData.arrows, newArrow] });
                      }}
                      className="px-2 py-1 text-xs bg-blue-50 border border-blue-300 text-blue-700 rounded hover:bg-blue-100"
                    >
                      + パス
                    </button>
                    <button
                      onClick={() => {
                        const newArrow = {
                          id: `arrow-${Date.now()}`,
                          fromX: 50,
                          fromY: 70,
                          toX: 50,
                          toY: 30,
                          type: "dribble" as const,
                        };
                        setGraphicData({ ...graphicData, arrows: [...graphicData.arrows, newArrow] });
                      }}
                      className="px-2 py-1 text-xs bg-green-50 border border-green-300 text-green-700 rounded hover:bg-green-100"
                    >
                      + ドリブル
                    </button>
                    <button
                      onClick={() => {
                        const newLabel = {
                          id: `dim-${Date.now()}`,
                          x1: 10,
                          y1: 50,
                          x2: 90,
                          y2: 50,
                          label: "10m",
                          position: "horizontal" as const,
                        };
                        setGraphicData({ ...graphicData, dimensionLabels: [...(graphicData.dimensionLabels || []), newLabel] });
                      }}
                      className="px-2 py-1 text-xs bg-gray-50 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
                    >
                      + サイズ表記
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    ※ ドラッグで移動 / ダブルクリックで削除
                  </p>

                  {/* オーガナイズ（図解の下） */}
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                    <h3 className="font-bold text-slate-700 mb-2 border-b border-slate-300 pb-1">オーガナイズ</h3>
                    <div className="space-y-1">
                      <EditableField
                        label="(1)大きさ"
                        value={inputData.organize.gridSize}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, gridSize: v }
                        })}
                      />
                      <EditableField
                        label="(2)用具"
                        value={inputData.organize.equipment}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, equipment: v }
                        })}
                      />
                      <EditableField
                        label="(3)方法"
                        value={inputData.organize.method}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, method: v }
                        })}
                      />
                      <EditableField
                        label="(4)得点"
                        value={inputData.organize.scoring}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, scoring: v }
                        })}
                      />
                      <EditableField
                        label="(5)トータル時間"
                        value={inputData.organize.totalDuration}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, totalDuration: v }
                        })}
                      />
                      <EditableField
                        label="(6)1回の時間"
                        value={inputData.organize.roundDuration}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, roundDuration: v }
                        })}
                      />
                      <EditableField
                        label="(7)間隔"
                        value={inputData.organize.markersInterval}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, markersInterval: v }
                        })}
                      />
                      <EditableField
                        label="(8)備考"
                        value={inputData.organize.notes || ""}
                        onChange={(v) => setInputData({
                          ...inputData,
                          organize: { ...inputData.organize, notes: v }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* 右側：情報（編集可能） */}
                <div className="space-y-4 text-sm">
                  {/* キーファクター */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h3 className="font-bold text-yellow-800 mb-2 border-b border-yellow-300 pb-1">キーファクター</h3>
                    <EditableList
                      items={inputData.keyFactors}
                      onChange={(items) => setInputData({ ...inputData, keyFactors: items })}
                    />
                  </div>

                  {/* 認知 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h3 className="font-bold text-green-800 mb-2 border-b border-green-300 pb-1">認知（何を見るか）</h3>
                    <EditableList
                      items={inputData.recognition}
                      onChange={(items) => setInputData({ ...inputData, recognition: items })}
                    />
                  </div>

                  {/* 基準 */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <h3 className="font-bold text-orange-800 mb-2 border-b border-orange-300 pb-1">基準（デモ）</h3>
                    <EditableList
                      items={inputData.criteria}
                      onChange={(items) => setInputData({ ...inputData, criteria: items })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ダウンロードボタン（一時的に無効化） */}
            {/* <div className="text-center">
              <PDFDownloadButton input={inputData} graphic={graphicData} />
            </div> */}
          </div>
        )}
      </div>
    </main>
  );
}
