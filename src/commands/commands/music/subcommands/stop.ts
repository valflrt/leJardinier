import CCommand from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const stop__cmd = new CCommand()
  .setName("stop")
  .setDescription("Stop the music")
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;

    let controller = controllersManager.get(message.guildId!);

    if (!controller)
      return methods.sendTextEmbed(
        `${reactions.error.random} Couldn't stop playing !`
      );
    controller.stopPlaying();
    controller.destroy();

    methods.sendTextEmbed(`${reactions.success.random} Stopped playing !`);
  })
  .addHelpCommand();

export default stop_cmd;
