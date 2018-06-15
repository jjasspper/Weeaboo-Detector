import {Api} from "./api/Api";

export class Guild extends Api {

	apiUri: string;
	request: any;

	addServer(id: string, name: string): Promise<any> {
		return new Promise((resolve, reject) => {
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
					reject(err);
				} else {
					resolve(data);
				}
			});
		});

	}

}