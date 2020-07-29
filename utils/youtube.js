const axios = require("axios").default;

const baseAPIURL = "https://www.googleapis.com/youtube/v3/";
const baseVideoURL = "https://youtu.be/";

class Youtube {
    static async search(query) {
        try {
            const result = await axios.get("/search", {
                baseURL: baseAPIURL,
                // headers: { "Authorization": `Bearer ${process.env.YOUTUBE_API_KEY}` },
                params: {
                    part: "snippet",
                    q: query,
                    key: process.env.YOUTUBE_API_KEY,
                    type: "video",
                    maxResults: 10,
                },
            });
            // map((item) => new YoutubeVideoInfo(item))
            return result.data.items.map((item) => new YoutubeVideoInfo(item));
        } catch (error) {
            // console.log(error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
    }
}

class YoutubeVideoInfo {
    constructor(rawData) {
        this.url = baseVideoURL + rawData.id.videoId;
        this.title = rawData.snippet.title;
        this.thumbnailURL = rawData.snippet.thumbnails.default.url;
        this.description = rawData.snippet.description;
    }

    getEmbed() {
        //TODO
    }
}

module.exports = Youtube;
