import { describe, it } from "mocha";
import { expect } from "chai";

import regexps from "./regexp";

describe("Regexps tests", () => {
  describe(`"extractYoutubeVideoID" tests`, () => {
    it("should extract a youtube video id from a youtube URL", () => {
      const dataset: { url: string; id: string }[] = [
        { url: "https://youtu.be/dQw4w9WgXcQ?123", id: "dQw4w9WgXcQ" },
        { url: "http://youtu.be/dQw4w9WgXcQ?123", id: "dQw4w9WgXcQ" },
        {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?123",
          id: "dQw4w9WgXcQ",
        },
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ?asd",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://youtu.be/dQw4w9WgXcQ&123", id: "dQw4w9WgXcQ" },
        {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ&123",
          id: "dQw4w9WgXcQ",
        },
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&asd",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://youtu.be/dQw4w9WgXcQ/123", id: "dQw4w9WgXcQ" },
        {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ/123",
          id: "dQw4w9WgXcQ",
        },
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ/asd",
          id: "dQw4w9WgXcQ",
        },
        {
          url: "https://youtube.com/shorts/dQw4w9WgXcQ?feature=share",
          id: "dQw4w9WgXcQ",
        },
      ];

      let results = dataset.map(({ url }) =>
        regexps.extractYoutubeVideoID.exec(url)
      );

      expect(
        !results.some(
          (result, i) => !result || (!!result && !(result[2] === dataset[i].id))
        )
      ).to.be.true;
    });

    it("should not extract a youtube video id from a wrong youtube URL", () => {
      const dataset: string[] = [
        "https://youtube.com/playlist?list=PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
        "https://www.youtube.com/embed/videoseries?list=PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
      ];

      let results = dataset.map((url) =>
        regexps.extractYoutubeVideoID.exec(url)
      );

      expect(!results.some((result) => !result)).to.be.false;
    });
  });

  describe(`"extractYoutubePlaylistID" tests`, () => {
    it("should extract a youtube playlist id from a youtube URL", () => {
      const dataset: { url: string; id: string }[] = [
        {
          url: "https://www.youtube.com/playlist?list=PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
          id: "PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
        },
        {
          url: "https://www.youtube.com/watch?v=O0h-fZtKcEQ&list=PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q&index=2",
          id: "PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
        },
        {
          url: "https://youtube.com/playlist?list=PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
          id: "PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
        },
        {
          url: "https://www.youtube.com/embed/videoseries?list=PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
          id: "PLXjXoNpnwIx9OQMxTLDI8qitNaiAsHs5Q",
        },
      ];

      let results = dataset.map(({ url }) =>
        regexps.extractYoutubePlaylistID.exec(url)
      );

      expect(
        !results.some(
          (result, i) => !result || (!!result && !(result[1] === dataset[i].id))
        )
      ).to.be.true;
    });

    it("should not find a youtube playlist id from a wrong youtube URL", () => {
      const dataset: string[] = [
        "https://www.youtube.com/watch?v=Uo4KaBtztjs",
        "https://www.youtube.com/embed/C-dOn43M7YM",
      ];

      let results = dataset.map((url) =>
        regexps.extractYoutubePlaylistID.exec(url)
      );

      expect(!results.some((result) => !result)).to.be.true;
    });
  });

  describe(`"validateYoutubeVideoID" tests`, () => {
    it("should validate a youtube video ID", () => {
      const dataset: string[] = [
        "dQw4w9WgXcQ",
        "O0h-fZtKcEQ",
        "O_jcM_aX6Cc",
        "77vXbRxP53M",
        "C-dOn43M7YM",
      ];

      let results = dataset.map((id) =>
        regexps.validateYoutubeVideoID.exec(id)
      );

      expect(!results.some((result) => !result)).to.be.true;
    });

    it("should not validate a wrong youtube video ID", () => {
      const dataset: string[] = [
        "hello it's me",
        "some random text",
        "*click* noice",
        "bonjour ceci est du français",
      ];

      let results = dataset.map((id) =>
        regexps.validateYoutubeVideoID.exec(id)
      );

      expect(!results.some((result) => !result)).to.be.false;
    });
  });
});
