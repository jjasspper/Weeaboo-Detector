import {ApiHandler} from "./api/ApiHandler";

export class GuildHandler extends ApiHandler {

    addServer(id: string, name: string): void {
        this.request({
            method: 'POST',
            uri: this.apiUri + "/servers/add",
            json: true,
            body: {
                "serverID": id,
                "serverName": name
            }
        }, (err, response, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(name);
                console.log(data);
            }
        });
    }

}