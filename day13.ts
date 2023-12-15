import { printSolution, readFile, transpose, sum } from "./aoc.ts";

type Pattern = string;
type PossiblePattern = {index: number, diffRemaining: number};

/**
 * Finds the difference between two strings.
 * 
 * Returns the difference as a number.
 */
const findDiff = (s1: string | undefined, s2: string | undefined): number => {
  // The difference between two strings when either one of them is undefined is
  // very large :P
  if (!s2 || !s1) return Number.POSITIVE_INFINITY;

  return s2.split('').reduce((p, c, i) => {
    if (c !== s1[i]) return p+1;
    return p;
  }, 0)
}

const findPossibleMirrors = (patterns: Pattern[], neededDifference: number): PossiblePattern[] => {
  return patterns.map((pattern, index, allPatterns) => {
    const diff = findDiff(pattern, allPatterns[index+1]);
    return (diff <= neededDifference) ? {index: index, diffRemaining: neededDifference - diff} : {index: -1, diffRemaining: -1};
  }).filter(p => p.diffRemaining >= 0);
}

/**
 * Finds a mirror in a list of patterns.
 * 
 * First checks for possible mirrors by simply comparing two lines.
 * Then uses the list of possible mirrors to see if there is an
 * actual mirror (ie. check if all other lines are mirrored).
 * 
 * Has a neededDifference which indicates the number of smudges that
 * can exist in a list of patterns. For part 1: this is 0. For part 2
 * this is 1.
 * 
 * By enforcing that the neededDifference is 0 at the end we make sure
 * that we don't count the mirrors from part 1 in part 2.
 */
const findMirror = (patterns: Pattern[], neededDifference: number): number | undefined => {
  const possibleMirrors: PossiblePattern[] = findPossibleMirrors(patterns, neededDifference);

  return possibleMirrors.find(({index, diffRemaining}) => {
    // A first or last line is only valid as mirror if there is no diff remaining
    if (index === 0 || index === patterns.length - 1) return diffRemaining === 0;
    let l = index-1;
    let r = index+2;
    while (l >= 0 && r < patterns.length && diffRemaining >= 0) {
      diffRemaining -= findDiff(patterns[l], patterns[r]);
      l--;
      r++;
    }
    return diffRemaining === 0;
  })?.index;
}

const calculateValue = (p: string[], allowedDifference: number): number => {
  // Check if there is a horizontal mirror (ie: a mirror in a row)
  const horizontalMirror = findMirror(p, allowedDifference);
  if (horizontalMirror !== undefined) return (horizontalMirror + 1) * 100;

  // Check if there is a vertical mirror (ie. a mirror in a column)
  const verticalMirror = findMirror(transpose(p.map(l => l.split(""))).map(l => l.join("")), allowedDifference)
  if (verticalMirror !== undefined) return verticalMirror + 1;
  
  return 0;
}

const part1 = (input: string) => {
  return sum(input.split("\n\n")
    .map(l => l.split("\n"))
    .map(p => calculateValue(p, 0)));
}


// Idea: also allow a smudge in the calculateValue function.
// This function enforces that the smudge has been found.
// I.e. a valid line must have no diffRemaining.
// This invalidates all the mirrors found in part1 automatically.
const part2 = (input: string) => {
  return sum(input.split("\n\n")
    .map(l => l.split("\n"))
    .map(p => calculateValue(p, 1)))
}

const input = await readFile("input/day13.txt");
printSolution(part1(input), part2(input));