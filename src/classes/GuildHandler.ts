import {ApiHandler} from "./api/ApiHandler";
import {Api} from "../interfaces/Api";

export class GuildHandler implements Api {

    apiUri : string;
    request : any;

    constructor (api, request) {
        this.apiUri = api;
        this.request = request;
    }

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