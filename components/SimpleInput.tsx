"use client";

import { useState, useRef, useEffect } from "react";

interface SimpleInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export default function SimpleInput({ onSubmit, isLoading }: SimpleInputProps) {
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Web Speech API のサポートチェック
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.lang = "ja-JP";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setDescription((prev) => prev + finalTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          練習メニューを説明してください
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例：3vs1のロンド、5m×5mの正方形コートで、攻撃3人が三角形に配置、守備1人が中央。攻撃側は三角形を維持しながらボールを回す。守備にボールを取られたら攻守交代。キーファクターはパスを受ける際のボディシェイプと、パス後のポジション修正。"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none pr-12"
            disabled={isLoading}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              className={`absolute right-3 top-3 p-2 rounded-full transition-colors ${
                isListening
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={isListening ? "録音停止" : "音声入力"}
            >
              {isListening ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {isListening && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            録音中...話しかけてください
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          人数、コートサイズ、ルール、選手の配置などを自由に説明してください。AIが自動で情報を整理し、図解を生成します。
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !description.trim()}
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
            AIが生成中...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
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
            図解付きPDFを生成
          </>
        )}
      </button>
    </form>
  );
}
