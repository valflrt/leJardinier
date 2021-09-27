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

import { MessageEmbed } from "discord.js";

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

	get(guildId: string) {
		this.players.find((player) => player.guildId === guildId);
	}
}

export const playerManager = new PlayerManager();

export class GuildPlayer {
	public guildId: string;
	private initialized: boolean = false;

	private messageInstance: MessageInstance;

	private connection?: VoiceConnection;
	private player?: AudioPlayer;

	private currentSong: MoreVideoDetails | null | undefined = null;

	constructor(messageInstance: MessageInstance) {
		this.guildId = messageInstance.message.guildId!;
		this.messageInstance = messageInstance;
	}

	public async start() {
		let { methods, message } = this.messageInstance;

		if (!message.member?.voice.channel)
			return methods.sendEmbed(
				`${reactions.error.random()} You need to be in a voice channel`
			);
		let audioChannel = message.member!.voice.channel;

		let song = await this.getNextSong();
		if (!song) return;

		let permissions = audioChannel.permissionsFor(audioChannel.guild.me!);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return;

		this.connection = getVoiceConnection(audioChannel.guildId);

		if (!this.connection)
			this.connection = joinVoiceChannel({
				guildId: audioChannel.guildId,
				channelId: audioChannel.id,
				adapterCreator: audioChannel.guild.voiceAdapterCreator,
			});

		await methods.sendEmbed(
			`${reactions.success.random()} Successfully joined \`${
				audioChannel.name
			}\``
		);

		this.connection!.subscribe(this.player!);
	}

	private async play() {
		let { methods, message } = this.messageInstance;

		let player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		player.play(createAudioResource(ytdl(this.currentSong!.video_url)));

		player.on(AudioPlayerStatus.Playing, () => {
			methods.sendCustomEmbed((embed: MessageEmbed) =>
				embed
					.setThumbnail(this.currentSong!.thumbnails[0].url)
					.setDescription(
						`${reactions.success.random()} Playing \`${
							this.currentSong!.title
						}\``
					)
			);
		});

		player.on("error", (err) => {
			methods.sendEmbed(
				`${reactions.error.random()} An unknown error occurred (connection might have crashed)`
			);
			logger.error(`Audio connection crashed: ${err}`);
		});

		player.on(AudioPlayerStatus.Idle, async () => {
			await playlistManager.skipSong(message.guildId!);
			this.currentSong = await this.getNextSong();
			if (!this.currentSong) return this.connection!.destroy();
			player.play(createAudioResource(ytdl(this.currentSong!.video_url)));
		});
	}

	private async getNextSong() {
		let { methods, message } = this.messageInstance;
		this.currentSong = await playlistManager.getFirstSong(message.guildId!);
		if (!this.currentSong)
			await methods.sendEmbed(`The playlist is empty !`);
		return this.currentSong;
	}

	public async skipSong(messageInstance: MessageInstance) {
		await playlistManager.skipSong(messageInstance.message.guildId!);
		this.play();
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
