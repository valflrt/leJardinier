import * as voice from "@discordjs/voice";

import { Track } from "../classes/track";

import log from "../../../bot/log";

import reactions from "../../../assets/reactions";
import MusicController from "./controller";
import ytdl from "ytdl-core";

export default class TrackPlayer {
  private audioPlayer: voice.AudioPlayer;

  private track: Track;

  public state?: string;

  constructor(track: Track) {
    this.audioPlayer = voice.createAudioPlayer({
      behaviors: {
        noSubscriber: voice.NoSubscriberBehavior.Pause,
      },
    });
    this.track = track;
  }

  /**
   * Creates an audio resource
   * @param videoId video id of the video to fetch
   */
  public play(videoId: string) {
    return new Promise<void>(async (resolve, reject) => {
      let ytdlStream;
      try {
        ytdlStream = ytdl(videoId, {
          quality: "lowest",
          filter: "audioonly",
        });
        if (!ytdlStream) return reject(new Error("Stream unavailable"));
        let { stream, type } = await voice.demuxProbe(ytdlStream);
        if (this.audioPlayer.playable)
          this.audioPlayer.play(
            voice.createAudioResource(stream, { inputType: type })
          );
      } catch (e) {
        return reject(e);
      }
      return resolve();
    });
  }

  public stop() {
    this.audioPlayer.stop();
  }

  public setup(musicController: MusicController) {
    let { context, currentTrackMessage } = musicController;
    let { actions } = context;

    this.audioPlayer.on(voice.AudioPlayerStatus.Playing, (os, ns) => {
      this.state = ns.status;
      currentTrackMessage!.editWithCustomEmbed((embed) =>
        embed
          .setThumbnail(this.track.thumbnailsURL)
          .setDescription(
            `${reactions.success.random} Now playing ${
              this.track.generateTrackURL() ?? "unknown"
            }`
          )
      );
    });

    this.audioPlayer.on(voice.AudioPlayerStatus.Idle, async (os, ns) => {
      this.state = ns.status;
      this.audioPlayer.stop();
      musicController.playNextTrack();
    });

    this.audioPlayer.on("error", async (err) => {
      actions.sendTextEmbed(
        `${reactions.error.random} An unknown error occurred (connection might have crashed).\n`.concat(
          `Playing next track...`
        )
      );
      log.error(`Audio connection crashed: ${err}`);
    });
  }

  public toObject(): voice.AudioPlayer {
    return this.audioPlayer;
  }
}
