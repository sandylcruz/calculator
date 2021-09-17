import calculate from '../';

describe('does not throw an error when', () => {
  it('is passed a second operator that is "-"', () => {
    expect(() => {
      calculate('4 * -2');
    }).not.toThrow();
  });

  it('is passed two consecutive "-" operators', () => {
    expect(() => {
      calculate('-5+-8--11*2');
    }).not.toThrow();
  });
});

describe('returns the correct value when', () => {
  it('is passed the simplest expression', () => {
    expect(calculate('1')).toBe(1);
  });

  it('is passed simple equations with two numbers', () => {
    expect(calculate('2 + 2')).toBe(4);
  });

  it('is passed equations with negative numbers', () => {
    expect(calculate('(2 + -2)')).toBe(0);
  });

  it('is passed more complex equations without parentheses', () => {
    expect(calculate('4*5/2')).toBe(10);
  });

  it('is passed longer more complex equations without parentheses', () => {
    expect(calculate('5 + 3 * 6 - 5 / 3  + 7')).toBe(28.333333333333332);
  });

  it('is passed more complex equations with excessive spaces', () => {
    expect(calculate('4*        5/2')).toBe(10);
  });

  it('is passed equations with parentheses', () => {
    expect(calculate('(4-2)*3.5')).toBe(7);
  });

  it('is passed matching nested parentheses', () => {
    expect(calculate('(4-2)*3.5')).toBe(7);
  });

  it('is passed value starting with .', () => {
    expect(calculate('.5 + .5')).toBe(1);
  });

  it('is passed an initial value that starts with a negative', () => {
    expect(calculate('-5 + 5')).toBe(0);
  });

  it('is passed an initial value that starts with a decimal', () => {
    expect(calculate('-.32       /.5')).toBe(-0.64);
  });

  it('is passed an initial value starts with a negative', () => {
    expect(calculate('-5+-8--11*2')).toBe(9);
  });
});

describe('returns errors when', () => {
  it('is passed a non-number', () => {
    expect(() => {
      calculate('19 + cinnamon');
    }).toThrow('Invalid input');
  });

  it('is passed 2 invalid consecutive operators', () => {
    expect(() => {
      calculate('2+-+-4');
    }).toThrow('Syntax error');
  });

  it('is passed  3+ consecutive operators', () => {
    expect(() => {
      calculate('5+*-4 * 2');
    }).toThrow('Syntax error');
  });

  it('is passed too many parentheses', () => {
    expect(() => {
      calculate('(5 + 4)) / 2');
    }).toThrow('Invalid parentheses');
  });
});
