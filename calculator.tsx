import * as React from 'react';

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

calculate("1 + 2") => 3
calculate("4*5/2") => 10
calculate(-5+-8--11*2) => 9
calculate(-.32       /.5) => -0.64
calculate((4-2)*3.5) => 7
calculate(2+-+-4) => Syntax Error (or similar)
calculate(19 + cinnamon) => Invalid Input (or similar)
*/

const calculate = React.memo(() => {});

export default calculate;
