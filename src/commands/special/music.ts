import { EmbedFieldData } from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";

import database from "../../managers/database";
import youtubeAPI from "../../managers/api/youtube";

import GuildPlayer from "../../middlewares/music/guildPlayer";
import playerManager from "../../middlewares/music/playerManager";

import PrePlaylist from "../../middlewares/music/classes/playlist";
import PreTrack from "../../middlewares/music/classes/track";

import reactions from "../../assets/reactions";

const music = new CCommand()
  .setName("music")
  .setDescription("Music command")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription(
          `You can play some good tunes with this command ${reactions.smile.random}\n`.concat(
            `Here are the available commands:`
          )
        )
        .setFields(
          methods.formatters.CommandPreview.createFields(music.commands)
        )
    );
  })

  // play
  .addSubcommand((c) =>
    c
      .setName("play")
      .addAlias("p")
      .setDescription("Start playing music from the current playlist")
      .setExecution(async (messageInstance) => {
        let player = new GuildPlayer(messageInstance);
        playerManager.register(player);
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
              `Use this command to add a song to the playlist from youtube:`
            )
            .addFields(
              methods.formatters.CommandPreview.createFields(
                music.commands.find((c) => c.identifier === "add")!.commands
              )
            )
        );
      })
      .addHelpCommand()

      // add.yturl
      .addSubcommand((c) =>
        c
          .setName("youtube url")
          .setIdentifier("youtubeurl")
          .addAlias("url")
          .setDescription(
            "Add a song to the current playlist from a youtube url"
          )
          .addParameter((p) => p.setName("youtube url").setRequired(true))
          .setExecution(async (messageInstance) => {
            let { methods, message, commandParameters } = messageInstance;

            if (commandParameters.length === 0)
              return methods.sendTextEmbed(
                `${reactions.error.random} You must specify the video url`
              );

            let sent = await methods.sendTextEmbed(`Looking for your song...`);

            let track = await new PreTrack().fromURL(commandParameters);

            if (!track)
              return methods.sendTextEmbed(
                `${reactions.error.random} Couldn't find the song you're looking for ! `.concat(
                  `You could try checking your url or giving another one`
                )
              );

            await track.saveToDB(message.guildId!);

            await sent.editWithEmbed(
              track
                .generateEmbed(messageInstance)
                .setDescription(
                  `${
                    reactions.success.random
                  } Added ${track.generateTrackURL()}`
                )
            );
          })
          .addHelpCommand()
      )

      // music.playlisturl
      .addSubcommand((c) =>
        c
          .setName("playlist url")
          .setIdentifier("playlisturl")
          .addAlias("plurl")
          .setDescription(
            "Adds multiples songs from a youtube playlist url. (20 items maximum in the playlist)"
          )
          .setExecution(async (messageInstance) => {
            let { methods, message, commandParameters } = messageInstance;

            if (commandParameters.length === 0)
              return methods.sendTextEmbed(
                `${reactions.error.random} You need to specify the playlist url !`
              );

            let sent = await methods.sendTextEmbed(
              `Looking for your playlist...`
            );

            let playlist = await new PrePlaylist().fromURL(commandParameters);

            if (!playlist)
              return methods.sendTextEmbed(
                `${reactions.error.random} Couldn't find the playlist !\n`.concat(
                  `Your url may be invalid.`
                )
              );

            await playlist.saveTracksToDB(message.guildId!);

            sent.editWithCustomEmbed((embed) =>
              embed
                .setDescription(
                  `${reactions.success.random} Tracks found ${reactions.smile.random}\n`.concat(
                    `Added:\n`.concat(playlist!.generatePreview())
                  )
                )
                .addFields()
            );
          })
      )

      // add.search
      .addSubcommand((c) =>
        c
          .setName("search")
          .setDescription("Add a song to the playlist from youtube search")
          .addParameter((p) => p.setName("youtube search").setRequired(true))
          .setExecution(async (messageInstance) => {
            let { methods, message, commandParameters } = messageInstance;

            if (commandParameters.length === 0)
              return methods.sendTextEmbed(
                `${reactions.error.random} You need to specify text to search for ! `
              );

            let sent = await methods.sendTextEmbed(`Looking for your song...`);

            let videoSearchData = await youtubeAPI.searchVideo(
              commandParameters
            );

            if (!videoSearchData?.id?.videoId)
              return sent.editWithTextEmbed(
                `${reactions.error.random} No results !\n`.concat(
                  `Please try another youtube search ${reactions.smile.random}`
                )
              );

            await sent.editWithTextEmbed(`Song found ! Loading details...`);

            let track = await new PreTrack().fromID(videoSearchData.id.videoId);

            if (!track)
              return sent.editWithTextEmbed(
                `${reactions.error.random} Couldn't fetch video information !\n`.concat(
                  `This video could be unavailable...`
                )
              );

            await track.saveToDB(message.guildId!);
            await sent.editWithEmbed(
              track
                .generateEmbed(messageInstance)
                .setDescription(
                  `${
                    reactions.success.random
                  } Added ${track.generateTrackURL()}`
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
      .setDescription(`Skip current track`)
      .setExecution(async (messageInstance) => {
        let { methods, message } = messageInstance;
        let player = playerManager.get(message.guildId!);
        if (!player?.initialized)
          return methods.sendTextEmbed(
            `${reactions.error.random} You can't skip now !`
          );
        await player.removeFirstTrack();
        await methods.sendTextEmbed(
          `${reactions.success.random} Track skipped !`
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

        playerManager.get(message.guildId!)?.destroyConnection();
        methods.sendTextEmbed(`${reactions.success.random} Stopped playing !`);
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

        let guild = await database.guilds.findOne({
          id: message.guildId!,
        });
        if (!guild?.playlist || guild.playlist!.length === 0)
          return methods.sendTextEmbed(`The playlist is empty !`);

        let tracksPreview = guild.playlist!.map((track, i): EmbedFieldData => {
          return {
            name: bold(`#${i + 1}`),
            value: bold(hyperlink(track.title, track.videoURL)),
          };
        });

        methods.sendCustomEmbed((embed) =>
          embed
            .setDescription(`Here is the current playlist:`)
            .addFields(tracksPreview)
        );
      })
      .addHelpCommand()

      // clear
      .addSubcommand((c) =>
        c
          .setName("clear")
          .addAlias("cl")
          .setDescription(`Clear the current playlist`)
          .setExecution(async (messageInstance) => {
            let { methods, message } = messageInstance;
            let cleared = await database.guilds.updateOne(
              {
                id: message.guildId!,
              },
              { playlist: [] }
            );
            if (cleared.ok === 1)
              return methods.sendTextEmbed(
                `${reactions.success.random} Playlist cleared`
              );
          })
          .addHelpCommand()
      )

      // remove
      .addSubcommand((c) =>
        c
          .setName("remove")
          .addAlias("rm")
          .setDescription("Removes a track the current playlist")
          .addParameter((p) => p.setName("track id").setRequired(true))
          .setExecution(async (messageInstance) => {
            let { methods, message, commandParameters } = messageInstance;

            if (!commandParameters)
              return methods.sendTextEmbed(
                `${reactions.error.random} You need to specify an id !`
              );

            let videoID = +(+commandParameters); // used to make sure the number is positive

            if (!videoID || !Number.isInteger(videoID))
              return methods.sendTextEmbed(
                `${reactions.error.random} Incorrect id !\n`.concat(
                  `Please use an integer as id (eg: 1, 2, 56, 5797837, ...)`
                )
              );

            let guild = await database.guilds.findOne({
              id: message.guildId!,
            });
            if (!guild)
              return methods.sendTextEmbed(
                `${reactions.success.random} Current playlist is empty`
              );

            let removed = guild.playlist!.splice(videoID - 1, 1)[0];

            await database.guilds.updateOne(
              {
                id: message.guildId!,
              },
              { playlist: guild.playlist! }
            );

            methods.sendTextEmbed(
              `${reactions.success.random} Removed `.concat(
                `${bold(`#${videoID}`)}: ${bold(
                  hyperlink(removed.title, removed.videoURL)
                )}`
              )
            );
          })
          .addHelpCommand()
      )
  );

export default music;
