import {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
	NoSubscriberBehavior,
	AudioPlayerStatus,
	AudioPlayer,
	VoiceConnection,
} from "@discordjs/voice";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import axios from "axios";

import { MessageEmbed, StageChannel, VoiceChannel } from "discord.js";

import MessageInstance from "./message";
import { playlistManager } from "./database";
import reactions from "../assets/reactions";

import keys from "../config/keys";
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
		playlistManager.addSong(guildId, (await this.fetchSong())!);

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
		this.players = this.players.filter(player => player.guildId !== guildId);
	}
}

export const playerManager = new PlayerManager();

export class GuildPlayer {
	public guildId: string;
	public initialized: boolean = false;

	private messageInstance: MessageInstance;

	private connection?: VoiceConnection;
	private player?: AudioPlayer;

	public audioChannel?: VoiceChannel | StageChannel;
	public currentSong: MoreVideoDetails | null | undefined = null;

	constructor(messageInstance: MessageInstance) {
		this.guildId = messageInstance.message.guildId!;
		this.messageInstance = messageInstance;
	}

	public async init() {
		let { methods, message } = this.messageInstance;

		if (!message.member?.voice.channel)
			return methods.sendEmbed(
				`${reactions.error.random()} You need to be in a voice channel`
			);
		this.audioChannel = message.member!.voice.channel;

		let permissions = this.audioChannel!.permissionsFor(this.audioChannel!.guild.me!);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return;

		this.initialized = true;
	}

	public async join() {
		let { } = this.messageInstance;

		this.connection = getVoiceConnection(this.audioChannel!.guildId);

		if (!this.connection)
			this.connection = joinVoiceChannel({
				guildId: this.audioChannel!.guildId,
				channelId: this.audioChannel!.id,
				adapterCreator: this.audioChannel!.guild.voiceAdapterCreator,
			});

		this.connection!.subscribe(this.player!);
	}

	public async play() {
		let { methods } = this.messageInstance;

		await this.getNextSong();
		if (!this.currentSong) return methods.sendEmbed(`The playlist is empty !`);

		if (!this.player)
			this.initPlayer();

		this.player!.play(createAudioResource(ytdl(this.currentSong!.video_url)));
	}

	private initPlayer() {
		let { methods } = this.messageInstance

		if (!this.player) {
			this.player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});

			this.player.on(AudioPlayerStatus.Playing, () => {
				methods.sendCustomEmbed((embed: MessageEmbed) =>
					embed
						.setThumbnail(this.currentSong!.thumbnails[0].url)
						.setDescription(
							`${reactions.success.random()} Playing \`${this.currentSong!.title
							}\``
						)
				);
			});

			this.player.on("error", (err) => {
				methods.sendEmbed(
					`${reactions.error.random()} An unknown error occurred (connection might have crashed)`
				);
				logger.error(`Audio connection crashed: ${err}`);
			});

			this.player.on(AudioPlayerStatus.Idle, async () => {
				await this.skipSong();
				await this.play();
			});
		}
	}

	private async getNextSong() {
		let { message } = this.messageInstance;
		this.currentSong = await playlistManager.getFirstSong(message.guildId!);
		return this.currentSong;
	}

	public async skipSong() {
		await playlistManager.skipSong(this.messageInstance.message.guildId!);
	}
}

export const youtubeSearch = async (searchString: string) =>
	(
		await axios.get(
			`https://youtube.googleapis.com/youtube/v3/search?`
				.concat(`part=snippet`)
				.concat(`&q=${searchString}`)
				.concat(`&type=video`)
				.concat(`&key=${keys.youtube}`)
		)
	).data.items[0];
