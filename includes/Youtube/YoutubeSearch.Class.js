const yts = require('yt-search');
const msg = require('../Messages');

class YoutubeSearch {

    async search(message, arg) {
        let search = arg;

        if (Array.isArray(arg)) search = arg.join(' ');

        const searched = await yts.search(search);

        if(searched.videos.length === 0) {
            msg.msg_error(message, 'Looks like i was unable to find the song on YouTube');
        }

        const videos = searched.videos.slice( 0, 8 );

        const list = [];
        videos.forEach((r, index) => {
            // 1. Song Example - WhatImDoing 02:00
            list.push(`**${index + 1}. [${r.title}](${r.url})** - ${r.author.name} **[${r.timestamp}]**\n`);
        });

        const author = message.author.username;
        const authorIcon = message.author.avatarURL();

        const msg_embed = msg.msg_embed({
            title: '**Type the song number to select it**',
            field: ['\u200B', list],
            author: true
        });

        const user_option = await message.channel.send(msg_embed)
        .then(async (msg) => {
            const emotes = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','❌']
            await emotes.forEach(async (emote) => {
                try {
                    await msg.react(emote)
                } catch (error) {
                    return false;
                }
            });
      
            const opt = await msg.awaitReactions( (reaction, user) => 
                user.id === message.author.id && (emotes.includes(reaction._emoji.name)), { max: 1, time: 35000 }
            ).then(async (collected) => {

                if (collected.size === 0) {
                    msg.delete({ timeout: 1200 });
                    return false;
                }

                let select = false;
                emotes.pop();  // remove 'Close' emote

                for (let i = 0; i < emotes.length; i++) {
                    if (collected.first().emoji.name == emotes[i]) {
                        select = videos[i].url;
                    }
                }
                
                msg.delete({ timeout: 1200 });

                return select;
            });

            return opt;
        });

        return user_option;
    }

}

module.exports = { YoutubeSearch };