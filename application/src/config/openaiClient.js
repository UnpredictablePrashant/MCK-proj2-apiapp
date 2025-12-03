const OpenAI = require("openai");

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function createOpenAIClient({ apiKey = process.env.OPENAI_API_KEY } = {}) {
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is missing. Set it in your environment or .env file."
    );
  }

  return new OpenAI({ apiKey });
}

module.exports = {
  createOpenAIClient,
  DEFAULT_MODEL,
};
