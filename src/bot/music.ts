import { VoiceChannel } from "discord.js";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import axios from "axios";

import { playlistManager } from "./database";
import MessageInstance from "./message";
import { ISong } from "../types";

import keys from "../config/keys";

export class Song {
	private commandArgs: string;

	public details?: MoreVideoDetails;
	public songFound?: boolean;

	constructor(commandArgs: string) {
		this.commandArgs = commandArgs;
	}

	public init = async () => {
		await this.getSongDetails()
			.then((details) => {
				this.details = details.videoDetails;
				this.songFound = true;
			})
			.catch(() => (this.songFound = false));
	};

	// TODO: find a way to replace method get

	public get = (): ISong => ({
		name: this.details!.title,
		details: this.details!,
	});

	private getSongDetails = async () =>
		await ytdl.getBasicInfo(this.commandArgs!);
}

export class AudioChannelManager  {

	private channel: VoiceChannel;

	constructor(channel: VoiceChannel) {
		this.channel = channel;
	}

	public startPlaying = async () => {
		let song = await playlistManager.getFirstSong(this.channel.guildId);
		if (!song) return;
		this.channel
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
				.concat(`&key=${keys.youtube}`)
		)
	).data.items[0];
