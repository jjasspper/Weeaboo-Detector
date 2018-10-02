export class Bot {

	protected client: any;

	constructor(client) {
		this.client = client;
	}

	init(): void {
		this.client.user.setActivity("with weeabs");
		this.client.user.setUsername("Weeabo Detector");

		console.log("--------------------------------------------------------------");
		console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
		console.log("--------------------------------------------------------------");
	}

	getClient() {
		return this.client;
	}
}