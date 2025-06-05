export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { script, platform, category, languages, thumbMode } = req.body;

  if (!script || script.trim().length < 10) {
    return res.status(400).json({ error: "Texto do vídeo é muito curto ou inválido." });
  }

  // Geração básica de tags com base no conteúdo do script
  const keywords = script
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .slice(0, 10)
    .join(", ");

  // Descrição padrão com hashtags e local para links
  const description = `Este vídeo aborda o tema: "${script.slice(0, 100)}..."\n\nAproveite para conferir outros vídeos relacionados e links úteis no final da descrição.\n\n#${category} #${platform} #creator`;

  // Traduções básicas por idioma
  const translations = {};
  if (languages && languages.includes("en")) {
    translations["en"] = {
      title: "Focus on Topic: A Creative Video",
      description: "This video explores a topic of interest for creators. Watch and learn more about it!"
    };
  }
  if (languages && languages.includes("es")) {
    translations["es"] = {
      title: "Explorando Temas Creativos",
      description: "Este video presenta un tema interesante para creadores. ¡No te lo pierdas!"
    };
  }
  if (languages && languages.includes("fr")) {
    translations["fr"] = {
      title: "Explorer un Sujet Créatif",
      description: "Cette vidéo aborde un sujet fascinant pour les créateurs. Regardez-la maintenant !"
    };
  }

  res.status(200).json({
    title: `Vídeo sobre ${category} - Plataforma ${platform}`,
    description: description,
    tags: keywords,
    thumbnailPrompt: thumbMode === "gerar" ? `Crie uma imagem sobre: ${script.slice(0, 50)}...` : null,
    translations
  });
}
