import { printSolution, readFile, lcm } from "./aoc.ts";

type Node = {
  left: string;
  right: string;
}

type Mapping = {
  instructions: string;
  map: Map<string, Node>;
  startingKeys: string[];
}

const buildMapping = (input: string): Mapping => {
  const map: Map<string, Node> = new Map();
  const startingKeys: string[] = [];
  const [instructions, mapping] = input
    .split("\n\n")
    .map(s => s.trim());
  
  mapping
    .split("\n")
    .forEach(ins => {
      const [key, node] = ins.split(" = ");
      const [left, right] = node.match(/(\w+)/gi);
      map.set(key, {left, right});
      if (key.endsWith("A")) startingKeys.push(key);
    });

    return {instructions, map, startingKeys};
}

const part1 = (input: string) => {
  const {instructions, map} = buildMapping(input);
  let pathLength = 0;
  let lookup = "AAA";
  while (lookup !== "ZZZ") {
    const d = instructions.at(pathLength % instructions.length) === "L" ? "left" : "right";
    lookup = map.get(lookup)[d];
    pathLength++;
  }

  return pathLength;
}




const part2 = (input: string) => {
  const {instructions, map, startingKeys} = buildMapping(input);
  
  const pathLength = (instructions: string, map: Map<string, Node>) => (key: string) => {
    let lookup = key;
    let pathLength = 0;
    while (! lookup.endsWith("Z")) {
      const d = instructions.at(pathLength % instructions.length) === "L" ? "left" : "right";
      lookup = map.get(lookup)[d];
      pathLength++;
    }

    return pathLength;
  }
  

  return startingKeys
    .map(pathLength(instructions, map))
    .reduce(lcm, 1);
}

const input = await readFile("input/day8.txt");
printSolution(part1(input), part2(input));
