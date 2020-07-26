const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String, // user id
    name: String, // playlist name
    public: Boolean, // Can anyone edit...
    created: Date, // playlist creation date
    musics: JSON
});

module.exports = mongoose.model('playlists', settingsSchema);