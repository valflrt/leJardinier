import { MessageEmbed } from "discord.js";
import { bold, inlineCode, hyperlink } from "@discordjs/builders";

import CCommand from "../../lib/command/classes/command";

import database from "../../bot/database";
import { PlaylistModel } from "../../lib/database/models/playlist";

import * as Music from "../../bot/music";

import reactions from "../../assets/reactions";
import CSubcommandPreview from "../../lib/formatting/subcommand";

const music = new CCommand()
	.setName("music")
	.setDescription("Music command")
	.setExecution(async (messageInstance) => {
		let { methods } = messageInstance;
		methods.sendCustomEmbed((embed) =>
			embed
				.setDescription(
					`You can play some good tunes with this command ${reactions.smile.random()}\n`.concat(
						`Here are the available commands:`
					)
				)
				.setFields(CSubcommandPreview.createFields(music.commands))
		);
	})

	// play
	.addSubcommand((c) =>
		c
			.setName("play")
			.addAlias("p")
			.setDescription("Start playing music from the current playlist")
			.setExecution(async (messageInstance) => {
				let player = new Music.GuildPlayer(messageInstance);
				Music.playerManager.register(player);
				await player.join();
				await player.play();
			})
			.addHelpCommand()
	)

	// add
	.addSubcommand((c) =>
		c
			.setName("add")
			.setDescription("Adds a song to the playlist")
			.setExecution(async (messageInstance) => {
				let { methods } = messageInstance;
				methods.sendCustomEmbed((embed) =>
					embed
						.setDescription(
							`Use this command to add a song to the playlist:`
						)
						.addFields(
							CSubcommandPreview.createFields(
								music.commands.find(
									(c) => c.identifier === "add"
								)!.commands
							)
						)
				);
			})

			// add.yturl
			.addSubcommand((c) =>
				c
					.setName("youtube url")
					.setIdentifier("youtubeurl")
					.addAlias("url")
					.setDescription(
						"Add a song to the current playlist from a youtube url"
					)
					.addParameter((p) =>
						p.setName("youtube url").setRequired(true)
					)
					.setExecution(async (messageInstance) => {
						let { methods, message, commandParameters } =
							messageInstance;

						if (commandParameters.length === 0)
							return methods.sendTextEmbed(
								`${reactions.error.random()} You must specify the video url`
							);

						let sent = await methods.sendTextEmbed(
							`Looking for your song...`
						);

						let song = new Music.Song(commandParameters);

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
										`Added ${bold(
											hyperlink(
												songDetails.title,
												songDetails.video_url
											)
										)}`
									)
								)
						);
					})
					.addHelpCommand()
			)

			// add.search
			.addSubcommand((c) =>
				c
					.setName("search")
					.setDescription(
						"Add a song to the playlist from youtube search"
					)
					.addParameter((p) =>
						p.setName("youtube search").setRequired(true)
					)
					.setExecution(async (messageInstance) => {
						let { methods, message, commandParameters } =
							messageInstance;

						if (!commandParameters)
							return methods.sendTextEmbed(
								`${reactions.error.random()} You need to specify text to search for`
							);

						let sent = await methods.sendTextEmbed(
							`Looking for your song...`
						);

						let data = await Music.youtubeSearch(commandParameters);

						if (!data)
							return sent.editWithTextEmbed(
								`${reactions.error.random()} No results !\n`.concat(
									`Please try another youtube search ${reactions.smile.random()}`
								)
							);

						await sent.editWithTextEmbed(
							`Song found ! Loading data...`
						);

						let song = new Music.Song(data.id.videoId);

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
									`${reactions.success.random()} Added ${bold(
										hyperlink(
											songDetails.title,
											songDetails.video_url
										)
									)}`
								)
						);
					})
					.addHelpCommand()
			)
	)

	// skip
	.addSubcommand((c) =>
		c
			.setName("skip")
			.setDescription(`Skip current song`)
			.setExecution(async (messageInstance) => {
				let { methods, message } = messageInstance;
				let player = Music.playerManager.get(message.guildId!);
				if (!player?.initialized)
					return methods.sendTextEmbed(
						`${reactions.error.random()} You need to use ${inlineCode(
							`lj!music play`
						)} before skipping a song !`
					);
				await player.skipSong();
				await methods.sendTextEmbed(
					`${reactions.success.random()} Song skipped !`
				);
				await player.play();
			})
			.addHelpCommand()
	)

	// stop
	.addSubcommand((c) =>
		c
			.setName("stop")
			.setDescription("Stop the music")
			.setExecution(async (messageInstance) => {
				let { methods, message } = messageInstance;

				Music.playerManager.get(message.guildId!)?.destroy();
				methods.sendTextEmbed(
					`${reactions.success.random()} Stopped playing !`
				);
			})
			.addHelpCommand()
	)

	// playlist
	.addSubcommand((c) =>
		c
			.setName("playlist")
			.addAlias("pl")
			.setDescription("Display the current playlist")
			.setExecution(async (messageInstance) => {
				let { methods, message } = messageInstance;

				let playlist = await PlaylistModel.findOne({
					guildId: message.guildId!,
				});
				if (!playlist || !playlist.songs || playlist.songs.length === 0)
					return methods.sendTextEmbed(`The playlist is empty !`);

				let songs = playlist
					.songs!.map(
						(song, i) =>
							`${inlineCode(` ${i + 1} `)} ${inlineCode(
								song.title
							)}`
					)
					.join("\n");

				methods.sendTextEmbed(
					`Here is the current playlist:\n`.concat(songs)
				);
			})
			.addHelpCommand()
	)

	// clear
	.addSubcommand((c) =>
		c
			.setName("clear")
			.addAlias("cl")
			.setDescription(`Clear the current playlist`)
			.setExecution(async (messageInstance) => {
				let { methods, message } = messageInstance;
				let cleared = await database.playlists.clear(message.guildId!);
				if (cleared === null)
					return methods.sendTextEmbed(
						`${reactions.success.random()} Playlist already empty`
					);
				methods.sendTextEmbed(
					`${reactions.success.random()} Playlist cleared`
				);
			})
			.addHelpCommand()
	)

	// remove
	.addSubcommand((c) =>
		c
			.setName("remove")
			.addAlias("rm")
			.setDescription("Removes one song the current playlist")
			.addParameter((p) => p.setName("song id").setRequired(true))
			.setExecution(async (messageInstance) => {
				let { methods, message, commandParameters } = messageInstance;

				if (!commandParameters)
					return methods.sendTextEmbed(
						`${reactions.error.random()} You need to specify an id !`
					);

				let songId = +commandParameters;

				if (!songId || !Number.isInteger(songId))
					return methods.sendTextEmbed(
						`${reactions.error.random()} Incorrect id !\n`.concat(
							`Please use an integer as id (eg: 1, 2, 56, 5797837, ...)`
						)
					);

				let playlist = await PlaylistModel.findOne({
					guildId: message.guildId!,
				});
				if (!playlist)
					return methods.sendTextEmbed(
						`${reactions.success.random()} Current playlist is empty`
					);

				let removed = playlist.songs!.splice(songId - 1, 1)[0];
				await playlist.save();

				methods.sendTextEmbed(
					`${reactions.success.random()} Removed\n`.concat(
						`${inlineCode(` ${songId} `)} ${inlineCode(
							removed.title
						)}`
					)
				);
			})
			.addHelpCommand()
	);

export default music;
