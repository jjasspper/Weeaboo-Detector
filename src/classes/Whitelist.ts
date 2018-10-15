import {Api} from "./api/Api";

export class Whitelist {

	// Houses the api class
	private api;

	constructor() {
		this.api = new Api();
	}

	/**
	 * Retrieves the current whitelisted words
	 */

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

	/**
	 * Adds a user to the whitelist
	 *
	 * @param serverID
	 * @param userID
	 */

	addUser(serverID, userID): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'PUT',
				uri: this.api.apiUri + "/whitelist/users/add",
				json: true,
				body: {
					"serverID": serverID,
					"userID": userID
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

	/**
	 * Removes a user from the watchlist
	 *
	 * @param serverID
	 * @param userID
	 */

	removeUser(serverID, userID): Promise<any> {
		return new Promise((resolve, reject) => {
			this.api.request({
				method: 'PUT',
				uri: this.api.apiUri + "/whitelist/users/remove",
				json: true,
				body: {
					"serverID": serverID,
					"userID": userID
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