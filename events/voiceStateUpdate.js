const music = require('../includes/Music.Class');

module.exports = (client, oldState, newState) => {
    // check if someone connects or disconnects
    if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;

    // check if the bot is connecting
    if (newState.channelID) return;

    if (newState.id )

    // bot is not on some channel
    if (!newState.guild.voiceStates.cache.get(client.user.id)) return false;
    
    // The channel id that the user disconnected, is not the same as the bot is connected. 
    if (!oldState.channelID === newState.guild.voiceStates.cache.get(client.user.id).channelID) return false;

    try {
        // voice channel on which the bot contains someone connected. | does not include the bot |
        if (newState.guild.channels.cache.get(newState.guild.voiceStates.cache.get(client.user.id).channelID)) {
            if (newState.guild.channels.cache.get(newState.guild.voiceStates.cache.get(client.user.id).channelID).members.size > 1) return false;
        }
    } catch (error) {
        console.error(error)
    }

    // Clear
    music.stop();
};