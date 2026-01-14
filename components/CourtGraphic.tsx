"use client";

import { useState, useRef, useCallback } from "react";
import { GraphicData, PlayerPosition, Marker, Arrow, DimensionLabel } from "@/lib/types";

interface CourtGraphicProps {
  data: GraphicData;
  width?: number;
  height?: number;
  showLabels?: boolean;
  editable?: boolean;
  onUpdate?: (data: GraphicData) => void;
}

export default function CourtGraphic({
  data,
  width = 400,
  height = 400,
  showLabels = true,
  editable = false,
  onUpdate,
}: CourtGraphicProps) {
  const { players, arrows, markers, dimensionLabels = [], courtWidth, courtHeight } = data;
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{
    type: "player" | "marker" | "arrow-start" | "arrow-end";
    id: string;
  } | null>(null);

  // 座標変換（パーセント → 実際のピクセル）
  const toX = (percent: number) => (percent / 100) * width * 0.9 + width * 0.05;
  const toY = (percent: number) => (percent / 100) * height * 0.9 + height * 0.05;

  // 逆変換（ピクセル → パーセント）
  const toPercentX = (px: number) => ((px - width * 0.05) / (width * 0.9)) * 100;
  const toPercentY = (py: number) => ((py - height * 0.05) / (height * 0.9)) * 100;

  // チームカラー
  const teamColors: Record<string, string> = {
    attack: "#f97316",
    defense: "#3b82f6",
    freeman: "#eab308",
    neutral: "#22c55e",
  };

  // 矢印カラー
  const arrowColors: Record<string, string> = {
    move: "#ffffff",
    pass: "#3b82f6",
    dribble: "#22c55e",
  };

  // マウス位置を取得
  const getMousePosition = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // ドラッグ開始
  const handleDragStart = (type: "player" | "marker" | "arrow-start" | "arrow-end", id: string) => {
    if (!editable) return;
    setDragging({ type, id });
  };

  // ダブルクリックで削除
  const handleDoubleClick = (type: "player" | "marker" | "arrow", id: string) => {
    if (!editable || !onUpdate) return;
    if (type === "player") {
      onUpdate({ ...data, players: players.filter((p) => p.id !== id) });
    } else if (type === "marker") {
      onUpdate({ ...data, markers: markers.filter((m) => m.id !== id) });
    } else if (type === "arrow") {
      onUpdate({ ...data, arrows: arrows.filter((a) => a.id !== id) });
    }
  };

  // ドラッグ中
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragging || !editable || !onUpdate) return;

      const pos = getMousePosition(e);
      const percentX = Math.max(0, Math.min(100, toPercentX(pos.x)));
      const percentY = Math.max(0, Math.min(100, toPercentY(pos.y)));

      if (dragging.type === "player") {
        const newPlayers = players.map((p) =>
          p.id === dragging.id ? { ...p, x: percentX, y: percentY } : p
        );
        onUpdate({ ...data, players: newPlayers });
      } else if (dragging.type === "marker") {
        const newMarkers = markers.map((m) =>
          m.id === dragging.id ? { ...m, x: percentX, y: percentY } : m
        );
        onUpdate({ ...data, markers: newMarkers });
      } else if (dragging.type === "arrow-start") {
        const newArrows = arrows.map((a) =>
          a.id === dragging.id ? { ...a, fromX: percentX, fromY: percentY } : a
        );
        onUpdate({ ...data, arrows: newArrows });
      } else if (dragging.type === "arrow-end") {
        const newArrows = arrows.map((a) =>
          a.id === dragging.id ? { ...a, toX: percentX, toY: percentY } : a
        );
        onUpdate({ ...data, arrows: newArrows });
      }
    },
    [dragging, editable, onUpdate, data, players, markers, arrows, getMousePosition]
  );

  // ドラッグ終了
  const handleMouseUp = () => {
    setDragging(null);
  };

  const cursorStyle = editable ? (dragging ? "grabbing" : "default") : "default";

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="bg-green-600 rounded-lg"
      style={{ cursor: cursorStyle }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* コートの枠線 */}
      <rect
        x={width * 0.05}
        y={height * 0.05}
        width={width * 0.9}
        height={height * 0.9}
        fill="none"
        stroke="white"
        strokeWidth="2"
      />

      {/* サイズ表記 */}
      {dimensionLabels.map((dim) => {
        const x1 = toX(dim.x1);
        const y1 = toY(dim.y1);
        const x2 = toX(dim.x2);
        const y2 = toY(dim.y2);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        return (
          <g key={dim.id}>
            {/* 線 */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            {/* 端の短い線 */}
            {dim.position === "horizontal" ? (
              <>
                <line x1={x1} y1={y1 - 5} x2={x1} y2={y1 + 5} stroke="white" strokeWidth="1" />
                <line x1={x2} y1={y2 - 5} x2={x2} y2={y2 + 5} stroke="white" strokeWidth="1" />
              </>
            ) : (
              <>
                <line x1={x1 - 5} y1={y1} x2={x1 + 5} y2={y1} stroke="white" strokeWidth="1" />
                <line x1={x2 - 5} y1={y2} x2={x2 + 5} y2={y2} stroke="white" strokeWidth="1" />
              </>
            )}
            {/* ラベル */}
            <rect
              x={midX - 15}
              y={midY - 8}
              width={30}
              height={16}
              fill="rgba(0,0,0,0.7)"
              rx={3}
            />
            <text
              x={midX}
              y={midY + 4}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
            >
              {dim.label}
            </text>
          </g>
        );
      })}

      {/* マーカー/道具 */}
      {markers.map((marker) => {
        const x = toX(marker.x);
        const y = toY(marker.y);
        const isDragging = dragging?.type === "marker" && dragging.id === marker.id;

        const commonProps = {
          style: { cursor: editable ? "grab" : "default" },
          onMouseDown: () => handleDragStart("marker", marker.id),
          onDoubleClick: () => handleDoubleClick("marker", marker.id),
        };

        if (marker.type === "cone") {
          return (
            <polygon
              key={marker.id}
              points={`${x},${y - 12} ${x - 8},${y + 6} ${x + 8},${y + 6}`}
              fill="#ef4444"
              stroke={isDragging ? "#fff" : "#b91c1c"}
              strokeWidth={isDragging ? 2 : 1}
              {...commonProps}
            />
          );
        } else if (marker.type === "soccerMarker") {
          return (
            <circle
              key={marker.id}
              cx={x}
              cy={y}
              r={8}
              fill="#3b82f6"
              stroke={isDragging ? "#fff" : "#1d4ed8"}
              strokeWidth={isDragging ? 2 : 1}
              {...commonProps}
            />
          );
        } else if (marker.type === "flatMarker") {
          return (
            <ellipse
              key={marker.id}
              cx={x}
              cy={y}
              rx={10}
              ry={4}
              fill="#fbbf24"
              stroke={isDragging ? "#fff" : "#d97706"}
              strokeWidth={isDragging ? 2 : 1}
              {...commonProps}
            />
          );
        } else if (marker.type === "miniGoal") {
          return (
            <g key={marker.id} {...commonProps}>
              <rect
                x={x - 18}
                y={y - 8}
                width={36}
                height={16}
                fill="white"
                stroke={isDragging ? "#3b82f6" : "#1f2937"}
                strokeWidth={isDragging ? 3 : 2}
              />
              <line x1={x - 18} y1={y} x2={x + 18} y2={y} stroke="#9ca3af" strokeWidth="1" />
            </g>
          );
        } else {
          return (
            <circle
              key={marker.id}
              cx={x}
              cy={y}
              r={5}
              fill="#9ca3af"
              stroke="#6b7280"
              strokeWidth="1"
              {...commonProps}
            />
          );
        }
      })}

      {/* 矢印の定義 */}
      <defs>
        <marker id="arrowhead-move" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
        </marker>
        <marker id="arrowhead-pass" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
        <marker id="arrowhead-dribble" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
        </marker>
      </defs>

      {/* 矢印 */}
      {arrows.map((arrow) => {
        const x1 = toX(arrow.fromX);
        const y1 = toY(arrow.fromY);
        const x2 = toX(arrow.toX);
        const y2 = toY(arrow.toY);

        const color = arrowColors[arrow.type] || "#ffffff";
        const strokeStyle =
          arrow.type === "pass"
            ? { strokeDasharray: "8,4" }
            : arrow.type === "dribble"
            ? { strokeDasharray: "3,3" }
            : {};

        return (
          <g key={arrow.id} onDoubleClick={() => handleDoubleClick("arrow", arrow.id)}>
            {/* 矢印線 */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="3"
              {...strokeStyle}
              markerEnd={`url(#arrowhead-${arrow.type})`}
            />
            {/* 編集用ハンドル（開始点） */}
            {editable && (
              <circle
                cx={x1}
                cy={y1}
                r={6}
                fill={color}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: "grab" }}
                onMouseDown={() => handleDragStart("arrow-start", arrow.id)}
              />
            )}
            {/* 編集用ハンドル（終了点） */}
            {editable && (
              <circle
                cx={x2}
                cy={y2}
                r={6}
                fill={color}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: "grab" }}
                onMouseDown={() => handleDragStart("arrow-end", arrow.id)}
              />
            )}
          </g>
        );
      })}

      {/* 選手 */}
      {players.map((player) => {
        const x = toX(player.x);
        const y = toY(player.y);
        const color = teamColors[player.team];
        const isDragging = dragging?.type === "player" && dragging.id === player.id;

        return (
          <g
            key={player.id}
            style={{ cursor: editable ? "grab" : "default" }}
            onMouseDown={() => handleDragStart("player", player.id)}
            onDoubleClick={() => handleDoubleClick("player", player.id)}
          >
            <circle
              cx={x}
              cy={y}
              r={18}
              fill={color}
              stroke={isDragging ? "#fff" : "rgba(255,255,255,0.5)"}
              strokeWidth={isDragging ? 3 : 2}
            />
            {showLabels && player.label && (
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                style={{ pointerEvents: "none" }}
              >
                {player.label}
              </text>
            )}
            {player.hasBall && (
              <circle
                cx={x + 14}
                cy={y - 14}
                r={8}
                fill="white"
                stroke="#1f2937"
                strokeWidth="1"
                style={{ pointerEvents: "none" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
