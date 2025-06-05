
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { script, platform, category, languages, thumbMode } = req.body;

  if (!script || script.trim().length < 10) {
    return res.status(400).json({ error: "Texto do vídeo é muito curto ou inválido." });
  }

  const keywords = script.split(" ").slice(0, 10).join(", ");
  const description = `Este vídeo aborda o tema: "${script.slice(0, 100)}..."

Aproveite para conferir outros vídeos relacionados e links úteis no final da descrição.

#${category} #${platform} #creator`;

  const translations = {};
  if (languages && languages.includes("en")) {
    translations["en"] = {
      title: "Wildlife in Focus: Capybaras Adventure",
      description: "This video shows capybaras in their natural environment using a drone. We explore their behavior and more."
    };
  }
  if (languages && languages.includes("es")) {
    translations["es"] = {
      title: "Capibaras en Acción: Naturaleza desde un Drone",
      description: "Observamos capibaras en su hábitat natural usando un drone. Exploramos su comportamiento y entorno."
    };
  }
  if (languages && languages.includes("fr")) {
    translations["fr"] = {
      title: "Capybaras en Vue: Aventure dans la Nature",
      description: "Ce documentaire explore le comportement des capybaras dans leur habitat naturel à l'aide d'un drone."
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
