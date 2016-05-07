"use strict";

var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tens = ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
var significantGroups = ['', 'thousand', 'million', 'billion', 'trillion',
'quadrillion', 'pentillion', 'quintillion', 'sextillion', 'septillion',
'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion',
'tredecillion', 'quattuordecillion', 'quindecillion', 'sexdecillion',
'septendecillion', 'octodecillion', 'novemdecillion', 'vigintillion',
'unvigintillion', 'icosidillion', 'trevigintillion', 'quattuorvigintillion',
'quinvigintillion', 'sexvigintillion', 'septenvigintillion', 'octovigintillion',
'novemvigintillion', 'trigintillion', 'untrigintillion', 'duotrigintillion'];

// This function takes an array of up to 3 integer numbers, and returns the string represenation of it.
// As this only takes up to 3 numbers, it will only take between 0 and 999
function getWordsForNumbers(numberArray) {

  let returnValue = '';

  let originalLength = numberArray.length;
  while(numberArray.length < 3) {
    numberArray.unshift(0);
  }

  switch(originalLength) {
    case 3:
      if (numberArray[0] != 0) {
        returnValue += `${ones[numberArray[0]]} hundred `;
      }
      if (numberArray[1] > 0 || numberArray[2] > 0) {
        returnValue += 'and ';
      }
    case 2:
      if(numberArray[1] == 1) {
        returnValue += teens[numberArray[2]] + ' ';
        break;
      }
      else if (numberArray[1] > 1) {
        returnValue += tens[numberArray[1]] + ' ';
      }
    case 1:
    if(numberArray[2] > 0) {
      returnValue += ones[numberArray[2]];
    }
  }

  return returnValue.trim();
}

function convertToText(number) {
  let isNegative = false;

  number = number.replace(/[ ,]/g, '');
  if (number === '') {
    throw new Error('Awaiting Input...');
  }
  else if (number === '0') {
    return 'zero';
  }

  if (number[0] == '-') {
    isNegative = true;
    number = number.slice(1);
  }
  if(!number.match(/^\d+$/g)) {
    throw new Error('You entered a non number character');
    return;
  }
  if (number.length > 105) {
    throw new Error('This number is too damn big to be converted to words');
  }

  // My method of converting numbers is to split the number into groups of three, then convert each part separately
  // e.g. you would say twenty three thousand, four hundred and sixty two.
  // I do that by taking 23462, splitting it into 24 and 462, then converting those
  // groups separately (twenty four, and four hundred and sixty two), then adding the group part on,
  // i.e. add the word "thousand" and a comma after the twenty four, then i join all the parts

  // Convert each individual string number to an integer
  let numbers = _.map(number.split(''), (x) => parseInt(x));
  // get the full length of the
  let numbersLength = numbers.length;
  // split the number into groups of 3, because that's how you say numbers
  let numberGroups = _.groupBy(numbers, (_, index) => Math.floor((numbersLength - index - 1) / 3));
  // reverse the array so it's easier to add the group words (i.e to add thousands)
  let numberGroupArray = _.values(numberGroups).reverse();
  // Call the getWordsForNumbers function which does the text conversion on each group of numbers
  let groupWords = _.map(numberGroupArray, (numGroup, index) => getWordsForNumbers(numGroup));
  // Add the significant part on, starting with the lowest group and working up. (i.e. do nothing first, then the thousands, then the millions...)
  let wordsWithSignificants = _.map(groupWords.reverse(), (word, index) => word ? `${word} ${significantGroups[index]}` : '');
  // Reverse the array again, and combine the array of separte parts with each other to form a final string
  let finalWord = _.reduce(wordsWithSignificants.reverse(), (word1, word2) => word2 ? `${word1}, ${word2}` : word1);
  // Add "negative" on if the number is a negative
  return (isNegative ? 'negative ' : '') + finalWord.trim();
}
