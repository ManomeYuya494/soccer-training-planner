import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, EXTRACT_MENU_PROMPT, GRAPHIC_SYSTEM_PROMPT } from "@/lib/gemini";
import { TrainingMenuInput, GenerateGraphicResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "練習メニューの説明を入力してください" },
        { status: 400 }
      );
    }

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 1: 自然言語からメニュー情報を抽出
    const extractResult = await model.generateContent(
      `${EXTRACT_MENU_PROMPT}\n\n## ユーザーの入力\n${description}`
    );
    const extractedText = extractResult.response.text();

    // JSONを抽出（マークダウンのコードブロックがある場合も対応）
    let extractedJson = extractedText;
    const jsonMatch = extractedJson.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      extractedJson = jsonMatch[1].trim();
    }

    const extracted = JSON.parse(extractedJson);
    const menu = extracted.menu;

    const menuInput: TrainingMenuInput = {
      title: menu.title || "練習メニュー",
      category: menu.category || "",
      organize: {
        gridSize: menu.organize?.gridSize || "",
        equipment: menu.organize?.equipment || "",
        method: menu.organize?.method || "",
        scoring: menu.organize?.scoring || "",
        totalDuration: menu.organize?.totalDuration || menu.organize?.duration || "",
        roundDuration: menu.organize?.roundDuration || "",
        markersInterval: menu.organize?.markersInterval || "",
        notes: menu.organize?.notes || "",
      },
      keyFactors: Array.isArray(menu.keyFactors) ? menu.keyFactors : [],
      recognition: Array.isArray(menu.recognition) ? menu.recognition : [],
      criteria: Array.isArray(menu.criteria) ? menu.criteria : [],
      graphicDescription: menu.graphicDescription || description,
    };

    // Step 2: 図解データを生成
    const graphicUserMessage = `
以下のサッカートレーニングの図解データを生成してください。

## トレーニング情報
- タイトル: ${menuInput.title}
- グリッドサイズ: ${menuInput.organize.gridSize || "指定なし"}
- 用具: ${menuInput.organize.equipment || "指定なし"}
- マーカー間隔: ${menuInput.organize.markersInterval || "指定なし"}

## 図解の説明
${menuInput.graphicDescription}

上記の説明に基づいて、選手の配置、マーカー、矢印などの情報をJSON形式で出力してください。
1対1や2対2の場合は、味方(attack)と相手(defense)を必ず区別してください。
フリーマンがいる場合はteam: "freeman"を使用してください。
選手のラベルには名前を入れず、A, B, C...（味方）やX, Y, Z...（相手）のアルファベットのみを使用してください。
`;

    const graphicResult = await model.generateContent(
      `${GRAPHIC_SYSTEM_PROMPT}\n\n${graphicUserMessage}`
    );
    const graphicText = graphicResult.response.text();

    // JSONを抽出
    let graphicJson = graphicText;
    const graphicJsonMatch = graphicJson.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (graphicJsonMatch) {
      graphicJson = graphicJsonMatch[1].trim();
    }

    const parsed: GenerateGraphicResponse = JSON.parse(graphicJson);

    // dimensionLabelsがない場合は空配列を追加
    const graphic = {
      ...parsed.graphic,
      dimensionLabels: parsed.graphic.dimensionLabels || [],
    };

    return NextResponse.json({
      input: menuInput,
      graphic,
    });
  } catch (error) {
    console.error("Error in quick-generate:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("API_KEY")) {
        return NextResponse.json(
          { error: "Gemini APIキーが設定されていないか無効です" },
          { status: 401 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("rate")) {
        return NextResponse.json(
          { error: "APIのレート制限に達しました。しばらく待ってから再試行してください。" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
