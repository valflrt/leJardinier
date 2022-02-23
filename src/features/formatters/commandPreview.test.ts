import { describe, it } from "mocha";
import { expect } from "chai";

import CommandPreview from "./commandPreview";

import Command from "../commands/command";

import config from "../../config";

let baseTestCommand = new Command({
  name: "test",
  description: "Test command\nyeah yeah a test command",
  execution: async () => {},
});

describe("CommandPreview formatter tests", () => {
  describe("Name formatting tests", () => {
    it("should make the command name bold", () => {
      expect(baseTestCommand.preview.name).to.equal("**test**");
    });
  });

  describe("Description formatting tests", () => {
    let baseDescription = "> Test command\n"
      .concat("> yeah yeah a test command\n")
      .concat(`> Usage: **\`${config.prefix}test\`**`);

    it("should create a complete command description with no aliases", () => {
      expect(baseTestCommand.preview.description).to.equal(baseDescription);
    });

    it("should create a complete command description with one alias", () => {
      baseTestCommand.aliases = ["tst"];

      expect(baseTestCommand.preview.description).to.equal(
        baseDescription.concat(`\n> Alias: **\`tst\`**`)
      );

      baseTestCommand.aliases = []; // resets aliases
    });

    it("should create a complete command description with one alias", () => {
      baseTestCommand.aliases = ["tst", "t", "fiushgf"];

      expect(baseTestCommand.preview.description).to.equal(
        baseDescription.concat(
          `\n> Aliases: **\`tst\`** **\`t\`** **\`fiushgf\`**`
        )
      );

      baseTestCommand.aliases = []; // resets aliases
    });
  });

  describe("Full preview tests", () => {
    let basePreview = "**test**\n"
      .concat("> Test command\n")
      .concat("> yeah yeah a test command\n")
      .concat(`> Usage: **\`${config.prefix}test\`**`);

    it("should create a full preview containing the name and the description of the command (subcommand display disabled)", () => {
      expect(baseTestCommand.preview.getFullPreview(false)).to.equal(
        basePreview
      );
    });

    it("should create a full preview containing the name and the description of the command (subcommand display enabled but no subcommands)", () => {
      expect(baseTestCommand.preview.getFullPreview()).to.equal(basePreview);
    });

    it("should create a full preview containing the name and the description of the command (with subcommands)", () => {
      baseTestCommand.commands = [
        new Command({
          name: "test subcommand",
          identifier: "testsub",
          description: "test subcommand",
          execution: async () => {},
        }),
      ];

      expect(baseTestCommand.preview.getFullPreview()).to.equal(
        basePreview.concat(`\n\n**__Subcommands:__**\n`)
      );

      baseTestCommand.commands = []; // resets commands
    });
  });

  describe("Embed fields creation tests", () => {
    it("should create embed fields for subcommands", () => {
      baseTestCommand.commands = [
        new Command({
          name: "test subcommand",
          identifier: "testsub",
          description: "test subcommand",
          execution: async () => {},
        }),
        new Command({
          name: "test subcommand 2",
          identifier: "testsub2",
          description: "test subcommand 2",
          execution: async () => {},
        }),
      ];

      expect(baseTestCommand.preview.embedFields).to.deep.equal([
        {
          name: "**test subcommand**",
          value: "> test subcommand\n".concat(
            `> Usage: **\`${config.prefix}test.testsub\`**`
          ),
        },
        {
          name: "**test subcommand 2**",
          value: "> test subcommand 2\n".concat(
            `> Usage: **\`${config.prefix}test.testsub2\`**`
          ),
        },
      ]);

      baseTestCommand.commands = []; // resets commands
    });
  });
});
