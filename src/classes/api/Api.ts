export class Api {
    protected apiUri: string = process.env.API;
    protected request: any = require("request");

    init(api, request): void {
        this.apiUri = api;
        this.request = request;
    }
}