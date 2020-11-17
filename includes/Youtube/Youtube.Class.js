const ytdl = require('ytdl-core');

class Youtube {

    async get_video_data(link) {
        const video = await ytdl.getInfo(link);
        
        const video_title = video.videoDetails.title;
        const video_url = video.videoDetails.video_url;

        const video_thumbnails = (video.videoDetails.thumbnail.thumbnails) ? video.videoDetails.thumbnail.thumbnails : false;
        const video_thumbnail = (video_thumbnails[video_thumbnails.length - 1].url) ? video_thumbnails[video_thumbnails.length - 1].url : false;

        return {'title': video_title,'url': video_url, 'thumbnail': video_thumbnail};
    }

}

module.exports = { Youtube };