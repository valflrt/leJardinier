import { describe, it } from "mocha";
import { expect } from "chai";

import MessageParser from "./messageParser";

import config from "../../../config";

describe(`MessageParser tests`, () => {
  describe(`Command namespace detection tests`, () => {
    it(`should find a simple command namespace`, () =>
      expect(
        new MessageParser(`${config.prefix}help`).detectedNamespace
      ).to.deep.equal(["help"]));

    it(`should find a complex command namespace`, () => {
      expect(
        new MessageParser(`${config.prefix}help.commands`).detectedNamespace
      ).to.deep.equal(["help", "commands"]);
      expect(
        new MessageParser(`${config.prefix}music.add.url`).detectedNamespace
      ).to.deep.equal(["music", "add", "url"]);
    });

    it(`should find a command namespace even if arguments are specified after the command call`, () => {
      expect(
        new MessageParser(`${config.prefix}music.play never gonna`)
          .detectedNamespace
      ).to.deep.equal(["music", "play"]);
      expect(
        new MessageParser(
          `${config.prefix}music.add.url https://www.youtube.com/watch?v=dQw4w9WgXcQ`
        ).detectedNamespace
      ).to.deep.equal(["music", "add", "url"]);
    });
  });

  describe(`Command parameters detection tests`, () => {
    it(`should returns an empty string if no parameter is found`, () => {
      expect(new MessageParser(`${config.prefix}help`).parameters).to.equal(``);
    });

    it(`should find the command call parameters`, () => {
      expect(
        new MessageParser(`${config.prefix}music.play never gonna`).parameters
      ).to.equal(`never gonna`);
      expect(
        new MessageParser(
          `${config.prefix}music.add.url https://www.youtube.com/watch?v=dQw4w9WgXcQ`
        ).parameters
      ).to.equal(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
    });

    it(`should parse special characters`, () => {
      expect(new MessageParser(`${config.prefix}help`).parameters).to.equal(``);
      expect(
        new MessageParser(
          `${config.prefix}music.add.url héèêlö ù dàmn sôcïopath`
        ).parameters
      ).to.equal(`heeelo u damn sociopath`);
    });
  });
});
