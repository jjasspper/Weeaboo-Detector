"use strict";

import {GuildHandler} from "./classes/GuildHandler";
import {MessageHandler} from "./classes/MessageHandler";
import {WordlistHandler} from "./classes/WordlistHandler";
import {Bot} from "./classes/Bot";
import {ApiHandler} from "./classes/api/ApiHandler";

require('dotenv');

const
    Discord = require("discord.js"),
    Request = require('request'),
    API = new ApiHandler(),
    guild = new GuildHandler(),
    Wordlist = new WordlistHandler(),
    appInfo: any = require("../package"),
    botColor: any = 0xae29fe,
    Client: any = new Discord.Client(),
    bot = new Bot(Client);

/**
 * Variable containing blocked words
 */

let blockedWords: object;

/**
 * Sends a message to the defined channel
 * @param message
 * @param channel
 */

function sendMessageToChannel(message, channel): void {
    channel.send(message);
}

/**
 * Logic for when the boot has booted.
 */

Client.on("ready", () => {
    API.init(process.env.API, Request);
    Wordlist.getWordlist();
    bot.init();
});

/**
 * Logic for when the bot joins a server
 */

Client.on("guildCreate", guild => {
    guild.addServer(guild.id, guild.name);
});

/**
 * Logic for send messages
 */

Client.on("message", message => {

    if (message.author.equals(Client.user)) return;

    const Message = new MessageHandler(message);
    Message.checkForWeeabShit();

    /**
     * Logic for the !weeabot command
     */

    /*if (content.includes("!weeabot")) {
        let allWordsInMessage = message.content.split(" ");
        let firstParam = allWordsInMessage[1];
        let secondParam = allWordsInMessage[2];

        switch (true) {
            case firstParam === "info":
                let embed = new Discord.RichEmbed()
                    .setTitle("Weeaboo Detector (weeabot) version " + appInfo.version)
                    .setColor(botColor)
                    .addField("Commands: ", "- !weeabot info: lists info of this bot.")
                    .addField("Your server: ", message.guild.name)
                    .addField("Server ID: ", message.guild.id)
                    .setFooter("© JVH 2018")
                    .setThumbnail(Client.user.avatarURL);
                sendMessageToChannel({embed}, channel);
                break;
            case firstParam === "serverid":
                console.log(message.guild.id);
                break;
            case firstParam === "register":
                request({
                    method: 'POST',
                    uri: apiUri + "/servers/add",
                    json: true,
                    body: {
                        "serverID": message.guild.id.toString(),
                        "serverName": message.guild.name.toString(),
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
            message.channel.send("That is one one cool lookin' pokemon " + Message.sender + "!");
        }, 1000);
    }*/

});

Client.login(process.env.BOT_TOKEN);

