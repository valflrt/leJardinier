import CCommand from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const stop_cmd = new CCommand()
  .setName("stop")
  .setDescription("Stop the music")
  .setExecution(async ({ message }) => {
    let controller = controllersManager.get(message.guildId!);

    if (!controller)
      return message.sendTextEmbed(
        `${reactions.error.random} Couldn't stop playing !`
      );
    controller.stopPlaying();
    controller.destroy();

    message.sendTextEmbed(`${reactions.success.random} Stopped playing !`);
  })
  .addHelpCommand();

export default stop_cmd;
