import { describe, it } from "mocha";
import { expect } from "chai";

import morseEncoder from ".";

describe("Morse tests", () => {
  describe("Morse encoding tests", () => {
    it(`should equal morse registered characters`, () => {
      expect(
        morseFormatter.encode(`abcdefghijklmnopqrstuvwxyz,?!:-"(=.;')+@`)
      ).to.equal(
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --.. --..-- ..--.. -.-.-- ---... -....- .-..-. -.--. -...- .-.-.- -.-.-. .----. -.--.- .-.-. .--.-."
      );
    });

    it(`should convert a phrase (multiple words separated with one or more spaces) to morse`, () => {
      expect(morseFormatter.encode(`hello how are    you doing ?`)).to.equal(
        ".... . .-.. .-.. --- / .... --- .-- / .- .-. . / -.-- --- ..- / -.. --- .. -. --. / ..--.."
      );
    });

    it(`should write # when the formatter encounters an unknown character`, () => {
      expect(morseFormatter.encode(`hello ~`)).to.equal(
        ".... . .-.. .-.. --- / #"
      );
    });

    it(`should encode capitalized letters`, () => {
      expect(morseFormatter.encode(`F*CK IT`)).to.equal(
        "..-. # -.-. -.- / .. -"
      );
    });
  });

  describe("Morse decoding tests", () => {
    it(`should equal morse registered characters`, () => {
      expect(
        morseFormatter.decode(
          `.- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --.. --..-- ..--.. -.-.-- ---... -....- .-..-. -.--. -...- .-.-.- -.-.-. .----. -.--.- .-.-. .--.-.`
        )
      ).to.equal(`abcdefghijklmnopqrstuvwxyz,?!:-"(=.;')+@`);
    });

    it(`should convert a phrase (multiple words separated with one or more spaces) to morse`, () => {
      expect(
        morseFormatter.decode(
          `.... . .-.. .-.. --- / .... --- .-- / .- .-. . / -.-- --- ..- / -.. --- .. -. --. / ..--..`
        )
      ).to.equal("hello how are you doing ?");
    });

    it(`should write # when the formatter encounters an unknown morse like character`, () => {
      expect(morseFormatter.decode(`.... . .-.. .-... ---`)).to.equal("hel#o");
    });
  });
});
