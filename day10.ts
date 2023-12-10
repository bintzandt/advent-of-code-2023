import { printSolution, readFile, sum, zip } from "./aoc.ts";

type Pos = number;
type Pipe = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Direction = "N" | "E" | "S" | "W";

class Grid {
  cols: number;
  rows: number;
  values: string[];

  constructor(input: string) {
    const lines = input.split("\n");
    this.rows = lines.length;
    this.cols = lines[0].length;
    this.values = lines.flatMap(l => l.split(""))
  }

  path = (): Pos[] => {
    let s = this.start();
    let p = this.connectedPipe(s);
    const indicesOfPipes = []
    
    while (this.values[p] !== "S" || indicesOfPipes.length === 0) {
      indicesOfPipes.push(s)
      const newPipe = this.followPipe(s, p);
      s = p; 
      p = newPipe!;
    }
    
    indicesOfPipes.push(s);
    return indicesOfPipes;
  }

  maxIndiceInRow = (pos: Pos): Pos => ( Math.floor(pos / this.cols) + 1 ) * this.cols - 1;

  connectedPipe = (pos: Pos) => {
    const result = [
      ["|", "7", "F"].includes(this.values[this.north(pos)]) ? this.north(pos) : 0,
      ["-", "L", "F"].includes(this.values[this.west(pos)]) ? this.west(pos) : 0,
      ["-", "J", "7"].includes(this.values[this.east(pos)]) ? this.east(pos) : 0,
      ["|", "L", "J"].includes(this.values[this.south(pos)]) ? this.south(pos) : 0,
    ];
  
    return result.filter(Boolean)[1];
  }

  followPipe = (from: Pos, pipe: Pos): Pos => {
    const pipeShape = this.values[pipe] as Pipe;
    const fromDirection = this.determineFromDirection(from, pipe);
    return this.Directions[pipeShape][fromDirection](pipe)
  }

  determineFromDirection = (from: Pos, pipe: Pos): Direction => {
    const diff = pipe - from;
  
    switch (diff) {
      case 1: return "W";
      case -1: return "E";
      case this.cols: return "N";
      default: return "S";
    }
  }

  start = () => {
    return this.values.indexOf("S");
  }
  
  west = (pos: Pos) => {
    return pos - 1;
  }

  east = (pos: Pos) => {
    return pos + 1;
  }

  north = (pos: Pos) => {
    return pos - this.cols;
  }

  south = (pos: Pos) => {
    return pos + this.cols;
  }

  public Directions: Record<Partial<Pipe>, Record<Direction, any>> = {
    "|": {
      "N": this.south,
      "S": this.north,
    },
    "-": {
      "E": this.west,
      "W": this.east,
    },
    "L": {
      "N": this.east,
      "E": this.north,
    },
    "J": {
      "N": this.west,
      "W": this.north,
    },
    "7": {
      "S": this.west,
      "W": this.south,
    },
    "F": {
      "S": this.east,
      "E": this.south,
    }
  }
}

const part1 = (input: string) => {  
  const grid = new Grid(input);
  return grid.path().length / 2;
}

const part2 = (input: string) => {  
  const grid = new Grid(input);
  const pipes = grid.path();
  const allFields = grid.values;

  const result = allFields.map((_, i) => {
    // If this is part of the pipe, we can return 0
    if (pipes.includes(i)) return 0;
    
    // Otherwise, count how many | appear to the right of this point that are part of the loop!
    const to = grid.maxIndiceInRow(i);
    let pipesToTheRight = 0;
    for (let j = i+1; j <= to; j++) {
      const vj = grid.values[j];

      // Check if the field is part of the pipe and if it is connected to the north.
      if (pipes.includes(j) && ["|","J","L"].includes(vj)) {
        pipesToTheRight++;
      }
    }
  
    // We only need to could fields that have an uneven number of pipes to their right.
    // Otherwise, this field is not part of the path.
    return (pipesToTheRight % 2 === 0) ? 0 : 1;
  })

  return sum(result);
}

const input = await readFile("input/day10.txt");
printSolution(part1(input), part2(input));
