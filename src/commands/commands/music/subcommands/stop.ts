import CCommand from "../../../../managers/commands/classes/command";

import controllersManager from "../../../../features/musicManager/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const stop = new CCommand()
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

export default stop;
