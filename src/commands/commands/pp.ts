import { MessageEmbed } from "discord.js";

import Command from "../../features/commands/command";

const profilePicture_cmd = new Command({
  name: "profile picture",
  identifier: "pp",
  description: "Gives someone's profile picture",
  parameters: [{ name: "mention", required: false }],
  execution: async ({ actions, message }) => {
    let member = message.mentions.members?.first()?.user || message.author;
    if (!member) return actions.sendTextEmbed(`Unknown user`);

    actions.sendCustomEmbed((embed: MessageEmbed) =>
      embed
        .setDescription(`Here is ${member!.toString()}'s profile picture`)
        .setImage(member!.displayAvatarURL({ size: 300 }))
    );
  },
});

export default profilePicture_cmd;
