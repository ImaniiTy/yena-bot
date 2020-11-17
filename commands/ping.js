module.exports = {
    name: 'ping',
    aliases: false,
    arguments: false,
    group: 'all',
    description: 'Get the latency of the bot',
    async execute(message) {
      const message_pinging = await message.channel.send(':3 Pinging');
      message_pinging.edit({
        content: '',
        embed: {
          description: [
            `**${message_pinging.createdAt - message.createdAt}ms**`,
          ].join('\n'),
          color: '#C14BF7',
        },
      });
    },
  };
  