import { StageChannel, VoiceChannel } from "discord.js";
import * as voice from "@discordjs/voice";

import ytdl from "ytdl-core";

import controllersManager from "./controllersManager";
import databaseHandler from "./database";

import MessageInstance from "../../../bot/message";
import { SentMessage } from "../../../declarations/types";

import reactions from "../../../assets/reactions";
import TrackPlayer from "./player";
import log from "../../../bot/log";

export default class MusicController {
  public messageInstance: MessageInstance;

  private currentPlayer: TrackPlayer | null = null;
  public currentTrackMessage?: SentMessage;

  public audioChannel?: VoiceChannel | StageChannel | null;

  constructor(messageInstance: MessageInstance) {
    this.messageInstance = messageInstance;
  }

  /**
   * Makes the bot join the channel where the member is
   */
  public async join(): Promise<boolean> {
    let { methods, message, bot } = this.messageInstance;

    if (!message.member || !message.member.voice.channel) {
      methods.sendTextEmbed(
        `${reactions.error.random} You need to be in a voice channel !`
      );
      return false;
    }

    this.audioChannel = message.member!.voice.channel;

    let permissions = this.audioChannel!.permissionsFor(
      this.audioChannel!.guild.me!
    );
    if (!permissions.has("CONNECT")) {
      methods.sendTextEmbed(
        `${reactions.error.random} I am not allowed to join this voice channel !`
      );
      return false;
    }

    if (!permissions.has("SPEAK")) {
      methods.sendTextEmbed(
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

    if (!this.audioChannel?.members.has(bot.user!.id))
      methods.sendTextEmbed(`Joined ${this.audioChannel!.toString()}`);

    await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 3e4); // 6e4: 60s

    return true;
  }

  /**
   * Makes the player start playing the current track
   */
  public async play() {
    let { methods, message } = this.messageInstance;

    let joined = await this.join();
    if (!joined) return;

    let track = await databaseHandler.getFirstTrack(message.guildId!);
    if (!track) return methods.sendTextEmbed(`The playlist is empty !`);

    let connection = voice.getVoiceConnection(message.guildId ?? "");
    if (!connection)
      return methods.sendTextEmbed(
        `${reactions.error.random} Internal error: couldn't get voice connection !`
      );

    this.currentTrackMessage = await methods.sendTextEmbed(`Loading audio...`);

    let player = (this.currentPlayer = new TrackPlayer(track));
    player.setup(this);

    let failedFn = async () => {
      await methods.sendTextEmbed(
        `${reactions.error.random} Couldn't play current track. Skipping...`
      );
      player.stop();
      await this.playNextTrack();
    };

    if (!track.videoID) return failedFn();

    await player.play(track.videoID).catch((e) => {
      log.system.error(`Failed to play track:`);
      console.log(e);
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
    let { message } = this.messageInstance;
    await databaseHandler.removeFirstTrack(message.guildId!);
    await this.play();
  }

  public destroy() {
    let { message } = this.messageInstance;
    voice.getVoiceConnection(message.guildId ?? "")?.destroy();
    controllersManager.remove(message.guildId!);
  }
}
