"use client";

import dynamic from "next/dynamic";
import { TrainingMenuInput, GraphicData } from "@/lib/types";

// react-pdfはSSRで問題があるため、動的インポートでクライアントのみでレンダリング
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const TrainingPDF = dynamic(() => import("./TrainingPDF"), { ssr: false });

interface PDFDownloadButtonProps {
  input: TrainingMenuInput;
  graphic: GraphicData;
}

export default function PDFDownloadButton({
  input,
  graphic,
}: PDFDownloadButtonProps) {
  const fileName = `練習メニュー_${input.title.replace(/\s/g, "_")}.pdf`;

  return (
    <PDFDownloadLink
      document={<TrainingPDF input={input} graphic={graphic} />}
      fileName={fileName}
    >
      {({ loading, error }) => {
        if (error) {
          return (
            <span className="text-red-600">
              PDF生成エラー
            </span>
          );
        }

        if (loading) {
          return (
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg">
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
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDFをダウンロード
          </span>
        );
      }}
    </PDFDownloadLink>
  );
}
