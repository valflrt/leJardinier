import ytdl, { MoreVideoDetails } from "ytdl-core";
import axios from "axios";

import { playlistManager } from "./database";
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

	public save = (guildId: string) =>
		playlistManager.addSong(guildId, {
			name: this.details!.title,
			details: this.details!,
		});

	private getSongDetails = async () =>
		await ytdl.getBasicInfo(this.commandArgs!);
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
