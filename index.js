/*!
 * Datepicker
 *
 * Author: nuintun
 * Date: 2017/09/26
 *
 * This is licensed under the MIT License (MIT).
 */

'use strict';

const chalk = require('chalk');
const moment = require('moment');
const cursor = require('cli-cursor');
const inquirer = require('inquirer');
const lodash = require('lodash');
const Base = require('inquirer/lib/prompts/base');
const observe = require('inquirer/lib/utils/events');

const findIndex = lodash.findIndex;
const findLastIndex = lodash.findLastIndex;
const PROPS = ['year', 'month', 'day', 'hour', 'minute', 'second'];

function foramtRange(date, range) {
  if (!range) return null;

  let meta = {};
  let count = 0;

  PROPS.forEach(function(key) {
    if (key === 'day') {
      key = 'date';
    }

    if (range.hasOwnProperty(key)) {
      count++;
      meta[key] = range[key];
    } else {
      meta[key] = date.get(key);
    }
  });

  return count ? moment(meta) : null;
}

function isValidDate(date, min, max) {
  min = foramtRange(date, min);
  max = foramtRange(date, max);

  if ((min && date.isBefore(min)) || (max && date.isAfter(max))) {
    return false;
  }

  return true;
}

function isSelectable(value) {
  return value !== null;
}

class Datepicker extends Base {
  constructor(question, rl, answers) {
    super(question, rl, answers);

    let context = this;
    let options = context.opt;
    let min = options.min;
    let max = options.max;
    let format = options.format;
    let steps = options.steps || {};

    PROPS.forEach(function(key) {
      if (min && min[key]) {
        min[key] = min[key] >>> 0;
      }

      if (max && max[key]) {
        max[key] = max[key] >>> 0;
      }

      key += 's';
      steps[key] = Math.max(steps[key] >>> 0, 1);
    });

    if (!Array.isArray(format)) {
      format = ['Y', '/', 'MM', '/', 'DD', ' ', 'HH', ':', 'mm', ':', 'ss'];
    }

    let initial = moment.min(moment(min), moment(max), moment(options.default));
    let selection = { value: 0, cursor: 0, date: initial, elements: [] };

    function saveSelectionDate(date) {
      if (isValidDate(date, min, max)) {
        selection.date = date;

        return true;
      }

      return false;
    }

    format.forEach(function(key) {
      let elements = selection.elements;

      switch (key) {
        case 'Y':
        case 'YY':
        case 'YYYY':
          elements.push({
            add(value) {
              return saveSelectionDate(selection.date.clone().add(value * steps.years, 'years'));
            },
            set(value) {
              if (value >= 1000) {
                selection.value = 0;
              }

              if (value <= 9999) {
                saveSelectionDate(selection.date.clone().set('year', value));
              }
            }
          });
          break;
        case 'M':
        case 'Mo':
        case 'MM':
        case 'MMM':
        case 'MMMM':
          elements.push({
            add(value) {
              return saveSelectionDate(selection.date.clone().add(value * steps.months, 'months'));
            },
            set(value) {
              if (value >= 10 || parseInt(value % 10) > 1) {
                selection.value = 0;
              }

              if (value >= 1 && value <= 12) {
                saveSelectionDate(selection.date.clone().set('month', value - 1));
              }
            }
          });
          break;
        case 'D':
        case 'Do':
        case 'DD':
          elements.push({
            add(value) {
              return saveSelectionDate(selection.date.clone().add(value * steps.days, 'days'));
            },
            set(value) {
              if (value >= 10 || parseInt(value % 10) > 3) {
                selection.value = 0;
              }

              if (value >= 1 && value <= 31) {
                saveSelectionDate(selection.date.clone().set('date', value));
              }
            }
          });
          break;
        case 'H':
        case 'HH':
        case 'h':
        case 'hh':
          elements.push({
            add(value) {
              return saveSelectionDate(selection.date.clone().add(value * steps.hours, 'hours'));
            },
            set(value) {
              if (value >= 10 || parseInt(value % 10) > 2) {
                selection.value = 0;
              }

              if (value >= 0 && value <= 24) {
                saveSelectionDate(selection.date.clone().set('hour', value));
              }
            }
          });
          break;
        case 'm':
        case 'mm':
          elements.push({
            add(value) {
              return saveSelectionDate(selection.date.clone().add(value * steps.minutes, 'minutes'));
            },
            set(value) {
              if (value >= 10 || parseInt(value % 10) > 5) {
                selection.value = 0;
              }

              if (value >= 0 && value <= 59) {
                saveSelectionDate(selection.date.clone().set('minute', value));
              }
            }
          });
          break;
        case 's':
        case 'ss':
          elements.push({
            add(value) {
              return saveSelectionDate(selection.date.clone().add(value * steps.seconds, 'seconds'));
            },
            set(value) {
              if (value >= 10 || parseInt(value % 10) > 5) {
                selection.value = 0;
              }

              if (value >= 0 && value <= 59) {
                saveSelectionDate(selection.date.clone().set('second', value));
              }
            }
          });
          break;
        case 'A':
        case 'a':
          elements.push({
            add() {
              let hour = selection.date.get('hour');

              return saveSelectionDate(selection.date.clone().add(hour >= 12 ? -12 : 12, 'hours'));
            },
            set() { return true; }
          });
          break;
        default:
          elements.push(null);
      }
    });

    options.min = min;
    options.max = max;
    options.steps = steps;
    options.format = format;
    context.selection = selection;
  }

