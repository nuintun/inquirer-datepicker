# inquirer-datepicker

>
>Datepicker plugin for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
>
>![Datetime prompt](datepicker.png)

### Getting started
###### install plugin
```javascript
npm i inquirer-datepicker
```

###### register prompt
```javascript
inquirer.registerPrompt('datepicker', require('inquirer-datepicker'))
```

### Options
###### message

Inherited from inquirer, message to be displayed while retrieving response.

###### format

An array of format specifiers for printing the date to the console.

Uses the [moment](https://github.com/moment/moment) format options.

For example:

```Javascript
// 2017/09/26 22:56:36
{
  type: 'datepicker',
  name: 'date',
  message: 'Select a date time: ',
  format: ['Y', '/', 'MM', '/', 'DD', ' ', 'HH', ':', 'mm', ':', 'ss']
}

// 2017/09/26 10:56:36 PM
{
  type: 'datepicker',
  name: 'date',
  message: 'Select a date time: ',
  format: ['Y', '/', 'MM', '/', 'DD', ' ', 'hh', ':', 'mm', ':', 'ss', ' ', 'A']
}
```

###### default

Initial value for datepicker.

Example:
```javascript
{
  type: 'datepicker',
  name: 'date',
  message: 'Select a date time: ',
  default: new Date('2017-09-26 22:56:36'),
}
```

###### min, max

These specify a range for entry.  Users will be prohibited from entering a value higher or lower.

```Javascript
{
  type: 'datepicker',
  name: 'date',
  message: 'Select a date time: ',
  // Enter only 2017/9/1 6:00 to 2017/9/26 18:00
  min: {
    year: 2017,
    month: 9,
    day: 1,
    hour: 6
  },
  max: {
    year: 2017,
    month: 9,
    day: 26,
    hour: 18
  }
}
```

###### steps.{ years, months, days, hours, minutes, seconds }

These specify the allowed interval (modulo), but only work when useing up and down keys.

For instance:

```Javascript

// Minutes can only be entered in intervals of 15 minutes
{
  type: 'datepicker',
  name: 'date',
  message: 'Select a date time: ',
  steps: {
    minutes: 15
  }
}
```

### Thanks
See: [inquirer-datepicker-prompt](https://github.com/DerekTBrown/inquirer-datepicker-prompt)
