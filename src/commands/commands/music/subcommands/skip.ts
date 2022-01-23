import CCommand from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";

import reactions from "../../../../assets/reactions";

const skip_cmd = new CCommand()
  .setName("skip")
  .setDescription(`Skip current track`)
  .setExecution(async ({ message }) => {
    let controller = controllersManager.get(message.guildId!);
    if (!controller)
      return message.sendTextEmbed(
        `${reactions.error.random} Failed to skip this track !`
      );
    await message.sendTextEmbed(`${reactions.success.random} Track skipped !`);
    await controller.play();
  })
  .addHelpCommand();

export default skip_cmd;
