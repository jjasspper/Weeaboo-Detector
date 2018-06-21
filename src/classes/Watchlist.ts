import {Api} from "./api/Api";

export class Watchlist extends Api {
	addUser(serverID, userID, level, userName): Promise<any> {
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
					reject(process.exit(err));
				} else {
					resolve(data);
				}
			})
		});
	}

	whitelistUser(serverID, user) {

	}

	resetWeeabLevel(serverID, userID) {

	}

	updateUsername(serverID, userID, newName) {

	}
}