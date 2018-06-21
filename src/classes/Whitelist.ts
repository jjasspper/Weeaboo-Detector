import {Api} from "./api/Api";

export class Whitelist {

	private api;

	constructor() {
		this.api = new Api();
	}

	retrieve(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'GET',
				uri: this.api.apiUri + "/whitelist/words/all",
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(data));
				}
			});
		})
	}

	addUser(serverID, userID): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'POST',
				uri: this.api.apiUri + "/whitelist/addUser",
				json: true,
				body: {
					"serverID": serverID,
					"userID": userID
				}
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(data));
				}
			});
		});
	}

	removeUser(serverID, userID): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'POST',
				uri: this.api.apiUri + "/whitelist/removeUser",
				json: true,
				body: {
					"serverID": serverID,
					"userID": userID
				}
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(data));
				}
			});
		});
	}
}