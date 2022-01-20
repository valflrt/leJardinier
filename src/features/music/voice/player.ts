import * as voice from "@discordjs/voice";

import { Track } from "../classes/track";

import log from "../../../bot/log";

import reactions from "../../../assets/reactions";
import MusicController from "./controller";

export default class TrackPlayer {
  private audioPlayer: voice.AudioPlayer;

  private track: Track;

  constructor(track: Track) {
    this.audioPlayer = voice.createAudioPlayer({
      behaviors: {
        noSubscriber: voice.NoSubscriberBehavior.Pause,
      },
    });
    this.track = track;
  }

  public play(resource: voice.AudioResource) {
    if (this.audioPlayer.playable) this.audioPlayer.play(resource);
  }

  public stop() {
    this.audioPlayer.stop();
  }

  public setup(musicController: MusicController) {
    let { messageInstance, currentTrackMessage } = musicController;
    let { methods } = messageInstance;

    this.audioPlayer.on(voice.AudioPlayerStatus.Playing, () => {
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

    this.audioPlayer.on(voice.AudioPlayerStatus.Idle, async () => {
      this.audioPlayer.stop();
      musicController.playNextTrack();
    });

    this.audioPlayer.on("error", async (err) => {
      methods.sendTextEmbed(
        `${reactions.error.random} An unknown error occurred (connection might have crashed).\n`.concat(
          `Playing next track...`
        )
      );
      log.system.error(`Audio connection crashed: ${err}`);
    });
  }

  public toObject(): voice.AudioPlayer {
    return this.audioPlayer;
  }
}
