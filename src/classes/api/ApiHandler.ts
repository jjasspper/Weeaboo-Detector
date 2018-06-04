export class ApiHandler {
    protected apiUri : string = process.env.API;
    protected request: any = require("request");
}