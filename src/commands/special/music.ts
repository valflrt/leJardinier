import { MessageEmbed } from "discord.js";

import { Command } from "../../bot/command";
import MessageInstance from "../../bot/message";

import { playlistManager } from "../../bot/database";
import { PlaylistModel } from "../../database/models/playlist";
import {
	playerManager,
	GuildPlayer,
	Song,
	youtubeSearch,
} from "../../bot/music";

import { url } from "../../bot/text";
import reactions from "../../assets/reactions";

const music = new Command({
	name: "music",
	description: `Music command`,
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;
		methods.sendTextEmbed(
			`You can play some good tunes with this command ${reactions.smile.random()}\n`
				.concat(`Here are the available commands:\n`)
				.concat(
					music
						.commands!.map(
							(command) =>
								`\`${command.syntax}\` ${command.description}`
						)
						.join("\n")
				)
		);
	},
	commands: [
		new Command({
			name: "play",
			description: `Start playing music from the current playlist`,
			execution: async (messageInstance: MessageInstance) => {
				let player = new GuildPlayer(messageInstance);
				playerManager.register(player);
				await player.join();
				await player.play();
			},
		}),
		new Command({
			name: "url",
			description: `Add a song to the current playlist from a youtube url`,
			arguments: `[youtube url]`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message, commandArgs } = messageInstance;

				if (!commandArgs)
					return methods.sendTextEmbed(
						`${reactions.error.random()} You must specify the video url`
					);

				let sent = await methods.sendTextEmbed(
					`Looking for your song...`
				);

				let song = new Song(commandArgs!);

				if (!(await song.found))
					return methods.sendTextEmbed(
						`${reactions.error.random()} Song not found please check your youtube url`
					);

				await song.save(message.guildId!);

				let songDetails = (await song.details)!;

				sent.editWithCustomEmbed((embed: MessageEmbed) =>
					embed
						.setThumbnail(songDetails.thumbnails[0].url)
						.setDescription(
							`${reactions.success.random()} Song found ${reactions.smile.random()}\n`.concat(
								`Added **${url(
									songDetails.title,
									songDetails.video_url
								)}**`
							)
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
					return methods.sendTextEmbed(
						`${reactions.error.random()} You need to specify text to search for`
					);

				let sent = await methods.sendTextEmbed(
					`Looking for your song...`
				);

				let data = await youtubeSearch(commandArgs!);

				if (!data)
					return sent.editWithTextEmbed(
						`${reactions.error.random()} No results !\n`.concat(
							`Please try another youtube search ${reactions.smile.random()}`
						)
					);

				await sent.editWithTextEmbed(`Song found ! Loading data...`);

				let song = new Song(data.id.videoId);

				if (!(await song.found))
					return sent.editWithTextEmbed(
						`${reactions.error.random()} Couldn't find song information !\n`.concat(
							`Please retry ${reactions.smile.random()}`
						)
					);

				await song.save(message.guildId!);

				let songDetails = (await song.details)!;

				sent.editWithCustomEmbed((embed: MessageEmbed) =>
					embed
						.setThumbnail(songDetails.thumbnails[0].url)
						.setDescription(
							`${reactions.success.random()} Added **${url(
								songDetails.title,
								songDetails.video_url
							)}**`
						)
				);
			},
		}),
		new Command({
			name: "skip",
			description: `Skip current song`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;
				let player = playerManager.get(message.guildId!);
				if (!player?.initialized)
					return methods.sendTextEmbed(
						`${reactions.error.random()} You need to use \`lj!music play\` before skipping a song !`
					);
				await player.skipSong();
				await methods.sendTextEmbed(
					`${reactions.success.random()} Song skipped !`
				);
				await player.play();
			},
		}),
		new Command({
			name: "stop",
			description: `Stop the music`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				playerManager.get(message.guildId!)?.destroy();
				methods.sendTextEmbed(
					`${reactions.success.random()} Stopped playing !`
				);
			},
		}),
		new Command({
			name: "playlist",
			description: `Display the current playlist`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				let playlist = await PlaylistModel.findOne({
					guildId: message.guildId!,
				});
				if (!playlist || !playlist.songs || playlist.songs.length === 0)
					return methods.sendTextEmbed(`The playlist is empty !`);

				let songs = playlist
					.songs!.map((song, i) => `\` ${i + 1} \` \`${song.title}\``)
					.join("\n");

				methods.sendTextEmbed(
					`Here is the current playlist:\n`.concat(songs)
				);
			},
		}),
		new Command({
			name: "clear",
			description: `Clear the current playlist`,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;
				let cleared = await playlistManager.clear(message.guildId!);
				if (cleared === null)
					return methods.sendTextEmbed(
						`${reactions.success.random()} Playlist already empty`
					);
				methods.sendTextEmbed(
					`${reactions.success.random()} Playlist successfully cleared`
				);
			},
		}),
	],
});

export default music;
