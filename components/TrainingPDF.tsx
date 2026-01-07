"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Rect,
  Circle,
  Line,
  Polygon,
  G,
} from "@react-pdf/renderer";
import { TrainingMenuInput, GraphicData, DIFFICULTY_OPTIONS } from "@/lib/types";

// 日本語フォントを登録
Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.1/files/noto-sans-jp-japanese-400-normal.woff",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.1/files/noto-sans-jp-japanese-700-normal.woff",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    padding: 25,
    fontSize: 9,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 10,
    borderBottom: "2 solid #1f2937",
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1f2937",
    textAlign: "center",
  },
  mainContent: {
    flexDirection: "row",
    gap: 15,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: 220,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1f2937",
    backgroundColor: "#f3f4f6",
    padding: 4,
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.5,
    paddingLeft: 4,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: "#6b7280",
    marginRight: 4,
  },
  infoValue: {
    fontSize: 9,
    color: "#1f2937",
  },
  graphicContainer: {
    backgroundColor: "#dcfce7",
    borderRadius: 4,
    padding: 5,
    marginBottom: 10,
  },
  graphicTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#166534",
    textAlign: "center",
    marginBottom: 5,
  },
  keyFactorSection: {
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  keyFactorTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#92400e",
    marginBottom: 4,
  },
  keyFactorContent: {
    fontSize: 8,
    color: "#78350f",
    lineHeight: 1.5,
  },
  coachingSection: {
    backgroundColor: "#e0e7ff",
    padding: 8,
    borderRadius: 4,
  },
  coachingTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#3730a3",
    marginBottom: 4,
  },
  coachingContent: {
    fontSize: 8,
    color: "#312e81",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    textAlign: "center",
    fontSize: 7,
    color: "#9ca3af",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 5,
  },
});

interface TrainingPDFProps {
  input: TrainingMenuInput;
  graphic: GraphicData;
}

// コート図解をPDF用に描画
function CourtGraphicPDF({ data }: { data: GraphicData }) {
  const width = 200;
  const height = 200;
  const padding = 10;

  const toX = (percent: number) =>
    (percent / 100) * (width - padding * 2) + padding;
  const toY = (percent: number) =>
    (percent / 100) * (height - padding * 2) + padding;

  const teamColors: Record<string, string> = {
    attack: "#f97316",
    defense: "#3b82f6",
    neutral: "#22c55e",
  };

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* 背景 */}
      <Rect x="0" y="0" width={width} height={height} fill="#bbf7d0" />

      {/* コートの枠線 */}
      <Rect
        x={padding}
        y={padding}
        width={width - padding * 2}
        height={height - padding * 2}
        fill="none"
        stroke="#1f2937"
        strokeWidth="1.5"
      />

      {/* マーカー/コーン */}
      {data.markers.map((marker, index) => {
        const x = toX(marker.x);
        const y = toY(marker.y);

        if (marker.type === "cone") {
          const points = `${x},${y - 8} ${x - 5},${y + 4} ${x + 5},${y + 4}`;
          return (
            <Polygon key={`marker-${index}`} points={points} fill="#ef4444" />
          );
        }
        return (
          <Circle
            key={`marker-${index}`}
            cx={x}
            cy={y}
            r={4}
            fill="#fbbf24"
          />
        );
      })}

      {/* 矢印 */}
      {data.arrows.map((arrow, index) => {
        const x1 = toX(arrow.fromX);
        const y1 = toY(arrow.fromY);
        const x2 = toX(arrow.toX);
        const y2 = toY(arrow.toY);

        return (
          <Line
            key={`arrow-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={arrow.type === "pass" ? "#3b82f6" : "#6b7280"}
            strokeWidth="1.5"
            strokeDasharray={arrow.type === "pass" ? "3,3" : undefined}
          />
        );
      })}

      {/* 選手 */}
      {data.players.map((player, index) => {
        const x = toX(player.x);
        const y = toY(player.y);
        const color = teamColors[player.team] || "#6b7280";

        return (
          <G key={`player-${index}`}>
            <Circle cx={x} cy={y} r={12} fill={color} />
            {player.hasBall && (
              <Circle
                cx={x + 10}
                cy={y - 10}
                r={5}
                fill="white"
                stroke="#1f2937"
                strokeWidth="0.5"
              />
            )}
          </G>
        );
      })}
    </Svg>
  );
}

export default function TrainingPDF({ input, graphic }: TrainingPDFProps) {
  const difficultyLabel =
    DIFFICULTY_OPTIONS.find((d) => d.value === input.difficulty)?.label ||
    "★☆☆☆☆";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>【練習メニュー：{input.title}】</Text>
        </View>

        {/* 基本情報 */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>【対象年齢】</Text>
            <Text style={styles.infoValue}>{input.targetAge}〜</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>【人数】</Text>
            <Text style={styles.infoValue}>{input.players || "-"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>【難易度】</Text>
            <Text style={styles.infoValue}>{difficultyLabel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>【コートサイズ】</Text>
            <Text style={styles.infoValue}>{input.courtSize || "-"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>【時間】</Text>
            <Text style={styles.infoValue}>{input.duration || "-"}</Text>
          </View>
        </View>

        {/* メインコンテンツ */}
        <View style={styles.mainContent}>
          {/* 左カラム */}
          <View style={styles.leftColumn}>
            {/* オーガナイズ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>【オーガナイズ】</Text>
              <Text style={styles.sectionContent}>
                {input.organize || "-"}
              </Text>
            </View>

            {/* メモ */}
            {input.memo && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>【メモ】</Text>
                <Text style={styles.sectionContent}>{input.memo}</Text>
              </View>
            )}

            {/* 備考 */}
            {input.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>【備考】</Text>
                <Text style={styles.sectionContent}>{input.notes}</Text>
              </View>
            )}
          </View>

          {/* 右カラム - グラフィック */}
          <View style={styles.rightColumn}>
            <View style={styles.graphicContainer}>
              <Text style={styles.graphicTitle}>グラフィック</Text>
              <CourtGraphicPDF data={graphic} />
            </View>
          </View>
        </View>

        {/* キーファクター */}
        <View style={styles.keyFactorSection}>
          <Text style={styles.keyFactorTitle}>キーファクター</Text>
          <Text style={styles.keyFactorContent}>
            {input.keyFactors || "-"}
          </Text>
        </View>

        {/* 留意点・コーチングポイント */}
        <View style={styles.coachingSection}>
          <Text style={styles.coachingTitle}>留意点・コーチングポイント</Text>
          <Text style={styles.coachingContent}>
            {input.coachingPoints || "-"}
          </Text>
        </View>

        {/* フッター */}
        <Text style={styles.footer}>
          サッカートレーニング計画ツール - AI図解生成
        </Text>
      </Page>
    </Document>
  );
}
