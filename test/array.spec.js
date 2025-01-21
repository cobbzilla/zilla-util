import { describe, it } from "mocha";
import { expect } from "chai";
import { shuffleArray, randomString } from "../lib/esm/index.js";

describe("shuffleArray", () => {
    it("should shuffle the array and result in a different order", () => {
        // Generate an array of 10,000 random strings of length 10
        const originalArray = Array.from({ length: 1000 }, () => randomString());

        // Shuffle the array
        const shuffledArray = shuffleArray([...originalArray]);

        // Ensure the shuffled array contains the same elements
        expect(shuffledArray).to.have.members(originalArray);
        expect(shuffledArray).to.have.length(originalArray.length);

        // Check if at least one element has changed position
        const isDifferent = shuffledArray.some((val, index) => val !== originalArray[index]);
        expect(isDifferent).to.be.true;
    });
});
