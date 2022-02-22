import { describe, it } from "mocha";
import { expect } from "chai";

import Factorize from ".";

describe("Quantifier tests", () => {
  it("should not format numbers equal or lower than 100", () => {
    expect(Factorize.parseString("100")).to.equal("100");
    expect(Factorize.parseNumber(100)).to.equal("100");
  });

  it("should be able to format numbers over 10^12 (1_000_000_000_000)", () => {
    expect(Factorize.parseNumber(100)).to.equal("100");
  });

  describe(`Parsing quantities from a string`, () => {
    it(`Should add the corresponding factor to a power of ten number (string)`, () => {
      expect(Factorize.parseString("1000")).to.equal("1.0K");
      expect(Factorize.parseString("100000000")).to.equal("100.0M");
      expect(Factorize.parseString("10000000000")).to.equal("10.0B");
    });
    it(`should add the corresponding factor to a random number (string), and round it`, () => {
      expect(Factorize.parseString("515631")).to.equal("515.6K");
      expect(Factorize.parseString("745374231")).to.equal("745.4M");
      expect(Factorize.parseString("65468846464")).to.equal("65.5B");
    });
  });

  describe("Parsing quantities from a number", () => {
    it(`Should add the corresponding factor to a power of ten number (string)`, () => {
      expect(Factorize.parseString("1000")).to.equal("1.0K");
      expect(Factorize.parseString("100000000")).to.equal("100.0M");
      expect(Factorize.parseString("10000000000")).to.equal("10.0B");
    });
    it(`should add the corresponding factor to a random number (string), and round it`, () => {
      expect(Factorize.parseNumber(46851)).to.equal("46.9K");
      expect(Factorize.parseNumber(67346851)).to.equal("67.3M");
      expect(Factorize.parseNumber(46546541654)).to.equal("46.5B");
    });
  });
});
