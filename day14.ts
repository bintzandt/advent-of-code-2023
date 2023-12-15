import { printSolution, readFile, transpose, sum } from "./aoc.ts";

type Direction = "N" | "E" | "S" | "W"

type Platform = string[][];

const tiltRocksInDirection = (p: Platform, dir: Direction): Platform => {
  switch (dir) {
    case "N": return transpose(transpose(p).map(tiltRocksInLine));
    case "S": return transpose(transpose(p).map(l => tiltRocksInLine(l.reverse()).reverse()));
    case "E": return p.map(l => tiltRocksInLine(l.reverse()).reverse());
    case "W": return p.map(tiltRocksInLine);
  }
}

const cycle = (p: Platform): Platform => {
  const l: Direction[] = ["N", "W", "S", "E"];
  return l.reduce(
    (prev: Platform, curr: Direction) => tiltRocksInDirection(prev, curr), p
  );
};

const tiltRocksInLine = (l: string[]): string[] => {
  if (l.length === 0) return [];
  if (l.length === 1) return l;

  if (l[0] === "O") return [l[0]].concat(tiltRocksInLine(l.slice(1)));
  if (l[0] === "#") return [l[0]].concat(tiltRocksInLine(l.slice(1)));

  // l[0] is a dot...
  // Check what comes next:
  const next = l.findIndex(v => v !== ".");
  
  // Nothing interesting comes after this
  if (next === -1) return l;
  
  // It is a rock: continue from there
  if (l[next] === "#") return l.slice(0, next+1).concat(tiltRocksInLine(l.slice(next+1)));

  // It is a tilting rock: swap with l[0]
  return [l[next]].concat(tiltRocksInLine(l.slice(1, next).concat(["."], l.slice(next+1))))
}

const calculateLoadOnNorthBeams = (p: Platform) => {
  return sum(transpose(p).map(l => l.reverse().reduce((prev, curr, i) => {
    if (curr === "O") return prev + i + 1;
    return prev;
  }, 0)));
}

const part1 = (input: string) => {
  const parsed = input.split("\n").map(l => l.split(""));
  const tilted = tiltRocksInDirection(parsed, "N");
  return calculateLoadOnNorthBeams(tilted);
}


/**
 * Idea:
 * => Create a function for tilting a platform in a certain direction (tiltRocksInDirection)
 *    This function uses the tiltRocksInLine function designed for part 1.
 *    By transposing the input or reversing lines in the input, we can simulate different directions.
 *    Just make sure to reverse it back afterwards!
 * => Create a cycle function that executes one cycle of direction changes
 * => Since 1_000_000_000 is a very large number there must be something interesting in the input
 * => This probably is a cycle
 * => I use a loop that tries to simulate every cycle
 * => It keeps track of previous states
 * => If a match is found, we have found a cycle in the input data
 * => Use the list of states and the current i to find the final state
 */
const part2 = (input: string) => {
  let currentPlatform = input.split("\n").map(l => l.split(""));

  const numOfCycles = 1_000_000_000;
  const previousStates = [];
  previousStates.push(JSON.stringify(input));

  let i = 0;
  let startOfCycle = -1;

  for (i; i < numOfCycles; i ++){
    const nextPlatform = cycle(currentPlatform);

    const nextStringified = JSON.stringify(nextPlatform);

    if (previousStates.includes(nextStringified)){
      startOfCycle = previousStates.indexOf(nextStringified);
      break;
    }

    currentPlatform = nextPlatform;
    previousStates.push(nextStringified);
  }

  // Make a list of all platforms in the cycle
  const cycles = previousStates.slice(startOfCycle);

  // Calculate the cycle length
  const cLenght = cycles.length;

  // Calculate iterations remaining
  const remaining = numOfCycles - i;
  
  // Find the correct final cycle index based on the remaining iterations and the cycle length
  const final = cycles[(remaining % cLenght) - 1];
  
  return calculateLoadOnNorthBeams(JSON.parse(final));
}

const input = await readFile("input/day14.txt");
printSolution(part1(input), part2(input));