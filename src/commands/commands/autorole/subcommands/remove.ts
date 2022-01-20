import CCommand from "../../../../features/commands/classes/command";

import database from "../../../../features/database";

import reactions from "../../../../assets/reactions";

const remove__cmd = new CCommand()
  .setName("remove")
  .addAlias("rm")
  .setDescription("Removes the current watcher")
  .setExecution(async (messageInstance) => {
    let { methods, message, bot } = messageInstance;

    let guild = await database.guilds.findOne({ id: message.guildId! });
    if (guild?.autorole) {
      let channel = await bot.channels.fetch(guild.autorole.channelId);
      if (channel)
        if (channel!.isText()) {
          await channel.messages
            .fetch(guild.autorole.messageId)
            .then((message) => {
              if (message && message.deletable) message.delete();
            })
            .catch((e) => console.log(e));
        }
    }

    await database.guilds.updateOrCreateOne(
      { id: message.guildId! },
      { autorole: null },
      { id: message.guildId! }
    );
    methods.sendTextEmbed(`Autorole removed ${reactions.smile.random}`);
  });

export default remove_cmd;
