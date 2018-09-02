import {Api} from "./api/Api";
import {Guild} from "./Guild";
import {Message} from "./Message";

export interface User {
	server: string;
	user: string;
	level: number;
	userid: string;
	isWhitelisted: number;
}

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

	static checkWeeabLevel(serverID, userID, channel, finalLevel, message) {
		let guild = new Guild();
		let watchlist = new Watchlist();
		let serverLimits;
		let user;

		watchlist.getUser(serverID, userID).then((result: string) => {
			user = JSON.parse(result);

			if (user && user.success) {
				user = user.data[0];

				if (user.isWhitelisted === 1) {
					return;
				} else {
					guild.getServerLevels(serverID).then((result) => {
						serverLimits = result;
						switch (true) {
							case user.level >= serverLimits[0] && user.level < serverLimits[1]:
								Message.send(`User: <@${userID}> has now reached the first stage of a weeaboo. For your safety it has been put in the muted weeabs channel.`, channel);
								break;
							case user.level >= serverLimits[1] && user.level < serverLimits[2]:
								let member = message.guild.members.get(userID);
								member.kick('You are slowly turning into a weeabo, we had to take precautions.');
								Message.send(`User: <@${userID}> has reached a dangerous weeab-level. For your mental stability it has been kicked from this server.`, channel);
								break;
							case user.level >= serverLimits[2] :
								let member2 = message.guild.members.get(userID);
								member2.ban(`Your weeab-levels have risen to an unbelievable height. For the servers sake you have been banned.`);
								Message.send(`User: <@${userID}> has completely lost it and went full weeab-mode. To prevent further sickeness to spread this user has been banned.`, channel);
								break;
							default :
								Message.send(`Possible weeaboo detected. User: <@${userID}> weeab-level has been incremented by ${finalLevel}.`, channel);
						}
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