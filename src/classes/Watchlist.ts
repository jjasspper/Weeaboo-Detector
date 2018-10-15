import {Api} from "./api/Api";
import {Guild} from "./Guild";
import {Message} from "./Message";
import {IServerData} from "../interfaces/IServerData";

export class Watchlist extends Api {

	/**
	 * Adds a user to the watchlist
	 *
	 * @param serverID
	 * @param userID
	 * @param level
	 * @param userName
	 */

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

	/**
	 * Updates a username
	 *@todo
	 * @param serverID
	 * @param userID
	 * @param newName
	 */

	updateUsername(serverID, userID, newName) {

	}

	/**
	 * Gets userdata from the API
	 *
	 * @param serverID
	 * @param userID
	 */

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

	resetUserLevel(serverID, userID) {
		return new Promise(((resolve, reject) => {
			this.request({
				method: 'PUT',
				uri: this.apiUri + "/watchlist/users/reset",
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
			})
		}))
	}

	/**
	 * Checks if a message contains blacklisted words
	 *
	 * @param serverID
	 * @param userID
	 * @param blockedWord
	 * @param finalLevel
	 * @param message
	 */

	static checkWeeabLevel(serverID, userID, saidBlockedWords, finalLevel, message) {
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
						const member = message.guild.members.get(userID);
						switch (true) {
							case user.level >= serverLimits[0] && user.level < serverLimits[1]:
								const guild = new Guild();
								guild.getServer(message.guild.id).then((result: IServerData) => {
									guild.roleExistsOrGenerate(message, result.generated_role_id.toString()).then((roleID) => {
										if (!member.roles.has(roleID)) {
											Message.send(`User: <@${userID}> has reached the first stage of a weeaboo. The Weeaboo rank has been assigned to it.`, message.channel);
										}
										Message.send(`Weeaboo detected! User: <@${userID}> weeb-level has been incremented by ${finalLevel}, for saying the word(s): ${saidBlockedWords}.`, message.channel);
										member.addRole(roleID);
									}, (error) => {
										Message.send(`An error occurred: ${error}`, message.channel);
									});
								});
								break;
							case user.level >= serverLimits[1] && user.level < serverLimits[2]:
								member.kick('You are slowly turning into a weeaboo, we had to take precautions.');
								Message.send(`User: <@${userID}> has reached a dangerous weeb-level. For your mental stability it has been kicked from this server, for saying the word(s): ${saidBlockedWords}.`, message.channel);
								break;
							case user.level >= serverLimits[2] :
								member.ban(["Your weeb-levels have risen to an unbelievable height. For the servers' sake you have been banned."]);
								Message.send(`User: <@${userID}> has completely lost it and went full weeb-mode. To prevent further sickness to spread this user has been banned, for saying the word(s): ${saidBlockedWords}.`, message.channel);
								break;
							default :
								Message.send(`Possible weeaboo detected! User: <@${userID}> weeb-level has been incremented by ${finalLevel}, for saying the word(s): ${saidBlockedWords}.`, message.channel);
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