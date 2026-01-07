"use client";

import { GraphicData } from "@/lib/types";

interface CourtGraphicProps {
  data: GraphicData;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function CourtGraphic({
  data,
  width = 400,
  height = 400,
  showLabels = true,
}: CourtGraphicProps) {
  const { players, arrows, markers, courtWidth, courtHeight } = data;

  // 座標変換（パーセント → 実際のピクセル）
  const toX = (percent: number) => (percent / 100) * width * 0.9 + width * 0.05;
  const toY = (percent: number) => (percent / 100) * height * 0.9 + height * 0.05;

  // チームカラー
  const teamColors = {
    attack: "#f97316", // オレンジ
    defense: "#3b82f6", // 青
    neutral: "#22c55e", // 緑
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="bg-green-100 rounded-lg"
    >
      {/* コートの枠線 */}
      <rect
        x={width * 0.05}
        y={height * 0.05}
        width={width * 0.9}
        height={height * 0.9}
        fill="none"
        stroke="#1f2937"
        strokeWidth="2"
      />

      {/* マーカー/コーン */}
      {markers.map((marker) => {
        const x = toX(marker.x);
        const y = toY(marker.y);

        if (marker.type === "cone") {
          // コーン（三角形）
          return (
            <polygon
              key={marker.id}
              points={`${x},${y - 12} ${x - 8},${y + 6} ${x + 8},${y + 6}`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1"
            />
          );
        } else if (marker.type === "marker") {
          // マーカー（円）
          return (
            <circle
              key={marker.id}
              cx={x}
              cy={y}
              r={6}
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1"
            />
          );
        } else if (marker.type === "goal") {
          // ゴール（四角）
          return (
            <rect
              key={marker.id}
              x={x - 15}
              y={y - 5}
              width={30}
              height={10}
              fill="white"
              stroke="#1f2937"
              strokeWidth="2"
            />
          );
        } else {
          // フラッグ
          return (
            <g key={marker.id}>
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={y - 15}
                stroke="#1f2937"
                strokeWidth="2"
              />
              <polygon
                points={`${x},${y - 15} ${x + 10},${y - 10} ${x},${y - 5}`}
                fill="#ef4444"
              />
            </g>
          );
        }
      })}

      {/* 矢印 */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
        <marker
          id="arrowhead-pass"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>

      {arrows.map((arrow) => {
        const x1 = toX(arrow.fromX);
        const y1 = toY(arrow.fromY);
        const x2 = toX(arrow.toX);
        const y2 = toY(arrow.toY);

        const strokeStyle =
          arrow.type === "pass"
            ? { stroke: "#3b82f6", strokeDasharray: "5,5" }
            : arrow.type === "dribble"
            ? { stroke: "#22c55e", strokeDasharray: "2,2" }
            : { stroke: "#6b7280" };

        return (
          <line
            key={arrow.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            {...strokeStyle}
            strokeWidth="2"
            markerEnd={
              arrow.type === "pass"
                ? "url(#arrowhead-pass)"
                : "url(#arrowhead)"
            }
          />
        );
      })}

      {/* 選手 */}
      {players.map((player) => {
        const x = toX(player.x);
        const y = toY(player.y);
        const color = teamColors[player.team];

        return (
          <g key={player.id}>
            {/* 選手の円 */}
            <circle
              cx={x}
              cy={y}
              r={18}
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
            {/* ラベル */}
            {showLabels && player.label && (
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {player.label}
              </text>
            )}
            {/* ボールを持っている場合 */}
            {player.hasBall && (
              <circle
                cx={x + 14}
                cy={y - 14}
                r={8}
                fill="white"
                stroke="#1f2937"
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}

      {/* コートサイズ表示 */}
      <text
        x={width - 10}
        y={20}
        textAnchor="end"
        fill="#6b7280"
        fontSize="10"
      >
        {courtWidth}m × {courtHeight}m
      </text>
    </svg>
  );
}
