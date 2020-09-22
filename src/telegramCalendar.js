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
      },
      {
        text: "Вт",
      },
      {
        text: "Ср",
      },
      {
        text: "Чт",
      },
      {
        text: "Пт",
      },
      {
        text: "Сб",
      },
      {
        text: "Вс",
      },
    ];

    return row;
  }

  _getButtons() {
    return [{ text: "<" }, { text: ">" }];
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
      }))
    );
  }

  _generateKeyboard() {
    let keyboard = new kb.ReplyKeyboard();
    let label = this._getLabel();
    let rows = this._getMonthArray();
    let buttons = this._getButtons();

    keyboard.addRow({
      text: `${this.date.getFullYear()} / ${
        this.monthNames[this.date.getMonth()]
      }`,
    });
    keyboard.addRow(...label);
    for (let i in rows) {
      keyboard.addRow(...rows[i]);
    }
    keyboard.addRow(...buttons);

    return keyboard;
  }

  getCalendar() {
    return this._generateKeyboard();
  }

  nextMonth() {
    this.date = new Date(this.date.setMonth(this.date.getMonth() + 1));
    return this.getCalendar();
  }

  prevMonth() {
    this.date = new Date(this.date.setMonth(this.date.getMonth() - 1));
    return this.getCalendar();
  }
}

module.exports = Calendar;
