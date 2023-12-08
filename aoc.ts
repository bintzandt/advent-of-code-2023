const decoder = new TextDecoder("utf-8");

export const readFile = async (fileName: string) => {
    const data = await Deno.readFile(fileName);
    return decoder.decode(data);
};

export const printSolution = (a: any, b: any) => {
    console.log(`Part 1: ${a}\nPart 2: ${b}`);
}

/**
 * Zip multiple arrays together
 */
export const zip = (...arrays: Array<Array<any>>) => arrays[0].map((_, i) => arrays.map(a => a[i]));

/**
 * Sum of an array
 */
export const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

/**
 * Max number in an array
 */
export const max = (ns: number[]) => ns.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);

/**
 * Greatest common divisor for two numbers
 */
export const gcd = (a: number, b: number): number => b == 0 ? a : gcd (b, a % b);

/**
 * Lowest common multiple for two numbers
 */
export const lcm = (a: number, b: number): number =>  a / gcd (a, b) * b;