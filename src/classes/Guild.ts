import {Api} from "./api/Api";

export class Guild extends Api {

    apiUri: string;
    request: any;

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