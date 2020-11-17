const music = require('../includes/Music.Class');

module.exports = {
    name: 'join',
    aliases: ['j'],
    arguments: false,
    group: 'music',
    description: 'Plays a song.',
    async execute(message, args) {
        await music.try_connect_channel(message);
    }
}
