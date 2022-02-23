import Command from "../../../../features/commands/command";

import databaseHandler from "../../../../features/music/voice/database";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const skip_cmd = new Command({
  name: "skip",
  description: `Skip current track`,
  execution: async ({ actions, message }) => {
    let controller = controllersManager.get(message.guildId!);
    await databaseHandler.removeFirstTrack(message.guildId!);
    if (controller) await controller.play();
    await actions.sendTextEmbed(`${reactions.success.random} Track skipped !`);
  },
});

export default skip_cmd;
