const mongoose_start = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            useUnifiedTopology: true
        };

        mongoose_start.connect(process.env.MongoDB_Link, dbOptions);
        mongoose_start.set('useFindAndModify', false);

        mongoose_start.connection.on('connected', () => {
            console.log('[Mongoose] Connection successfully.');
        });
        mongoose_start.connection.on('err', () => {
            console.log(`[Mongoose] Connection Error: \n${err.stack}.`);
        });
        mongoose_start.connection.on('disconnected', () => {
            console.log('[Mongoose] Disconnected.');
        });
    }
}