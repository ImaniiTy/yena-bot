const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');

module.exports = {
    name: 'radio',
    aliases: ['rd'],
    arguments: false,
    group: 'music',
    description: 'List of Radios. | Starts radio.',
    async execute(message, args) {

        const radios = JSON.parse(process.env.RADIO_LIST)

        // Show list
        if (!args.length) {
            const radio_list_msg = [];
            let number = 1;
            Object.keys(radios).forEach(function (r) {
                radio_list_msg.push(`${number}. \`\`${r}\`\`\n`)
                number++;
            });
            msg.msg_success(message, `List of Radios\n${radio_list_msg.join('')}`);
            return true;
        }

        // Radio option doesn't exist
        if (!radios[args[0].toLowerCase()]) {
            msg.msg_error(message, `Sorry, I don\'t have that option.\nSee the list of radios with the command:\n\`\`${message.guild.prefix}radio\`\``);
            return false;
        }

        // Try Connect to voice channel
        const try_connect = await music.try_connect_channel(message);
        if (!try_connect) return;

        
        try {
            const url = radios[args[0].toLowerCase()];
            const name = args[0].toLowerCase();

            await music.play_radio({ url, name }, message);

            // Restarts after the song ends
            music._reset_radio_interval({ url, name }, message);
        } catch (error) {
            console.log(error);
        }

        return true;
    }
}