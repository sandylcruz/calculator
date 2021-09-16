interface BinaryOperationToken {
  type: 'BinaryOperationToken';
  operation: '+' | '-' | '*' | '/';
}

interface NumberToken {
  type: 'NumberToken';
  value: number;
}

interface ParenthesesToken {
  type: 'ParenthesesToken';
  value: '(' | ')';
}

type Token = BinaryOperationToken | NumberToken;

const isNumber = (element) => {
  return /^-?\d+$/.test(element);
};

const isOperator = (element) => {
  const operators = new Set(['+', '-', '*', '/']);
  return operators.has(element);
};

const hasConsecutiveOperators = (string: string): boolean => {
  for (let i = 0; i < string.length; i++) {
    const current = string[i];
    const next = string[i + 1];

    if (isOperator(current) && isOperator(next) && next !== '-') {
      return true;
    }
  }

  return false;
};

const hasValidCharacters = (string: string): boolean => {
  const trimmedString = string.replace(/\s/g, '').split('');
  let validCharacters = new Set(['+', '/', '-', '*', '.', '(', ')']);

  for (let i = 0; i < 10; i++) {
    validCharacters.add(String(i));
  }

  for (let i = 0; i < trimmedString.length; i++) {
    const currentChar = trimmedString[i];
    if (!validCharacters.has(currentChar)) {
      return false;
    }
  }

  return true;
};

const eliminateSpaces = (string: string): string => {
  let newString = '';

  for (let i = 0; i < string.length; i++) {
    const currentChar = string[i];
    if (currentChar !== ' ') {
      newString += currentChar;
    }
  }

  return newString;
};

const tokenGenerator = (string: string): Array<Token> => {
  const trimmedString = eliminateSpaces(string);

  if (!hasValidCharacters(trimmedString)) throw 'Invalid input';
  if (hasConsecutiveOperators(trimmedString)) throw 'Syntax error';
  // unbalanced parentheses

  const tokenArray = [];

  let numberAccumulator = '';
  let numberIsNegative = false;

  for (let i = 0; i < trimmedString.length; i++) {
    const current = trimmedString[i];
    const previous = trimmedString[i - 1];

    if (isNumber(current) || current === '.') {
      numberAccumulator += current;
    } else if (isOperator(current)) {
      if (numberAccumulator !== '') {
        const token: NumberToken = {
          type: 'NumberToken',
          value: numberIsNegative
            ? Number(numberAccumulator) * -1
            : Number(numberAccumulator),
        };
        tokenArray.push(token);
        numberAccumulator = '';
        numberIsNegative = false;
      }

      if (current === '-') {
        if (isOperator(previous)) {
          numberIsNegative = true;
        } else {
          tokenArray.push({
            type: 'BinaryOperationToken',
            operation: current,
          });
        }
      }
    } else if (
      current === '+' ||
      current === '-' ||
      current === '*' ||
      current === '/'
    ) {
      tokenArray.push({
        type: 'BinaryOperationToken',
        operation: current,
      });
    } else if (current === '(') {
      tokenArray.push({
        type: 'ParenthesesToken',
        value: '(',
      });
    } else if (current === ')') {
      tokenArray.push({
        type: 'ParenthesesToken',
        value: ')',
      });
    }
  }

  if (numberAccumulator !== '') {
    const token: NumberToken = {
      type: 'NumberToken',
      value: numberIsNegative
        ? Number(numberAccumulator) * -1
        : Number(numberAccumulator),
    };
    tokenArray.push(token);
  }

  return tokenArray;
};
// console.log(tokenGenerator('5 + 3 * 6 - ( 5 / 3 ) + 7'));

// console.log(tokenGenerator('2.225 + 4'));
// console.log(tokenGenerator('2.225 + -4'));
// console.log(tokenGenerator('2. + -4'));

const operatorPrecedence = {
  x: 1,
  '/': 1,
  '+': 2,
  '-': 2,
};

const addStackToOutput = (stack) => {};

