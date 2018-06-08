import {Message} from "./classes/Message";
import {Wordlist} from "./classes/Wordlist";
import {Bot} from "./classes/Bot";
import {Api} from "./classes/api/Api";

require('dotenv').config();

const
    discord = require("discord.js"),
    request = require('request'),
    api = new Api(),
    wordlist = new Wordlist().getWordlist(),
    client: any = new discord.Client(),
    bot = new Bot(client);
//guild = new GuildHandler(),
//appInfo: any = require("../package"),
//botColor: any = 0xae29fe,

/**
 * Logic for when the boot has booted.
 */

client.on("ready", () => {
    api.init(process.env.API, request);
    bot.init();
});

/**
 * Logic for when the bot joins a server
 */

client.on("guildCreate", guild => {
    guild.addServer(guild.id, guild.name);
});

/**
 * Logic for send messages
 */

client.on("message", msg => {
    if (msg.author.equals(client.user)) return;

    const message = new Message(msg);
    message.checkForWeeabShit(wordlist);

    /**
     * Logic for the !weeabot command
     */

    /*if (content.includes("!weeabot")) {
        let allWordsInMessage = msg.content.split(" ");
        let firstParam = allWordsInMessage[1];
        let secondParam = allWordsInMessage[2];

        switch (true) {
            case firstParam === "info":
                let embed = new discord.RichEmbed()
                    .setTitle("Weeaboo Detector (weeabot) version " + appInfo.version)
                    .setColor(botColor)
                    .addField("Commands: ", "- !weeabot info: lists info of this bot.")
                    .addField("Your server: ", msg.guild.name)
                    .addField("Server ID: ", msg.guild.id)
                    .setFooter("© JVH 2018")
                    .setThumbnail(client.user.avatarURL);
                sendMessageToChannel({embed}, channel);
                break;
            case firstParam === "serverid":
                console.log(msg.guild.id);
                break;
            case firstParam === "register":
                request({
                    method: 'POST',
                    uri: apiUri + "/servers/add",
                    json: true,
                    body: {
                        "serverID": msg.guild.id.toString(),
                        "serverName": msg.guild.name.toString(),
                    }
                }, (err, response, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
                break;
            default:
                sendMessageToChannel("Command not found, use '!weeabot info' to list all commands.", channel);
                break;
        }

        return;
    }

    // Random shit

    if (content.includes("p!pokemon")) {
        setTimeout(function () {
            msg.channel.send("That is one one cool lookin' pokemon " + msg.sender + "!");
        }, 1000);
    }*/

});

client.login(process.env.BOT_TOKEN);

