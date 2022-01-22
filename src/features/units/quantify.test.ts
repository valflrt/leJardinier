import { describe, it } from "mocha";
import { expect } from "chai";

import generateQuantified from "./quantify";

describe("Quantifier tests", () => {
  it("should not format numbers equal or lower than 100", () => {
    expect(generateQuantified.fromString("100")).to.equal("100");
    expect(generateQuantified.fromNumber(100)).to.equal("100");
  });

  describe(`Parsing quantities from a string`, () => {
    it(`Should add "K" multiplier to a power of ten number (string)`, () => {
      expect(generateQuantified.fromString("1000")).to.equal("1K");
      expect(generateQuantified.fromString("10000")).to.equal("10K");
      expect(generateQuantified.fromString("100000")).to.equal("100K");
    });
    it(`Should add "M" multiplier to a random number (string)`, () => {
      expect(generateQuantified.fromString("1000000")).to.equal("1M");
      expect(generateQuantified.fromString("10000000")).to.equal("10M");
      expect(generateQuantified.fromString("100000000")).to.equal("100M");
    });
    it(`should add "K" or "M" multiplier to a random number (string), and round it`, () => {
      expect(generateQuantified.fromString("65464")).to.equal("65K");
      expect(generateQuantified.fromString("515631")).to.equal("516K");
      expect(generateQuantified.fromString("745374231")).to.equal("745M");
    });
  });

  describe("Parsing quantities from a number", () => {
    it(`Should add "K" multiplier to a power of ten number (string)`, () => {
      expect(generateQuantified.fromNumber(1000)).to.equal("1K");
      expect(generateQuantified.fromNumber(10000)).to.equal("10K");
      expect(generateQuantified.fromNumber(100000)).to.equal("100K");
    });
    it(`Should add "M" multiplier to a random number (string)`, () => {
      expect(generateQuantified.fromNumber(1000000)).to.equal("1M");
      expect(generateQuantified.fromNumber(10000000)).to.equal("10M");
      expect(generateQuantified.fromNumber(100000000)).to.equal("100M");
    });
    it(`should add "K" or "M" multiplier to a random number (string), and round it`, () => {
      expect(generateQuantified.fromNumber(46851)).to.equal("47K");
      expect(generateQuantified.fromNumber(376824)).to.equal("377K");
      expect(generateQuantified.fromNumber(67346851)).to.equal("67M");
    });
  });
});
