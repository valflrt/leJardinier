import CCommand from "../../../../features/commands/classes/command";

import controllersManager from "../../../../features/music/voice/controllersManager";
import MusicController from "../../../../features/music/voice/controller";

const play_cmd = new CCommand()
  .setName("play")
  .addAlias("p")
  .setDescription("Start playing music from the current playlist")
  .setExecution(async (context) => {
    let controller = new MusicController(context);
    controllersManager.register(controller);
    await controller.play();
  })
  .addHelpCommand();

export default play_cmd;
