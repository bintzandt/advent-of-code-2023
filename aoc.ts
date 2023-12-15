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

/**
 * All combinations of a list
 */
export const combinations = (a: any) => a.flatMap((v: any, i: any) => a.slice(i+1).map((w: any) => [v, w]));

/**
 * Returns a list of number starting at from.
 * 
 * If the function only gets one argument, it
 * assumes that from = 0 and uses the argument
 * as to. 
 */
export const range = (from: number, to: number | null = null): number[] => {
    if (to === null) {
        to = from;
        from = 0;
    }
    
    return Array(to-from).fill(1).map((_, i) => i + from);
}

/**
 * Transposes a list of lists.
 */
export function transpose<T>(matrix: T[][]) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

/**
 * Returns a list with n times a in it.
 * 
 * Can possibly be very long so be careful.
 */
export function repeat<T>(a: T, n: number): T[] {
    if (n === 0) return [];
    return [a].concat(repeat(a, n-1));
}

/**
 * Uses a map to memoize the result of a function call
 * with specific arguments.
 * 
 * Based on the example given in https://www.freecodecamp.org/news/understanding-memoize-in-javascript-51d07d19430e/
 * but made more generic and TS compatible.
 */
export function memoize<Args extends unknown[], Result>(
    func: (...args: Args) => Result
): (...args: Args) => Result {
    const stored = new Map<string, Result>();

    return (...args) => {
        const argString = JSON.stringify(args);

        if (stored.has(argString)) {
            return stored.get(argString)!;
        }

        const result = func(...args);
        stored.set(argString, result);
        return result;
    };
}