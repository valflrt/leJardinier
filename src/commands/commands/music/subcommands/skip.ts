import Command from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const skip_cmd = new Command({
  name: "skip",
  description: `Skip current track`,
  execution: async ({ actions, message }) => {
    let controller = controllersManager.get(message.guildId!);
    if (!controller)
      return actions.sendTextEmbed(
        `${reactions.error.random} Failed to skip this track !`
      );
    await actions.sendTextEmbed(`${reactions.success.random} Track skipped !`);
    await controller.play();
  },
});

export default skip_cmd;
