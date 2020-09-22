const Calendar = require("./src/telegramCalendar.js");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(token, { polling: true });

let c = new Calendar();

bot.sendMessage(
  chatId,
  "calendar",
  c.getCalendar().open({ resize_keyboard: false })
);

bot.onText(/</, (msg, match) => {
  let calendar = c.prevMonth().open({ resize_keyboard: true });

  bot.sendMessage(chatId, "Back", calendar);
});

bot.onText(/>/, (msg, match) => {
  let calendar = c.nextMonth().open({ resize_keyboard: true });

  bot.sendMessage(chatId, "Next", calendar);
});
