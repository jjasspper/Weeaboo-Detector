import {Message} from "./classes/Message";
import {Commands} from "./classes/Commands";
import {GuildHandler} from "./classes/GuildHandler";
import {WatchlistHandler} from "./classes/WatchlistHandler";

module.exports = (client, wordlist, whitelist) => {

	/**
	 * Do things when a message is send
	 */

	client.on("message", (msg) => {
		if (msg.author.equals(client.user)) return;

		const message = new Message(msg);
		const commands = new Commands(client);

		message.parse(wordlist, whitelist);
		commands.parse(msg, msg.content)
	});

	/**
	 * Do things when bot joins a server
	 */

	client.on("guildCreate", (server) => {
		let guild = new GuildHandler();
		guild.addServer(server.id, server.name);
		server.createRole({
			name: "Weeaboo",
			color: 0xa400ff,
			permissions: 0x400,
			mentionable: true
		}).then((role) => {
			console.log("Registered role:");
			console.log(role);
			guild.registerRole(role.id, server.id);
		}).catch((err) => {
			console.log(`Could not create rank for server ${server.id}`);
		});
	});

	/**
	 * Do things when user data gets updated
	 */

	client.on("userUpdate", (oldUser, newUser) => {
		let watchlistHandler = new WatchlistHandler();
		watchlistHandler.updateUsername(newUser.id, newUser.username).then((response) => {
			console.log("User update:");
			console.log(response);
		}).catch((err) => {
			console.log(err);
		});
	});

	/**
	 * Do things when server data gets updated
	 */

	client.on("guildUpdate", (oldServer, newServer) => {
		let guildHandler = new GuildHandler();
		guildHandler.updateServerName(newServer.id, newServer.name).then((result) => {
			console.log("Guild update:");
			console.log(result);
		}).catch((err) => {
			console.log(err);
		});
	});

	/**
	 * Do things when a message gets updated
	 */

	client.on("messageUpdate", (oldMessage, newMessage) => {
		const message = new Message(newMessage);
		message.parse(wordlist, whitelist);
	});
};
