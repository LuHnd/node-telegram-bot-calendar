const kb = require("node-telegram-keyboard-wrapper");
const calendar = require("calendar-month-array");

function splitArray(array, n) {
  let [...arr] = array;
  var res = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
}

class Calendar {
  constructor(options) {
    options = options || {};
    this.date = options.date || new Date();
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    //add language
  }

  _getLabel() {
    let row = [
      {
        text: "Пн",
        callback_data: "date-ignore",
      },
      {
        text: "Вт",
        callback_data: "date-ignore",
      },
      {
        text: "Ср",
        callback_data: "date-ignore",
      },
      {
        text: "Чт",
        callback_data: "date-ignore",
      },
      {
        text: "Пт",
        callback_data: "date-ignore",
      },
      {
        text: "Сб",
        callback_data: "date-ignore",
      },
      {
        text: "Вс",
        callback_data: "date-ignore",
      },
    ];

    return row;
  }

  _getButtons() {
    return [
      { text: "<", callback_data: "date-prev" },
      { text: ">", callback_data: "date-next" },
    ];
  }

  _getMonthArray() {
    let monthArray = calendar(this.date, {
      weekStartDay: 1,
      formatDate: (date) => date.getDate(),
      formatSiblingMonthDate: () => "  ",
    });

    return monthArray.map((i) =>
      i.map((j) => ({
        text: j,
        callback_data: "date-" + j,
      }))
    );
  }

  _generateKeyboard() {
    let keyboard = new kb.InlineKeyboard();
    let label = this._getLabel();
    let rows = this._getMonthArray();
    let buttons = this._getButtons();

    keyboard.addRow({
      text: `${this.date.getFullYear()} / ${
        this.monthNames[this.date.getMonth()]
      }`,
      callback_data: "date-ignore",
    });
    keyboard.addRow(...label);
    for (let i in rows) {
      keyboard.addRow(...rows[i]);
    }
    keyboard.addRow(...buttons);

    return keyboard;
  }

  getCalendar() {
    return this._generateKeyboard().build();
  }

  nextMonth() {
    this.date = new Date(this.date.setMonth(this.date.getMonth() + 1));
    return this.getCalendar();
  }

  prevMonth() {
    this.date = new Date(this.date.setMonth(this.date.getMonth() - 1));
    return this.getCalendar();
  }

  catchCallbackQuery(bot, query, cb) {
    try {
      let data = query.data,
        message_id = query.message.message_id,
        chat_id = query.message.chat.id;
      console.log({ data, chat_id, message_id });

      let query_split = data.split("-");
      if (query_split[0] == "date") {
        if (query_split[1] == "prev") {
          let kb = this.prevMonth();
          bot.editMessageReplyMarkup(kb.reply_markup, { chat_id, message_id });
        }
        if (query_split[1] == "next") {
          let kb = this.nextMonth();
          bot.editMessageReplyMarkup(kb.reply_markup, { chat_id, message_id });
        }

        if (typeof parseInt(query_split[1]) == "number") {
          cb({
            year: this.date.getFullYear(),
            month: this.date.getMonth() + 1,
            day: query_split[1],
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Calendar;
