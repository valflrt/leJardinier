import ytdl, { MoreVideoDetails } from "ytdl-core";

import { ISong } from "../types";

export class Song {

	private commandArgs: string;

	public details?: MoreVideoDetails;
	public songFound?: boolean;

	constructor(commandArgs: string) {
		this.commandArgs = commandArgs;
	}

	public init = async () => {
		await this.getSongDetails()
			.then(details => {
				this.details = details.videoDetails;
				this.songFound = true;
			}).catch(() => this.songFound = false);
	};

	public get = (): ISong => ({
		name: this.details!.title,
		details: this.details!
	})

	private getSongDetails = async () =>
		await ytdl.getBasicInfo(this.commandArgs!);

}