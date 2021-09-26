import {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
	NoSubscriberBehavior,
	AudioPlayerStatus,
	AudioPlayer,
} from "@discordjs/voice";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import axios from "axios";

import { InternalDiscordGatewayAdapterCreator, MessageEmbed } from "discord.js";

import MessageInstance from "./message";
import { playlistManager } from "./database";
import reactions from "../assets/reactions";

import keys from "../config/keys";
import log, { logger } from "./log";

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

class GuildConnectionHandler {
	private players: AudioPlayer[] = [];

	public play = async (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;

		if (!message.member?.voice.channel)
			return methods.sendEmbed(
				`${reactions.error.random()} You need to be in a voice channel`
			);
		let audioChannel = message.member!.voice.channel;

		let song = await this.getNextSong(messageInstance);
		if (!song) return;

		let permissions = audioChannel.permissionsFor(audioChannel.guild.me!);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return;

		let connection = getVoiceConnection(audioChannel.guildId);

		if (!connection)
			connection = joinVoiceChannel({
				guildId: audioChannel.guildId,
				channelId: audioChannel.id,
				adapterCreator: audioChannel.guild.voiceAdapterCreator,
			});

		await methods.sendEmbed(`${reactions.success.random()} Successfully joined \`${audioChannel.name}\``);

		let player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		player.play(createAudioResource(ytdl(song.video_url)));

		player.on(AudioPlayerStatus.Playing, () => {
			methods.sendCustomEmbed((embed: MessageEmbed) => embed
				.setThumbnail(song!.thumbnails[0].url)
				.setDescription(`${reactions.success.random()} Playing \`${song!.title}\``)
			)
		});

		player.on("error", err => {
			methods.sendEmbed(`${reactions.error.random()} An unknown error occurred (connection might have crashed)`);
			logger.error(`Audio connection crashed: ${err}`);
		});

		player.on(AudioPlayerStatus.Idle, async () => {
			await playlistManager.skipSong(message.guildId!);
			song = await this.getNextSong(messageInstance);
			if (!song) return connection!.destroy();
			player.play(createAudioResource(ytdl(song.video_url)));
		});

		connection.subscribe(player);

	};

	private getNextSong = async (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;
		let song = await playlistManager.getFirstSong(message.guildId!);
		if (!song) await methods.sendEmbed(`The playlist is empty !`);
		return song;
	};
}

export const guildConnectionHandler = new GuildConnectionHandler();

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
