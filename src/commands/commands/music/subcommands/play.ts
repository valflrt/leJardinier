import CCommand from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";
import MusicController from "../../../../features/music/voice/controller";

const play__cmd = new CCommand()
  .setName("play")
  .addAlias("p")
  .setDescription("Start playing music from the current playlist")
  .setExecution(async (messageInstance) => {
    let controller = new MusicController(messageInstance);
    controllersManager.register(controller);
    await controller.play();
  })
  .addHelpCommand();

export default play_cmd;
