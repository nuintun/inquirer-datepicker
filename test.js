const inquirer = require('inquirer');
const Datepicker = require('./index');

// In your code, this will be:
inquirer.registerPrompt('datepicker', Datepicker);

var questions = [
  {
    name: 'date',
    type: 'datepicker',
    message: 'Select date time: ',
    min: {
      year: 2016
    },
    max: {
      year: 2018
    }
  }
];

inquirer
  .prompt(questions)
  .then(function(input) {
    console.log(input.date);
  })
  .catch(function(error) {
    process.stderr.write(error);
  });
