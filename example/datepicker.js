const inquirer = require('inquirer');
const Datepicker = require('./index');

// In your code, this will be:
inquirer.registerPrompt('datepicker', Datepicker);

var questions = [
  {
    name: 'start',
    type: 'datepicker',
    message: 'Select start date time: '
  },
  {
    name: 'end',
    type: 'datepicker',
    message: 'Select end date time: '
  }
];

inquirer
  .prompt(questions)
  .then(function(input) {
    console.log(JSON.stringify(input, null, 2));
  });
