let { Before, After, Given, When, Then } = require('@cucumber/cucumber')
const path = require('path')
const fs = require('fs')

Before('@skip', function() {
  return 'skipped'
})

Given('I have the dashboard page', function(cb) {
  this.attach('here you go')
  this.attach('{"name": "some JSON"}', 'application/json');
  setTimeout(cb, 3000)
})

When('I click on my account', function() {
  this.attach('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum', 'text/plain');
  throw new Error('The button my button hasn\'t been found')
})

Then('The title of the page should be {string}', function(bar) {
 this.attach(stream, 'image/png', callback);
 return true
})

After(function() {
  //const file = fs.readFileSync(path.resolve(__dirname, 'image.png'))
  //this.attach(file, 'image/png')
})
