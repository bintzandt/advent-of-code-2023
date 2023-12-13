import { printSolution, readFile, sum, combinations, repeat, transpose } from "./aoc.ts";

type Node = {x: number, y: number, value: string}

const distance = ([f, t]: Node[]) => Math.abs(f.x - t.x) + Math.abs(f.y - t.y);

const expandLine = (l: string[]): string[][] => {
  return l.every( v => v === "." ) ? repeat(l, 2) : [l];
}

const expand = (i: string[][]): string[][] => {
  const doubleHorizontal = i.flatMap(l => expandLine(l));
  return transpose(doubleHorizontal)
    .flatMap(l => expandLine(l));
}

const sumOfLengthOfPathsBetweenStars = (i: string[][]) => {
  const nodes: Node[] = [];
  i.forEach((l, y) => {
      l.forEach((v, x) => {
        nodes.push({x, y, value: v});
      })
    })
  const stars = nodes.filter(n => n.value === "#");
  const pairs = combinations(stars);
  return sum(pairs.map(distance));
}

const part1 = (input: string[][]) => sumOfLengthOfPathsBetweenStars(expand(input));

/**
 * Idea for part2: instead of calculating the distances with the
 * actual expansion, notice that the growth is linear. I.e. the
 * growth per expansion step is the same. Using this fact, we
 * can calculate the growth using the non-expanded galaxy and a
 * galaxy where the space has been doubled. Once we have the
 * growth, we can calculate the expansion for any given number
 * by summing up the base length (the sum of lengths of all paths
 * at expansion 0) and (growth * (expansion - 1)).
 */
const part2 = (input: string[][]) => {
  const sumBase = sumOfLengthOfPathsBetweenStars(input);
  const sumDoubled = sumOfLengthOfPathsBetweenStars(expand(input));
  const growth = sumDoubled - sumBase;

  return sumBase + (growth * (1_000_000 - 1));
}

const input = await readFile("input/day11.txt");
const preparedInput = input.split("\n").map(l => l.split(""));
printSolution(part1(preparedInput), part2(preparedInput));