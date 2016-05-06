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

  let numbers = _.map(number.split(''), (x) => parseInt(x));
  let numbersLength = numbers.length;
  let numberGroups = _.groupBy(numbers, (_, index) => Math.floor((numbersLength - index - 1) / 3));
  let numberGroupArray = _.values(numberGroups).reverse();
  let groupWords = _.map(numberGroupArray, (numGroup, index) => getWordsForNumbers(numGroup));
  let wordsWithSignificants = _.map(groupWords.reverse(), (word, index) => word ? `${word} ${significantGroups[index]}` : '');
  let finalWord = _.reduce(wordsWithSignificants.reverse(), (word1, word2) => word2 ? `${word1}, ${word2}` : word1);
  return (isNegative ? 'negative ' : '') + finalWord.trim();
}
