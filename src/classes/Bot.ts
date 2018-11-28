import {GuildHandler} from "./GuildHandler";

export class Bot {

	protected client: any;

	constructor(client) {
		this.client = client;
	}

	init(): void {
		this.syncGuilds();

		this.client.user.setActivity("with weebs");
		this.client.user.setUsername("Weeaboo Detector");

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
		const guildCollection = this.client.guilds.array();
		const guildHandler = new GuildHandler();

		//Used for logging
		let counter = 1;
		let i = 0;

		console.log(`Synchronising ${guildCollection.length} guilds...`);

		let interval = setInterval(() => {
			const guild = guildCollection[i];
			guildHandler.getServer(guild.id).then((result) => {
				console.log(`${counter} guild(s) synchronised!`);
				if (typeof result == 'undefined') {
					guildHandler.addServer(guild.id, guild.name).then((result) => {
						console.log("New guild added.");
						counter++;
					}, (err) => {
						console.log(err);
						process.exit();
					});
				} else {
					counter++;
				}
			}, (err) => {
				console.log("Error while synchronising servers:");
				console.log(err);
				process.exit();
			});

			if (i == guildCollection.length - 1) {
				clearInterval(interval);
			}

			i++;
		}, 500);
	}

	private setAsyncTimeout(f) {
		setTimeout(() => {
			f();
		}, 500);
	}
}