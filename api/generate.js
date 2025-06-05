export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { script, platform = "youtube" } = req.body;

  if (!script || script.trim().length < 10) {
    return res.status(400).json({ error: "Texto do vídeo é muito curto ou inválido." });
  }

  const systemPrompt = `
  Você é um assistente de criação de conteúdo para vídeos curtos e longos nas plataformas YouTube, Instagram e TikTok. Seu trabalho é transformar um pequeno resumo ou ideia de vídeo em:

  1. Título curto, criativo e chamativo, com palavras-chave relevantes e adequadas ao tema.
  2. Descrição envolvente, com storytelling, hashtags e espaço para links e vídeos recomendados.
  3. Tags separadas por vírgula, curtas, sem palavras irrelevantes.
  4. Prompt para thumbnail que descreva uma cena visual impactante e contextual do vídeo (apenas se solicitado).
  5. Traduções para os idiomas solicitados (EN, ES, FR), adaptando o conteúdo ao idioma e cultura.

  A linguagem e estilo devem variar conforme a plataforma:
  - YouTube: foco em narrativa e SEO.
  - TikTok: linguagem direta e envolvente.
  - Instagram: emocional e estético.

  Evite repetições do texto original. Interprete o que ele representa e gere conteúdo criativo, coeso e direcionado para viralização.

  Use este formato de resposta JSON:
  {
    "title": "...",
    "description": "...",
    "tags": "...",
    "thumbnailPrompt": "...",
    "translations": {
      "en": { "title": "...", "description": "..." },
      "es": { "title": "...", "description": "..." },
      "fr": { "title": "...", "description": "..." }
    }
  }
  `;

  const userPrompt = `Plataforma: ${platform}\nResumo ou script: ${script}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro na geração de conteúdo:", error);
    res.status(500).json({ error: "Erro ao gerar conteúdo." });
  }
}


