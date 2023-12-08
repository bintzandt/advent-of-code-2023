import { printSolution, readFile, sum } from "./aoc.ts";

/**
 * Function to parse a line from the input.
 * 
 * Returns the number of winning tickets for a line.
 */
const parseLine = (l: string) => {
  const [winning, mine] = l.split("|");
  const [_, numbers] = winning.split(":");
  const parsedWinningNumbers = numbers.trim().split(" ").map(n => parseInt(n.trim())).filter(Boolean);
  const parsedMyNumbers = mine.trim().split(" ").map(n => parseInt(n.trim())).filter(Boolean);

  return parsedWinningNumbers
    .filter(n => parsedMyNumbers.includes(n))
    .length;
}

const part1 = (input: string) => {
  return sum(
    input
    .split("\n")
    .map(parseLine)
    .map(numberOfWinningNumbers => numberOfWinningNumbers === 0 ? 0 : Math.pow(2, numberOfWinningNumbers-1))
  );
};

const part2 = (input: string) => {
  return sum(input
    .split("\n")
    .map(parseLine)
    // Items at the bottom never give more results
    .reverse()
    .reduce((prev: number[], numberOfWinningNumbers: number) => {
      // If there are no winning numbers, it is just this ticket.
      if (numberOfWinningNumbers === 0) {
        return [...prev, 1];
      }

      // Otherwise, use 1 (for this ticket) and the result of numberOfWinningNumbers previous tickets
      // As the result for this ticket.
      return [
        ...prev,
        1 + prev.slice(-numberOfWinningNumbers).reduce((prev, numberOfWinningNumbers) => prev + numberOfWinningNumbers, 0)
      ];
    }, []))
}

const input = await readFile("input/day4.txt");
printSolution(part1(input), part2(input));
