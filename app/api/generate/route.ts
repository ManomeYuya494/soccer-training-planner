import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, GRAPHIC_SYSTEM_PROMPT } from "@/lib/openai";
import { TrainingMenuInput, GenerateGraphicResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: TrainingMenuInput = await request.json();

    // ユーザーメッセージを構築
    const userMessage = `
以下のサッカートレーニングの図解データを生成してください。

## トレーニング情報
- タイトル: ${body.title}
- コートサイズ: ${body.courtSize || "指定なし"}
- 人数: ${body.players || "指定なし"}
- オーガナイズ: ${body.organize || "指定なし"}

## 図解の説明
${body.graphicDescription}

上記の説明に基づいて、選手の配置、マーカー、矢印などの情報をJSON形式で出力してください。
`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: GRAPHIC_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("AIからの応答がありませんでした");
    }

    const parsed: GenerateGraphicResponse = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating graphic:", error);

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
      { error: "図解の生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
