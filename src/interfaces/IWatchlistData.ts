export interface IWatchlistData {
	success: boolean;
	data: [{
		server: string;
		user: string;
		level: number;
		userid: string;
		isWhitelisted: number;
	}];
}