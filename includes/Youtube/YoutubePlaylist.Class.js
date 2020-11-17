const { getYoutubeInfo } = require('youtu-get');

class YoutubePlaylist {

    async get_playlist_data(link) {
        const playlist_id = this._get_playlist_id(link);

        const videos = getYoutubeInfo(playlist_id);

        return videos;
    }

    _get_playlist_id(link) {
        const reg = new RegExp("[&?]list=([a-z0-9_-]+)","i");
        const playlist_id = reg.exec(link);

        return playlist_id[1];
    }
}

module.exports = { YoutubePlaylist };