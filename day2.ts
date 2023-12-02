import { printSolution, readFile } from "./aoc.ts";

type Set = {
  red: number;
  blue: number;
  green: number;
};

type Game = {
  id: number;
  sets: Set[];
};

const parseGame = (game: string): Game => {
  // The game id is seperated from the sets with a colon.
  const splitted = game.split(":");
  const id = Number.parseInt(splitted[0].split(" ")[1]);

  // Each set in a game is seperated by a semicolon
  return { id, sets: splitted[1].split(";").map(parseSet) };
};

const parseSet = (set: string): Set => {
  // We can use 0 as a default since 0 is always smaller than the maximum.
  const parsedSet: Set = {
    red: 0,
    blue: 0,
    green: 0,
  };
  const parts = set.split(",");
  parts.forEach((part: string) => {
    const [count, color] = part.trim().split(" ");
    parsedSet[color] = Number.parseInt(count);
  });

  return parsedSet;
};

const part1 = (input: string) => {
  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  return input
    .split("\n")
    // Map into games.
    .map(parseGame)
    // Filter the games to check that every set in the game
    // adheres to the maximum requirements.
    .filter((game) =>
      game.sets.every((set) =>
        set.blue <= MAX_BLUE &&
        set.red <= MAX_RED &&
        set.green <= MAX_GREEN
      )
    )
    // Calculate the sum.
    .reduce((prev, curr) => prev + curr.id, 0);
};

const part2 = (input: string) => {
  return input
    .split("\n")
    // Map into games
    .map(parseGame)
    // Map each game into a set which contains the maximum value for
    // each color that is at least needed to play that game.
    .map((game: Game) =>
      game.sets.reduce(
        (prev, curr) => ({
          red: Math.max(prev.red, curr.red),
          green: Math.max(prev.green, curr.green),
          blue: Math.max(prev.blue, curr.blue),
        }),
        { red: 0, blue: 0, green: 0 },
      )
    )
    // Map the set into the product of the needed colors.
    .map((set) => set.blue * set.green * set.red)
    // Calculate the sum of the list.
    .reduce((prev, curr) => prev + curr, 0);
};

const input = await readFile("input/day2.txt");
printSolution(part1(input), part2(input));
