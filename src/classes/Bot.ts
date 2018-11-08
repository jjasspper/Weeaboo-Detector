import {GuildHandler} from "./GuildHandler";

export class Bot {

	protected client: any;

	constructor(client) {
		this.client = client;
	}

	init(): void {
		this.syncGuilds();

		this.client.user.setActivity("with weebs");
		this.client.user.setUsername("Weeabo Detector");

		console.log("--------------------------------------------------------------");
		console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
		console.log("--------------------------------------------------------------");
	}

	/**
	 * Returns the client
	 */

	getClient() {
		return this.client;
	}

	/**
	 * Checks if all guilds are tracked in the database. If not, the method will add the guild to the database.
	 */

	syncGuilds() {
		console.log("Syncing guilds...");
		const guildCollection = this.client.guilds;
		const guildHandler = new GuildHandler();

		guildCollection.forEach((data) => {
			const guild = data;

			guildHandler.getServer(guild.id).then((result) => {
				console.log(result);
				if (typeof result == 'undefined') {
					guildHandler.addServer(guild.id, guild.name).then((result) => {
						console.log("New guild added.");
					}, (err) => {
						console.log(err);
						process.exit();
					});
				} else {
					return;
				}
			}, (err) => {
				console.log(err);
				process.exit();
			});
		});
		console.log("Guilds synchronised!");
	}
}