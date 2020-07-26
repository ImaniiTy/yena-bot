const { Message, MessageEmbed } = require("discord.js");
const PlayLists = require("../models/playlists");
const mongoose = require('mongoose');
const { prefix } = require('../bot_config.json');

class PlayListsModule {
    constructor() {
    }

    playlists(message, args) {
        if (!args.length) { return this._commandsList(message); }

        if (args[0] === 'create') { this._create(message, args[1], message.author.id); }
    }

    _create(message, playlistName, authorID) {
        const playlist = new PlayLists({
            _id: mongoose.Types.ObjectId(),
            userID: authorID,
            name: playlistName,
            public: false,
            created: + Date.now(),
            musics: {}
        });

        playlist.save()
            .then(result => console.log(result))
            .catch(err => console.log(err));

        message.channel.send('PlayList successfully **Created**!');
        return true;
    }




    _commandsList(message) {
        // inside a command, event listener, etc.
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Playlists Commands Help')
            .setDescription('list of all commands related to "Playlists", and how to use them.')
            .addFields(
                { name: 'Create', value: `\`\`${prefix}playlists create {Playlist_Name}\`\`` },
                { name: 'Add', value: `\`\`${prefix}playlists add {Music_Link}\`\` || Youtube or Spotify` },
                { name: 'List', value: `\`\`${prefix}playlists list {Playlist_Name}\`\`` },
                { name: 'Remove', value: `\`\`${prefix}playlists remove {Music_Position}\`\` || playlists remove 1` },
                { name: 'Public', value: `\`\`${prefix}playlists public {on/off}\`\` || playlists public on\nAllows other users to add/remove music from your playlist!` },
                { name: 'Date', value: `\`\`${prefix}playlists date {Playlist_Name}\`\` || Shows the date the playlist was created!` },
                { name: '\u200B', value: '\u200B' }, // Jump Line
            )
            .setTimestamp()
            .setFooter(':3');

        return message.reply(exampleEmbed);
    }

    // Default
    _getCommands() {
        return Object.getOwnPropertyNames(PlayListsModule.prototype).filter(
            (item) => typeof this[item] === "function" && item !== "constructor" && !item.startsWith("_")
        );
    }
}

module.exports = new PlayListsModule();
