const music = require('../includes/Music.Class');
const utils = require('../includes/utils');

module.exports = {
    name: 'queue',
    aliases: ['q', 'list'],
    arguments: false,
    group: 'music',
    description: 'Shows the queue.',
    execute(message) {
        console.log(music.queue)
        if (music.queue.length < 1) return false;


        const pages = music.queue_page();
        let page = 1;

        const embed = {
            description: pages[page - 1].join(''),
            footer: {
                text: `Page ${page} of ${pages.length}`,
            },
        };

        message.channel.send({ embed }).then((msg) => {
            msg.react('⬅️').then(msg.react('➡️')).catch(() => console.error('One of the emojis failed to react.'));

            const filter_backward = (reaction, user) => reaction._emoji.name === '⬅️' && user.id === message.author.id;
            const filter_forward = (reaction, user) => reaction._emoji.name === '➡️' && user.id === message.author.id;

            const backward = msg.createReactionCollector(filter_backward, { time: 50000 });
            const forward = msg.createReactionCollector(filter_forward, { time: 50000 });

            backward.on('collect', async (r) => {
                await msg.reactions.resolve('⬅️').users.remove(message.author.id);
                if (page === 1) return;

                page -= 1;
                embed.description = pages[page - 1].join('');
                embed.footer = {
                text: `Page ${page} of ${pages.length}`,
                };

                msg.edit({ embed });
            });

            forward.on('collect', async (r) => {
                await msg.reactions.resolve('➡️').users.remove(message.author.id);
                if (page === pages.length) return;

                page += 1;
                embed.description = pages[page - 1].join('');
                embed.footer = {
                text: `Page ${page} of ${pages.length}`,
                };

                msg.edit({ embed });
            });

            msg.delete({ timeout: 20000 });
        }).catch(console.error);
    },
};
