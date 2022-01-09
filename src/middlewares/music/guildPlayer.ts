import { StageChannel, VoiceChannel } from "discord.js";
import * as voice from "@discordjs/voice";
import { bold, hyperlink } from "@discordjs/builders";

import ytdl from "ytdl-core";
import playerManager from "./playerManager";

import MessageInstance from "../../bot/message";
import { SentMessage } from "../../declarations/types";

import database from "../../managers/database";

import { ITrack } from "./classes/track";

import reactions from "../../assets/reactions";
import log from "../../bot/log";

export default class GuildPlayer {
  public guildId: string;
  public initialized: boolean = false;

  private messageInstance: MessageInstance;

  private connection?: voice.VoiceConnection;
  private connectionReady: boolean = false;

  private player?: voice.AudioPlayer;
  private playerReady: boolean = false;

  private stream?: voice.AudioResource | null;

  private currentTrackMessage?: SentMessage;

  public audioChannel?: VoiceChannel | StageChannel | null;
  public currentTrack: ITrack | null = null;

  constructor(messageInstance: MessageInstance) {
    this.guildId = messageInstance.message.guildId!;
    this.messageInstance = messageInstance;
  }

  /**
   * Makes the bot join the channel where the member is
   */
  public join() {
    let { methods, message, bot } = this.messageInstance;

    return new Promise<void>((resolve, reject) => {
      let contactMod = `Maybe you should contact a moderator of this server.`;

      if (!message.member || !message.member.voice.channel) {
        methods.sendTextEmbed(
          `${reactions.error.random} You need to be in a voice channel !`
        );
        return reject("User is not in a voice channel");
      }
      this.audioChannel = message.member!.voice.channel;

      let permissions = this.audioChannel!.permissionsFor(
        this.audioChannel!.guild.me!
      );
      if (!permissions.has("CONNECT")) {
        methods.sendTextEmbed(
          `${reactions.error.random} I am not allowed to join this voice channel !`.concat(
            contactMod
          )
        );
        return reject("Bot is not allowed to join channel");
      }
      if (!permissions.has("SPEAK")) {
        methods.sendTextEmbed(
          `${reactions.error.random} I am not allowed to speak in this voice channel !\n`.concat(
            contactMod
          )
        );
        return reject("Bot is not speak in join channel");
      }

      this.connection = voice.joinVoiceChannel({
        guildId: this.audioChannel!.guildId,
        channelId: this.audioChannel!.id,
        adapterCreator: this.audioChannel!.guild
          .voiceAdapterCreator as voice.DiscordGatewayAdapterCreator,
      });

      if (!this.audioChannel?.members.has(bot.user!.id))
        methods.sendTextEmbed(`Joined ${this.audioChannel!.toString()}`);

      resolve();
    });
  }

  /**
   * Makes the not start playing the current track
   */
  public async play() {
    let { methods } = this.messageInstance;

    this.currentTrackMessage = await methods.sendTextEmbed(`Loading audio...`);

    await this.getNextTrack();
    if (!this.currentTrack)
      return this.currentTrackMessage?.editWithTextEmbed(
        `The playlist is empty !`
      );

    this.initPlayer();
    await this.initConnection();

    let failedFn = async () => {
      await methods.sendTextEmbed(
        `${reactions.error.random} Couldn't play current track. Skipping...`
      );
      await this.skip();
      this.play();
    };

    if (!this.currentTrack.videoID) return failedFn();

    this.stream = await this.createResource(this.currentTrack!.videoID);
    if (!this.stream) return failedFn();

    this.player!.play(this.stream);
    this.connection!.subscribe(this.player!);
  }

  private initConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.connectionReady) return resolve();
      if (!this.connection) return;
      this.connection!.once(voice.VoiceConnectionStatus.Ready, () => {
        this.connectionReady = true;
        resolve();
      });
    });
  }

  /**
   * Initializes the audio player
   */
  private initPlayer() {
    let { methods } = this.messageInstance;

    if (!this.player?.checkPlayable())
      this.player = voice.createAudioPlayer({
        behaviors: {
          noSubscriber: voice.NoSubscriberBehavior.Pause,
        },
      });

    if (!this.playerReady)
      this.player.on(voice.AudioPlayerStatus.Playing, () => {
        this.currentTrackMessage?.editWithCustomEmbed((embed) =>
          embed
            .setThumbnail(this.currentTrack!.thumbnailsURL)
            .setDescription(
              `${reactions.success.random} Now playing ${bold(
                hyperlink(this.currentTrack!.title, this.currentTrack!.videoURL)
              )}`
            )
        );
      });

    this.player.on(voice.AudioPlayerStatus.Idle, async () => {
      if (this.stream?.ended) {
        await this.skip();
        this.play();
      }
    });

    this.player.on("error", async (err) => {
      methods.sendTextEmbed(
        `${reactions.error.random} An unknown error occurred (connection might have crashed).\n`.concat(
          `Playing next track...`
        )
      );
      log.system.error(`Audio connection crashed: ${err}`);
    });

    return;
  }

  private async createResource(
    videoId: string
  ): Promise<voice.AudioResource | null> {
    return new Promise((resolve) => {
      let resource = ytdl(videoId, {
        quality: "highestaudio",
        filter: "audioonly",
      });
      resource.once("readable", async () => {
        let { stream, type } = await voice.demuxProbe(resource);
        resolve(voice.createAudioResource(stream, { inputType: type }));
      });
      resource.on("error", (e) => {
        console.log(e);
        resolve(null);
      });
    });
  }

  /**
   * returns the first track in the database
   */
  private async getNextTrack() {
    let trackFromDB = (
      await database.guilds.findOne({
        id: this.messageInstance.message.guildId!,
      })
    )?.playlist![0];
    this.currentTrack = trackFromDB ?? null;
    return this.currentTrack;
  }

  public async removeFirstTrack() {
    let guild = await database.guilds.findOne({
      id: this.messageInstance.message.guildId!,
    });
    if (!guild) {
      log.system.error("Failed to skip track: Guild not found !");
      return;
    }
    guild.playlist!.shift();
    if (guild.playlist!.length === 0) return;
    await database.guilds.updateOne(
      {
        id: this.messageInstance.message.guildId!,
      },
      { playlist: guild.playlist! }
    );
    return;
  }

  private async skip() {
    await this.removeFirstTrack();
    let nextTrack = await this.getNextTrack();
    if (!nextTrack)
      return this.messageInstance.methods.sendTextEmbed(
        `The playlist is empty !`
      );
    this.currentTrack = nextTrack;
    await this.play();
  }

  public stopPlaying() {
    this.player?.stop();
  }

  public destroyConnection() {
    this.connection?.destroy();
    playerManager.remove(this.guildId);
  }
}
