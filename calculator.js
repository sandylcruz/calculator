/*
Problem Summary
Write a calculator program. The program should let a user enter a math problem as a string and get an answer.

Requirements
- take text or string as input
- support positive, negative, and decimal numbers
- support +, -, *, and / operations, with standard mathematical order of operations
- no more than 2 operators in series
- the second can only be -
- support parentheses (multiple nesting levels)
- a bit of documentation / help text for how to use your program
Some Examples

calculate "1 + 2" => 3
calculate "4*5/2" => 10
calculate "-5+-8--11*2" => 9
calculate "-.32       /.5" => -0.64
calculate "(4-2)*3.5" => 7
calculate "2+-+-4" => Syntax Error (or similar)
calculate "19 + cinnamon" => Invalid Input (or similar)
*/
const isOperator = (char) => {
  const operands = new Set(['+', '-', '*', '/']);
  return operands.has(char);
};

const isNumber = (element) => {
  return /^-?\d+$/.test(element);
};

// const calculate = (operator, num1, num2) => {};

const stringCalculator = (string) => {
  const operators = new Set(['+', '-', '/', '*']);
  const elements = string.split('');
  console.log(elements);

  for (let i = 0; i < elements.length; i++) {
    const currentElement = elements[i];

    if (isNumber(currentElement)) {
      console.log(`is digit: ${currentElement}`);
    } else if (isOperator(currentElement)) {
      console.log(`is operator: ${currentElement}`);
    } else {
      console.log(`is not digit or operator: ${currentElement}`);
    }
  }
  // const total =
  // return total;
};
console.log(stringCalculator('1 + 2'));
// console.log(stringCalculator('-5+-8--11*2'));
// export default stringCalculator;
