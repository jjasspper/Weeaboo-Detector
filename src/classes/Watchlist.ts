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
	 * Changes the weeab-level for a user
	 *
	 * @param serverID
	 * @param userID
	 */

	setWeeabLevel(serverID, userID) {

	}

	/**
	 * Updates a username
	 *
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

	/**
	 * Checks if a use
	 *
	 * @param serverID
	 * @param userID
	 * @param channel
	 * @param finalLevel
	 * @param message
	 */

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
						const member = message.guild.members.get(userID);
						switch (true) {
							case user.level >= serverLimits[0] && user.level < serverLimits[1]:
								const guild = new Guild();
								guild.getServer(message.guild.id).then((result: IServerData) => {
									guild.roleExistsOrGenerate(message, result.generated_role_id.toString()).then((roleID) => {
										member.addRole(roleID);
										Message.send(`User: <@${userID}> has now reached the first stage of a weeaboo. For your safety it has been put in the muted weeabs group.`, channel);
									}, (error) => {
										Message.send(`An error occurred: ${error}`, channel);
									});
								});
								break;
							case user.level >= serverLimits[1] && user.level < serverLimits[2]:
								member.kick('You are slowly turning into a weeaboo, we had to take precautions.');
								Message.send(`User: <@${userID}> has reached a dangerous weeab-level. For your mental stability it has been kicked from this server.`, channel);
								break;
							case user.level >= serverLimits[2] :
								member.ban(["Your weeab-levels have risen to an unbelievable height. For the servers sake you have been banned."]);
								Message.send(`User: <@${userID}> has completely lost it and went full weeab-mode. To prevent further sickness to spread this user has been banned.`, channel);
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