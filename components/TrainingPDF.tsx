"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { TrainingProposal, TrainingInput, TrainingMenuItem } from "@/lib/types";

// 日本語フォントを登録（Noto Sans JP）
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
    padding: 30,
    fontSize: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 15,
    borderBottom: "2 solid #22c55e",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#166534",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  metaItem: {
    fontSize: 9,
    color: "#6b7280",
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: "#f0fdf4",
    padding: 6,
    borderLeft: "3 solid #22c55e",
  },
  sectionType: {
    fontSize: 8,
    fontWeight: 700,
    color: "#ffffff",
    backgroundColor: "#22c55e",
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#166534",
  },
  sectionDuration: {
    fontSize: 9,
    color: "#6b7280",
    marginLeft: "auto",
  },
  sectionContent: {
    paddingLeft: 10,
    paddingTop: 4,
  },
  description: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 1.4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 8,
    color: "#6b7280",
    width: 60,
  },
  detailValue: {
    fontSize: 8,
    color: "#374151",
    flex: 1,
  },
  rulesContainer: {
    marginTop: 6,
    marginBottom: 6,
  },
  rulesTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 3,
  },
  ruleItem: {
    fontSize: 8,
    color: "#4b5563",
    marginBottom: 2,
    paddingLeft: 8,
  },
  coachingContainer: {
    marginTop: 6,
    backgroundColor: "#fefce8",
    padding: 8,
    borderLeft: "3 solid #eab308",
  },
  coachingTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#854d0e",
    marginBottom: 4,
  },
  coachingItem: {
    fontSize: 8,
    color: "#713f12",
    marginBottom: 2,
    paddingLeft: 8,
  },
  keyPointsContainer: {
    marginTop: 15,
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 4,
  },
  keyPointsTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1e40af",
    marginBottom: 6,
  },
  keyPointItem: {
    fontSize: 9,
    color: "#1e3a8a",
    marginBottom: 3,
    paddingLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 8,
  },
});

interface TrainingPDFProps {
  proposal: TrainingProposal;
  inputData: TrainingInput;
}

function MenuSection({
  item,
  type,
}: {
  item: TrainingMenuItem;
  type: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionType}>{type}</Text>
        <Text style={styles.sectionTitle}>{item.name}</Text>
        <Text style={styles.sectionDuration}>{item.duration}分</Text>
      </View>
      <View style={styles.sectionContent}>
        <Text style={styles.description}>{item.description}</Text>

        {(item.gridSize || item.playerArrangement) && (
          <View>
            {item.gridSize && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>グリッド:</Text>
                <Text style={styles.detailValue}>{item.gridSize}</Text>
              </View>
            )}
            {item.playerArrangement && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>配置:</Text>
                <Text style={styles.detailValue}>{item.playerArrangement}</Text>
              </View>
            )}
          </View>
        )}

        {item.rules.length > 0 && (
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>ルール</Text>
            {item.rules.map((rule, i) => (
              <Text key={i} style={styles.ruleItem}>
                ・{rule}
              </Text>
            ))}
          </View>
        )}

        {item.coachingPoints.length > 0 && (
          <View style={styles.coachingContainer}>
            <Text style={styles.coachingTitle}>コーチングポイント</Text>
            {item.coachingPoints.map((point, i) => (
              <Text key={i} style={styles.coachingItem}>
                ★ {point}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default function TrainingPDF({ proposal, inputData }: TrainingPDFProps) {
  const formattedDate = new Date(inputData.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>{proposal.title}</Text>
          <Text style={styles.subtitle}>{proposal.overview}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>{formattedDate}</Text>
            <Text style={styles.metaItem}>
              参加者: {inputData.participants}人
            </Text>
            <Text style={styles.metaItem}>
              練習時間: {proposal.totalDuration}分
            </Text>
            {inputData.location && (
              <Text style={styles.metaItem}>場所: {inputData.location}</Text>
            )}
          </View>
        </View>

        {/* ウォーミングアップ */}
        <MenuSection item={proposal.warmup} type="W-UP" />

        {/* メイントレーニング */}
        {proposal.mainTraining.map((training, index) => (
          <MenuSection
            key={index}
            item={training}
            type={`MAIN ${index + 1}`}
          />
        ))}

        {/* クールダウン */}
        <MenuSection item={proposal.cooldown} type="C-DOWN" />

        {/* 今日のポイント */}
        <View style={styles.keyPointsContainer}>
          <Text style={styles.keyPointsTitle}>今日のポイント</Text>
          {proposal.keyPoints.map((point, i) => (
            <Text key={i} style={styles.keyPointItem}>
              ✓ {point}
            </Text>
          ))}
        </View>

        {/* フッター */}
        <Text style={styles.footer}>
          サッカートレーニング計画ツール - AIによる自動生成
        </Text>
      </Page>
    </Document>
  );
}
