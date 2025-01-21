export const shuffleArray = <T>(array: T[]): T[] => {
    const result = array.slice(); // Create a shallow copy to avoid mutating the original array
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};
