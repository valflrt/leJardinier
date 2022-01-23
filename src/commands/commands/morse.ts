import { MessageEmbed } from "discord.js";
import { codeBlock, inlineCode } from "@discordjs/builders";

import CCommand from "../../features/commands/classes/command";

import Morse from "../../features/morse";
import morseTable from "../../assets/morseTable";

const morse_cmd = new CCommand()
  .setName("morse")
  .setDescription(`Morse code utility command`)
  .setExecution(async ({ methods }) => {
    methods.sendTextEmbed(
      `Use ${inlineCode(
        morse_cmd.commands.find((c) => c.name === "encode")!.syntax
      )} to encode text to Morse code`.concat(
        `Use ${
          morse_cmd.commands.find((c) => c.name === "table")!.syntax
        } to get Morse code table`
      )
    );
  })
  .addSubcommand((c) =>
    c
      .setName("encode")
      .setDescription("Encodes text to Morse code")
      .addParameter((p) => p.setName("sentence").setRequired(true))
      .setExecution(async ({ methods, commandParameters }) => {
        if (commandParameters.length === 0)
          methods.sendTextEmbed(
            "You need to give some text to convert to Morse Code..."
          );
        else
          methods.sendTextEmbed(
            "Here is your Morse encoded text:".concat(
              codeBlock(Morse.encode(commandParameters))
            )
          );
      })
      .addHelpCommand()
  )
  .addSubcommand((c) =>
    c
      .setName("decode")
      .setDescription("Decodes Morse code")
      .addParameter((p) => p.setName("morse code").setRequired(true))
      .setExecution(async ({ methods, commandParameters }) => {
        if (commandParameters.length === 0)
          methods.sendTextEmbed("You need to give some Morse to decode...");
        else
          methods.sendTextEmbed(
            "Here is your decoded text:".concat(
              codeBlock(Morse.decode(commandParameters))
            )
          );
      })
      .addHelpCommand()
  )
  .addSubcommand((c) =>
    c
      .setName("table")
      .setDescription("Gives the Morse table")
      .setExecution(async ({ methods }) => {
        methods.sendCustomEmbed((embed: MessageEmbed) =>
          embed.setDescription(`Here is the morse table\n
					${morseTable.map((char) => `${char[0]}: ${inlineCode(char[1])}`).join("\n")}`)
        );
      })
      .addHelpCommand()
  );

export default morse_cmd;
