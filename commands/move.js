const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');
const utils = require('../includes/utils');

module.exports = {
    name: 'move',
    aliases: ['mv'],
    arguments: '<song number> / <from> <to> / swap <from> <to> / last',
    group: 'music',
    description: 'Move the selected song to the provided position.',
    async execute(message, args) {
        // user is the same channel on the bot
        if (!utils.bot_on_same_channel(message)) return false;

        // Queue is empty.
        if (!music.queue.length) {
            msg.msg_error(message, 'There is currently no song in the queue.');
            return false;
        }

        const command_options = { 
            selected_to_top: (num) => selected_to_top(message, num),
            selected_from_to: (from_to) => selected_from_to(message, from_to),
            swap: (swap_from_to) => swap(message, swap_from_to),
            last: () => last(message)
        };

        if (!args.length || !command_options[args[0].toLowerCase()] && isNaN(parseInt(args[0])) || args.length > 1 && isNaN(parseInt(args[1])) ) {
            msg.msg_error(message, `You forgot the track id to move.`);
            return false;
        }

        // Move <song id> / Move <from> <to>
        if (!isNaN(parseInt(args[0])) ) {
            if (args.length < 2) {
                command_options.selected_to_top(parseInt(args[0]));
            } else {
                command_options.selected_from_to(args);
            }
        } // Move swap <from> <to> / Move last
        else if (!command_options[args[0].toLowerCase()](args)) {
            return false
        }

        return true;
    }
}

function selected_to_top(message, num) {
    // This index does not exist
    if (music.queue.length < num) {
        msg.msg_error(message, `There\'s no song with index ``${num}`` in the queue.`);
        return false;
    }

    // Move to the first position
    music.queue.splice(0, 0, music.queue.splice((num-1), 1)[0]);

    msg.msg_success(message, 'Song moved to position 1.');
    return true;
}

function selected_from_to(message, args) {
    // This index does not exist
    if (music.queue.length < args[0] || music.queue.length < args[1]) {
        msg.msg_error(message, `There\'s no song with index \`\`${args[0]}\`\` and \`\`${args[1]}\`\` in the queue.`);
        return false;
    }

    // Move the selected song to the provided position.
    music.queue.splice(( parseInt(args[1])-1 ), 0, music.queue.splice(( parseInt(args[0])-1 ), 1)[0]);

    msg.msg_success(message, 'Songs swapped.');
    return true;
}

function swap(message, args) {
    args.shift(); // Remove 'swap' value
    // This index does not exist
    if (music.queue.length < args[0] || music.queue.length < args[1]) {
        msg.msg_error(message, `There\'s no song with index \`\`${args[0]}\`\` and \`\`${args[1]}\`\` in the queue.`);
        return false;
    }

    const temp_value = music.queue[parseInt(args[0])-1];
    music.queue[parseInt(args[0])-1] = music.queue[parseInt(args[1])-1];
    music.queue[parseInt(args[1])-1] = temp_value;

    msg.msg_success(message, 'Songs swapped.');
    return true;
}

function last(message) {
    music.queue.splice(0, 0, music.queue.pop())

    msg.msg_success(message, 'Song moved to position 1.');
    return true;
}