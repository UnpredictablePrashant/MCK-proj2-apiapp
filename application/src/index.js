require("dotenv").config();
const QuotesService = require("./services/quotesService");

async function main() {
  try {
    const quotesService = new QuotesService();
    const quote = await quotesService.getMotivationalQuote();
    console.log(
      `Quote of the day:\n"${quote.quote}" — ${quote.author}`
    );
  } catch (error) {
    console.error("Failed to fetch motivational quote:", error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  QuotesService,
};
