import { printSolution, readFile, zip } from "./aoc.ts";

const distance = ({time, speed}: {time: number, speed: number}) => time * speed;

// Uses an interval instead of checking every possible time within
// the race.
const numberOfWaysToBeatRace = ([raceTime, raceDistance]: number[]) => {
  let startInterval = raceTime;
  let endInterval = raceTime;
  
  for (let i = 1; i < raceTime; i++) {
    if (distance({ time: raceTime - i, speed: i}) > raceDistance) {
      startInterval = i;
      break;
    }
  }

  for (let i = raceTime - 1; i > startInterval; i--) {
    if (distance({time: raceTime - i, speed: i}) > raceDistance) {
      endInterval = i;
      break;
    }
  }

  return endInterval - startInterval + 1;
}



const part1 = (times: number[], distances: number[]) => {
  return zip(times, distances).map(numberOfWaysToBeatRace).reduce((prev, curr) => prev * curr, 1);
}

const part2 = (times: number[], distances: number[]) => {
  return numberOfWaysToBeatRace([Number(times.join("")), Number(distances.join(""))]);
}

const input = await readFile("input/day6.txt");
const [time, distanceString] = input.split("\n");
const times = time.split(":")[1].trim().split(" ").filter(Boolean).map(Number);
const distances = distanceString.split(":")[1].trim().split(" ").filter(Boolean).map(Number);
printSolution(part1(times, distances), part2(times, distances));
