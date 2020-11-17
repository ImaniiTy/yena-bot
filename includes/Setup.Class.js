const { DB } = require('./db/DB.Class');
const msg = require('./Messages');

class Setup {

    async create_song_channel(message, guild_id = null) {
        if (guild_id == null) return false;

        // Song-Request Topic/Description
        const channel_description = `:play_pause: Pause/Resume the song.\n:stop_button: Stop and empty the queue.\n`
        + `:track_next: Skip the song.\n:arrows_counterclockwise: Switch between the loop modes.\n`
        + `:twisted_rightwards_arrows: Shuffle the queue.\n:x: Clear Queue.`;

        // Create Song-Request channel
        const song_channel_data = await message.guild.channels.create( 
            process.env.MUSIC_CHANNEL_NAME,
            {
                type: 'text',
                topic: channel_description,
            }
        );

        // Set channel id in DB
        await new DB(guild_id).update_guild_data(
            'g_song_channel_id',
            song_channel_data.id,
        );

        // Get song channel
        const song_request_channel = message.guild.channels.cache.get( song_channel_data.id );

        // Send Message
        const player_message = await this.song_message(guild_id);
        song_request_channel.send(player_message[0], { embed: player_message[1] })
            .then((msg) => {
                // Set reactions
                this.song_message_react(msg);
                // Set message_id in DB
                new DB(guild_id).update_guild_data('g_song_message_id', msg.id);
            });
        
        msg.msg_success(
            message, 
            [
                `Prefix: ${message.guild.prefix} \`\`(More info on ${message.guild.prefix}help)\`\``,
                `Channel: <#${song_request_channel.id}>\`\` (You can rename and move this channel if you want to!)\`\``,
                'Most of my commands **only work in the music channel**!'
            ], // description
            '**Main Setup is done!**' // title
        );

        return true;
    }

    async song_message(guild_id) {
        // Create message array
        const message = [
            '__**Queue list:**__\nJoin a voice channel and queue songs by name or url in here.',
        ];

        // Get Embed
        const embed_message = await this.song_message_embed(guild_id);
        // Push Embed to message
        message.push(embed_message);

        return message;
    }

    async song_message_embed(guild_id) {
        let prefix = process.env.PREFIX;
    
        const guild_data = await new DB(guild_id).get_guild_data();
        if (guild_data) {
            prefix = guild_data.g_prefix;
        }
    
        const embed = {
            color: '#C14BF7',
            title: null,
            url: null,
            description: null,
            fields: [
            {
                name: 'No song playing currently',
                value:
                '[GitHub](https://github.com/ImaniiTy/yena-bot/tree/Crazy) | [Invite](https://discord.com/oauth2/authorize?client_id=648646759664582657&scope=bot&permissions=37088600)',
            },
            ],
            image: {
            url: process.env.SONG_MESSAGE_IMAGE,
            },
            timestamp: null,
            footer: {
            text: `Prefix for this server is:  ${prefix}`,
            },
        };
    
        return embed;
    }

    song_message_react(message) {
        message.react('⏯️')
            .then(() => message.react('⏹️'))
            .then(() => message.react('⏭️'))
            .then(() => message.react('🔄'))
            .then(() => message.react('🔀'))
            .then(() => message.react('❌'))
            .catch(() => console.error('One of the emojis failed to react.'));
    }

}

module.exports = { Setup };
