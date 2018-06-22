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