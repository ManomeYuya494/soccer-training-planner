import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, GRAPHIC_SYSTEM_PROMPT } from "@/lib/anthropic";
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

    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `${GRAPHIC_SYSTEM_PROMPT}\n\n${userMessage}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("AIからの応答がありませんでした");
    }

    // JSONを抽出（マークダウンのコードブロックがある場合も対応）
    let jsonText = content.text;
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed: GenerateGraphicResponse = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating graphic:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("api_key")) {
        return NextResponse.json(
          { error: "Anthropic APIキーが設定されていないか無効です" },
          { status: 401 }
        );
      }
      if (error.message.includes("rate_limit")) {
        return NextResponse.json(
          { error: "APIのレート制限に達しました。しばらく待ってから再試行してください。" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "図解の生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
