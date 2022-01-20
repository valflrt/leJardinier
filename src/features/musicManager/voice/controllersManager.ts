import MusicController from "./controller";

class ControllersManager {
  private controllers: MusicController[] = [];

  register(guildPlayer: MusicController) {
    this.controllers.push(guildPlayer);
  }

  get(guildId: string): MusicController | undefined {
    return this.controllers.find(
      (controller) => controller.messageInstance.message.guildId === guildId
    );
  }

  remove(guildId: string) {
    this.controllers = this.controllers.filter(
      (controller) => controller.messageInstance.message.guildId !== guildId
    );
  }
}

const controllersManager = new ControllersManager();

export default controllersManager;
