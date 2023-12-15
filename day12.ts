import { memoize, printSolution, readFile, repeat, sum } from "./aoc.ts";

type Row = {
  line: string,
  groups: number[],
}

const numberOfWays = memoize(({line, groups}: Row): number => {
  // Base case: EOL and no remaining groups => valid
  if (line.length === 0 && groups.length === 0) {
    return 1;
  }

  // Base case: EOL and remaining groups => invalid
  if (line.length === 0) return 0;

  // Base case: No remaining groups =>
  //    if all remaining chars are opertional: valid
  //    otherwise: invalid
  if (groups.length === 0) {
    for (const c of line) {
      if (c === "#") return 0;
    }

    return 1;
  }

  // Base case: the line of not long enough to fit all groups => invalid
  if (line.length < sum(groups) + groups.length -1) {
    return 0;
  }


  // Recursion case: operational => move to the next character
  if (line[0] === ".") return numberOfWays({line: line.slice(1), groups});

  
  // Recursion case: damaged =>
  //     if there is not enough space to fit the current group (ie. is an operational spring)
  //        withing the current group size: invalid
  //     if there is another damaged spring after the current group (line[currentGroup]): invalid
  //     otherwise: continue checking this line
  if (line[0] === "#") {
    const [currentGroup, ...otherGroups] = groups;
    
    for (let i = 0; i < currentGroup; i++){
      if (line[i] === ".") return 0;
    }
    if (line[currentGroup] === "#") return 0;

    return numberOfWays({line: line.slice(currentGroup+1), groups: otherGroups});
  }
  
  // Recursion case: unknown => check the number of ways for either operational or damaged and sum them.
  return numberOfWays({line: "#" + line.slice(1), groups}) + numberOfWays({line: "." + line.slice(1), groups});
})

const part1 = (input: Row[]) => {
  return sum(input.map(numberOfWays));
}

const part2 = (input: Row[]) => {
  const newInput = input.map(({line, groups}) => {
    return {
      line: repeat(line, 5).join("?"),
      groups: repeat(groups, 5).flat()
    }
  })

  return sum(newInput.map(numberOfWays));
}

const input = await readFile("input/day12.txt");
const preparedInput: Row[] = input.split("\n").map(l => {
  const [line, groups] = l.split(" ");
  return {
    line, 
    groups: groups.split(",").map(Number),
  };
})
printSolution(part1(preparedInput), part2(preparedInput));