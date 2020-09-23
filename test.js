const Calendar = require("./src/telegramCalendar.js");
const TelegramBot = require("node-telegram-bot-api");
const config = require("config");

const token = config.get("bot_token");
const chatId = config.get("chat_id");

const bot = new TelegramBot(token, { polling: true });

let c = new Calendar();

bot.sendMessage(chatId, "calendar", c.getCalendar());

bot.on("callback_query", (query) => {
  c.catchCallbackQuery(bot, query, function (date) {
    console.log(date);
  });
});
