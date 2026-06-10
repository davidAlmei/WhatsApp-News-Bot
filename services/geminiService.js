const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateDigest(tech, business, world) {
  const prompt = `
Summarize these news articles.

Return ONLY valid JSON.

Format:

{
  "technology": [
    {
      "title": "...",
      "summary": "...",
      "url": "..."
    }
  ],
  "business": [
    {
      "title": "...",
      "summary": "...",
      "url": "..."
    }
  ],
  "world": [
    {
      "title": "...",
      "summary": "...",
      "url": "..."
    }
  ]
}

Rules:
- Maximum 3 articles per category.
- Summary should be under 25 words.
- Preserve URLs exactly.
- Return only JSON.

Technology:
${JSON.stringify(tech)}

Business:
${JSON.stringify(business)}

World:
${JSON.stringify(world)}
`;

  let delay = 5000; // 5 seconds

  while (true) {
    try {
      console.log("Calling Gemini...");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const cleaned = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("Gemini success!");

      return JSON.parse(cleaned);

    } catch (err) {

      // Retry only for temporary issues
      if (err.status === 503 || err.status === 429) {

        console.log(
          `Gemini unavailable. Retrying in ${
            delay / 1000
          } seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );

        // Increase delay each retry
        delay = Math.min(delay * 2, 60000);

      } else {
        console.error("Gemini Error:", err);
        throw err;
      }
    }
  }
}

module.exports = { generateDigest };