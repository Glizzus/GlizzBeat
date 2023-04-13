const { Client, GatewayIntentBits } = require('discord.js');
const { token, userId } = require('./config.json');
const { readFile } = require('fs/promises');

(async () => {
    const bytes = await readFile('./services.txt');
    const urls = bytes.toString().split('\n');

    const client = new Client({ intents: [GatewayIntentBits.Guilds]});
    await client.login(token);
    const user = await client.users.fetch(userId);

    for (const url of urls) {
        const serviceUp = true;
        const check = async () => {
            const response = await fetch(url);
            if (response.status !== 200) {
                if (!serviceUp) {
                    return;
                }
                user.send(`Service ${url} is down`);
                serviceUp = false;
                return;
            }
            serviceUp = true;
        }
        check();
        setInterval(check, 1000 * 60);
    }
})()