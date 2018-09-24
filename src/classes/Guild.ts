import {Api} from "./api/Api";

export interface ServerInfo {
	id: number,
	name: string,
	date_created: string,
	auth: string,
	muteLimit: number,
	kickLimit: number,
	banLimit: number
}

export class Guild extends Api {

	apiUri: string;
	request: any;

	registerRole(roleID, serverID) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'POST',
				uri: this.apiUri + "/servers/addrole",
				json: true,
				body: {
					"roleID": roleID,
					"serverID": serverID
				}
			}, (err, response, data) => {
				if (err) {
					reject(err);
				} else {
					console.log(roleID);
					resolve(data);
				}
			});
		});
	}

	/**
	 * Registers a new guild
	 * @param id
	 * @param name
	 */

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

	/**
	 * Return serverdate
	 * @param id
	 */

	getServer(id) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'GET',
				uri: `${this.apiUri}/servers/${id}`,
				json: true
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
	 * Returns the mute, kick and banlevel in an array, in that order.
	 * @param id
	 */

	getServerLevels(id) {
		return new Promise(((resolve, reject) => {
			this.getServer(id).then((result: ServerInfo) => {
				resolve([result.muteLimit, result.kickLimit, result.banLimit]);
			}, (err) => {
				reject(err);
			});
		}));
	}

	/**
	 * Removes a guild
	 * @param id
	 */

	removeServer(id: string) {

	}

	/**
	 * Updated a servers mute level
	 * @param serverID
	 * @param level
	 */

	updateMaxMuteLevel(serverID, level) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'PUT',
				uri: this.apiUri + "/servers/update/mutelevel",
				json: true,
				body: {
					"serverID": serverID,
					"level": level
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
	 * Updated a servers kick level
	 * @param serverID
	 * @param level
	 */

	updateMaxKickLevel(serverID, level) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'PUT',
				uri: this.apiUri + "/servers/update/kicklevel",
				json: true,
				body: {
					"serverID": serverID,
					"level": level
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
	 * Updated a servers ban level
	 * @param serverID
	 * @param level
	 */

	updateMaxBanLevel(serverID, level) {
		return new Promise((resolve, reject) => {
			this.request({
				method: 'PUT',
				uri: this.apiUri + "/servers/update/banlevel",
				json: true,
				body: {
					"serverID": serverID,
					"level": level
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