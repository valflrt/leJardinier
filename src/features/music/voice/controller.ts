import { StageChannel, VoiceChannel } from "discord.js";
import * as voice from "@discordjs/voice";

import lejardinier from "../../..";

import TrackPlayer from "./player";
import controllersManager from "./controllersManager";
import databaseHandler from "./database";

import Context from "../../../bot/context";
import { SentMessageActions } from "../../../bot/actions";

import logger from "../../logger";

import reactions from "../../../assets/reactions";

export default class MusicController {
  public context: Context;

  public currentPlayer: TrackPlayer | null = null;
  public currentTrackMessage?: SentMessageActions;

  public audioChannel?: VoiceChannel | StageChannel | null;

  constructor(context: Context) {
    this.context = context;
  }

  /**
   * Makes the bot join the channel where the member is
   */
  public async join(): Promise<boolean> {
    let { actions, message } = this.context;

    if (!message.member || !message.member.voice.channel) {
      actions.sendTextEmbed(
        `${reactions.error.random} You need to be in a voice channel !`
      );
      return false;
    }

    this.audioChannel = message.member!.voice.channel;

    let permissions = this.audioChannel!.permissionsFor(
      this.audioChannel!.guild.me!
    );
    if (!permissions.has("CONNECT")) {
      actions.sendTextEmbed(
        `${reactions.error.random} I am not allowed to join this voice channel !`
      );
      return false;
    }

    if (!permissions.has("SPEAK")) {
      actions.sendTextEmbed(
        `${reactions.error.random} I am not allowed to speak in this voice channel !`
      );
      return false;
    }

    let connection = voice.joinVoiceChannel({
      guildId: this.audioChannel!.guildId,
      channelId: this.audioChannel!.id,
      adapterCreator: this.audioChannel!.guild
        .voiceAdapterCreator as voice.DiscordGatewayAdapterCreator,
    });

    if (!this.audioChannel?.members.has(lejardinier.client.user!.id))
      actions.sendTextEmbed(`Joined ${this.audioChannel!.toString()}`);

    await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 3e4); // 6e4: 60s

    return true;
  }

  /**
   * Makes the player start playing the current track
   */
  public async play() {
    let { actions, message } = this.context;

    let joined = await this.join();
    if (!joined) return;

    let track = await databaseHandler.getFirstTrack(message.guildId!);
    if (!track) return actions.sendTextEmbed(`The playlist is empty !`);

    let connection = voice.getVoiceConnection(message.guildId ?? "");
    if (!connection)
      return actions.sendTextEmbed(
        `${reactions.error.random} Internal error: couldn't get voice connection !`
      );

    this.currentTrackMessage = await actions.sendTextEmbed(`Loading audio...`);

    let player = (this.currentPlayer = new TrackPlayer(track));
    player.setup(this);

    let failedFn = async () => {
      await actions.sendTextEmbed(
        `${reactions.error.random} Couldn't play current track. Skipping...`
      );
      player.stop();
      await this.playNextTrack();
    };

    if (!track.videoID) return failedFn();

    await player.play(track.videoID).catch((e) => {
      logger.log(`Failed to play track: ${e}`, "error");
      return failedFn();
    });
    connection.subscribe(player.toObject());
  }

  /**
   * Makes the current player stop playing
   */
  public stopPlaying() {
    this.currentPlayer?.stop();
  }

  public async playNextTrack() {
    let { message } = this.context;
    await databaseHandler.removeFirstTrack(message.guildId!);
    await this.play();
  }

  public destroy() {
    let { message } = this.context;
    voice.getVoiceConnection(message.guildId ?? "")?.destroy();
    controllersManager.remove(message.guildId!);
  }
}
