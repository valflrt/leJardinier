import CCommand from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const skip__cmd = new CCommand()
  .setName("skip")
  .setDescription(`Skip current track`)
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;
    let controller = controllersManager.get(message.guildId!);
    if (!controller)
      return methods.sendTextEmbed(
        `${reactions.error.random} Failed to skip this track !`
      );
    await methods.sendTextEmbed(`${reactions.success.random} Track skipped !`);
    await controller.play();
  })
  .addHelpCommand();

export default skip_cmd;
