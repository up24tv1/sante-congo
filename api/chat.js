export default async function handler(req, res) {
    if (req.method !== "POST") {
          return res.status(405).json({ error: "Method not allowed" });
    }

  const { system, messages } = req.body;

  try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                          model: "gpt-4o-mini",
                          messages: [
                            { role: "system", content: system },
                                      ...messages,
                                    ],
                          max_tokens: 1024,
                          temperature: 0.7,
                }),
        });

      const data = await response.json();

      if (data.error) {
              return res.status(500).json({ error: data.error.message });
      }

      return res.status(200).json({ text: data.choices[0].message.content });
  } catch (err) {
        return res.status(500).json({ error: "Server error: " + err.message });
  }
}
