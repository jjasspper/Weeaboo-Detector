export interface IUserData {
	success: boolean;
	data: [{
		server: string;
		user: string;
		level: number;
		userid: string;
		isWhitelisted: number;
	}];
}