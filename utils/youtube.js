const axios = require("axios").default;
const moment = require("moment");
const Entitites = require("html-entities").AllHtmlEntities;
const { stringify } = require("qs");

const baseAPIURL = "https://www.googleapis.com/youtube/v3/";
const baseVideoURL = "https://youtu.be/";

const entitites = new Entitites();
class Youtube {
    static async search(query) {
        try {
            const result = await axios.get("/search", {
                baseURL: baseAPIURL,
                params: {
                    part: "snippet",
                    q: query,
                    key: process.env.YOUTUBE_API_KEY,
                    type: "video",
                    maxResults: 6,
                },
            });

            const ids = result.data.items.map((item) => item.id.videoId);
            const aditionalInfo = await axios.get("/videos", {
                baseURL: baseAPIURL,
                params: {
                    part: "contentDetails",
                    id: ids,
                    key: process.env.YOUTUBE_API_KEY,
                },
                paramsSerializer: function (params) {
                    return stringify(params, { arrayFormat: "repeat" });
                },
            });

            return result.data.items.map(
                (item, index) => new YoutubeVideoInfo({ ...item, ...aditionalInfo.data.items[index].contentDetails })
            );
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
        this.title = entitites.decode(rawData.snippet.title);//.replace(/\[|\]/g, (m) => `\\${m}`);
        this.thumbnailURL = rawData.snippet.thumbnails.default.url;
        this.description = rawData.snippet.description;
        this.duration = rawData.duration;
    }

    getConvertedDuration() {
        const durationMilliseconds = moment.duration(this.duration).asMilliseconds();
        return moment.utc(durationMilliseconds).format("m:ss");
    }

    getTitleClamped(maxSize) {
        if(this.title.length > maxSize) {
            return `${this.title.substring(0, maxSize - 1)}...`;
        }

        return this.title;
    }

    getEmbed() {
        //TODO
    }
}

module.exports = Youtube;
