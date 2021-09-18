interface BinaryOperationToken {
  type: 'BinaryOperationToken';
  operation: '+' | '-' | '*' | '/';
}

interface ClosingParenthesis {
  type: 'ClosingParenthesis';
  value: ')';
}

interface NumberToken {
  type: 'NumberToken';
  value: number;
}

interface OpeningParenthesis {
  type: 'OpeningParenthesis';
  value: '(';
}

type NumberOrBinaryOperationToken = NumberToken | BinaryOperationToken;

type Token =
  | BinaryOperationToken
  | NumberToken
  | OpeningParenthesis
  | ClosingParenthesis;

const OPERATORS = new Set(['+', '-', '*', '/']);

const operatorPrecedence = {
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1,
};

const VALID_CHARACTERS = new Set(['+', '/', '-', '*', '.', '(', ')']);

for (let i = 0; i < 10; i++) {
  // dynamically generate the numbers 0-9 and add it to VALID_CHARACTERS to conserve space
  VALID_CHARACTERS.add(String(i));
}

const isOperator = (element: string) => OPERATORS.has(element);
const isNumber = (element: string) => /^-?\d+$/.test(element);

// This function is important to determine if two consecutive operators are valid (e.g. "2 + - 2") or invalid (e.g. "2 - /")
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

const eliminateSpaces = (string: string): string => string.replace(/\s/g, '');

const hasValidCharacters = (string: string): boolean =>
  string.split('').every((character) => VALID_CHARACTERS.has(character));

const generateTokenForExpression = (string: string): Array<Token> => {
  const trimmedString = eliminateSpaces(string);

  if (!hasValidCharacters(trimmedString)) throw 'Invalid input';
  if (hasConsecutiveOperators(trimmedString)) throw 'Syntax error';

  const tokenArray = [];

  let numberAccumulator = '';
  let numberIsNegative = false;

  const generateNumberToken = (value: string): NumberToken => ({
    type: 'NumberToken',
    value: numberIsNegative
      ? Number(numberAccumulator) * -1
      : Number(numberAccumulator),
  });

  const addNumberToken = (token: NumberToken) => {
    tokenArray.push(token);
    numberAccumulator = '';
    numberIsNegative = false;
  };

  for (let i = 0; i < trimmedString.length; i++) {
    const current = trimmedString[i];
    const previous = trimmedString[i - 1];

    /*
    IF current is a number or "."
    ELSE IF current is "-" sign and is the first element
    ELSE IF current is an operator
      IF numberAccumulator is empty
      IF current is "-" and the element before it was an operator
      ELSE current is just an operator
    ELSE IF current is "("
    ELSE IF current is a number or ")"
    */

    if (isNumber(current) || current === '.') {
      numberAccumulator += current;
    } else if (current === '-' && i === 0) {
      numberIsNegative = true;
    } else if (isOperator(current)) {
      if (numberAccumulator !== '') {
        const token = generateNumberToken(numberAccumulator);
        addNumberToken(token);
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
        type: 'OpeningParenthesis',
        value: '(',
      });
    } else {
      const token = generateNumberToken(numberAccumulator);
      addNumberToken(token);
      tokenArray.push({
        type: 'ClosingParenthesis',
        value: ')',
      });
    }
  }

  if (numberAccumulator !== '') {
    const token = generateNumberToken(numberAccumulator);
    tokenArray.push(token);
  }

  return tokenArray;
};

// This is an implementation of the Shunting-Yard algorithm.
const transformTokensToReversePolishNotation = (
  tokenArray: Array<Token>,
): Array<NumberOrBinaryOperationToken> => {
  const stack: Array<BinaryOperationToken | OpeningParenthesis> = [];
  const output: NumberOrBinaryOperationToken[] = [];

  for (let i = 0; i < tokenArray.length; i++) {
    const currentElement = tokenArray[i];

    switch (currentElement.type) {
      case 'NumberToken': {
        output.push(currentElement);
        break;
      }
      case 'BinaryOperationToken': {
        currentElement;
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

        const previousPrecedence =
          operatorPrecedence[previousOperator.operation];

        if (currentPrecedence > previousPrecedence) {
          stack.push(currentElement);
        } else {
          while (
            stack.length &&
            stack[stack.length - 1].type !== 'OpeningParenthesis'
          ) {
            const element = stack.pop();
            // @ts-expect-error Given the above, we know for sure that this is not an opening parenthesis.
            output.push(element);
          }
          stack.push(currentElement);
        }
        break;
      }
      case 'OpeningParenthesis': {
        stack.push(currentElement);
        break;
      }
      case 'ClosingParenthesis': {
        let removedElement = stack.pop();

        if (!removedElement) {
          throw new Error('Invalid parentheses');
        }

        while (removedElement.type !== 'OpeningParenthesis') {
          output.push(removedElement);
          removedElement = stack.pop();
        }
        break;
      }
    }
  }

  while (
    stack.length &&
    stack[stack.length - 1].type !== 'OpeningParenthesis'
  ) {
    const element = stack.pop();
    // Given the above condition, we know that the element is an opening
    // parenthesis, but TypeScript is not aware. The following condition exists
    // solely for TypeScript to be aware.
    /* istanbul ignore next */
    if (element.type !== 'OpeningParenthesis') {
      output.push(element);
    }
  }

  return output;
};

const performOperation = (currentElement, leftElement, rightElement, stack) => {
  if (currentElement.operation === '*') {
    stack.push(leftElement * rightElement);
  } else if (currentElement.operation === '/') {
    stack.push(leftElement / rightElement);
  } else if (currentElement.operation === '+') {
    stack.push(leftElement + rightElement);
  } else {
    stack.push(leftElement - rightElement);
  }
};

const evaluateReversePolishNotation = (
  array: Array<Exclude<Token, OpeningParenthesis | ClosingParenthesis>>,
) => {
  const stack: Array<number> = [];

  for (let i = 0; i < array.length; i++) {
    const currentElement = array[i];

    if (currentElement.type === 'NumberToken') {
      stack.push(currentElement.value);
    } else {
      const rightElement = stack.pop();
      const leftElement = stack.pop();

      performOperation(currentElement, leftElement, rightElement, stack);
    }
  }

  return stack.pop();
};

const calculate = (string: string): number => {
  const tokenizedExpression = generateTokenForExpression(string);
  const reversePolishNotationExpression =
    transformTokensToReversePolishNotation(tokenizedExpression);
  const result = evaluateReversePolishNotation(reversePolishNotationExpression);
  return Number(result);
};

export default calculate;
