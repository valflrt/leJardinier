import { StageChannel, VoiceChannel } from "discord.js";
import * as voice from "@discordjs/voice";
import { bold, hyperlink } from "@discordjs/builders";

import ytdl from "ytdl-core";
import playerManager from "./playerManager";

import MessageInstance from "../../bot/message";
import { SentMessage } from "../../declarations/types";

import database from "../../managers/database";

import reactions from "../../assets/reactions";
import log from "../../bot/log";
import { VideoDetails } from "./types";

export default class GuildPlayer {
  public guildId: string;
  public initialized: boolean = false;

  private messageInstance: MessageInstance;

  private connection?: voice.VoiceConnection;
  private player?: voice.AudioPlayer;

  private currentSongMessage?: SentMessage;

  public audioChannel?: VoiceChannel | StageChannel;
  public currentSong: VideoDetails | null = null;

  constructor(messageInstance: MessageInstance) {
    this.guildId = messageInstance.message.guildId!;
    this.messageInstance = messageInstance;
  }

  public async join() {
    let { methods, message, bot } = this.messageInstance;

    if (!message.member?.voice.channel)
      return methods.sendTextEmbed(
        `${reactions.error.random} You need to be in a voice channel`
      );
    this.audioChannel = message.member!.voice.channel;

    let permissions = this.audioChannel!.permissionsFor(
      this.audioChannel!.guild.me!
    );
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return methods.sendTextEmbed(
        `${reactions.error.random} I am not allowed to join voice channels !\n`.concat(
          `Please contact the moderator of this guild.`
        )
      );

    this.connection = voice.joinVoiceChannel({
      guildId: this.audioChannel!.guildId,
      channelId: this.audioChannel!.id,
      adapterCreator: this.audioChannel!.guild
        .voiceAdapterCreator as voice.DiscordGatewayAdapterCreator,
    });

    if (!this.audioChannel?.members.has(bot.user!.id))
      methods.sendTextEmbed(`Joined ${this.audioChannel!.toString()}`);
  }

  public async play() {
    let { methods } = this.messageInstance;

    this.currentSongMessage = await methods.sendTextEmbed(`Loading audio...`);

    await this.getNextSong();
    if (!this.currentSong)
      return this.currentSongMessage?.editWithTextEmbed(
        `The playlist is empty !`
      );

    this.initPlayer();

    if (!this.currentSong!.id)
      return this.currentSongMessage?.editWithTextEmbed(
        `Couldn't read this song !`
      );

    this.connection!.once(voice.VoiceConnectionStatus.Ready, async () => {
      this.player!.play(
        await this.createResource(
          ytdl(this.currentSong!.id!, { filter: "audioonly" })
        )
      );
      this.connection!.subscribe(this.player!);
    });
  }

  private initPlayer() {
    let { methods } = this.messageInstance;

    this.player = voice.createAudioPlayer({
      behaviors: {
        noSubscriber: voice.NoSubscriberBehavior.Pause,
      },
    });

    this.player.on(voice.AudioPlayerStatus.Playing, () => {
      this.currentSongMessage?.editWithCustomEmbed((embed) =>
        embed
          .setThumbnail(
            this.currentSong!.snippet?.thumbnails?.default?.url ?? ""
          )
          .setDescription(
            `${reactions.success.random} Now playing ${bold(
              hyperlink(
                this.currentSong!.snippet?.title ?? "unknown",
                this.currentSong!.id
                  ? `https://youtu.be/${this.currentSong!.id!}`
                  : ""
              )
            )}`
          )
      );
    });

    this.player.on(voice.AudioPlayerStatus.Idle, async () => {
      await this.skipSong();
      await this.play();
    });

    this.player.on("error", (err) => {
      methods.sendTextEmbed(
        `${reactions.error.random} An unknown error occurred (connection might have crashed)`
      );
      log.system.error(`Audio connection crashed: ${err}`);
    });

    return;
  }

  private async createResource(resource: any) {
    let { stream, type } = await voice.demuxProbe(resource);
    return voice.createAudioResource(stream, { inputType: type });
  }

  private async getNextSong() {
    let songFromDb = (
      await database.guilds.findOne({
        id: this.messageInstance.message.guildId!,
      })
    )?.playlist!.shift();
    this.currentSong = songFromDb ?? null;
    return this.currentSong;
  }

  public async skipSong() {
    let guild = await database.guilds.findOne({
      id: this.messageInstance.message.guildId!,
    });
    if (!guild)
      return log.system.error("Failed to skip song: Guild not found !") as void;
  }

  public destroy() {
    this.connection?.destroy();
    playerManager.remove(this.guildId);
  }
}
