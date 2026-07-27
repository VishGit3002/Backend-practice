import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import chalk from "chalk";

const rl = readline.createInterface({ input, output });

function add(a: number, b: number): number {
  return a + b;
}
function subtract(a: number, b: number): number {
  return a - b;
}
function multiply(a: number, b: number): number {
  return a * b;
}
function power(a: number, b: number): number {
  return a ** b;
}
function divide(a: number, b: number): number | null {
  if (b === 0) {
    return null;
  }
  return a / b;
}

type OperationFn = (a: number, b: number) => number | null;

const operations: Record<number, OperationFn> = {
  1: add,
  2: subtract,
  3: multiply,
  4: power,
  5: divide,
};

function calculate(
  operation: number,
  a: number,
  b: number,
): number | null | undefined {
  const operationFn = operations[operation];
  return operationFn(a, b);
}

const calculator = async function (): Promise<void> {
  let operation: number | null = null;

  while (true) {
    console.log(chalk.green("=============Calculator============="));
    console.log(
      "1. Add\n2. Subtract\n3. Multiply\n4. Power\n5. Divide\n6. Exit",
    );
    operation = Number(await rl.question(chalk.blue("Choose operation: ")));

    if (operation === 6) {
      console.log(chalk.green("Exiting Calculator..."));
      return;
    }

    if (
      operation === 1 ||
      operation === 2 ||
      operation === 3 ||
      operation === 4 ||
      operation === 5
    ) {
      const a = Number(
        await rl.question(chalk.blue("Enter the First input: ")),
      );
      const b = Number(
        await rl.question(chalk.blue("Enter the Second input: ")),
      );

      if (Number.isNaN(a) || Number.isNaN(b)) {
        console.log(chalk.red("Invalid input. Please try again."));
        continue;
      }

      const result = calculate(operation, a, b);

      if (result === null) {
        console.log(chalk.bold.red(" Division by zero is not allowed "));
      } else {
        console.log(chalk.green(`The result is: ${result}`));
      }

      const restart = (
        await rl.question(chalk.blue("Do you want to continue? (y/n): "))
      ).toLowerCase();
      if (restart === "y") {
        continue;
      } else {
        break;
      }
    } else {
      console.log(chalk.red("Invalid option. Please try again."));
    }
  }
};

await calculator();

rl.close();
