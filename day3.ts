import { printSolution, readFile } from "./aoc.ts";

type Grid = {
  rows: number;
  cols: number;
  values: string[][];
}

type Coordinate = {
  x: number;
  y: number;
  value: string;
}

const neighbours = (x: number, y: number, grid: Grid) => {
  return [
    {
      x: x-1,
      y: y-1,
      value: grid.values[y-1]?.[x-1], // bottom left
    },
    {

      x: x,
      y: y-1,
      value: grid.values[y-1]?.[x], // below
    },
    {
      x: x+1,
      y: y-1,
      value: grid.values[y-1]?.[x+1], // bottom right
    },
    {
      x: x-1,
      y,
      value: grid.values[y]?.[x-1], // left
    },
    {
      x: x+1,
      y,
      value: grid.values[y]?.[x+1], // right
    },
    {
      x: x-1,
      y: y+1,
      value: grid.values[y+1]?.[x-1], // top left
    },
    {
      x: x,
      y: y+1,
      value: grid.values[y+1]?.[x], // above
    },
    {
      x: x+1,
      y: y+1,
      value: grid.values[y+1]?.[x+1], //top right
    },
  ].filter(c => Boolean(c.value));
}

const isAdjacentToSymbol = (neighbours: Coordinate[]) => neighbours.some(n => n.value !== "." && isNaN(parseInt(n.value)));

const completeNumber = (x: number, y: number, grid: Grid) => {
  let before = "";
  let after = "";
  
  let currX = x-1;
  let currY = y;
  while (true) {
    if (currX < 0) {
      currX = grid.cols-1;
      currY -= 1;
    }

    if (currY < 0) break;

    if (isNaN(Number(grid.values[currY][currX]))) break;

    before += grid.values[currY][currX];
    currX -= 1;
  }

  currX = x+1;
  currY = y;
  while (true) {
    if (currX == grid.cols) {
      currX = 0;
      currY += 1;
    }
    if (currY > grid.rows) break;

    if (isNaN(Number(grid.values[currY][currX]))) break;

    after += grid.values[currY][currX];
    currX += 1;
  }

  return {
    value: Number.parseInt(before.split('').reverse().join('') + grid.values[y][x] + after),
    newX: currX,
    newY: currY,
  };
}

const part1 = (input: string) => {
  const values = input.split("\n").map(x => x.split('').concat(["."]));
  const grid : Grid = {
    cols: values.length,
    rows: values[0].length,
    values,
  };

  const engineNumbers: number[] = [];

  for (let y = 0; y < grid.cols; y++) {
    for (let x = 0; x < grid.rows; x++) {
      const value = grid.values[y][x];
      if (isNaN(parseInt(value))) {
        continue;
      }
      if (isAdjacentToSymbol(neighbours(x, y, grid))) {
        const result = completeNumber(x, y, grid);
        engineNumbers.push(Number(result.value));
        x = result.newX;
        y = result.newY;
      }
    }
  }

  return engineNumbers.map(Number).reduce((prev, curr) => prev + curr, 0);
};

const part2 = (input: string) => {
  const values = input.split("\n").map(x => x.split('').concat(["."]));
  const grid : Grid = {
    cols: values.length,
    rows: values[0].length,
    values,
  };

  const isDigit = (x: string) => /^\d$/.test(x);
  const gearNumbers: number[] = [];

  for (let y = 0; y < grid.cols; y++) {
    for (let x = 0; x < grid.rows; x++) {
      const value = grid.values[y][x];
      if (value !== "*") {
        continue;
      }

      const allNeighbours = neighbours(x, y, grid);
      const numbers = allNeighbours
        .filter(n => isDigit(n.value))
        .map(n => completeNumber(n.x, n.y, grid))
        .filter((v, i, a) => {
          return a.findIndex(ax => ax.newX === v.newX && ax.newY === v.newY && ax.value === v.value) === i
        })
        .map(v => v.value)

      if (numbers.length == 2) {
        gearNumbers.push(numbers[0] * numbers[1]);
      }
    }
  }

  return gearNumbers.reduce((prev, curr) => prev + curr, 0);
}

const input = await readFile("input/day3.txt");
printSolution(part1(input), part2(input));
