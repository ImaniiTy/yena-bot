const music = require('../includes/Music.Class');
const utils = require('../includes/utils');
const msg = require('../includes/Messages');



module.exports = {
    name: 'resume',
    aliases: ['continue'],
    arguments: false,
    group: 'music',
    description: 'Resumes the current paused song.',
    execute(message, args) {
        // user is the same channel on the bot
        if (!utils.bot_on_same_channel(message)) return false;

        // Queue is empty.
        if (!music.queue.length) {
            msg.msg_error(message, 'There is currently no song in the queue.');
            return false;
        }


        const command_options = { 
            number: (num) => number(message, num),
            cleanup: (cleanup_args) => cleanup(message, cleanup_args),
            doubles: () => doubles(message),
            range: (range_args) => range(message, range_args)
        };

     
        if (!args.length || !command_options[args[0].toLowerCase()] && isNaN(parseInt(args[0]))) {
            msg.msg_error(message, `You forgot the track id to remove.`);
            return false;
        }

        // Remove <song id>
        if (!isNaN(parseInt(args[0])) ) {
            command_options.number(parseInt(args[0]));
        } // Cleanup <@UserMention> / Doubles / Range <from> <to>
        else if (!command_options[args[0].toLowerCase()](args)) {
            return false
        }
        
        return true;
    },
};

function number(message, num) {
    // This index does not exist
    if (music.queue.length < num) {
        msg.msg_error(message, `There\'s no song with index \`\`${num}\`\` in the queue.`);
        return false;
    }

    // Remove from queue
    music.queue.splice(num - 1, 1);

    msg.msg_success(message, 'Song removed.');
    return true;
}

function cleanup(message, args) {
    if (args.length < 2) {
        msg.msg_error(message, 'Inform which user should have their sounds removed.\nExample: remove cleanup @UserName');
        return false;
    }

    const user_id_for_remove = ( args[1].startsWith('<@!') ) ? args[1].slice(3, -1) : args[1].slice(2, -1);
    
    // Removes songs from the queue.
    const new_queue = music.queue.filter( (song) => song.author !== user_id_for_remove ); 
    music.queue = new_queue;
    
    msg.msg_success(message, 'Double songs removed.');
    return true;
}

function doubles(message) {
    // Removes songs from the queue.
    const new_queue = music.queue.filter(
        (song, index, self) => self.findIndex(value => value.title === song.title && value.url === song.url) === index
    );
    music.queue = new_queue;

    msg.msg_success(message, 'Song removed.');
    return true;
}

function range(message, args) {
    if (args.length < 3 || isNaN(parseInt(args[1])) || isNaN(parseInt(args[2])) ) {
        msg.msg_error(message, 'You need to provide the range.\nExample: \`\`remove range 4 7\`\`\n(Will remove items 4,5,6, and 7)');
        return false;
    }         

    const remove_from = (parseInt(args[1])-1);
    const remove_to = (parseInt(args[2])-1);

    music.queue.splice(remove_from,remove_to);

    msg.msg_success(message, 'Song removed.');
    return true;
}