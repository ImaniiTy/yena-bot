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
            const results = await Youtube.searchVideo(query);

            const ids = results.map((item) => item.id.videoId);
            const aditionalInfo = await Youtube.getVideoInfo(ids);

            return results.map((item, index) => new YoutubeVideoInfo({ ...item, ...aditionalInfo[index].contentDetails }));
        } catch (error) {
            // console.log(error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
    }

    static async searchVideo(query, parts = "snippet") {
        const results = await axios.get("/search", {
            baseURL: baseAPIURL,
            params: {
                part: parts,
                q: query,
                key: process.env.YOUTUBE_API_KEY,
                type: "video",
                maxResults: 6,
            },
        });

        return results.data.items;
    }

    static async getVideoInfo(ids, parts = "contentDetails") {
        Array.isArray(ids) || (ids = [ids]);

        const infos = await axios.get("/videos", {
            baseURL: baseAPIURL,
            params: {
                part: parts,
                id: ids,
                key: process.env.YOUTUBE_API_KEY,
            },
            paramsSerializer: function (params) {
                return stringify(params, { arrayFormat: "repeat" });
            },
        });

        return infos.data.items;
    }

    static getVideoIdFromUrl(url) {
        const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const result = url.match(rx);
        return result ? result[1] : null;
    }
}

class YoutubeVideoInfo {
    constructor(rawData) {
        this.id = rawData.id.videoId || rawData.id;
        this.url = baseVideoURL + this.id;
        this.title = entitites.decode(rawData.snippet.title);
        this.thumbnailURL = rawData.snippet.thumbnails.default.url;
        this.description = rawData.snippet.description;
        this.duration = rawData.duration;
    }

    static async fromId(id) {
        const info = (await Youtube.getVideoInfo(id, "contentDetails,snippet"))[0];
        return new YoutubeVideoInfo(info);
    }

    getConvertedDuration() {
        const durationMilliseconds = moment.duration(this.duration).asMilliseconds();
        return moment.utc(durationMilliseconds).format("m:ss");
    }

    getTitleClamped(maxSize) {
        if (this.title.length > maxSize) {
            const clampedTitle = `${this.title.substring(0, maxSize - 1)}...`;
            return this._sanitizeTitle(clampedTitle);
        }

        return this.title;
    }

    getVideoIdFromUrl(url) {
        const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const result = url.match(rx);
        return result ? result[1] : null;
    }

    /**
     *
     * @param {String} str
     */
    _sanitizeTitle(str) {
        if (str.split("[").length - 1 > str.split("]").length - 1) {
            let newStr = [...str];
            newStr[str.length - 4] = "]";
            return newStr.join("");
        }
        return str;
    }

    getEmbed() {
        //TODO
    }
}

module.exports = {Youtube, YoutubeVideoInfo};
