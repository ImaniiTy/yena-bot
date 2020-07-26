require("fs")
    .readdirSync(__dirname + "/")
    .forEach(function (file) {
        if (file.match(/.js$/) !== null && file !== "index.js") {
            const name = file.replace(".js", "");
            const _export = require("./" + file);

            exports[name] = _export;
        }
    });