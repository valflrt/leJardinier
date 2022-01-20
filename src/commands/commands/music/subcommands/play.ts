import CCommand from "../../../../managers/commands/classes/command";

import controllersManager from "../../../../features/musicManager/voice/controllersManager";
import MusicController from "../../../../features/musicManager/voice/controller";

const play = new CCommand()
  .setName("play")
  .addAlias("p")
  .setDescription("Start playing music from the current playlist")
  .setExecution(async (messageInstance) => {
    let controller = new MusicController(messageInstance);
    controllersManager.register(controller);
    await controller.play();
  })
  .addHelpCommand();

export default play;
