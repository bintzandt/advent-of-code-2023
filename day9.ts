import { printSolution, readFile, sum } from "./aoc.ts";

type Sequences = Sequence[];
type Sequence = number[];

const allSequences = (sequences: Sequences, i = 0): Sequences => {
  if (sequences[i].some(n => n !== 0)) {
    const newSequences = [
      ...sequences,
      sequences[i].map((n, i, a) => (a[i+1] - n)).filter(n => !isNaN(n))
    ];
    return allSequences(newSequences, i+1);
  }

  return sequences.reverse();
}

const nextNumber = (sequence: number[]): number => {  
  const sequences = allSequences([sequence]);
  for (const [i, sequence] of sequences.entries()) {
    if (i === 0) {
      sequence.push(0);
    } else {
      sequence.push(sequences[i-1].pop()! + sequence.pop()!);
    }
  }

  return sequences.pop()?.pop()!;
}

const previousNumber = (sequence: Sequence): number => {  
  const sequences = allSequences([sequence]);
  for (const [i, sequence] of sequences.entries()) {
    if (i === 0) {
      sequence.unshift(0);
    } else {
      sequence.unshift(sequence[0] - sequences[i-1][0]);
    }
  }

  return sequences.pop()?.at(0)!;
}

const input = await readFile("input/day9.txt");
const preparedInput = input.split("\n").map(l => l.split(" ").filter(Boolean).map(Number))
printSolution(sum(preparedInput.map(nextNumber)), sum(preparedInput.map(previousNumber)));
