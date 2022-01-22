import { describe, it } from "mocha";
import { expect } from "chai";

import quantify from "./quantify";

describe("Quantifier tests", () => {
  it("should not format numbers equal or lower than 100", () => {
    expect(quantify.fromString("100")).to.equal("100");
    expect(quantify.fromNumber(100)).to.equal("100");
  });

  describe(`Parsing quantities from a string`, () => {
    it(`Should add "K" multiplier to a power of ten number (string)`, () => {
      expect(quantify.fromString("1000")).to.equal("1K");
      expect(quantify.fromString("10000")).to.equal("10K");
      expect(quantify.fromString("100000")).to.equal("100K");
    });
    it(`Should add "M" multiplier to a random number (string)`, () => {
      expect(quantify.fromString("1000000")).to.equal("1M");
      expect(quantify.fromString("10000000")).to.equal("10M");
      expect(quantify.fromString("100000000")).to.equal("100M");
    });
    it(`should add "K" or "M" multiplier to a random number (string), and round it`, () => {
      expect(quantify.fromString("65464")).to.equal("65K");
      expect(quantify.fromString("515631")).to.equal("516K");
      expect(quantify.fromString("745374231")).to.equal("745M");
    });
  });

  describe("Parsing quantities from a number", () => {
    it(`Should add "K" multiplier to a power of ten number (string)`, () => {
      expect(quantify.fromNumber(1000)).to.equal("1K");
      expect(quantify.fromNumber(10000)).to.equal("10K");
      expect(quantify.fromNumber(100000)).to.equal("100K");
    });
    it(`Should add "M" multiplier to a random number (string)`, () => {
      expect(quantify.fromNumber(1000000)).to.equal("1M");
      expect(quantify.fromNumber(10000000)).to.equal("10M");
      expect(quantify.fromNumber(100000000)).to.equal("100M");
    });
    it(`should add "K" or "M" multiplier to a random number (string), and round it`, () => {
      expect(quantify.fromNumber(46851)).to.equal("47K");
      expect(quantify.fromNumber(376824)).to.equal("377K");
      expect(quantify.fromNumber(67346851)).to.equal("67M");
    });
  });
});
