const { getAllNews } = require("./newsService");

const { formatMorningBrief } = require("./formatter");

const { sendWhatsAppMessage } = require("./whatsappService");

async function main() {

  const news = await getAllNews();

  const message = formatMorningBrief(news);

  console.log(message);

  await sendWhatsAppMessage(message);
}

main();