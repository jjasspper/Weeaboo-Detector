import {Api} from "./api/Api";
import {Guild} from "./Guild";
import {Message} from "./Message";

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

	getUser(serverID, userID) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'GET',
				uri: this.apiUri + `/watchlist/users/${serverID}/${userID}`,
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			})
		});
	}

	static checkWeeabLevel(serverID, userID, channel, finalLevel) {
		let guild = new Guild();
		let watchlist = new Watchlist();
		let serverLimits;
		let user;

		watchlist.getUser(serverID, userID).then((result: string) => {
			user = JSON.parse(result);

			if (user && user.success) {
				user = user.data[0];

				if (user.isWhitelisted === 1) {
					Message.send(`User allowed.`, channel);
					return;
				} else {
					guild.getServerLevels(serverID).then((result) => {
						serverLimits = result;
						Message.send(`Possible weeaboo detected. User: <@${userID}> weeab-level has been incremented by ${finalLevel}.`, channel);
					}, (err) => {
						console.log(err);
						return;
					});
				}
			} else {
				return;
			}
		}, (err) => {
			console.log(err);
			return;
		});
	}
}