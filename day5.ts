import { printSolution, readFile } from "./aoc.ts";

class Range {
  destinationStart: number;
  sourceStart: number;
  length: number;

  constructor(destination: number, source: number, lenght: number) {
      this.destinationStart = destination;
      this.sourceStart = source;
      this.length = lenght;
  }

  public inRange = (source: number): boolean  => {
    return source >= this.sourceStart && source < this.sourceStart + this.length;
  }

  public convert = (source: number): number => {
    if (this.inRange(source)) {
      return this.destinationStart + (source - this.sourceStart);
    }

    return source;
  }

  public inReverseRange = (dest:number): boolean => {
    return dest >= this.destinationStart && dest < this.destinationStart + this.length;
  }

  public reverse = (dest: number): number => {
    if (this.inReverseRange(dest)) {
      return dest - this.destinationStart + this.sourceStart;
    }

    return dest;
  }
}

type AlmanacMap = {
  from: string;
  to: string;
  ranges: Range[];
}

const parseSeeds = (seedList: string): number[] => {
  return seedList.split(":")[1].trim().split(" ").map(Number);
}

const parseMapString = (mapString: string): AlmanacMap => {
  const [name, map] = mapString.split(":");
  const [from, _, to] = name.split("-")
  const ranges = map.split("\n").filter(Boolean).map(line => {
    const [dest, source, length] = line.split(" ").map(Number);

    return new Range(dest, source, length);
  });
  return {from, to: to.split(" ")[0], ranges};
}

const getMap = (mapStrings: string[]): Map<string, AlmanacMap> => {
  const map = new Map<string, AlmanacMap>();
  mapStrings
    .filter(Boolean)
    .map(parseMapString)
    .forEach(m => map.set(m.from, m));
  return map;
}

const splitInput = (input: string) => {
  return input.split(/(\w+-to-\w+ map:[\d\s]+)/gi);
}

const seedToLocation = (seed: number, map: Map<string, AlmanacMap>): number => {
  const path = ["seed", "soil", "fertilizer", "water", "light", "temperature", "humidity"];

  return path.reduce((prev: number, curr: string) => {
    return map.get(curr)?.ranges.find(r => r.inRange(prev))?.convert(prev) ?? prev
  }, seed);
}

const part1 = (input: string) => {
  const [seedString, ...mapStrings] = splitInput(input);
 
  const seeds = parseSeeds(seedString);
  const map = getMap(mapStrings);

  return seeds
    .map(sn => seedToLocation(sn, map))
    .reduce((prev: number, curr: number) => Math.min(prev, curr), Number.POSITIVE_INFINITY);
}

type SeedRange = {
  from: number;
  to: number;
}

// Parses a seedListString into a list of SeedRanges.
const parseSeedRange = (seedList: string): SeedRange[] => {
  return seedList.split(":")[1].trim().split(/(\d+ \d+)/)
      .filter(s => s && s !== " ")
      .map(s => {
        const [from, length] = s.split(" ").map(Number);
        return {from, to: from+length};
      });
}

// Maps a location number to a seed.
const locationToSeed = (location: number, map: Map<string, AlmanacMap>): number => {
  const path = ["seed", "soil", "fertilizer", "water", "light", "temperature", "humidity"].reverse();

  return path.reduce((prev: number, curr: string) => {
    return map.get(curr)?.ranges.find(r => r.inReverseRange(prev))?.reverse(prev) ?? prev
  }, location);
}

const part2 = (input: string) => {
  const [seedString, ...mapStrings] = splitInput(input);
  
  const seeds = parseSeedRange(seedString);
  const map = getMap(mapStrings);

  // We can abuse the fact that we are looking for the nearest location.
  //
  // So lets start at the smallest possible location and check if there
  // is a seed for that. If not, look at the next smallest location.
  //
  // This still takes some time to run, but it is probably a lot less than
  // calculating the location for every seed in the seed ranges since we can
  // stop at the first location that matches a seed because it is guaranteed
  // to be the smallest location.
  for (let i = 0; i < 1_000_000_000; i++) {
    const seed = locationToSeed(i, map);

    // Check if this is an actual seed
    if (seeds.some(sn => sn.from <= seed && sn.to > seed)) {
      // Found it!!
      return i;
    }
  }
}

const input = await readFile("input/day5.txt");
printSolution(part1(input), part2(input));
