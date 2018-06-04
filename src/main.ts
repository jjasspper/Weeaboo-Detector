"use strict";

import {GuildHandler} from "./classes/GuildHandler";
import {MessageHandler} from "./classes/MessageHandler";
import {WordlistHandler} from "./classes/WordlistHandler";

const
    Discord = require("discord.js"),
    guild = new GuildHandler(process.env.API, require('request')),
    wordlistHandler = new WordlistHandler(),
    appInfo: any = require("../package"),
    botColor: any = 0xae29fe,
    client: any = new Discord.Client();

/**
 * Variable containing blocked words
 */

let blockedWords: object;

/**
 * Contains bot info
 * @type {{version: string, blockedWords: string[]}}
 */

let info: object = {
    version: appInfo.version,
};

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

client.on("ready", () => {
    wordlistHandler.getWordlist();

    console.log("--------------------------------------------------------------");
    console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
    console.log("--------------------------------------------------------------");

    client.user.setActivity("on weeabs");
    client.user.setUsername("Weeabo Detector");
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

client.on("message", message => {

    if (message.author.equals(client.user)) return;

    const Message = new MessageHandler(message.author, message.content.toLowerCase(), message.channel);
    const content = Message.content;

    /**
     * Logic for the !weeabot command
     */

    if (content.includes("!weeabot")) {
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
                    .setThumbnail(client.user.avatarURL);
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
    }

    /**
     * Checks if a word in the message matches a word in the words object
     */

    for (let i = 0; i < Object.keys(blockedWords).length; i++) {
        let blockedWordObj = wordlistHandler.wordlist[i];
        let blockedWord = blockedWordObj.word;
        let blockedWordLevel = blockedWordObj.level;

        if (content.includes(blockedWord) || Message.gluedContent.includes(blockedWord)) {
            request({
                method: 'POST',
                uri: apiUri + "/watchlist/users/add",
                json: true,
                body: {
                    "serverID": message.guild.id.toString(),
                    "userID": message.author.id.toString(),
                    "level": blockedWordLevel,
                    "userName": message.author.username
                }
            }, (err, response, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(message.guild.name);
                    console.log(data.success);
                }
            });
            sendMessageToChannel("Possible weeaboo detected. User: " + Message.sender + " has been put on the watchlist!", Message.channel);
        }
    }

});

client.login(process.env.BOT_TOKEN);

