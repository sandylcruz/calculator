interface BinaryOperationToken {
  type: 'BinaryOperationToken';
  operation: '+' | '-' | '*' | '/';
}

interface ClosingParenthesesToken {
  type: 'ClosingParenthesesToken';
  value: ')';
}

interface NumberToken {
  type: 'NumberToken';
  value: number;
}

interface OpeningParenthesesToken {
  type: 'OpeningParenthesesToken';
  value: '(';
}

type NumberOrBinaryOperationToken = NumberToken | BinaryOperationToken;

type Token =
  | BinaryOperationToken
  | NumberToken
  | OpeningParenthesesToken
  | ClosingParenthesesToken;

const operators = new Set(['+', '-', '*', '/']);
const operatorPrecedence = {
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1,
};
const validCharacters = new Set(['+', '/', '-', '*', '.', '(', ')']);

const isOperator = (element: string) => operators.has(element);
const isNumber = (element: string) => /^-?\d+$/.test(element);

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

const eliminateSpaces = (string: string): string =>
  string.replace(/\s/g, '').split('').join('');

const hasValidCharacters = (string: string): boolean => {
  for (let i = 0; i < 10; i++) {
    validCharacters.add(String(i));
  }

  for (let i = 0; i < string.length; i++) {
    const currentChar = string[i];
    if (!validCharacters.has(currentChar)) {
      return false;
    }
  }

  return true;
};

const tokenGenerator = (string: string): Array<Token> => {
  const trimmedString = eliminateSpaces(string);

  if (!hasValidCharacters(trimmedString)) throw 'Invalid input';
  if (hasConsecutiveOperators(trimmedString)) throw 'Syntax error';

  const tokenArray = [];

  let numberAccumulator = '';
  let numberIsNegative = false;

  for (let i = 0; i < trimmedString.length; i++) {
    const current = trimmedString[i];
    const previous = trimmedString[i - 1];

    if (isNumber(current) || current === '.') {
      numberAccumulator += current;
    } else if (current === '-' && i === 0) {
      numberIsNegative = true;
    } else if (isOperator(current)) {
      if (numberAccumulator !== '') {
        const token = {
          type: 'NumberToken',
          value: numberIsNegative
            ? Number(numberAccumulator) * -1
            : Number(numberAccumulator),
        };
        tokenArray.push(token);
        numberAccumulator = '';
        numberIsNegative = false;
      }
      if (current === '-' && isOperator(previous)) {
        numberIsNegative = true;
      } else {
        tokenArray.push({
          type: 'BinaryOperationToken',
          operation: current,
        });
      }
    } else if (current === '(') {
      tokenArray.push({
        type: 'OpeningParenthesesToken',
        value: '(',
      });
    } else if (isNumber(current) || current === ')') {
      const token: NumberToken = {
        type: 'NumberToken',
        value: numberIsNegative
          ? Number(numberAccumulator) * -1
          : Number(numberAccumulator),
      };
      tokenArray.push(token);
      numberAccumulator = '';
      numberIsNegative = false;
      tokenArray.push({
        type: 'ClosingParenthesesToken',
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

const shuntingYard = (
  tokenArray: Array<Token>
): Array<NumberOrBinaryOperationToken> => {
  const stack: Array<BinaryOperationToken | OpeningParenthesesToken> = [];
  const output: NumberOrBinaryOperationToken[] = [];

  for (let i = 0; i < tokenArray.length; i++) {
    const currentElement = tokenArray[i];

    if (currentElement.type === 'NumberToken') {
      output.push(currentElement);
    } else if (currentElement.type === 'BinaryOperationToken') {
      if (stack.length === 0) {
        stack.push(currentElement);
        continue;
      }

      const currentPrecedence = operatorPrecedence[currentElement.operation];
      const previousOperator = stack[stack.length - 1];

      if (previousOperator.type !== 'BinaryOperationToken') {
        stack.push(currentElement);
        continue;
      }

      const previousPrecedence = operatorPrecedence[previousOperator.operation];

      if (currentPrecedence > previousPrecedence) {
        stack.push(currentElement);
      } else {
        while (
          stack.length &&
          stack[stack.length - 1].type !== 'OpeningParenthesesToken'
        ) {
          const element = stack.pop();
          // @ts-expect-error Given the above, we know for sure that this is not an opening parenthesis.
          output.push(element);
        }
        stack.push(currentElement);
      }
    } else if (currentElement.type === 'OpeningParenthesesToken') {
      stack.push(currentElement);
    } else {
      let removedElement = stack.pop();

      if (!removedElement) {
        throw new Error('Invalid parentheses');
      }

      while (removedElement.type !== 'OpeningParenthesesToken') {
        output.push(removedElement);
        removedElement = stack.pop();
      }
    }
  }
  const stackLength = stack.length;
  for (let j = 0; j < stackLength; j++) {
    const element = stack.pop();
    if (element.type !== 'OpeningParenthesesToken') {
      output.push(element);
    }
  }

  return output;
};

const reversePolishNotation = (
  array: Array<
    Exclude<Token, OpeningParenthesesToken | ClosingParenthesesToken>
  >
) => {
  const stack: Array<number> = [];

  for (let i = 0; i < array.length; i++) {
    const currentElement = array[i];

    if (currentElement.type === 'NumberToken') {
      stack.push(currentElement.value);
    } else {
      const rightElement = stack.pop();
      const leftElement = stack.pop();

      if (currentElement.operation === '*') {
        stack.push(leftElement * rightElement);
      } else if (currentElement.operation === '/') {
        stack.push(leftElement / rightElement);
      } else if (currentElement.operation === '+') {
        stack.push(leftElement + rightElement);
      } else {
        stack.push(leftElement - rightElement);
      }
    }
  }

  return stack.pop();
};

const calculate = (string: string): number => {
  const tokensArray = tokenGenerator(string);
  const parsedArray = shuntingYard(tokensArray);
  const result = reversePolishNotation(parsedArray);
  return Number(result);
};

export default calculate;
