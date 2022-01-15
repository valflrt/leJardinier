const regexps = {
  extractYoutubeVideoID:
    /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]{11}))/i,
  extractYoutubePlaylistID:
    /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(?:.*)$/i,
  validateYoutubeVideoID: /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/,
};

export default regexps;
