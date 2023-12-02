import { readFile, printSolution } from "./aoc.ts";

const part1 = (input: string) => {
    return input.split("\n").map((s: string) => {
        const isDigit = (x: string) => /^\d$/.test(x);
        const first = s.split('').find(isDigit);
        const last = s.split('').findLast(isDigit);

        return first + last;
    }).reduce((prev, curr) => prev + Number.parseInt(curr), 0);
}

const part2 = (input: string) => part1(
    input
    // If we replace one with "1" we might no longer
    // correctly parse "oneeight" since this would be
    // replaced into "1ight" instead of "18". This was
    // never mentioned in the examples or the corresponding
    // text and seems like an oversight from Eric since this
    // makes the puzzle much harder (maybe too hard for day 1?).
    .replaceAll("one", "o1e")
    .replaceAll("two", "t2o")
    .replaceAll("three", "t3e")
    .replaceAll("four", "f4r")
    .replaceAll("five", "f5e")
    .replaceAll("six", "s6x")
    .replaceAll("seven", "s7n")
    .replaceAll("eight", "e8t")
    .replaceAll("nine", "n9e")
);

const input = await readFile("input/day1.txt");
printSolution(part1(input), part2(input));
