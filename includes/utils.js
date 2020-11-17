function convert_time(time) {
    if (time.includes(':')) {
        time = arg.split(':');
        const minutes = +time[0];
        const seconds = +time[1];
        
        // time in seconds
        return (minutes * 60 + seconds);
    }

    return time;
}

function have_connect_or_speak_permission(message) {
    const { channel } = message.member.voice;

    if (!channel) return false;
    
    const permission = channel.permissionsFor(message.client.user);
    
    if (!permission.has('CONNECT') || !permission.has('SPEAK')) return false;

    return true;
}

function bot_on_same_channel(message) {
    // User is NOT in any channel
    if (!message.member.voice) return false;
    
    // Bot is NOT in any channel
    if (!message.guild.me.voice.channel) return true;
    
    // User is NOT on the same channel as Bot
    if (message.member.voice.channelID !== message.guild.me.voice.channel.id) return false;

    return true;
}

function someone_on_the_channel(message) {
    if (!message.channel.guild.voice) return false;

    const bot_voice_channel_id = message.channel.guild.voice.channelID;
    let someone_on_the_channel = false;

    someone_on_the_channel = message.guild.voiceStates.cache.filter((user) => {
        if (user.channelID === bot_voice_channel_id.channelID && user.id.toString() !== message.client.user.toString()) {
            return true;
        }
        return false;
    });

    if (!someone_on_the_channel) {
        return false; 
    }

    return true;
}

module.exports = { 
    convert_time,
    have_connect_or_speak_permission,
    bot_on_same_channel,
    someone_on_the_channel
};