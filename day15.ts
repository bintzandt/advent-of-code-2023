import { printSolution, readFile, sum } from "./aoc.ts";

type Operation = "-" | "=";

type Step = {
  op: Operation,
  label: string,
  focal?: number,
}

type Lens = {
  label: string,
  focal: number,
};

type LensMap = Map<number, Lens[]>

const hash = (s: string): number => {
  return s.split("").reduce((prev, curr) => {
    const c = curr.charCodeAt(0);
    return ((prev + c) * 17) % 256
  }, 0);
}

const part1 = (input: string) => {
  const result = input.split(',');
  return sum(result.map(hash))
}

const performStep = (map: LensMap, s: Step): LensMap => {
  const n = hash(s.label);
  const box = map.get(n);

  // Remove lens with s.label from the box
  if (s.op === "-") {
    // If the box does not exist yet, do nothing.
    if (box === undefined) return map;

    const i = box.findIndex(l => l.label === s.label);

    // If there is no lens with the correct label, do nothing.
    if (i === -1) return map;

    // Remove the lens from the list
    map.set(n, box.slice(0, i).concat(box.slice(i+1)));
    return map;
  }

  // Put lens with focal length in the box
  if (s.op === "=") {
    if (box === undefined) {
      map.set(n, [{label: s.label, focal: s.focal!}]);
      return map;
    }

    const i = box.findIndex(l => l.label === s.label);

    // If there is no lens with a matching label, add it
    if (i === -1) {
      map.set(n, [
        ...box,
        {label: s.label, focal: s.focal!}
      ]);
      return map;
    }

    // Replace the existing lens
    map.set(n, box.map((l: Lens): Lens => l.label !== s.label ? l : ({label: s.label, focal: s.focal!})))
    return map;
  }

  return map;
}

/**
 * Parses a string as a Step.
 */
const parseStep = (l: string): Step => {
  const [label, op, focal] = l.split(/(=|-)/);
  return {
    op: op as Operation,
    label,
    focal: op === "=" ? Number(focal) : undefined,
  };
}

/**
 * Calculates the focusing power of a box.
 */
const focusingPowerOfBox = ([boxNr, box]: [number, Lens[]]) => {
  return box.reduce((prev, l, i) => prev + (1+boxNr) * (i+1) * l.focal, 0)
}

const part2 = (input: string) => {
  const finalBoxes = input
    .split(',')
    .map(parseStep)
    .reduce(performStep, new Map<number, Lens[]>())

  return sum(Array.from(finalBoxes.entries()).map(focusingPowerOfBox));
}

const input = await readFile("input/day15.txt");
printSolution(part1(input), part2(input));