const quickdb = require('quick.db');

class DB {
    constructor(guild_id) {
        this.guild_id = guild_id;
    }

    async get_guild_data() {
        if (!this.guild_id) return false;
    
        const data = await quickdb.fetch(`guild_${this.guild_id}`);

        if (!data) return false;
    
        return data;
    }

    async update_guild_data(data_name, data_value) {
        try {
            await quickdb.set(`guild_${this.guild_id}.${data_name}`, data_value);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
}

module.exports = { DB };