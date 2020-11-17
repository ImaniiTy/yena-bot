const { DB } = require('../includes/db/DB.Class');
const { Setup } = require('../includes/Setup.Class');
const msg = require('../includes/Messages');

module.exports = {
    name: 'setup',
    aliases: null,
    arguments: false,
    group: 'all',
    description: 'Setup the unique songrequest channel.',
    async execute(message, args) {
        
        const guild_id = message.channel.guild.id;

        const guild_data = await new DB(message.guild.id).get_guild_data();
        
        // Song channel already in db
        if (guild_data.g_song_channel_id) {

            // Check if 'songchannel' already exists in the guild.
            const have_song_channel = message.guild.channels.cache.find(
                (channel) => channel.type === 'text' && channel.id == guild_data.g_song_channel_id,
            );

            // Song channel already exist in guild
            if (have_song_channel) {
                msg.msg_error(message, `Already setup in <#${guild_data.g_song_channel_id}>`, '**Oops...!**');
                return false;
            }

            // If 'guild_song_channel' is different from the database,
            // Create / Update song_channel
            await new Setup().create_song_channel(message, guild_id);
        } else {
            await new Setup().create_song_channel(message, guild_id);
        }
    }
}