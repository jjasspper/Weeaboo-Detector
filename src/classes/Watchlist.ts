import {Api} from "./api/Api";

export class Watchlist extends Api {
	saveUser(serverID, userID, level, userName): Promise<any> {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'POST',
				uri: this.apiUri + "/watchlist/users/add",
				json: true,
				body: {
					"serverID": serverID,
					"userID": userID,
					"level": level,
					"userName": userName
				}
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			})
		});
	}

	setWeeabLevel(serverID, userID) {

	}

	updateUsername(serverID, userID, newName) {

	}

	getLevel(serverID, userID) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'GET',
				uri: this.apiUri + `/watchlist/users/level/${serverID}/${userID}`,
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			})
		});
	}
}