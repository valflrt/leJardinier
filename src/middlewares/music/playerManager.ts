import GuildPlayer from "./guildPlayer";

class PlayerManager {
  private players: GuildPlayer[] = [];

  register(guildPlayer: GuildPlayer) {
    this.players.push(guildPlayer);
  }

  get(guildId: string): GuildPlayer | undefined {
    return this.players.find((player) => player.guildId === guildId);
  }

  remove(guildId: string) {
    this.players = this.players.filter((player) => player.guildId !== guildId);
  }
}

const playerManager = new PlayerManager();

export default playerManager;
