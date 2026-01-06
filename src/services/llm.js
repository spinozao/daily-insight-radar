/**
 * Enhancing the LLM prompt to strictly follow the "Gold Selection" criteria.
 * 
 * Prompt Engineering Key Points:
 * 1. Role: Radar for "Warmth, Depth, Light".
 * 2. Output: Strictly JSON.
 * 3. Specific Fields: Pain Protocol, History Match, Golden Sentence.
 */

const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
    apiKey: config.llm.apiKey,
    baseURL: config.llm.baseURL
});

async function analyzeContent(content, sourceName) {
    if (!content || content.length < 50) return null;

    // Truncate content to safe limit (approx 4000 chars) to save context window
    const safeContent = content.substring(0, 4000);

    const systemPrompt = `
你是一位顶级新媒体主编的“超级大脑”，专门负责为公众号提取高维度的选题素材。
我们的核心标准是：**有体温（人文关怀）、有厚度（历史纵深）、有光芒（金句升华）。**
请忽略那是平庸的、纯资讯类的、或者贩卖廉价焦虑的内容。

你的任务是分析输入文本，如果它有价值，请提取并重构为以下 JSON 格式。如果无价值，返回 NULL。

JSON 结构要求：
{
  "painProtocol": "精准痛点（30字内）。例如：'35岁职场人的失语时刻' 或 '丧偶式育儿背后的母职惩罚'。",
  "historyMatch": "历史对标（50字内）。必须引用具体历史人物或典故。例如：'对比苏轼在黄州写下《定风波》时的自我和解' 或 '杨绛在动荡年代守护书桌的定力'。",
  "goldenSentence": "升华金句（30字内）。这是文章的灵魂金句，要求对仗工整、意境深远。例如：'万物皆有裂痕，那是光照进来的地方。'",
  "summary": "素材摘要（100字内）。简述事件或观点核心。"
}
`;

    const userPrompt = `
[来源]: ${sourceName}
[内容]: 
${safeContent}

请判断并输出 JSON。如果不符合“深度/人文/独特”标准，直接输出: {"error": "low_quality"}
`;

    try {
        const response = await openai.chat.completions.create({
            model: config.llm.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8 // Slightly creative for history matching
        });

        const resultText = response.choices[0].message.content;
        let parsed;

        try {
            parsed = JSON.parse(resultText);
        } catch (e) {
            console.error('JSON Parse error:', e);
            return null;
        }

        if (parsed.error === 'low_quality') return null;

        // Validation
        if (parsed.painProtocol && parsed.historyMatch && parsed.goldenSentence) {
            return parsed;
        }
        return null;

    } catch (error) {
        console.error(`LLM Analysis Error (${sourceName}):`, error.message);
        return null;
    }
}

module.exports = { analyzeContent };