  /**
   * Start the Inquiry session
   *
   * @param  {Function} done   Callback when prompt is done
   * @return {Datepicker}
   */
  _run(done) {
    let context = this;

    context.done = done;

    // Once user confirm (enter key)
    let events = observe(context.rl);

    events.keypress.takeUntil(events.line).forEach(context.onKeypress.bind(context));
    events.line.take(1).forEach(context.onEnd.bind(context));

    // Init
    cursor.hide();
    context.render();

    return context;
  }

  /**
   * Render the prompt to screen
   *
   * @return {Datepicker}
   */
  render() {
    let context = this;
    let message = context.getQuestion();
    let selection = context.selection;
    let format = context.opt.format;

    format.forEach(function(key, index) {
      if (selection.cursor === index) {
        message += chalk.reset.inverse(selection.date.format(key));
      } else {
        message += selection.date.format(key);
      }
    });

    context.screen.render(message);

    return context;
  }

  /**
   * When user press a key
   */
  onKeypress(e) {
    let index;
    let context = this;
    let selection = context.selection;
    let cursor = selection.cursor;
    let elements = selection.elements;
    let options = context.opt;

    // Arrow Keys
    if (e.key.name === 'right') {
      index = findIndex(elements, isSelectable, cursor + 1);
      selection.cursor = index >= 0 ? index : cursor;
    } else if (e.key.name === 'left') {
      index = findLastIndex(elements, isSelectable, cursor > 0 ? cursor - 1 : cursor);
      selection.cursor = index >= 0 ? index : cursor;
    } else if (e.key.name === 'up') {
      if (!elements[cursor].add(1)) {
        selection.date = foramtRange(selection.date, options.max);
      }
    } else if (e.key.name === 'down') {
      if (!elements[cursor].add(-1)) {
        selection.date = foramtRange(selection.date, options.min);
      }
    }

    // Numerical Entry
    var input;

    if (Number.isInteger(input = parseInt(e.value, 10))) {
      selection.value = (selection.value * 10) + input;
      elements[cursor].set(selection.value);
    } else {
      selection.value = 0;
    }

    context.render();
  }

  /**
   * When user press `enter` key
   */
  onEnd() {
    let context = this;
    let screen = context.screen;
    let message = context.getQuestion();
    let selection = context.selection;
    let format = context.opt.format;

    context.status = 'answered';

    format.forEach(function(key) {
      message += chalk.reset.cyan(selection.date.format(key));
    });

    screen.render(message);
    screen.done();
    cursor.show();
    context.done(selection.date.toDate());
  }
}

module.exports = Datepicker;
