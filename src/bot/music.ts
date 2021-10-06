import * as voice from "@discordjs/voice";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import axios from "axios";

import { Message, MessageEmbed, StageChannel, VoiceChannel } from "discord.js";

import { playlistManager } from "./database";
import MessageInstance from "./message";
import reactions from "../assets/reactions";

import { secrets } from "../config";

import { logger } from "./log";

export class Song {
	private commandArgs: string;

	constructor(commandArgs: string) {
		this.commandArgs = commandArgs;
	}

	get found(): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) =>
			(await this.fetchSong()) ? resolve(true) : reject(false)
		);
	}

	get details(): Promise<MoreVideoDetails | undefined> {
		return this.fetchSong();
	}

	public save = async (guildId: string) =>
		playlistManager.add(guildId, (await this.fetchSong())!);

	private fetchSong = async (): Promise<MoreVideoDetails | undefined> =>
		(await ytdl.getBasicInfo(this.commandArgs!))?.videoDetails;
}

class PlayerManager {
	private players: GuildPlayer[] = [];

	register(guildPlayer: GuildPlayer) {
		this.players.push(guildPlayer);
	}

	get(guildId: string): GuildPlayer | undefined {
		return this.players.find((player) => player.guildId === guildId);
	}

	remove(guildId: string) {
		this.players = this.players.filter(
			(player) => player.guildId !== guildId
		);
	}
}

export const playerManager = new PlayerManager();

export class GuildPlayer {
	public guildId: string;
	public initialized: boolean = false;

	private messageInstance: MessageInstance;

	private connection?: voice.VoiceConnection;
	private player?: voice.AudioPlayer;

	private currentSongMessage?: Message;

	public audioChannel?: VoiceChannel | StageChannel;
	public currentSong: MoreVideoDetails | null | undefined = null;

	constructor(messageInstance: MessageInstance) {
		this.guildId = messageInstance.message.guildId!;
		this.messageInstance = messageInstance;
	}

	public async join() {
		let { methods, message } = this.messageInstance;


		if (!message.member?.voice.channel)
			return methods.sendEmbed(
				`${reactions.error.random()} You need to be in a voice channel`
			);
		this.audioChannel = message.member!.voice.channel;

		let permissions = this.audioChannel!.permissionsFor(
			this.audioChannel!.guild.me!
		);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
			return methods.sendEmbed(
				`${reactions.error.random()} I am not allowed to join voice channels !`.concat(
					`Please contact the moderator of this guild.`
				)
			);

		this.connection = voice.joinVoiceChannel({
			guildId: this.audioChannel!.guildId,
			channelId: this.audioChannel!.id,
			adapterCreator: this.audioChannel!.guild
				.voiceAdapterCreator as voice.DiscordGatewayAdapterCreator,
		});

		methods.sendEmbed(
			`Joined ${this.audioChannel!.toString()}`
		);

	}

	public async play() {
		let { methods } = this.messageInstance;

		this.currentSongMessage = await methods.sendEmbed(`Loading audio...`);

		await this.getNextSong();
		if (!this.currentSong)
			return this.currentSongMessage?.edit({
				embeds: [methods.returnEmbed(`The playlist is empty !`)],
			});

		this.initPlayer();

		this.connection!.once(
			voice.VoiceConnectionStatus.Ready,
			async () => {
				this.player!.play(
					await this.createResource(ytdl(this.currentSong!.video_url, { filter: "audioonly" }))
				);
				this.connection!.subscribe(this.player!);
			}
		);

	}

	private initPlayer() {
		let { methods } = this.messageInstance;

		this.player = voice.createAudioPlayer({
			behaviors: {
				noSubscriber: voice.NoSubscriberBehavior.Pause,
			},
		});

		this.player.on(voice.AudioPlayerStatus.Playing, () => {
			this.currentSongMessage?.edit({
				embeds: [
					methods.returnCustomEmbed((embed: MessageEmbed) =>
						embed
							.setThumbnail(this.currentSong!.thumbnails[0].url)
							.setDescription(
								`${reactions.success.random()} Now playing \`${this.currentSong!.title
								}\``
							)
					),
				],
			});
		});

		this.player.on(voice.AudioPlayerStatus.Idle, async () => {
			await this.skipSong();
			await this.play();
		});

		this.player.on("error", (err) => {
			methods.sendEmbed(
				`${reactions.error.random()} An unknown error occurred (connection might have crashed)`
			);
			logger.error(`Audio connection crashed: ${err}`);
			this.destroy();
		});

		return;
	}

	private async createResource(resource: any) {
		let { stream, type } = await voice.demuxProbe(resource);
		return voice.createAudioResource(stream, { inputType: type });
	}

	private async getNextSong() {
		this.currentSong = await playlistManager.getFirst(
			this.messageInstance.message.guildId!
		);
		return this.currentSong;
	}

	public async skipSong() {
		await playlistManager.removeFirst(
			this.messageInstance.message.guildId!
		);
	}

	public destroy() {
		this.connection?.destroy();
		playerManager.remove(this.guildId);
	}
}

export const youtubeSearch = async (searchString: string) =>
	(
		await axios.get(
			`https://youtube.googleapis.com/youtube/v3/search?`
				.concat(`part=snippet`)
				.concat(`&q=${searchString}`)
				.concat(`&type=video`)
				.concat(`&key=${secrets.youtube}`)
		)
	).data.items[0];
