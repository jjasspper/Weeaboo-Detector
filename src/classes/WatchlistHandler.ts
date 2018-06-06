import {ApiHandler} from "./api/ApiHandler";

export class WatchlistHandler extends ApiHandler {
    addUser(serverID, userID, level, userName): void {
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
                console.log(err);
            } else {
                console.log(data);
            }
        });
    }
}