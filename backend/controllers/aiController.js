import { OpenAI } from "openai";

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = "5c39acfeb8d34da589fbfd3203eef7aa";

const api = new OpenAI({
  apiKey,
  baseURL,
});

export const generateGeminiResponse = async (req, res) => {
  const userPrompt = req.body.message;
  const systemPrompt = "You are a helpful fashion assistant. Be friendly and concise.";

  try {
    const completion = await api.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const response = completion.choices[0].message.content;
    res.json({ reply: response });
  } catch (err) {
    res.status(500).json({ error: "AI error" });
  }
};