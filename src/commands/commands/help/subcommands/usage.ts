import { bold, inlineCode, italic, underscore } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";

import config from "../../../../config";

const usage_cmd = new CCommand()
  .setName("usage")
  .setDescription("Gives information on how to use the bot")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendCustomEmbed((embed) =>
      embed
        .setTitle(
          underscore(
            bold(`Here are some instructions to be able to use me efficiently`)
          )
        )
        .setDescription(
          bold("1/ Command calls\n")
            .concat(`First, you need to know how to call a command.\n`)
            .concat(
              italic(
                "(yes it's dumb because you just did, but I think a reminder could help some people)"
              )
            )
            .concat("\n\n")
            .concat(
              `To do so, you will need to write: ${inlineCode(
                `[prefix][command namespace] [?parameters]`
              )}\n`
            )
            .concat(`Here are some examples:\n`)
            .concat(`• ${inlineCode(`${config.prefix}hey`)}\n`)
            .concat(
              `• ${inlineCode(
                `${config.prefix}morse.encode this is an example`
              )}`
            )
            .concat("\n\n")
            .concat(bold("2/ Hierarchy system\n"))
            .concat(
              `I use a specific command hierarchy system: a "dotted" hierarchy.\n`
            )
            .concat(
              `That is to say the whole "path" to a command is called a ${bold(
                "command namespace"
              )} `
            )
            .concat(
              `and is composed of ${bold(
                "command identifiers"
              )} separated by dots:\n`
            )
            .concat(
              `${inlineCode(
                "[command identifier].[subcommand identifier].[sub-subcommand identifier].[...]"
              )}`
            )
            .concat("\n\n")
            .concat(`Examples:\n`)
            .concat(
              `• ${inlineCode(
                "morse.table"
              )} is the namespace for the subcommand "table" of the command "morse"\n`
            )
            .concat(
              `• ${inlineCode(
                "music.add.search"
              )} is the namespace for the sub-subcommand "search" of the subcommand "add" of the command "music"`
            )
        )
    );
  });

export default usage_cmd;
