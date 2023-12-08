import { printSolution, readFile, max} from "./aoc.ts";

type Game  = {
  hand: string;
  bet: number;
  type: number;
}

const parseInput = (input: string): Game[] => input.split("\n").map(line => {
  const [hand, bet] = line.split(" ");
  return {hand, bet: Number(bet), type: 0};
});

const typeOfHandPart1 = (game: Game): Game => {
  const hand = game.hand;
  const result = Object.values(hand.split("").reduce((prev, curr) => ({
      ...prev,
      [curr]: (prev[curr] ?? 0) + 1,
    }), {}));

  let typeNr = 0;
  const maxNr = max(result);
  if (maxNr === 5 || maxNr === 4) typeNr = maxNr + 1;
  if (maxNr === 3) typeNr = 3;
  if (maxNr === 3 && result.includes(2)) typeNr = 4;
  if (maxNr === 2) typeNr = 1;
  if (maxNr === 2 && result.filter(v => v===2).length === 2) typeNr = 2;
  return {...game, type: typeNr};
}

const compareHands = (a: string, b: string, ranks: string): -1 | 1 | 0 => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    const ia = ranks.indexOf(a[i]);
    const ib = ranks.indexOf(b[i]);
    if (ia > ib) return 1;
    if (ia < ib) return -1;
  }
  return 0;
}

const compareGame = (a: Game, b: Game, ranks: string) => {
  if (a.type > b.type) return 1;
  if (a.type < b.type) return -1;
  
  // We need to check more cases here!!
  return compareHands(a.hand, b.hand, ranks);
}

const part1 = (input: string) => {
  return parseInput(input)
  .map(typeOfHandPart1)
  .sort((a, b) => compareGame(a, b, "23456789TJQKA"))
  .reduce((prev, curr, i) => prev + curr.bet * (i+1), 0);
}

const typeOfHandPart2 = (game: Game): Game => {
  const hand = game.hand;
  const partialResult: {[key: string]: number} = hand
    .split("")
    .reduce((prev, curr) => ({
      ...prev,
      [curr]: (prev[curr] ?? 0 ) + 1,
    }), {});


  if (("J" in partialResult) && partialResult.J !== 5) {
    // Add all J's to the highest number
    let count = partialResult.J;
    delete partialResult.J;
    let highestKey = "";
    let v = 0;
    for (let key in partialResult) {
      if (v < partialResult[key]) {
        v = partialResult[key];
        highestKey = key;
      }
    }
    partialResult[highestKey] += count;
  }

  const result = Object.values(partialResult);
  let typeNr = 0;
  if (result.includes(5)) typeNr =  6;
  else if (result.includes(4)) typeNr =  5;
  else if (result.includes(2) && result.includes(3)) typeNr = 4;
  else if (result.includes(3)) typeNr =  3;
  else {
    const firstPair = result.findIndex(v => v === 2);
    if (result.includes(2, firstPair+1)) {
      typeNr = 2;
    }
    else if (firstPair !== -1) typeNr = 1;
  }

  return {...game, type: typeNr};
}

const part2 = (input: string) => {
  return parseInput(input)
    .map(typeOfHandPart2)
    .sort((a, b) => compareGame(a, b, "J23456789TQKA"))
    .reduce((prev, curr, i) => prev + curr.bet * (i+1), 0);
}

const input = await readFile("input/day7.txt");
printSolution(part1(input), part2(input));
