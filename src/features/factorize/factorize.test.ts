import { describe, it } from "mocha";
import { expect } from "chai";

import Factorize from "./factorize";

describe("Quantifier tests", () => {
  it("should not format numbers equal or lower than 100", () => {
    expect(Factorize.fromString("100")).to.equal("100");
    expect(Factorize.fromNumber(100)).to.equal("100");
  });

  describe(`Parsing quantities from a string`, () => {
    it(`Should add "K" multiplier to a power of ten number (string)`, () => {
      expect(Factorize.fromString("1000")).to.equal("1K");
      expect(Factorize.fromString("10000")).to.equal("10K");
      expect(Factorize.fromString("100000")).to.equal("100K");
    });
    it(`Should add "M" multiplier to a random number (string)`, () => {
      expect(Factorize.fromString("1000000")).to.equal("1M");
      expect(Factorize.fromString("10000000")).to.equal("10M");
      expect(Factorize.fromString("100000000")).to.equal("100M");
    });
    it(`should add "K" or "M" multiplier to a random number (string), and round it`, () => {
      expect(Factorize.fromString("65464")).to.equal("65K");
      expect(Factorize.fromString("515631")).to.equal("516K");
      expect(Factorize.fromString("745374231")).to.equal("745M");
    });
  });

  describe("Parsing quantities from a number", () => {
    it(`Should add "K" multiplier to a power of ten number (string)`, () => {
      expect(Factorize.fromNumber(1000)).to.equal("1K");
      expect(Factorize.fromNumber(10000)).to.equal("10K");
      expect(Factorize.fromNumber(100000)).to.equal("100K");
    });
    it(`Should add "M" multiplier to a random number (string)`, () => {
      expect(Factorize.fromNumber(1000000)).to.equal("1M");
      expect(Factorize.fromNumber(10000000)).to.equal("10M");
      expect(Factorize.fromNumber(100000000)).to.equal("100M");
    });
    it(`should add "K" or "M" multiplier to a random number (string), and round it`, () => {
      expect(Factorize.fromNumber(46851)).to.equal("47K");
      expect(Factorize.fromNumber(376824)).to.equal("377K");
      expect(Factorize.fromNumber(67346851)).to.equal("67M");
    });
  });
});
