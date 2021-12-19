import { inlineCode } from "@discordjs/builders";

import { Command } from "../../bot/command";
import { guildManager, userManager } from "../../managers/database";

const unregister = new Command({
  name: "unregister",
  description: "Unregister a guild or an user",
  execution: async (messageInstance) => {
    let { methods } = messageInstance;

    methods.sendTextEmbed(
      `With this command, you can unregister guilds and users.`
        .concat(
          `By unregistering, the guild/user will be removed from my database.\n\n`
        )
        .concat(
          `${inlineCode(`lj!unregister guild`)}: unregister current guild\n`
        )
        .concat(`${inlineCode(`lj!unregister user`)} unregister yourself`)
    );
  },
  commands: [
    new Command({
      name: "guild",
      description: "Unregister current guild (you need to be the owner)",
      execution: async (messageInstance) => {
        let { methods, message } = messageInstance;

        /*if (message.guild?.ownerId !== message.author.id)
					return methods.sendTextEmbed(`You are not the owner of this guild !`);*/

        if ((await guildManager.exists(message.guild!.id)) === false)
          return methods.sendTextEmbed(`This guild is not registered`);

        guildManager
          .remove(message.guild!.id)
          .then(() => methods.sendTextEmbed(`Guild unregistered successfully`))
          .catch((err) => {
            console.log(err);
            methods.sendTextEmbed(`Failed to unregister guild`);
          });
      },
    }),
    new Command({
      name: "user",
      description: "Unregister yourself",
      requiresDB: true,
      execution: async (messageInstance) => {
        let { methods, message } = messageInstance;

        if ((await userManager.exists(message.author!.id)) === false)
          return methods.sendTextEmbed(`This user is not registered`);

        userManager
          .remove(message.author!.id)
          .then(() => methods.sendTextEmbed(`User unregistered successfully`))
          .catch((err) => {
            console.log(err);
            methods.sendTextEmbed(`Failed to unregister user`);
          });
      },
    }),
  ],
});

export default unregister;
