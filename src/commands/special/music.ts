import { MessageEmbed } from "discord.js";

import { Command } from "../../bot/command";
import MessageInstance from "../../bot/message";

import { PlaylistModel } from "../../database/models/playlist";
import { guildConnectionHandler, Song, youtubeSearch } from "../../bot/music";

import reactions from "../../assets/reactions";

const music = new Command({
	name: "music",
	description: `Music command`,
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;
	},
	subcommands: [
		new Command({
			name: "play",
			description: `Start playing music from the playlist`,
			execution: async (messageInstance: MessageInstance) => {
				guildConnectionHandler.play(messageInstance);
			},
		}),
		new Command({
			name: "url",
			description: `Add a song to the playlist from a youtube url`,
			arguments: `[youtube url]`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message, commandArgs } = messageInstance;

				if (!commandArgs)
					return methods.sendEmbed(
						`${reactions.error.random()} You must specify the video url`
					);

				let song = new Song(commandArgs!);

				if (!(await song.found))
					return methods.sendEmbed(
						`${reactions.error.random()} Song not found please check your youtube url`
					);

				await song.save(message.guildId!);

				let songDetails = (await song.details)!;

				methods.sendCustomEmbed((embed: MessageEmbed) =>
					embed
						.setThumbnail(songDetails.thumbnails[0].url)
						.setDescription(
							`${reactions.success.random()} Successfully added \`${songDetails.title}\``
						)
				);
			},
		}),
		new Command({
			name: "search",
			description: `Add a song to the playlist from youtube search`,
			arguments: `[youtube search]`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message, commandArgs } = messageInstance;

				if (!commandArgs)
					return methods.sendEmbed(
						`${reactions.error.random()} You must specify text to search for`
					);

				let data = await youtubeSearch(commandArgs!);

				if (!data)
					return methods.sendEmbed(
						`${reactions.error.random()} Couldn't find the researched video`
					);

				let song = new Song(data.id.videoId);

				if (!(await song.found))
					return methods.sendEmbed(
						`${reactions.error.random()} Song not found please try another youtube search`
					);

				await song.save(message.guildId!);

				let songDetails = (await song.details)!;

				methods.sendCustomEmbed((embed: MessageEmbed) =>
					embed
						.setThumbnail(songDetails.thumbnails[0].url)
						.setDescription(
							`${reactions.success.random()} Successfully added song: ${songDetails.title
							}`
						)
				);
			},
		}),
		new Command({
			name: "skip",
			description: `Skip current song`,
			execution: (messageInstance: MessageInstance) => {
				let { methods } = messageInstance;
			},
		}),
		new Command({
			name: "playlist",
			description: `Display playlist`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				let playlist = await PlaylistModel.findOne({ guildId: message.guildId! });
				if (!playlist) return methods.sendEmbed(`The playlist is empty !`);

				let songs = playlist.songs!.map(song => `\`${song.title}\``).join("\n");

				methods.sendEmbed(`Here is the current playlist:\n`
					.concat(songs));
			},
		}),
		new Command({
			name: "clear",
			description: `Clear the playlist`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				let playlist = await PlaylistModel.findOne({
					guildId: message.guildId!,
				});
				if (!playlist) {
					new PlaylistModel({ guildId: message.guildId });
					return methods.sendEmbed(`Playlist already cleared`);
				}
				playlist.songs = [];
				await playlist.save();
				methods.sendEmbed(
					`${reactions.success.random()} Playlist successfully cleared`
				);
			},
		}),
	],
});

export default music;