const shuntingYard = (tokenArray) => {
  const stack = [];
  const output = [];

  for (let i = 0; i < tokenArray.length; i++) {
    const currentElement = tokenArray[i];

    if (currentElement.type === 'NumberToken') {
      output.push(currentElement.value);
    } else if (currentElement.type === 'BinaryOperationToken') {
      const currentElementsOperation = currentElement.operation;

      if (stack.length === 0) {
        stack.push(currentElementsOperation);
        continue;
      }

      if (
        operatorPrecedence[currentElementsOperation] <=
        operatorPrecedence[stack[stack.length - 1]]
      ) {
        stack.push(currentElementsOperation);
      } else if (
        operatorPrecedence[currentElementsOperation] >
        operatorPrecedence[stack[stack.length - 1]]
      ) {
        const stackLength = stack.length;
        for (let j = 0; j < stackLength; j++) {
          output.push(stack.pop());
        }
        stack.push(currentElementsOperation);
      }
    } else if (currentElement === '(') {
      console.log('(');
    } else if (currentElement === ')') {
      console.log();
    }
  }
  // TODO extract to helper method
  const stackLength = stack.length;
  for (let k = 0; k < stackLength; k++) {
    output.push(stack.pop());
  }

  return output;
};
// console.log(
//   shuntingYard([
//     { type: 'NumberToken', value: 4 },
//     { type: 'BinaryOperationToken', operation: '+' },
//     { type: 'NumberToken', value: 4 },
//     { type: 'BinaryOperationToken', operation: '*' },
//     { type: 'NumberToken', value: 2 },
//     { type: 'BinaryOperationToken', operation: '/' },
//     { type: 'NumberToken', value: 1 },
//     { type: 'BinaryOperationToken', operation: '-' },
//     { type: 'NumberToken', value: 5 },
//   ])
// );
// console.log(
//   shuntingYard([
//     { type: 'NumberToken', value: 5 },
//     { type: 'BinaryOperationToken', operation: '+' },
//     { type: 'NumberToken', value: 3 },
//     { type: 'BinaryOperationToken', operation: '*' },
//     { type: 'NumberToken', value: 6 },
//     { type: 'BinaryOperationToken', operation: '-' },
//     { type: 'NumberToken', value: 5 },
//     { type: 'BinaryOperationToken', operation: '/' },
//     { type: 'NumberToken', value: 3 },
//     { type: 'BinaryOperationToken', operation: '+' },
//     { type: 'NumberToken', value: 7 },
//   ])
// );

const reversePolishNotation = (array) => {
  const stack = [];

  for (let i = 0; i < array.length; i++) {
    const currentElement = array[i];
    if (!isNaN(currentElement) && isFinite(currentElement)) {
      stack.push(currentElement);
    } else {
      let a = stack.pop();
      let b = stack.pop();

      if (currentElement === '*') {
        stack.push(a * b);
      } else if (currentElement === '/') {
        stack.push(b / a);
      } else if (currentElement === '+') {
        stack.push(a + b);
      } else {
        stack.push(b - a);
      }
    }
  }

  return stack;
};

// console.log(reversePolishNotation([1, 3, 5, '*', '-'])); // -14
// console.log(reversePolishNotation([4, 13, 5, '/', '+'])); // 6
// console.log(
//   reversePolishNotation([10, 6, 9, 3, '+', -11, '*', '/', '*', 17, '+', 5, '+'])
// ); // 22

const stringCalculator = (string: string): number => {
  const tokensArray = tokenGenerator(string);
  const parsedArray = shuntingYard(tokensArray);

  const result = reversePolishNotation(parsedArray);
  console.log(
    'tokens array:',
    tokensArray,
    'parsed array:',
    parsedArray,
    'result:',
    result
  );

  return Number(result);
};

// console.log(
//   shuntingYard([
//     { type: 'NumberToken', value: 2 },
//     { type: 'BinaryOperationToken', operation: '+' },
//     { type: 'BinaryOperationToken', operation: '-' },
//     { type: 'NumberToken', value: 4 },
//   ])
// ); // 2 4 + -

// console.log(
//   shuntingYard([
//     { type: 'NumberToken', value: 'A' },
//     { type: 'BinaryOperationToken', operation: '+' },
//     { type: 'NumberToken', value: 'B' },
//     { type: 'BinaryOperationToken', operation: 'x' },
//     { type: 'NumberToken', value: 'C' },
//     { type: 'BinaryOperationToken', operation: '-' },
//     { type: 'NumberToken', value: 'D' },
//   ])
// ); // 2 4 + -

// console.log(calculate('2+-+-4v')); // syntax error
// console.log(calculate('2+-+-4')); // syntax error

// console.log(calculate('2 + cinnamon')); // invalid input
// console.log(calculate('2 + 2')); // 4
// console.log(calculate('1+    2')); // 3
// console.log(calculate('4*5/2')); // 10
// console.log(calculate('-5+-8--11*2')); // 9
// console.log(calculate('-5-8--11*2')); // 9

// console.log(calculate('-.32       /.5')); // -0.64
// console.log(shuntingYard('(4-2)*3.5')); // 7
