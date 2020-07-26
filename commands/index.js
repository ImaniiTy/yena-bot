let commands = [];

require("fs")
    .readdirSync(__dirname + "/")
    .forEach(function (file) {
        if (file.match(/.js$/) !== null && file !== "index.js") {
            const name = file.replace(".js", "");
            const _export = require("./" + file);

            commands.push([name, _export]);
        }
    });

module.exports = commands;