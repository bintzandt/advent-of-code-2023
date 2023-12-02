const decoder = new TextDecoder("utf-8");

export const readFile = async (fileName: string) => {
    const data = await Deno.readFile(fileName);
    return decoder.decode(data);
};

export const printSolution = (a: any, b: any) => {
    console.log(`Part 1: ${a}\nPart 2: ${b}`);
}