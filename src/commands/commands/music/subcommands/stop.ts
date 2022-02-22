import Command from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const stop_cmd = new Command({
  name: "stop",
  description: "Stop the music",
  execution: async ({ actions, message }) => {
    let controller = controllersManager.get(message.guildId!);

    if (!controller)
      return actions.sendTextEmbed(
        `${reactions.error.random} Couldn't stop playing !`
      );
    controller.stopPlaying();
    controller.destroy();

    actions.sendTextEmbed(`${reactions.success.random} Stopped playing !`);
  },
});

export default stop_cmd;
