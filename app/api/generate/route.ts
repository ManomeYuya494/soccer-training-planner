import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, SYSTEM_PROMPT } from "@/lib/openai";
import { TrainingInput, GenerateResponse, THEME_OPTIONS, GROUND_SIZE_OPTIONS } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: TrainingInput = await request.json();

    // テーマとグラウンドサイズのラベルを取得
    const themeLabel = THEME_OPTIONS.find((t) => t.value === body.theme)?.label || body.theme;
    const groundSizeLabel = GROUND_SIZE_OPTIONS.find((g) => g.value === body.groundSize)?.label || body.groundSize;

    // ユーザーメッセージを構築
    const userMessage = `
以下の条件で、ジュニアサッカー（小学生）の練習メニューを3パターン提案してください。

## 練習条件
- 日付: ${body.date}
- 参加人数: ${body.participants}人
- 練習時間: ${body.duration}分
- 場所: ${body.location || "未指定"}
- グラウンドサイズ: ${groundSizeLabel}
- テーマ: ${themeLabel}
${body.preferences ? `- 指導者からの要望: ${body.preferences}` : ""}

必ずJSON形式で出力してください。
`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("AIからの応答がありませんでした");
    }

    const parsed: GenerateResponse = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating training plan:", error);

    // OpenAI API のエラーハンドリング
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "APIキーが設定されていないか無効です" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "練習メニューの生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
