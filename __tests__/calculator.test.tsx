import calculator from '../stringCalculator';

describe('calculator works with valid inputs', () => {
  it('returns the correct value when passed the simplest expression', () => {
    expect(calculator('1')).toBe(1);
  });

  it('returns the correct value when passed simple equations with two numbers', () => {
    expect(calculator('2 + 2')).toBe(4);
  });

  it('returns the correct value when passed equations with negative numbers', () => {
    expect(calculator('(2 + -2)')).toBe(0);
  });

  it('does not throw an error when the second operators is "-" are passed in', () => {
    expect(() => {
      calculator('4 * -2');
    }).not.toThrow();
  });

  it('does not throw an error when two consecutive "-" operators are passed in', () => {
    expect(() => {
      calculator('-5+-8--11*2');
    }).not.toThrow();
  });

  it('returns the correct value when passed more complex equations without parentheses', () => {
    expect(calculator('4*5/2')).toBe(10);
  });

  it('returns the correct value when passed longer more complex equations without parentheses', () => {
    expect(calculator('5 + 3 * 6 - 5 / 3  + 7')).toBe(28.333333333333332);
  });

  it('returns the correct value when passed more complex equations with excessive spaces', () => {
    expect(calculator('4*        5/2')).toBe(10);
  });

  it('returns the correct value when passed equations with parentheses', () => {
    expect(calculator('(4-2)*3.5')).toBe(7);
  });

  it('returns the correct value when passed matching nested parentheses', () => {
    expect(calculator('(4-2)*3.5')).toBe(7);
  });

  it('returns the correct value when passed value starting with .', () => {
    expect(calculator('.5 + .5')).toBe(1);
  });

  it('returns the correct value when the initial value starts with a negative', () => {
    expect(calculator('-5 + 5')).toBe(0);
  });

  it('returns the correct value when the initial value starts with a decimal', () => {
    expect(calculator('-.32       /.5')).toBe(-0.64);
  });

  it('returns the correct value when the initial value starts with a negative', () => {
    expect(calculator('-5+-8--11*2')).toBe(9);
  });
});

describe('calculator throws errors when given invalid inputs', () => {
  it('throws the correct error when a non-number is passed in', () => {
    expect(() => {
      calculator('19 + cinnamon');
    }).toThrow('Invalid input');
  });

  it('throws the correct error when 2 invalid consecutive operators are passed in', () => {
    expect(() => {
      calculator('2+-+-4');
    }).toThrow('Syntax error');
  });

  it('throws the correct error when 3+ consecutive operators are passed in', () => {
    expect(() => {
      calculator('5+*-4 * 2');
    }).toThrow('Syntax error');
  });

  it('throws the correct error when too many ending parentheses are passed in', () => {
    expect(() => {
      calculator('(5 + 4)) / 2');
    }).toThrow('Invalid parentheses');
  });

  // it('throws the correct error too many opening parentheses are passed in', () => {
  //   expect(() => {
  //     calculator('(((5 + 4)) / 2');
  //   }).toThrow('Invalid parentheses');
  // });
});
