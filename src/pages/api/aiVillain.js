import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt mancante o non valido" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un assistente esperto in D&D 5e. Rispondi SOLO in JSON valido senza testo extra." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 500
    });

    const textResponse = completion.choices[0].message.content.trim();

    // Controllo se è JSON valido
    if (!textResponse.startsWith("{")) {
      return res.status(500).json({ error: "Output AI non è JSON puro", raw: textResponse });
    }

    const villainData = JSON.parse(textResponse);
    return res.status(200).json(villainData);

  } catch (error) {
    console.error("Errore AI:", error);
    return res.status(500).json({ error: "Errore durante la generazione AI" });
  }
}
