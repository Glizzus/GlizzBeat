const { Client, GatewayIntentBits } = require('discord.js');
const { token, userId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.login(token);

async function watchService(url, expectedStatus) {
    one_minute = 1000 * 60;
    one_day = one_minute * 60 * 24;

    // Checks whether the service is up every minute
    function checkBeforeFailure() {
        const intervalId = setInterval(async () => {
            if (await serviceDown(url ,expectedStatus)) {
                alertUser(url);
                serviceDown = true;
                clearInterval(intervalId);
            }
        }, one_minute);
    }

    // This runs every 24 hours, so that if a service goes down,we wait 24 hours to check if it's up again
    checkBeforeFailure();
    setInterval(checkBeforeFailure, one_day);
}

async function alertUser(url) {
    console.log(`Service down ${url}`);
    const user = await client.users.fetch(userId);
    user.send(`Service ${url} is down`);
}

async function serviceDown(url, expectedStatus) {
    const { status } = await fetch(url);
    return status !== expectedStatus;
}

urlCodeMap = new Map([
    ["http://glizzus.net/rstudio", 200]
]);

for (const [url, expectedStatus] of urlCodeMap) {
    watchService(url, expectedStatus)
}