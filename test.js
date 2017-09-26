const inquirer = require('inquirer');
const Datepicker = require('./index');

// In your code, this will be:
inquirer.registerPrompt('datepicker', Datepicker);

var questions = [
  {
    name: 'date',
    type: 'datepicker',
    message: 'Select a date time: '
  }
];

inquirer
  .prompt(questions)
  .then(function(input) {
    console.log(input.date);
  });
