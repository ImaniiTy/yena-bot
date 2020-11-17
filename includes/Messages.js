const { MessageEmbed } = require('discord.js');

function msg_success(message, text, title = false) {
    const msg_embed = new MessageEmbed().setColor('#C14BF7').setDescription(text);
    
    if (title) msg_embed.setTitle(title);

    message.reply(msg_embed)
    .then((msg) => msg.delete({ timeout: process.env.TIMEOUT }))
    .catch(console.error);
}

function msg_error(message, text, title = false) {
    const msg_embed = new MessageEmbed().setColor('#F0463A').setDescription(text);
    
    if (title) msg_embed.setTitle(title);

    message.reply(msg_embed)
    .then((msg) => msg.delete({ timeout: process.env.TIMEOUT }))
    .catch(console.error);
}

function msg_embed({title = false, field = false, author = false}) {
    const msg_embed = new MessageEmbed();

    if (title) msg_embed.setTitle(title);

    if (field) {
        if (Array.isArray(field) && field.length > 1) {
            field[0] = (Array.isArray(field[0])) ? field[0].join('') : field[0];
            field[1] = (Array.isArray(field[1])) ? field[1].join('') : field[1];
            field[3] = (field[3]) ? field[3] : false;

            msg_embed.addField(field[0], field[1], field[3]);
        }
        else {
            msg_embed.addField('\u200B', field)
        }

    }
    if (author && author.username && author.avatarURL()) {
        msg_embed.setAuthor(author.username, author.avatarURL())
    }

    return msg_embed;
}


module.exports = {
    msg_success,
    msg_error,
    msg_embed
};