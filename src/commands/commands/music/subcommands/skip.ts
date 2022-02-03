import Command from "../../../../features/commands/classes/command";

import databaseHandler from "../../../../features/music/voice/database";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const skip_cmd = new Command({
  name: "skip",
  description: `Skip current track`,
  execution: async ({ actions, message }) => {
    let controller = controllersManager.get(message.guildId!);
    if (!controller) {
      databaseHandler.removeFirstTrack(message.guildId!);
    } else {
      await controller.playNextTrack();
    }
    await actions.sendTextEmbed(`${reactions.success.random} Track skipped !`);
  },
});

export default skip_cmd;
