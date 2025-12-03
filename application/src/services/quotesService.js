const { createOpenAIClient, DEFAULT_MODEL } = require("../config/openaiClient");

class QuotesService {
  constructor({
    apiKey,
    model = DEFAULT_MODEL,
    temperature = 0.8,
    maxRetries = 2,
    openAIClient,
  } = {}) {
    this.client = openAIClient || createOpenAIClient({ apiKey });
    this.model = model;
    this.temperature = temperature;
    this.maxRetries = maxRetries;
  }

  async getMotivationalQuote({
    audience = "busy professionals",
    theme = "daily gratitude",
    language = "English",
  } = {}) {
    const prompt = this.#buildPrompt({ audience, theme, language });
    return this.#withRetries(async () => {
      const response = await this.client.responses.create({
        model: this.model,
        input: prompt,
        temperature: this.temperature,
      });

      const raw = response?.output_text?.trim();
      if (!raw) {
        throw new Error("Empty response from OpenAI");
      }

      return this.#normalizeQuote(raw);
    });
  }

  #buildPrompt({ audience, theme, language }) {
    return `You are a motivational quotes generator.
Return JSON only with the shape {"quote":"", "author":""}.
Requirements:
- Provide a single motivational quote tailored for ${audience}.
- Prefer quotes that reinforce ${theme}.
- Respond in ${language}.
- Keep the quote under 35 words.
- If the author is unknown, set author to "Unknown".
- Do not include explanations or code fences.`;
  }

  async #withRetries(fn) {
    let attempt = 0;
    let lastError;

    while (attempt <= this.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        attempt += 1;

        if (attempt > this.maxRetries) {
          throw lastError;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * attempt, 3000))
        );
      }
    }

    throw lastError || new Error("Failed to fetch quote");
  }

  #normalizeQuote(raw) {
    const sanitized = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(sanitized);
      if (parsed.quote && parsed.author) {
        return {
          quote: parsed.quote.trim(),
          author: parsed.author.trim(),
        };
      }
    } catch (_) {
      // fall through to non-JSON handling
    }

    const match = sanitized.match(/["“”']?(.+?)["“”']?(?:\s*[—-]\s*(.+))?$/);
    return {
      quote: match?.[1]?.trim() || sanitized,
      author: match?.[2]?.trim() || "Unknown",
    };
  }
}

module.exports = QuotesService;
