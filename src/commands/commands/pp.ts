import { MessageEmbed } from "discord.js";

import CCommand from "../../features/commands/classes/command";

const profilePicture__cmd = new CCommand()
  .setName("profile picture")
  .setIdentifier("pp")
  .setDescription("Gives someone's profile picture")
  .addParameter((p) => p.setName("mention").setRequired(false))
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;

    let member = message.mentions.members?.first()?.user || message.author;
    if (!member) return methods.sendTextEmbed(`Unknown user`);

    methods.sendCustomEmbed((embed: MessageEmbed) =>
      embed
        .setDescription(`Here is ${member!.toString()}'s profile picture`)
        .setImage(member!.displayAvatarURL({ size: 300 }))
    );
  })
  .addHelpCommand();

export default profilePicture_cmd;
