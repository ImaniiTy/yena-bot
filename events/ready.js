module.exports = (client) => {
    console.log(
      `--| Bot: ${client.user.username}, ${client.guilds.cache.size} Servers, ${client.users.cache.size} Users |`
    );
    console.log('\n\n\n\n');
  
    client.user.setPresence({
      game: {
        name: ':3',
        type: 'WATCHING',
      },
      status: 'dnd', // 'online', 'idle', 'invisible' & 'dnd' => do not disturb
    });
    client.user.setUsername('Monkeys Bot');
  };