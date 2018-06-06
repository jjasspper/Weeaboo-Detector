export class Bot {

    private client : any;

    constructor(client) {
        this.client = client;
    }

    init () {
        this.client.user.setActivity("on weeabs");
        this.client.user.setUsername("Weeabo Detector");

        console.log("--------------------------------------------------------------");
        console.log("Weeaboo Detector enabled, watch your mouth filthy man-childs!");
        console.log("--------------------------------------------------------------");
    }
}